"use client";

import { Github, Linkedin, Mail, Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark
        ? "rgba(168, 85, 247, 0.5)"
        : "rgba(16, 185, 129, 0.5)";
      ctx.strokeStyle = isDark
        ? "rgba(168, 85, 247, 0.2)"
        : "rgba(16, 185, 129, 0.2)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-linear-to-r from-green-600 to-green-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent">
                Hi, I'm Michael
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Software Developer
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Hi, I'm Michael Wondwossen, a Front-end Developer with 3+ years of
              hands-on experience building modern, high-performance web
              applications using Next.js and React. I specialize in transforming
              complex business requirements into clean, intuitive, and scalable
              user interfaces. My work blends technical depth with a strong
              focus on user experience, performance, and reliability. Throughout
              my journey, I've had the opportunity to develop end-to-end
              solutions for both local and international teams. I thrive in
              collaborative environments, working closely with designers,
              backend engineers, and business partners to deliver features that
              are both functional and visually cohesive.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              My experience spans UI/UX implementation, secure authentication
              workflows, API integrations, and deployment on modern hosting
              platforms. I am passionate about continuous learning and building
              meaningful products that solve real-world problems. Every project
              I take on is an opportunity to grow, refine my craft, and deliver
              work that truly makes an impact. I'm always excited to collaborate
              on innovative ideas whether you're building a platform from
              scratch or improving an existing system, I'd love to be part of
              your journey.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button className="bg-linear-to-r from-green-600 to-green-500 dark:from-purple-600 dark:to-purple-500 hover:opacity-90">
                <a href="#contact" className="flex items-center gap-2">
                  Get In Touch
                  <ArrowDown className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" className="group">
                <a
                  href="https://drive.google.com/file/d/1OFbHyBe-qLQQa_zPsOhGuYEuhWwQxOcA/view?usp=sharing"
                  //   href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68e3c16a608b56b43f5aea03/10a9226bd_MichaelMetaferiaCV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4 group-hover:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/mikewon98"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/michael-wondwossen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:mikewon98@gmail.com"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform duration-200"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative w-full aspect-square rounded-full overflow-hidden glass p-2 animate-float">
                <img
                  src="/Michaelwon.jpg"
                  alt="Michael W Metaferia"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
