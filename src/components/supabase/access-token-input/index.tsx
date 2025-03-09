"use client";

import { useState } from "react";
import { useSupabase } from "../supabase-context-provider";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
    "&:focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
  button: {
    width: "100%",
    padding: "12px 24px",
    background: "hsl(154.9deg 59.5% 55% / 1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#2563eb",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  link: {
    fontSize: "0.8rem",
    color: "#718096",
  },
};

export default function AccessTokenInput() {
  const [accessToken, setAccessToken] = useState("");
  const supabase = useSupabase();
  return (
    <div style={styles.container}>
      <label style={styles.label}>Enter Supabase Access Token</label>
      <a
        style={styles.link}
        href="https://supabase.com/dashboard/account/tokens"
        target="_blank"
      >
        Get your token here
      </a>
      <input
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        type="text"
        placeholder="Enter your token here"
        style={styles.input}
      />
      <button
        onClick={() =>
          supabase
            .checkCompliance(accessToken)
            .then(() => {})
            .catch(() => {
              alert("Wrong Access Token");
              supabase.setAccessToken(null);
            })
        }
        style={styles.button}
      >
        Check Compliance
      </button>
    </div>
  );
}
