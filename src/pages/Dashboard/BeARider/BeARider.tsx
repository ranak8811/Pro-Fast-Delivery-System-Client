import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import {
  FaMotorcycle,
  FaIdCard,
  FaPhoneAlt,
  FaUserAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaClipboardList,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTitle from "../../../hooks/useTitle";

interface ServiceCenterLocation {
  region: string;
  district: string;
}

interface RiderFormInputs {
  age: number | string;
  phone: string;
  nid: string;
  region: string;
  district: string;
  bike_brand: string;
  bike_registration: string;
  note?: string;
}

const BeARider: React.FC = () => {
  useTitle("Become a Courier Rider");
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RiderFormInputs>();

  const rawLoaderData = useLoaderData();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenterLocation[]>(() =>
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

  const regions = Array.isArray(serviceCenters)
    ? [...new Set(serviceCenters.map((s) => s.region).filter(Boolean))]
    : [];
  const districts =
    selectedRegion && Array.isArray(serviceCenters)
      ? serviceCenters
          .filter((s) => s.region === selectedRegion)
          .map((s) => s.district)
          .filter(Boolean)
      : [];

  const onSubmit: SubmitHandler<RiderFormInputs> = async (data) => {
    setIsSubmitting(true);
    const riderData = {
      ...data,
      name: user?.displayName || "",
      email: user?.email || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/employee", riderData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted Successfully!",
          text: "Our dispatch operations team will review your credentials and contact you within 24-48 hours.",
          confirmButtonColor: "#20363A",
          customClass: {
            popup: "rounded-3xl shadow-xl px-6 py-6 font-sans",
          },
        });
        reset();
        setSelectedRegion("");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || "Could not submit your rider application. Please try again.",
        confirmButtonColor: "#20363A",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner with brand design */}
      <div className="bg-[#20363A] rounded-3xl p-6 md:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#CAEB66] text-xs font-semibold mb-4 backdrop-blur-md border border-white/10">
            <FaMotorcycle className="text-xs" /> Join The Pro-Fast Fleet
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Ride With Freedom. <span className="text-[#CAEB66]">Earn On Your Terms.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Become a certified Pro-Fast courier partner. Enjoy flexible delivery shifts, top-tier compensation with instant weekly payouts, in-app smart GPS route optimization, and full accidental insurance.
          </p>

          {/* Key Rider Benefits Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
              <FaMoneyBillWave className="text-[#CAEB66] text-base" />
              <span className="font-bold">Weekly Payouts</span>
              <span className="text-[11px] text-white/60">Guaranteed on-time</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
              <FaClock className="text-[#CAEB66] text-base" />
              <span className="font-bold">Flexible Hours</span>
              <span className="text-[11px] text-white/60">Choose your shift</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
              <FaShieldAlt className="text-[#CAEB66] text-base" />
              <span className="font-bold">Accident Cover</span>
              <span className="text-[11px] text-white/60">100% insured trips</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
              <FaMapMarkerAlt className="text-[#CAEB66] text-base" />
              <span className="font-bold">64 Districts</span>
              <span className="text-[11px] text-white/60">Local hubs near you</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Requirements & Steps (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rider Qualification Checklist */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <FaClipboardList className="text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">What You Need</h3>
                <p className="text-xs text-slate-400">Basic eligibility criteria</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs md:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                <span><strong>Age 18+:</strong> Must be at least 18 years of age.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                <span><strong>National ID (NID):</strong> Valid Smart NID card or voter registration slip.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                <span><strong>Vehicle & License:</strong> A registered motorbike or scooter with valid BRTA documents.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                <span><strong>Smartphone:</strong> Android or iOS phone with active internet connection.</span>
              </li>
            </ul>
          </div>

          {/* 3 Steps To Start Earning */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#20363A] text-[#CAEB66] font-extrabold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Submit Online Application</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in your verified contact, regional hub preference, and bike credentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#20363A] text-[#CAEB66] font-extrabold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Account Approval & Training</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our team verifies your records and sets up your mobile rider dispatch dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#20363A] text-[#CAEB66] font-extrabold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Pick Up & Start Delivering</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accept deliveries, collect parcels from hubs, and receive weekly payouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Application Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Courier Partner Application</h2>
              <p className="text-xs text-slate-400 mt-0.5">Please ensure all information matches your NID and registration</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
              Fast Review
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Applicant Name & Email (Pre-filled from authenticated user) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FaUserAlt className="text-slate-400 text-xs" /> Full Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FaEnvelope className="text-slate-400 text-xs" /> Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Age & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  min="18"
                  max="65"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all"
                  {...register("age", { required: true, min: 18 })}
                />
                {errors.age && (
                  <p className="text-rose-500 text-[11px] mt-1">You must be at least 18 years old</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FaPhoneAlt className="text-slate-400 text-[10px]" /> Contact Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +880 1700-000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-rose-500 text-[11px] mt-1">Active phone number is required</p>
                )}
              </div>
            </div>

            {/* NID Card */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <FaIdCard className="text-slate-400 text-xs" /> National ID Card Number (NID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="10, 13, or 17 digit NID number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all font-mono"
                {...register("nid", { required: true })}
              />
              {errors.nid && (
                <p className="text-rose-500 text-[11px] mt-1">National ID number is required</p>
              )}
            </div>

            {/* Service Hub Region & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Operating Region <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all"
                  {...register("region", { required: true })}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((region, idx) => (
                    <option key={idx} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-rose-500 text-[11px] mt-1">Operating region is required</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned District Hub <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                  {...register("district", { required: true })}
                  disabled={!selectedRegion}
                >
                  <option value="">Select District</option>
                  {districts.map((district, idx) => (
                    <option key={idx} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-rose-500 text-[11px] mt-1">District hub is required</p>
                )}
              </div>
            </div>

            {/* Motorbike Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FaMotorcycle className="text-slate-400 text-xs" /> Bike Brand & Model <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yamaha FZ, Bajaj Pulsar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all"
                  {...register("bike_brand", { required: true })}
                />
                {errors.bike_brand && (
                  <p className="text-rose-500 text-[11px] mt-1">Bike model is required</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka Metro-HA-12-3456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all uppercase"
                  {...register("bike_registration", { required: true })}
                />
                {errors.bike_registration && (
                  <p className="text-rose-500 text-[11px] mt-1">Vehicle registration is required</p>
                )}
              </div>
            </div>

            {/* Additional Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Additional Information (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Prior delivery experience, preferred shifts, or additional notes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none transition-all resize-none"
                {...register("note")}
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#CAEB66] hover:bg-[#bfe259] text-[#20363A] font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Submit Rider Application</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5">
                By submitting, you agree to Pro-Fast's Courier Partner Guidelines and Terms of Service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
