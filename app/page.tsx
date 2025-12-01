import FeaturedBlogs from "./components/FeaturedBlog";
import { fetchBlogs } from "./service/blogService";
import HeroSection from "./components/HeroSection";
import Experience from "./components/Experience";
import Contact from "./components/form/Contact";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";

export default async function Home() {
  const featuredBlogs = await fetchBlogs({
    url: "/api/blogs?populate=*&filters[isFeatured][$eq]=true",
  });

  return (
    <div>
      <HeroSection />
      <TechStack />
      <Experience />
      <Projects />
      <FeaturedBlogs blogs={featuredBlogs.data} />
      <Contact />
    </div>
  );
}
