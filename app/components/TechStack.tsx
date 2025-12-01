"use client";

import { motion } from "framer-motion";
import {
  Code,
  Database,
  Server,
  Smartphone,
  Layout,
  GitBranch,
} from "lucide-react";

const techCategories = [
  {
    title: "Frontend",
    icon: Layout,
    color:
      "from-green-400 to-emerald-600 dark:from-purple-400 dark:to-purple-600",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "from-blue-400 to-cyan-600 dark:from-indigo-400 dark:to-indigo-600",
    skills: ["Node.js", "Java", "Spring Boot", "REST API", "GraphQL", "Python"],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    color: "from-pink-400 to-rose-600 dark:from-pink-400 dark:to-pink-600",
    skills: ["Dart", "Flutter"],
  },
  {
    title: "Database",
    icon: Database,
    color:
      "from-yellow-400 to-orange-600 dark:from-yellow-400 dark:to-orange-600",
    skills: ["MongoDB", "MySQL", "Postgres"],
  },
  {
    title: "Tools",
    icon: GitBranch,
    color:
      "from-violet-400 to-purple-600 dark:from-violet-400 dark:to-purple-600",
    skills: ["Git", "GitHub", "Docker", "Figma", "Jira"],
  },
  {
    title: "Other",
    icon: Code,
    color: "from-teal-400 to-green-600 dark:from-teal-400 dark:to-green-600",
    skills: ["SEO", "Deployment", "Postman"],
  },
];

export default function TechStack() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
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
              Tech Stack
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-r ${category.color} flex items-center justify-center`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
