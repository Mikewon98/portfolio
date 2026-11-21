This is how I host this portfolio (michaelyze.com) on a single VPS: Ubuntu, Docker, Traefik for HTTPS, GitHub Actions + GHCR for images, Watchtower for automatic rolling deploys, and a self-hosted Payload CMS + Postgres for this blog. Everything below is the setup I actually run. Secrets, IPs and personal details are replaced with placeholders.

## Operating System Selection

I chose **Ubuntu 24.04 LTS** because it's stable and widely supported in the VPS world. I'd have loved to use Arch, but long-term support matters more for a production box.

During provisioning I:

- Disabled the provider's malware scanner to keep the install minimal
- Set a strong root password
- Added my SSH public key for key-based access

## Adding a Non-Root User

The first thing I do on any new server is create a non-root user. Working as root day to day isn't a good idea:

```bash
adduser <your-user>
usermod -aG sudo <your-user>
```

This creates the user and adds it to the `sudo` group for the times you need elevated permissions.

## Domain Name Setup

I pointed my domain at the server with two DNS records:

- An **A record** for the root domain (`michaelyze.com`) → the VPS public IP
- An **A/CNAME record** for `www` → the same server

Then I waited for DNS propagation, which can take a few hours. You can find the server's IP with:

```bash
ip addr
```

## SSH Hardening

### Use tmux

If you're following along, install tmux so your session survives a dropped SSH connection:

```bash
sudo apt install tmux
```

### Disable password authentication

First copy your public key to the non-root user, from your local machine:

```bash
ssh-copy-id <your-user>@<your-server>
```

Then edit the SSH daemon config:

```bash
sudo vim /etc/ssh/sshd_config
```

The key changes:

```plaintext
PasswordAuthentication no
PermitRootLogin no
UsePAM no
```

Reload SSH, and test the new login in a **second** terminal before you close the first one:

```bash
sudo systemctl reload ssh
```

## Installing Docker

Everything runs in containers. That gives me immutable, versioned images, configuration in one file, and easy rollbacks. I followed the official Docker install guide:

```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Run docker without sudo
sudo usermod -aG docker $USER
```

## Firewall with UFW

```bash
# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (critical - don't skip this!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable the firewall
sudo ufw enable
```

**Important caveat:** Docker writes its own iptables rules and can bypass UFW for any port you publish. So the only ports I publish are 80 and 443 on the reverse proxy. The app and the database are never exposed directly.

## Building the App Image

The site is a **Next.js 16** app built with `output: "standalone"`. The Dockerfile is a multi-stage build: install dependencies, build, then copy only the standalone server into a small runtime image that runs as a non-root user.

```dockerfile
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

I don't build on the server. **GitHub Actions** builds the image on every push to `main` and pushes it to the **GitHub Container Registry (GHCR)**. The default branch also gets a moving `stable` tag:

```yaml
- name: Extract metadata (tags, labels) for Docker
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/<github-user>/<image>
    tags: |
      type=sha,format=long
      type=raw,value=stable,enable={{is_default_branch}}

- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: ${{ github.event_name != 'pull_request' }}
    tags: ${{ steps.meta.outputs.tags }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

## Reverse Proxy with Traefik

Instead of nginx I use **Traefik**. It's one of the two main reasons this setup was easier than I expected. Traefik watches the Docker socket and configures routes from container labels, so there are no separate config files to maintain.

```yaml
reverse-proxy:
  image: traefik:v3.6
  restart: unless-stopped
  command:
    - "--providers.docker=true"
    - "--providers.docker.exposedbydefault=false"
    - "--entryPoints.web.address=:80"
    - "--entryPoints.websecure.address=:443"
    # Let's Encrypt via TLS challenge
    - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
    - "--certificatesresolvers.myresolver.acme.email=<your-email>"
    - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    # Redirect every HTTP request to HTTPS at the entrypoint level
    - "--entryPoints.web.http.redirections.entrypoint.to=websecure"
    - "--entryPoints.web.http.redirections.entrypoint.scheme=https"
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - letsencrypt:/letsencrypt
```

The Traefik dashboard port (8080) isn't published, so the dashboard can't be reached from the internet.

### Routing, TLS and sticky sessions

The app container only needs labels. It answers on both the apex domain and `www`, and asks for one certificate that covers both:

```yaml
blog:
  image: ghcr.io/<github-user>/<image>:stable
  restart: unless-stopped
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.blog.rule=Host(`michaelyze.com`) || Host(`www.michaelyze.com`)"
    - "traefik.http.routers.blog.entrypoints=websecure"
    - "traefik.http.routers.blog.tls.certresolver=myresolver"
    - "traefik.http.routers.blog.tls.domains[0].main=michaelyze.com"
    - "traefik.http.routers.blog.tls.domains[0].sans=www.michaelyze.com"
    - "traefik.http.services.blog.loadbalancer.server.port=3000"

    # Sticky sessions: keep a visitor on the same container so
    # Next.js Server Actions don't hit a different build during a rollout
    - "traefik.http.services.blog.loadbalancer.sticky.cookie=true"
    - "traefik.http.services.blog.loadbalancer.sticky.cookie.name=lb_session"
    - "traefik.http.services.blog.loadbalancer.sticky.cookie.secure=true"
    - "traefik.http.services.blog.loadbalancer.sticky.cookie.httpOnly=true"
    - "traefik.http.services.blog.loadbalancer.sticky.cookie.sameSite=lax"
```

### Rate limiting

Traefik also has a rate-limit middleware for basic protection against noisy bots. Define it, then attach it to the router:

```yaml
    - "traefik.http.middlewares.rate-limit.ratelimit.average=100"
    - "traefik.http.middlewares.rate-limit.ratelimit.burst=50"
    - "traefik.http.middlewares.rate-limit.ratelimit.period=1s"
    - "traefik.http.routers.blog.middlewares=rate-limit"
```

After `docker compose up -d`, Traefik picked up the container, requested the certificates and started serving HTTPS on its own.

## Automated Deployments with Watchtower

The second reason this setup is easy is **Watchtower**. It polls the registry and recreates containers when a new image appears under the same tag. The original `containrrr/watchtower` is archived, so I use the maintained **`nickfedor/watchtower`** fork:

```yaml
watchtower:
  image: nickfedor/watchtower
  restart: unless-stopped
  command:
    - "--label-enable"        # only touch containers that opt in
    - "--rolling-restart"     # restart one container at a time
    - "--include-restarting"
    - "--stop-timeout"
    - "60s"                   # give Next.js time to finish in-flight requests
    - "--scope=blog"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  environment:
    - WATCHTOWER_POLL_INTERVAL=300
    # Deploy notifications to a Discord channel
    - WATCHTOWER_NOTIFICATIONS=shoutrrr
    - WATCHTOWER_NOTIFICATION_URL=${DISCORD_WEBHOOK_URL}
  labels:
    - "com.centurylinklabs.watchtower.enable=false"
```

The app opts in with two labels:

```yaml
    - "com.centurylinklabs.watchtower.enable=true"
    - "com.centurylinklabs.watchtower.scope=blog"
```

So the whole deploy pipeline is **git push → GitHub Actions builds → `:stable` lands on GHCR → Watchtower pulls it within 5 minutes → rolling restart → Discord ping.** I never SSH in to deploy.

Secrets such as the webhook URL live in a `.env` file on the server (loaded with `env_file: .env`). It's never committed to git.

## The CMS: Self-Hosted Payload + Postgres

This blog used to run on a hosted headless CMS. When that moved behind a paid plan, I switched to **Payload CMS**. Payload runs inside the same Next.js app: the editor lives at `/admin`, and pages read posts through Payload's Local API with no extra HTTP hop. The data sits in a **Postgres** container on the same Docker network, with no published ports:

```yaml
postgres:
  image: postgres:17-alpine
  restart: unless-stopped
  environment:
    - POSTGRES_USER=payload
    - POSTGRES_DB=payload
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  volumes:
    - pgdata:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U payload -d payload"]
    interval: 10s
  labels:
    - "com.centurylinklabs.watchtower.enable=false"
```

Uploaded images go to a named volume mounted into the app container. Database migrations run automatically when the app boots, so a schema change ships through the same push-to-deploy pipeline. Backups are a `pg_dump` plus a copy of the media volume.

## Monitoring with Uptime Robot

For monitoring I use **Uptime Robot**. Its free tier checks the site every few minutes and emails me if it goes down:

- Create an account
- Add the website URL
- Configure notification preferences

On a single-node VPS this is far more practical than running Prometheus, Grafana and an ELK stack.

## Conclusion

Setting up a production-ready VPS was much easier than I expected. With Traefik and Watchtower doing most of the work, I have:

- ✅ DNS pointing to the server (apex + www)
- ✅ Hardened SSH and a UFW firewall
- ✅ The app in Docker, built by GitHub Actions and stored on GHCR
- ✅ Automatic HTTPS with Let's Encrypt and HTTP → HTTPS redirects
- ✅ Sticky sessions and rate limiting at the proxy
- ✅ Push-to-deploy with rolling restarts and Discord notifications
- ✅ A self-hosted CMS (Payload + Postgres) with no third-party bill
- ✅ Uptime monitoring
