"use client";

import Image from "next/image";
import { CSSProperties } from "react";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  } as CSSProperties,

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as CSSProperties,

  separator: {
    fontSize: "24px",
    color: "#718096",
    margin: "0 8px",
  } as CSSProperties,

  title: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#2D3748",
    margin: 0,
  } as CSSProperties,
};

export default function Header() {
  return (
    <div className="header" style={styles.header}>
      <div style={styles.logoContainer}>
        <Image
          src="https://www.delve.co/assets/delveLogo-WOSFmGOm.svg"
          alt="Delve Logo"
          width={132}
          height={40}
        />
        <span style={styles.separator}>×</span>
        <Image
          src="https://supabase.com/dashboard/img/supabase-logo.svg"
          alt="Supabase Logo"
          width={40}
          height={40}
        />
        <h1 style={styles.title}>Supabase</h1>
      </div>
    </div>
  );
}
