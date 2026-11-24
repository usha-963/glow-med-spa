
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Leaf,
  MessageCircle
} from "lucide-react";

import Navbar from "./components/Navbar";
import ServiceCard from "./components/ServiceCard";
import BookingModal from "./components/BookingModal";
import EnquiryModal from "./components/EnquiryModal";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import AdminGate from "./pages/AdminGate";

import hero from "./assets/hero-glow-med-spa.png";
import facial from "./assets/facial-treatments.png";
import rejuvenation from "./assets/skin-rejuvenation.png";
import consultation from "./assets/beauty-consultation.png";

const services = [
  {
    image: facial,
    number: "01",
    title: "Facial Treatments",
    description:
      "Personalized facials designed to refresh your skin and enhance your natural glow."
  },
  {
    image: rejuvenation,
    number: "02",
    title: "Skin Rejuvenation",
    description:
      "Explore skincare options designed to support smoother, healthier-looking skin."
  },
  {
    image: consultation,
    number: "03",
    title: "Beauty Consultation",
    description:
      "Discuss your skincare goals and explore personalized treatment options with our specialists."
  }
];

function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const book = () => setBookingOpen(true);

  const enquire = () => setEnquiryOpen(true);

  return (
    <>
      <Navbar
        onBook={book}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main>
        {/* HERO */}
        <section
          id="home"
          className="hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8,54,43,.18), rgba(28,22,17,.02)), url(${hero})`
          }}
        >
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} /> A MOMENT FOR YOU
            </span>

            <h1>
              Your Beauty,<br />
              <em>Our Passion.</em>
            </h1>

            <p>Personalized Beauty. Timeless Confidence.</p>

            <div className="hero-actions">
              <button className="btn" onClick={book}>
                Book Your Consultation <ArrowRight size={17} />
              </button>

              <button className="btn btn-enquire" onClick={enquire}>
                <MessageCircle size={18} /> Enquire Now
              </button>
            </div>
          </div>

          <div className="hero-caption">
            A welcoming space to feel your best.
          </div>
        </section>

        {/* TREATMENTS */}
        <section id="treatments" className="section treatments-section">
          <div className="section-heading">
            <span className="eyebrow">THE GLOW EXPERIENCE</span>

            <h2>Our Signature Treatments</h2>

            <p>
              Discover personalized treatments designed to enhance your natural beauty.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.number}
                {...service}
                onBook={book}
              />
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="about-section about-personalized"
        >
          <div className="about-copy">
            <span className="eyebrow">WELCOME TO GLOW</span>

            <h2>A thoughtful approach to feeling your best.</h2>

            <p>
              Our fictional studio concept is built around warm hospitality,
              personalized conversations, and a calm, welcoming experience.
            </p>

            <button className="text-link" onClick={enquire}>
              Have a question? Enquire now <ArrowRight size={17} />
            </button>
          </div>

          <div className="about-points">
            <div className="about-point">
              <Heart className="about-point-icon" />

              <span>
                <b>Personalized attention</b>
                <small>A conversation centered on your goals.</small>
              </span>
            </div>

            <div className="about-point">
              <ShieldCheck className="about-point-icon" />

              <span>
                <b>Care-first approach</b>
                <small>Questions answered by qualified professionals.</small>
              </span>
            </div>

            <div className="about-point">
              <Leaf className="about-point-icon" />

              <span>
                <b>Calm atmosphere</b>
                <small>A welcoming space to slow down.</small>
              </span>
            </div>
          </div>
        </section>

        {/* CONSULTATION CTA */}
        <section className="booking-cta">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>

          <h2>Make a little time for you.</h2>

          <p>
            Start with a conversation. Tell us what you are looking for.
          </p>

          <button className="btn btn-light" onClick={book}>
            Request a consultation <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <Footer />

      {/* BOOKING FORM */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      {/* ENQUIRY FORM */}
      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />

      {/* CHATBOT - UNCHANGED */}
      <Chatbot onBook={book} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </BrowserRouter>
  );
}
