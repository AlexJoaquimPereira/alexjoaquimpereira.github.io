import { useState } from "react";
import ProjectModal from "./ProjectModal";

export default function Projects({ data }) {
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);

  const tags = ["All", ...new Set(data.projects.flatMap((p) => p.tags))];
  const filtered =
    filter === "All"
      ? data.projects
      : data.projects.filter((p) => p.tags.includes(filter));

  return (
    <section id="projects" className="projects">
      <div className="card-title">Selected Projects</div>
      <div className="filters">
        {tags.map((t) => (
          <button
            key={t}
            className={`tag ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map((p) => (
          <article key={p.id} className="proj" onClick={() => setModal(p)}>
            <div className="proj-thumb">
              {p.title
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("")}
            </div>
            <div>
              <h4>{p.title}</h4>
              <p className="muted">{p.short}</p>
            </div>
          </article>
        ))}
      </div>

      {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
    </section>
  );
}
