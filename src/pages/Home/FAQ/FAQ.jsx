import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, our posture correctors are designed to be adjustable and fit a wide range of body types and sizes. We offer different sizes to ensure a comfortable and effective fit for everyone.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Absolutely. By promoting proper alignment, our posture corrector helps alleviate back pain caused by poor posture. Consistent use can lead to significant improvements in your overall posture and well-being.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Some of our advanced models come with smart features like gentle vibration alerts to remind you to correct your posture whenever you start to slouch. Check the product details for specific features.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can sign up for back-in-stock notifications on the product page. We will send you an email as soon as the product is available for purchase again.",
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
    <section className="py-20 px-4 bg-[#F0F5F5]">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#20363A]">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
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
          <button className="btn bg-lime-400 text-black rounded-full px-8">
            See More FAQ's <span className="ml-2 bg-black text-white rounded-full p-2">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
