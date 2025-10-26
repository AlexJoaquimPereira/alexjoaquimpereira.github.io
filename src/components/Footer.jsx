import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer({ name }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-logo">{name}</h3>

        <p className="footer-tagline">
          Built with ❤️ using <strong>React</strong> + <strong>Vite</strong>
        </p>

        <div className="footer-socials">
          <a
            href="https://github.com/AlexJoaquimPereira"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/alex-joaquim-pereira"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:alexpereira1781@gmail.com"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>

        <p className="footer-copy">
          © {year} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
