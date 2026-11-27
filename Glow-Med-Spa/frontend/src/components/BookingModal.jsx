
import { useState } from "react";
import { X, CalendarCheck, CheckCircle2 } from "lucide-react";

const API = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

// Automatically wake the backend and wait until it responds.
async function wakeBackend() {
  for (let attempt = 1; attempt <= 12; attempt++) {
    try {
      const response = await fetch(`${API}/api/health`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        return;
      }
    } catch (error) {
      // Backend may still be starting.
    }

    if (attempt < 12) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error(
    "The server is taking too long to start. Please try again shortly."
  );
}

export default function BookingModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Beauty Consultation",
    date: "",
    time: "",
    notes: "",
  });

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function submit(e) {
    e.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      // Wake Render before submitting the booking.
      await wakeBackend();

      const res = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not save booking.");
      }

      setStatus("success");
      setMessage(
        data.message || "Your demo appointment request has been saved."
      );
    } catch (err) {
      setStatus("error");

      setMessage(
        err.message || "Unable to connect to the booking server."
      );
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close booking form"
        >
          <X />
        </button>

        {status === "success" ? (
          <div className="success-state">
            <CheckCircle2 size={48} />

            <h2>Request received</h2>

            <p>{message}</p>

            <p className="small-note">
              This is a fictional portfolio demo, not a real medical appointment.
            </p>

            <button
              className="btn"
              onClick={() => {
                setStatus("idle");
                onClose();
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">
              <CalendarCheck size={15} /> LET'S PLAN YOUR VISIT
            </span>

            <h2 id="booking-title">Book a consultation</h2>

            <p className="modal-intro">
              Share your preferred time and our demo team will follow up.
            </p>

            <form className="booking-form" onSubmit={submit}>
              <label>
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  placeholder="Your name"
                />
              </label>

              <div className="form-two">
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    required
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label>
                Interested in
                <select
                  name="service"
                  value={form.service}
                  onChange={update}
                >
                  <option>Beauty Consultation</option>
                  <option>Facial Treatments</option>
                  <option>Skin Rejuvenation</option>
                </select>
              </label>

              <div className="form-two">
                <label>
                  Preferred date
                  <input
                    name="date"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.date}
                    onChange={update}
                    required
                  />
                </label>

                <label>
                  Preferred time
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={update}
                    required
                  />
                </label>
              </div>

              <label>
                Anything you'd like us to know?
                <textarea
                  name="notes"
                  rows="3"
                  value={form.notes}
                  onChange={update}
                  placeholder="Optional — please don't include sensitive medical information."
                />
              </label>

              {status === "error" && (
                <p className="form-error">{message}</p>
              )}

              <button
                className="btn btn-full"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Connecting and sending..."
                  : "Request appointment"}
              </button>

              <p className="small-note">
                Demo only. No actual appointment is confirmed and no medical advice is provided.
              </p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
