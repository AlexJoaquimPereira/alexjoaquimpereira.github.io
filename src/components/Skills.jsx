import { useEffect } from "react";

export default function Skills({ skills }) {
  useEffect(() => {
    const bars = document.querySelectorAll(".bar span");
    bars.forEach((b) => {
      const pct = b.dataset.target;
      setTimeout(() => (b.style.width = pct), 300);
    });
  }, []);

  return (
    <div id="skills">
      <h3 className="card-title">Skills</h3>
      <div className="skills">
        {skills.map((s) => (
          <div className="skill" key={s.name}>
            <div className="label">
              <span>{s.name}</span>
              <span>{s.pct}%</span>
            </div>
            <div className="bar">
              <span data-target={`${s.pct}%`}></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
