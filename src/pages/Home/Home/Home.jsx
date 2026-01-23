import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import BeMerchant from "../BeMerchant/BeMerchant";
import Features from "../Features/Features";
import Testimonials from "../Testimonials/Testimonials";
import FAQ from "../FAQ/FAQ";

const Home = () => {
  return (
    <div className="space-y-20">
      <Banner></Banner>
      <Services></Services>
      <Features></Features>
      <BeMerchant></BeMerchant>
      <Testimonials></Testimonials>
      <FAQ></FAQ>
    </div>
  );
};

export default Home;
