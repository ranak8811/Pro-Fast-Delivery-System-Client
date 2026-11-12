import React from "react";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaShieldAlt,
  FaUsers,
  FaBullseye,
  FaRocket,
  FaAward,
  FaHandshake,
  FaClock,
  FaMapMarkedAlt,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";
import useTitle from "../../hooks/useTitle";

const About: React.FC = () => {
  useTitle("About Us");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section Banner */}
      <div className="bg-[#20363A] rounded-3xl p-6 md:p-14 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#CAEB66] text-xs font-semibold mb-4 backdrop-blur-md border border-white/10">
            <FaTruck className="text-xs" /> Bangladesh's Smart Courier Partner
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Redefining Fast, Reliable Logistics Across Bangladesh
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Pro-Fast connects enterprises, online merchants, and individuals across all 64 districts. Powered by real-time GPS telemetry, intelligent AI tracking, and guaranteed doorstep handling, we make distance disappear.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/sendParcel"
              className="px-6 py-3.5 rounded-2xl bg-[#CAEB66] text-[#20363A] font-extrabold text-sm hover:bg-[#bfe259] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              Ship a Parcel Now
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/coverage"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              Explore 64 Districts
            </Link>
          </div>
        </div>
      </div>

      {/* High-Impact Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-center text-center space-y-1">
          <span className="text-3xl md:text-4xl font-black text-[#20363A]">64 / 64</span>
          <span className="text-xs font-semibold text-slate-700">Districts Covered</span>
          <p className="text-[11px] text-slate-400">Complete nationwide reach</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-center text-center space-y-1">
          <span className="text-3xl md:text-4xl font-black text-[#20363A]">1.5M+</span>
          <span className="text-xs font-semibold text-slate-700">Parcels Handled</span>
          <p className="text-[11px] text-slate-400">Safe doorstep delivery</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-center text-center space-y-1">
          <span className="text-3xl md:text-4xl font-black text-[#20363A]">10K+</span>
          <span className="text-xs font-semibold text-slate-700">Merchants & Riders</span>
          <p className="text-[11px] text-slate-400">Trusted logistics network</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-center text-center space-y-1">
          <span className="text-3xl md:text-4xl font-black text-emerald-600">99.8%</span>
          <span className="text-xs font-semibold text-slate-700">On-Time Success</span>
          <p className="text-[11px] text-slate-400">Guaranteed SLAs</p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl mb-2">
            <FaBullseye />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our mission is to democratize high-speed logistics across Bangladesh by providing dependable, technology-driven, and transparent courier services. We empower local e-commerce, small business owners, and everyday senders with real-time digital tools that make parcel distribution effortless.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#20363A]/10 text-[#20363A] flex items-center justify-center font-bold text-xl mb-2">
            <FaRocket />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Our Vision</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our vision is to build the most resilient and beloved logistics infrastructure in South Asia. We aspire to eliminate geographic friction for commerce through automated regional routing hubs, green fleets, and artificial intelligence-backed transit predictability.
          </p>
        </div>
      </div>

      {/* Our Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <FaAward className="text-amber-500 text-xs" /> Guiding Principles
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Values That Drive Every Delivery
          </h2>
          <p className="text-xs text-slate-400">
            How our drivers, operations team, and engineers ensure excellence every day
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-base">
              <FaUsers />
            </div>
            <h3 className="text-base font-bold text-slate-800">Customer Centricity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We put clients and recipients first with proactive communication, transparent milestone updates, and prompt resolution.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-base">
              <FaClock />
            </div>
            <h3 className="text-base font-bold text-slate-800">Speed with Precision</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every route is strategically calculated to reduce delivery bottlenecks, ensuring timely pickups and doorstep deliveries.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-base">
              <FaShieldAlt />
            </div>
            <h3 className="text-base font-bold text-slate-800">Complete Integrity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent rate calculators, zero hidden surcharges, secure Stripe checkouts, and insured parcel protection.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-base">
              <FaHandshake />
            </div>
            <h3 className="text-base font-bold text-slate-800">Empowerment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Creating lucrative, flexible livelihoods for thousands of freelance courier riders while scaling regional economies.
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Infrastructure Showcase */}
      <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200/80 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800">
            Powered by Next-Generation Logistics Tech
          </h2>
          <p className="text-xs text-slate-500">
            Cutting-edge tools that guarantee peace of mind for every shipment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="text-xs font-bold text-[#20363A] flex items-center gap-2">
              <FaChartLine className="text-emerald-500" /> AI Tracking Telemetry
            </div>
            <h4 className="text-sm font-bold text-slate-800">Smart ETA Forecasts</h4>
            <p className="text-xs text-slate-500">
              Machine learning models anticipate delays, weather disruptions, and traffic to give customers reliable delivery windows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="text-xs font-bold text-[#20363A] flex items-center gap-2">
              <FaMapMarkedAlt className="text-sky-500" /> 64-District Hub Mesh
            </div>
            <h4 className="text-sm font-bold text-slate-800">Regional Sorting Centers</h4>
            <p className="text-xs text-slate-500">
              Our decentralized service centers ensure quick handovers between long-haul trucks and local motorbike dispatchers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="text-xs font-bold text-[#20363A] flex items-center gap-2">
              <FaShieldAlt className="text-indigo-500" /> Secure Payments
            </div>
            <h4 className="text-sm font-bold text-slate-800">Instant Verification</h4>
            <p className="text-xs text-slate-500">
              End-to-end encrypted Stripe checkout and automated reconciliation for seamless COD and digital payments.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Card */}
      <div className="bg-[#20363A] text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#CAEB66]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black">
            Ready to experience faster delivery?
          </h3>
          <p className="text-sm text-white/70 max-w-lg">
            Dispatch your parcel in under 2 minutes or join our rapidly growing fleet of certified delivery riders.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <Link
            to="/sendParcel"
            className="px-6 py-3.5 rounded-2xl bg-[#CAEB66] text-[#20363A] font-extrabold text-sm hover:bg-[#bfe259] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            Send a Parcel
            <FaArrowRight className="text-xs" />
          </Link>
          <Link
            to="/beARider"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            Become a Rider
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
