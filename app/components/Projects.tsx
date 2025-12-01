"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "FenanPay Payment Gateway",
    description:
      "A comprehensive payment gateway platform with responsive interfaces, secure authentication flows, interactive forms, and dynamic routing. Integrated with REST APIs for real-time data.",
    image: "./fenan.png",
    tech: ["Next.js", "React", "REST API", "TypeScript"],
    link: "https://fenanpay.com",
    // gradient: "from-white to-white",
  },
  {
    title: "Ethio Djibouti Railway Booking",
    description:
      "Automated wagon booking system with secure authentication, interactive booking forms, user account management, and seamless integration with backend APIs using agile methodologies.",
    image: "./edr.png",
    tech: ["Next.js", "React", "Authentication", "REST API"],
    link: "https://freight.bookingedr.et",
    // gradient: "from-white to-white",
  },
  {
    title: "Biniyam Woodworks",
    description:
      "A fully responsive website for a woodworking business. Engineered with optimal performance, cross-browser compatibility, and deployed on Hostinger for reliable accessibility.",
    image: "/bini.png",
    tech: ["Next.js", "SEO", "Responsive Design"],
    link: "https://biniyamwoodworks.com",
    // gradient: "from-white to-white",
  },
];

export default function Projects() {
  return (
    <div id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-green-600 to-green-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Some of my recent work
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-linear-to-t  opacity-60`}
                ></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full group-hover:bg-green-500 dark:group-hover:bg-purple-500 group-hover:text-white group-hover:border-green-500 dark:group-hover:border-purple-500 transition-colors duration-300"
                  asChild
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
