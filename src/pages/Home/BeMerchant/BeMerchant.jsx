import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-cover bg-center bg-[#03373D] rounded-4xl p-8 md:p-16 lg:p-20 text-white my-12 mx-4"
    >
      <div className="hero-content flex-col lg:flex-row-reverse justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex-1 lg:flex-none mb-8 lg:mb-0">
          <img
            src={location}
            className="max-w-full h-auto rounded-lg shadow-2xl"
            alt="Location"
          />
        </div>
        <div className="flex-1 text-center lg:text-left lg:ml-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 text-lg leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn bg-[#D1E231] text-gray-900 hover:bg-[#a9b828] border-none rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300">
            Become A Merchant
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
