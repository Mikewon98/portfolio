"use client";

import { Briefcase, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Aquila ICT Solution",
    location: "Addis Ababa, Ethiopia",
    period: "May 2024 - Present",
    description:
      "Developed a payment gateway - Fenan Payment Platform. Built the Ethio Djibouti Railway Project - Wagon booking system, transforming manual processes to automated solutions.",
    current: true,
  },
  {
    title: "Frontend Developer",
    company: "Dowell Research",
    location: "UK (Remote)",
    period: "Feb 2024 - May 2024",
    description:
      "Developed an in-house project and a cafe management system for a client.",
    current: false,
  },
  {
    title: "Lead Web Developer",
    company: "Yokan Trading PLC",
    location: "Ethiopia",
    period: "Sep 2023 - Jan 2024",
    description:
      "Led the end-to-end development of web applications, from UI/UX design to full implementation.",
    current: false,
  },
  {
    title: "Software Engineer",
    company: "Freelance",
    location: "Ethiopia",
    period: "Jan 2023 - Present",
    description:
      "Designed aesthetically pleasing UI/UX, focusing on user-centric design principles for various clients.",
    current: true,
  },
];

export default function Experience() {
  return (
    <div id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-green-600 to-green-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            My professional journey
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-full md:w-5/12 
                  ${index % 2 === 0 ? "md:text-left" : ""}
                  `}
              >
                <div className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {exp.current && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 dark:bg-purple-500 text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-green-600 dark:text-purple-400 font-semibold mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span>{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {exp.description}
                  </p>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 border-4 border-white dark:border-gray-900"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
