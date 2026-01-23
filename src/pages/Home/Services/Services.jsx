import React from "react";
import ServiceCard from "./ServiceCard";
import bookingIcon from "../../../assets/bookingIcon.png";

const servicesData = [
  {
    title: "Express & Standard Delivery",
    description:
      "Get your parcels delivered within 24-72 hours. Express delivery in Dhaka is available within 4-6 hours.",
    icon: bookingIcon,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We offer home delivery to every district in Bangladesh, ensuring your products reach customers within 48-72 hours.",
    icon: bookingIcon,
  },
  {
    title: "Fulfillment Solutions",
    description:
      "Customized inventory management, order processing, packaging, and after-sales support to streamline your business.",
    icon: bookingIcon,
  },
  {
    title: "Cash on Delivery",
    description:
      "Secure and reliable cash on delivery service available across Bangladesh, ensuring safety for your products.",
    icon: bookingIcon,
  },
  {
    title: "Corporate Logistics",
    description:
      "Tailored corporate services, including warehouse and inventory management support for your business.",
    icon: bookingIcon,
  },
  {
    title: "Easy Parcel Returns",
    description:
      "Our reverse logistics allows customers to easily return or exchange products with online merchants.",
    icon: bookingIcon,
  },
];

const Services = () => {
  return (
    <section
      className="py-16 px-4 rounded-2xl"
      style={{ backgroundColor: "#20363A" }}
    >
      <div className="container mx-auto">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg max-w-3xl mx-auto">
            From express delivery to fulfillment solutions, we offer a complete
            range of logistics services to meet your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
