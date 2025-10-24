export default function Footer({ name }) {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} {name} — Built with ❤️ and React + Vite
    </footer>
  );
}
