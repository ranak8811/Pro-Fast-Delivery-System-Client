import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import bannerImg1 from "../../../assets/banner/banner1.png";
import bannerImg2 from "../../../assets/banner/banner2.png";
import bannerImg3 from "../../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <div className="w-full">
      <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
        <div>
          <img src={bannerImg1} alt="Banner 1" className="w-full object-cover" />
        </div>
        <div>
          <img src={bannerImg2} alt="Banner 2" className="w-full object-cover" />
        </div>
        <div>
          <img src={bannerImg3} alt="Banner 3" className="w-full object-cover" />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
