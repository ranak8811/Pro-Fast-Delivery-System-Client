import React from "react";

const ServiceCard = ({ service, index }) => {
  const cardStyle = {
    backgroundColor: index === 1 ? "#D4F75A" : "white",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
  };

  const textStyle = {
    color: index === 1 ? "#20363A" : "#20363A",
  };

  return (
    <div style={cardStyle}>
      <div
        className="mb-6 inline-block"
        style={{
          backgroundColor: "rgba(130, 130, 130, 0.1)",
          borderRadius: "50%",
          padding: "15px",
        }}
      >
        <img src={service.icon} alt={service.title} className="w-12 h-12" />
      </div>
      <h3
        className="text-2xl font-bold mb-3"
        style={textStyle}
      >
        {service.title}
      </h3>
      <p
        className="leading-relaxed"
        style={textStyle}
      >
        {service.description}
      </p>
    </div>
  );
};

export default ServiceCard;
