import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-main">
        <div><a className="brand footer-brand" href="#home">Glow <b>Med Spa</b></a><p>Personalized beauty. Timeless confidence.</p></div>
        <div><h4>Explore</h4><a href="#treatments">Treatments</a><a href="#about">About us</a><a href="#home">Back to top</a></div>
        <div><h4>Contact</h4><span><Mail size={15} /> hello@glowmedspa.example</span><span><MapPin size={15} /> Demo location · Miami, FL</span></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Glow Med Spa · Fictional portfolio demonstration by Nexora AI</div>
    </footer>
  );
}
