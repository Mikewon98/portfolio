import PersonalProjects from "../components/PersonalProjects";
import FeaturedBlogs from "../components/FeaturedBlog";
import { getBlogs } from "../service/blogService";
import HeroSection from "../components/HeroSection";
import Experience from "../components/Experience";
import Contact from "../components/form/Contact";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";

// Rendered per request: posts are read from Postgres via Payload's Local API
// (a few ms). This avoids serving the empty snapshot taken during `next build`,
// when the database is not reachable.
export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredBlogs = await getBlogs({ featured: true, limit: 6 });

  return (
    <div>
      <HeroSection />
      <TechStack />
      <Experience />
      <Projects />
      <PersonalProjects />
      <FeaturedBlogs blogs={featuredBlogs} />
      <Contact />
    </div>
  );
}
