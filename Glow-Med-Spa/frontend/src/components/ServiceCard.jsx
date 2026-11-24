import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({ image, number, title, description, onBook }) {
  return (
    <article className="service-card">
      <div className="service-image-wrap">
        <img src={image} alt={title} className="service-image" />
        <span className="service-number">{number}</span>
      </div>
      <div className="service-copy">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="text-link" onClick={onBook}>Explore consultation <ArrowUpRight size={16} /></button>
      </div>
    </article>
  );
}
