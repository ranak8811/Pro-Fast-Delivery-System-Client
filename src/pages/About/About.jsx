import React from "react";

const About = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#20363A]">About ProFast</h1>
          <p className="text-lg max-w-3xl mx-auto mt-4 text-gray-600">
            Your trusted partner in logistics and delivery services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#20363A] mb-4">Our Mission</h2>
            <p className="text-gray-700">
              Our mission is to provide fast, reliable, and affordable delivery services to every corner of Bangladesh. We are committed to leveraging technology to create a seamless and hassle-free experience for our customers. We aim to empower businesses and individuals by connecting them with our extensive logistics network.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#20363A] mb-4">Our Vision</h2>
            <p className="text-gray-700">
              Our vision is to be the leading logistics provider in Bangladesh, known for our commitment to customer satisfaction, operational excellence, and innovation. We aspire to build a future where distance is no longer a barrier for commerce and communication.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#20363A] mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li className="mb-2">
                <span className="font-semibold">Customer-Centric:</span> We put our customers at the heart of everything we do.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Integrity:</span> We believe in transparency and honesty in all our dealings.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Innovation:</span> We continuously seek to innovate and improve our services.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Reliability:</span> We are committed to delivering on our promises.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Teamwork:</span> We work together to achieve our common goals.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
