
import { useState } from "react";
import { X, Send, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function EnquiryModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `Phone: ${form.phone || "Not provided"}\nEnquiry: ${form.message}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not submit your enquiry.");
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #DED6C8",
    borderRadius: "9px",
    background: "#FFFCF8",
    color: "#173D32",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#25483B",
    fontSize: "13px",
    fontWeight: 600,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(15, 30, 24, 0.65)",
        display: "grid",
        placeItems: "center",
        padding: "18px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "470px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#FFFCF8",
          borderRadius: "17px",
          padding: "28px",
          boxSizing: "border-box",
          borderTop: "4px solid #C6A36A",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "22px",
        }}>
          <div>
            <div style={{
              color: "#A17B43",
              fontSize: "11px",
              letterSpacing: "1.5px",
              fontWeight: 700,
              marginBottom: "7px",
            }}>
              <Sparkles size={13} style={{ verticalAlign: "middle" }} /> GET IN TOUCH
            </div>
            <h2 style={{
              color: "#064E3B",
              fontSize: "25px",
              margin: 0,
            }}>
              Send an Enquiry
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry form"
            style={{
              border: "1px solid #E5D8C2",
              background: "#F5EFE5",
              color: "#064E3B",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{
            padding: "22px",
            background: "#EDF5EF",
            borderRadius: "12px",
            textAlign: "center",
            color: "#064E3B",
          }}>
            <Sparkles size={28} />
            <h3>Thank you!</h3>
            <p>Your enquiry has been saved. Our demo team can follow up with you.</p>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#064E3B",
                color: "#F1D49B",
                border: "1px solid #C6A36A",
                borderRadius: "8px",
                padding: "11px 24px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Full Name *</label>
              <input
                style={inputStyle}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Email Address *</label>
              <input
                style={inputStyle}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inputStyle}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Your Enquiry *</label>
              <textarea
                style={{ ...inputStyle, minHeight: "105px", resize: "vertical" }}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              />
            </div>

            {error && (
              <p style={{ color: "#B42318", fontSize: "13px" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#064E3B",
                color: "#F1D49B",
                border: "1px solid #C6A36A",
                borderRadius: "9px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "9px",
              }}
            >
              {loading ? "Sending..." : "Submit Enquiry"}
              {!loading && <Send size={16} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
