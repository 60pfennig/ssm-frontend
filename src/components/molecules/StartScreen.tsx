import { Heading } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface StartScreenProps {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Heading>Willkommen zur Spatial Sound Map der Lausitz</Heading>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: "30%",
        }}
      >
        <Image
          src={"/headphones.png"}
          alt="headphones"
          width={500}
          height={500}
        />
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "start",
            }}
          >
            Hier kannst du die Sounds der Lausitz entdecken. Um die Klänge
            räumlich wahrnehmen zu können sind Kopfhörer notwendig.
          </p>
          <button
            style={{
              marginTop: 40,
              backgroundColor: "#63666A",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              width: 200,
            }}
            onClick={handleButtonClick}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
