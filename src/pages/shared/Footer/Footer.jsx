import React from "react";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#20363A] text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="flex mx-auto text-white text-center justify-center">
          <ProFastLogo isFooter={true}></ProFastLogo>
        </div>
        <p className="max-w-xl mx-auto my-6">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <div className="border-t border-b border-dashed border-teal-500 py-4 my-8 flex justify-center space-x-6">
          <Link to="/" className="hover:text-lime-400 transition-colors">
            Services
          </Link>
          <Link to="/coverage" className="hover:text-lime-400 transition-colors">
            Coverage
          </Link>
          <Link to="/about" className="hover:text-lime-400 transition-colors">
            About Us
          </Link>
          <Link to="/" className="hover:text-lime-400 transition-colors">
            Pricing
          </Link>
          <Link to="/" className="hover:text-lime-400 transition-colors">
            Blog
          </Link>
          <Link to="/" className="hover:text-lime-400 transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex justify-center space-x-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lime-400 transition-colors"
          >
            <div className="bg-gray-700 p-3 rounded-full">
              <FaLinkedinIn size={20} />
            </div>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lime-400 transition-colors"
          >
            <div className="bg-gray-700 p-3 rounded-full">
              <FaXTwitter size={20} />
            </div>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lime-400 transition-colors"
          >
            <div className="bg-gray-700 p-3 rounded-full">
              <FaFacebookF size={20} />
            </div>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lime-400 transition-colors"
          >
            <div className="bg-gray-700 p-3 rounded-full">
              <FaYoutube size={20} />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
