
import { useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "admin@glowmedspa.com" &&
      password === "GlowDemo2026!"
    ) {
      sessionStorage.setItem("glowAdminLoggedIn", "true");
      onLogin();
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#faf7f2",
      padding: 20
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: 420,
        padding: 40,
        background: "white",
        border: "1px solid #eadfce",
        borderRadius: 16,
        boxSizing: "border-box"
      }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Sparkles size={34} color="#927047" />
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: 30,
            fontWeight: 500,
            color: "#382b29"
          }}>
            Glow Med Spa
          </h1>
          <p style={{ color: "#81756d" }}>Admin Portal</p>
        </div>

        <h2 style={{ color: "#382b29" }}>Welcome back</h2>
        <p style={{ color: "#81756d" }}>
          Sign in to manage your demo business.
        </p>

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
          style={fieldStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          style={fieldStyle}
        />

        {error && (
          <p style={{ color: "#b33b35", fontSize: 14 }}>{error}</p>
        )}

        <button type="submit" style={{
          width: "100%",
          padding: 14,
          marginTop: 20,
          background: "#927047",
          color: "white",
          border: 0,
          borderRadius: 7,
          fontWeight: 600,
          cursor: "pointer"
        }}>
          <LockKeyhole size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
          Sign In
        </button>

        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "#968a80",
          marginTop: 25
        }}>
          Fictional portfolio demonstration by Nexora AI
        </p>
      </form>
    </div>
  );
}

const fieldStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: 13,
  margin: "9px 0 20px",
  border: "1px solid #e5d8c8",
  borderRadius: 6,
  fontSize: 15
};
