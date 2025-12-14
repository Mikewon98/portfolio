import { Metadata } from "next";

export const siteMetadata: Metadata = {
  title: {
    default: "Michael Wondwossen - Full Stack Developer & Software Engineer",
    template: "%s | Michael Wondwossen",
  },
  description:
    "Portfolio of Michael Wondwossen - Full Stack Developer specializing in modern web technologies, React, Next.js, and innovative software solutions.",
  keywords: [
    "Michael Wondwossen Metaferia",
    "Michael W Metaferia",
    "Michael Wondwossen",
    "Michael Metaferia",
    "Michael",
    "Full Stack Developer",
    "Software Engineer",
    "React",
    "Flutter",
    "Next.js",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Michael Wondwossen Metaferia" }],
  creator: "Michael Wondwossen Metaferia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://michaelyze.com",
    title: "Michael Wondwossen - Full Stack Developer",
    description:
      "Portfolio showcasing projects, experience, and expertise in modern web development",
    siteName: "Michael Wondwossen Portfolio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
