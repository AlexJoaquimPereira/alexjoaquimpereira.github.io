import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./index.css";
import { siteData } from "/src/data/siteData";
import Header from "/src/components/Header";
import Hero from "/src/components/Hero";
import Skills from "/src/components/Skills";
import Projects from "/src/components/Projects";
import GithubStats from "/src/components/GithubStats";
import Contact from "/src/components/Contact";
import Footer from "/src/components/Footer";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // set browser tab title and favicon (place your image at /assets/tab-icon.png)
  useEffect(() => {
    document.title = "Alex Joaquim Pereira";

    const faviconPath = "/src/assets/react.png"; 
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = faviconPath;
  }, []);

  return (
    <div className="wrap">
      <Header theme={theme} setTheme={setTheme} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <section>
          <Hero data={siteData} />
          <Projects data={siteData} />
          <GithubStats />
          <Contact data={siteData} />
        </section>
        <aside>
          <Skills skills={siteData.skills} />
        </aside>
      </motion.main>

      <Footer name={siteData.name} />
    </div>
  );
}
