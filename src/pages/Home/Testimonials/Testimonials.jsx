import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import reviewQuote from "../../../assets/reviewQuote.png";

const testimonialsData = [
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    role: "Senior Product Designer",
  },
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Rasel Ahamed",
    role: "CTO",
  },
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Nasir Uddin",
    role: "CEO",
  },
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "John Doe",
    role: "Software Engineer",
  },
];

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-lime-400 rounded-full w-10 h-10 flex items-center justify-center`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-lime-400 rounded-full w-10 h-10 flex items-center justify-center`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <section className="py-20 px-4 text-center bg-[#F0F5F5]">
      <div className="container mx-auto">
        <img src={reviewQuote} alt="quote" className="mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4 text-[#20363A]">
          What our customers are sayings
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        <Slider {...settings}>
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded-2xl p-8 h-full relative">
                <p className="text-8xl text-gray-200 absolute top-4 left-4">
                  ❞
                </p>
                <p className="text-gray-700 italic mt-10 mb-6 text-left">
                  {testimonial.quote}
                </p>
                <div className="border-t border-dashed border-gray-300 my-4"></div>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-[#20363A] mr-4"></div>
                  <div>
                    <p className="font-bold text-left">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 text-left">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
