import React from "react";
import BangladeshMap from "./BangladeshMap";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const serviceCenters = useLoaderData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        We are available in 64 districts
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Our services span across all 64 districts of Bangladesh. We are committed to providing reliable and efficient delivery services to every corner of the country. Whether you are in a bustling city or a remote village, we've got you covered.
      </p>

      {/* Later you can add your search box here */}
      {/* <SearchDistrictBox /> */}

      <BangladeshMap serviceCenters={serviceCenters} />
    </div>
  );
};

export default Coverage;
