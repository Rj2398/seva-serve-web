import React from "react";

interface Props {
  message: string;
  onRetry: () => void;
}

const NetworkErrorModal = ({ message, onRetry }: Props) => {
  return (
    <div style={{
      flex: 1,
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#ffebee",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30px",
      }}>
        <i className="fa-solid fa-wifi" style={{ fontSize: "4rem", color: "#f44336" }}></i>
      </div>
      <h2 style={{ fontWeight: "800", marginBottom: "15px", color: "#333", fontSize: "32px" }}>
        Connection Error
      </h2>
      <p style={{ 
        fontSize: "18px", 
        color: "#666", 
        lineHeight: "1.6", 
        marginBottom: "40px",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: "15px 40px",
          border: "none",
          borderRadius: "8px",
          background: "#f26522",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background 0.3s, transform 0.2s"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#d95a1e";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#f26522";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Try Again
      </button>
    </div>
  );
};

export default NetworkErrorModal;
