export default function Header({ theme, setTheme }) {
  return (
    <header>
      <div className="brand">
        <div className="logo">AJP</div>
        <div>
          <h1>Alex Joaquim Pereira</h1>
          <small className="muted">Computer Engineering Student</small>
        </div>
      </div>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
        <button
          className="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "🌞"}
        </button>
      </nav>
    </header>
  );
}
