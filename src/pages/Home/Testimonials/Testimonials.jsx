import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import reviewQuote from "../../../assets/reviewQuote.png";

const testimonialsData = [
  {
    quote:
      "ProFast has been a game-changer for my small business. Their delivery is always on time, and the live tracking gives me peace of mind. Highly recommended!",
    name: "Sadia Islam",
    role: "E-commerce Store Owner",
  },
  {
    quote:
      "I've been using ProFast for all my personal shipments, and I'm consistently impressed with their professionalism and speed. Their customer service is top-notch!",
    name: "Rahim Ahmed",
    role: "Freelancer",
  },
  {
    quote:
      "The corporate logistics solutions from ProFast have streamlined our operations significantly. Their team is reliable, and their rates are competitive. A great partner to have.",
    name: "Fatima Chowdhury",
    role: "Operations Manager",
  },
  {
    quote:
      "As a frequent online shopper, I appreciate ProFast's easy parcel return service. It makes the whole process hassle-free. Thank you, ProFast!",
    name: "John Doe",
    role: "Online Shopper",
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
    <section className="py-16 px-4 text-center bg-[#F0F5F5]">
      <div className="container mx-auto">
        <img src={reviewQuote} alt="quote" className="mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4 text-[#20363A]">
          What Our Customers Are Saying
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We are committed to providing the best service to our customers. Here's what they have to say about us.
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
                  <div className="w-16 h-16 rounded-full bg-[#20363A] mr-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-white"
                    >
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </div>
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
