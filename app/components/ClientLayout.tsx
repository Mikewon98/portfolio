"use client";

import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Briefcase,
  Code,
  BookOpen,
  Mail,
} from "lucide-react";
import MichaelyzeIcon from "./icons/michaelyze_icon";
import MichaelyzePurpleIcon from "./icons/michaelyze_purple_icon";
import Michaelyze from "./icons/michaelyze";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode, mounted]);

  const navItems = [
    { name: "Home", path: createPageUrl("Home") + "#", icon: Home },
    { name: "Projects", path: createPageUrl("Home") + "#projects", icon: Code },
    {
      name: "Experience",
      path: createPageUrl("Home") + "#experience",
      icon: Briefcase,
    },
    { name: "Blog", path: createPageUrl("Blog"), icon: BookOpen },
    { name: "Contact", path: createPageUrl("Home") + "#contact", icon: Mail },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!mounted) {
    // Prevent hydration mismatch by rendering nothing until mounted on client
    // Or you can render a loading skeleton here
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-green-50/30 to-green-100/20 dark:from-gray-900 dark:via-purple-950/50 dark:to-black transition-all duration-500">
      <style jsx global>{`
        :root {
          --primary-light: #10b981;
          --primary-dark: #a855f7;
          --bg-light: #ffffff;
          --bg-dark: #000000;
        }

        .dark {
          color-scheme: dark;
        }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-lg py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href={createPageUrl("Home")}
              className="flex items-center justify-between space-x-4"
            >
              {/* <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 flex items-center justify-center font-bold text-white">
                <MichaelyzeIcon className="w-5 h-5" />
              </div> */}
              {/* <MichaelyzePurpleIcon className="w-8 h-8 fill-purple-500" /> */}
              <img
                src="/michaelyze_icon.png"
                alt="Michael W Metaferia"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Michael Wondwossen
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:cursor-pointer"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:cursor-pointer"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass mt-4 mx-4 rounded-2xl overflow-hidden">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="glass mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Michael Wondwossen. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Built with passion and code ✨
            </p>
            <Michaelyze className="inline w-28 h-6 mt-2 fill-purple-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}
