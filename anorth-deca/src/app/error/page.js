// pages/404.js or 404.jsx in Next.js
import React from "react";

export default function ErrorPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#ff6b6b" }}>404</h1>
      <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>Page Not Found</h2>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      
    </div>
  );
}