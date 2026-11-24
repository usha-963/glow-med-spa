import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar({ onBook, menuOpen, setMenuOpen }) {
  const links = [
    ["Home", "#home"], ["Treatments", "#treatments"],
    ["About", "#about"], ["Contact", "#contact"]
  ];
  return (
    <header className="navbar">
      <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Sparkles size={19} /></span>
        <span>Glow <b>Med Spa</b></span>
      </a>
      <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {links.map(([label, href]) => (
          <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <button className="btn btn-small" onClick={() => { setMenuOpen(false); onBook(); }}>Book a consultation</button>
      </nav>
    </header>
  );
}
