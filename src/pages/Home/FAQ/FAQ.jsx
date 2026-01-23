import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "What areas do you deliver to?",
    answer:
      "We deliver to all 64 districts of Bangladesh. We have a wide network of delivery agents to ensure that your parcel reaches its destination, no matter where it is.",
  },
  {
    question: "How long does it take to deliver a parcel?",
    answer:
      "For deliveries within Dhaka, we offer express delivery within 4-6 hours. For the rest of Bangladesh, our standard delivery time is 48-72 hours.",
  },
  {
    question: "How can I track my parcel?",
    answer:
      "You can track your parcel in real-time using the tracking ID provided to you at the time of booking. Simply enter the tracking ID on our website or mobile app to see the current status of your delivery.",
  },
  {
    question: "What is your cash on delivery policy?",
    answer:
      "We offer a 100% secure cash on delivery service across Bangladesh. Our agents will collect the payment from the recipient at the time of delivery.",
  },
  {
    question: "Do you offer any special services for businesses?",
    answer:
      "Yes, we offer a range of corporate services, including inventory management, order processing, and fulfillment solutions. Please contact us for a custom quote.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  const toggle = (index) => {
    if (open === index) {
      return setOpen(null);
    }
    setOpen(index);
  };

  return (
    <section className="py-16 px-4 bg-[#F0F5F5]">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#20363A]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Here are some of the most common questions we get from our customers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 rounded-2xl ${
                open === index ? "bg-teal-50 border border-teal-300" : "bg-white"
              }`}
            >
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggle(index)}
              >
                <h3 className="text-lg font-semibold text-[#20363A]">
                  {faq.question}
                </h3>
                <span>{open === index ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
              {open === index && (
                <div className="p-6 pt-0">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn bg-lime-400 text-black hover:bg-lime-500 border-none rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300">
            See More FAQ's
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
