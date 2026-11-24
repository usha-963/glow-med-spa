
import { useState } from "react";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

export default function AdminGate() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("glowAdminLoggedIn") === "true"
  );

  const handleLogin = () => {
    sessionStorage.setItem("glowAdminLoggedIn", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("glowAdminLoggedIn");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <Admin onLogout={handleLogout} />;
}
