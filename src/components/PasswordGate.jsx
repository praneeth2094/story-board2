import { useEffect, useState } from "react";
import "../styles/passwordGate.css";

const PASSWORD_HASH = "86cb35a822329fe1de40eb82a1791be1f66f8bd327446686bdd859a89e436853";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async () => {
    const hashed = await hashPassword(input.trim());
    if (hashed === PASSWORD_HASH) {
      sessionStorage.setItem("unlocked", "true");
      setUnlocked(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (unlocked) return children;

  return (
    <div className="password-gate-wrapper">
      <div className="password-gate-card">
        <h2 className="password-title">Private Stories</h2>
        <p className="password-subtitle">Enter the password to continue</p>

        <input
          type="password"
          className="password-input"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button className="password-btn" onClick={handleSubmit}>
          Unlock
        </button>

        {error && <p className="password-error">{error}</p>}
      </div>
    </div>
  );
}
