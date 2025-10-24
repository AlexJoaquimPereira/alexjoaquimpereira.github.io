import React, { useState, useEffect } from "react";
import "./index.css";
import { siteData } from "./data/siteData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GithubStats from "./components/GithubStats";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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

  return (
    <div className="wrap">
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <section>
          <Hero data={siteData} />
          <Projects data={siteData} />
          <GithubStats />
          <Contact data={siteData} />
        </section>
        <aside>
          <Skills skills={siteData.skills} />
        </aside>
      </main>
      <Footer name={siteData.name} />
    </div>
  );
}
