import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import BeMerchant from "../BeMerchant/BeMerchant";
import Features from "../Features/Features";
import Testimonials from "../Testimonials/Testimonials";
import FAQ from "../FAQ/FAQ";
import useTitle from "../../../hooks/useTitle";

const Home: React.FC = () => {
  useTitle("Home");

  return (
    <div className="space-y-20">
      <Banner />
      <Services />
      <Features />
      <BeMerchant />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
