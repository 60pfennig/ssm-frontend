import React from "react";

interface StartScreenProps {
  description: string;
  onClick: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ description, onClick }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        width: "100vw",
        height: "100vh",
      }}
      onClick={handleButtonClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="64"
        height="64"
        style={{ marginBottom: "16px" }}
      >
        {/* Hier sollte dein SVG-Code für den Kopfhörer stehen */}
        {/* Beispiel-SVG: */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="black"
          strokeWidth="3"
          fill="gray"
        />
      </svg>
      <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
        {description}
      </p>
      <button
        style={{
          marginTop: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={handleButtonClick}
      >
        Play
      </button>
    </div>
  );
};

export default StartScreen;
