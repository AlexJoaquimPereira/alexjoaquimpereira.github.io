export default function GithubStats() {
  return (
    <section id="github" className="github-stats">
      <h3 className="card-title">GitHub Stats</h3>

      <div className="github-grid">
        <div className="stat-card">
          <img
            src="https://github-readme-stats-vercel-seven.vercel.app/api?username=AlexJoaquimPereira&theme=buefy&show_icons=true&rank_icon=github&hide_border=true"
            alt="Alex's GitHub Stats"
            loading="lazy"
          />
        </div>
        <div className="stat-card">
          <img
            src="https://github-readme-stats-vercel-seven.vercel.app/api/top-langs?username=AlexJoaquimPereira&locale=en&layout=compact&langs_count=10&size_weight=0.5&count_weight=0.5&theme=buefy&hide_border=true"
            alt="Alex's Top Languages"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
