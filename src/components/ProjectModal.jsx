export default function ProjectModal({ project, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{project.title}</h3>
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p>{project.short}</p>
        <ul className="muted">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div style={{ marginTop: "12px" }}>
          <a href={project.repo} className="chip" target="_blank">
            Repo
          </a>
          <a href={project.live} className="chip" target="_blank">
            Live
          </a>
        </div>
      </div>
    </div>
  );
}
