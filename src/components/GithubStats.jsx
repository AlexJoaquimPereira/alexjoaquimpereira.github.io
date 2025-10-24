export default function GithubStats() {
  return (
    <section id="github" className="github-stats">
      <h3 className="card-title">GitHub Stats</h3>

      <div className="github-grid">
        <img
          src="https://github-readme-stats-vercel-seven.vercel.app/api?username=AlexJoaquimPereira&theme=buefy&show_icons=true&rank_icon=github&hide_rank=false&hide_border=true"
          alt="Alex's GitHub Stats"
          loading="lazy"
        />
        <img
          src="https://github-readme-stats-vercel-seven.vercel.app/api/top-langs?username=AlexJoaquimPereira&locale=en&layout=compact&langs_count=20&size_weight=0.5&count_weight=0.5&theme=buefy&hide_border=true&exclude_repo=github-readme-stats-vercel"
          alt="Alex's Top Languages"
          loading="lazy"
        />
      </div>
    </section>
  );
}
