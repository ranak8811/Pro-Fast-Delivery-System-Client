import React, { useState, useEffect } from "react";
import BangladeshMap, { ServiceCenter } from "./BangladeshMap";
import { useLoaderData } from "react-router-dom";
import { FaMapMarkedAlt, FaShieldAlt, FaTruck, FaClock } from "react-icons/fa";
import useTitle from "../../hooks/useTitle";

const Coverage: React.FC = () => {
  useTitle("Coverage Area");
  const rawLoaderData = useLoaderData();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>(() =>
    Array.isArray(rawLoaderData) ? rawLoaderData : []
  );

  useEffect(() => {
    if (Array.isArray(rawLoaderData) && rawLoaderData.length > 0) {
      setServiceCenters(rawLoaderData);
    } else {
      fetch("/serviceCenter.json")
        .then((res) => {
          if (!res.ok) return [];
          const ct = res.headers.get("content-type") || "";
          return ct.includes("application/json") ? res.json() : [];
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setServiceCenters(data);
          }
        })
        .catch((err) => console.warn("Fallback service centers fetch error:", err));
    }
  }, [rawLoaderData]);

  const totalDistricts = Array.isArray(serviceCenters) ? serviceCenters.length : 64;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner matching brand aesthetic */}
      <div className="bg-[#20363A] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#CAEB66] text-xs font-semibold mb-3 backdrop-blur-md">
            <FaMapMarkedAlt className="text-xs" /> Nationwide Delivery Network
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
            Available Across All {totalDistricts || 64} Districts
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            From metropolitan hubs to remote sub-districts, Pro-Fast delivers reliably everywhere in Bangladesh with end-to-end GPS visibility and local service centers.
          </p>

          {/* Quick Stats Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-medium text-white border border-white/10">
              <FaTruck className="text-[#CAEB66] text-xs" /> Doorstep Delivery
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-medium text-white border border-white/10">
              <FaClock className="text-[#CAEB66] text-xs" /> 24/7 Tracking & Support
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-medium text-white border border-white/10">
              <FaShieldAlt className="text-[#CAEB66] text-xs" /> 100% Insured Shipments
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map with floating search bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Interactive Service Hub Explorer
            </h2>
            <p className="text-xs text-slate-400">
              Search by district name or tap markers to view local delivery coverage
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {totalDistricts} Active Regional Centers
          </span>
        </div>

        <BangladeshMap serviceCenters={serviceCenters} />
      </div>
    </div>
  );
};

export default Coverage;
