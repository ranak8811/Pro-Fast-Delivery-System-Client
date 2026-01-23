import React from "react";
import liveTracking from "../../../assets/live-tracking.png";
import safeDelivery from "../../../assets/safe-delivery.png";
import callCenter from "../../../assets/service.png";

const featuresData = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    img: liveTracking,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    img: safeDelivery,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    img: callCenter,
  },
];

const Feature = ({ feature, reverse }) => {
  return (
    <div
      className={`flex items-center justify-center gap-8 rounded-2xl bg-white p-12 ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <div className="w-1/2">
        <img
          src={feature.img}
          alt={feature.title}
          className="max-w-full rounded-lg"
        />
      </div>
      <div
        className={`w-1/2 ${
          reverse
            ? "pr-12 border-r-2 border-dashed border-[#20363A]"
            : "pl-12 border-l-2 border-dashed border-[#20363A]"
        }`}
      >
        <h3 className="mb-4 text-3xl font-bold" style={{ color: "#20363A" }}>
          {feature.title}
        </h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="space-y-8 bg-gray-50 py-16 px-4">
      <div className="container mx-auto space-y-8">
        {featuresData.map((feature, index) => (
          <Feature key={index} feature={feature} reverse={index % 2 !== 0} />
        ))}
      </div>
    </section>
  );
};

export default Features;
