export default function Hero({ data }) {
  return (
    <section id="about" className="hero">
      <div className="eyebrow">Hello — I'm {data.name}</div>
      <h2>{data.heroTitle}</h2>
      <p>{data.heroSub}</p>
      <div className="cta-row">
        <a href={data.resumeUrl} className="btn">
          📄 Resume
        </a>
        <a href="#contact" className="ghost">
          ✉️ Contact
        </a>
      </div>
    </section>
  );
}
