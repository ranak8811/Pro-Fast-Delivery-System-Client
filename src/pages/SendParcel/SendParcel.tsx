import React, { useState, useEffect } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaFileAlt,
  FaTruck,
  FaUserAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaCalculator,
  FaInfoCircle,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useTrackingLogger from "../../hooks/useTrackingLogger";
import useTitle from "../../hooks/useTitle";

interface ServiceCenterItem {
  region: string;
  district: string;
}

export interface SendParcelFormInputs {
  title: string;
  type: string;
  weight?: string | number;
  sender_name: string;
  sender_contact: string;
  sender_region: string;
  sender_center: string;
  sender_address: string;
  pickup_instruction: string;
  receiver_name: string;
  receiver_contact: string;
  receiver_region: string;
  receiver_center: string;
  receiver_address: string;
  delivery_instruction: string;
}

const generateTrackingID = (): string => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SendParcel: React.FC = () => {
  useTitle("Send Parcel");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SendParcelFormInputs>({
    defaultValues: {
      type: "document",
    },
  });
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { logTracking } = useTrackingLogger();

  // Defensively retrieve loader data and fallback if not array
  const rawLoaderData = useLoaderData();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenterItem[]>(() =>
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

  // Extract unique regions safely
  const uniqueRegions = Array.isArray(serviceCenters)
    ? [...new Set(serviceCenters.map((w) => w.region).filter(Boolean))]
    : [];

  // Get districts by region safely
  const getDistrictsByRegion = (region?: string): string[] =>
    region && Array.isArray(serviceCenters)
      ? serviceCenters
          .filter((w) => w.region === region)
          .map((w) => w.district)
          .filter(Boolean)
      : [];

  const parcelType = useWatch({ control, name: "type" });
  const senderRegion = useWatch({ control, name: "sender_region" });
  const senderCenter = useWatch({ control, name: "sender_center" });
  const receiverRegion = useWatch({ control, name: "receiver_region" });
  const receiverCenter = useWatch({ control, name: "receiver_center" });
  const weightInput = useWatch({ control, name: "weight" });

  // Calculate live estimation
  const weight = parseFloat(String(weightInput)) || 0;
  const isSameDistrict =
    Boolean(senderCenter) &&
    Boolean(receiverCenter) &&
    senderCenter === receiverCenter;

  let estimatedBaseCost = 0;
  let estimatedExtraCost = 0;
  let breakdownText = "";

  if (parcelType === "document") {
    estimatedBaseCost = isSameDistrict ? 60 : 80;
    breakdownText = `Document delivery ${isSameDistrict ? "within" : "outside"} district`;
  } else {
    if (weight <= 3) {
      estimatedBaseCost = isSameDistrict ? 110 : 150;
      breakdownText = `Non-document up to 3kg ${isSameDistrict ? "within" : "outside"} district`;
    } else {
      const extraKg = weight - 3;
      const perKgCharge = extraKg * 40;
      const districtExtra = isSameDistrict ? 0 : 40;
      estimatedBaseCost = isSameDistrict ? 110 : 150;
      estimatedExtraCost = perKgCharge + districtExtra;
      breakdownText = `Non-document over 3kg (+৳40/kg for ${extraKg.toFixed(1)}kg extra${
        districtExtra ? ", outside district" : ""
      })`;
    }
  }

  const estimatedTotalCost = estimatedBaseCost + estimatedExtraCost;

  const onSubmit: SubmitHandler<SendParcelFormInputs> = (data) => {
    const finalWeight = parseFloat(String(data.weight)) || 0;
    const sameDistrict = data.sender_center === data.receiver_center;

    let baseCost = 0;
    let extraCost = 0;
    let breakdown = "";

    if (data.type === "document") {
      baseCost = sameDistrict ? 60 : 80;
      breakdown = `Document delivery ${sameDistrict ? "within" : "outside"} the district.`;
    } else {
      if (finalWeight <= 3) {
        baseCost = sameDistrict ? 110 : 150;
        breakdown = `Non-document up to 3kg ${sameDistrict ? "within" : "outside"} the district.`;
      } else {
        const extraKg = finalWeight - 3;
        const perKgCharge = extraKg * 40;
        const districtExtra = sameDistrict ? 0 : 40;
        baseCost = sameDistrict ? 110 : 150;
        extraCost = perKgCharge + districtExtra;
        breakdown = `Non-document over 3kg ${sameDistrict ? "within" : "outside"} the district.<br/>
          Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}<br/>
          ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}`;
      }
    }

    const totalCost = baseCost + extraCost;

    Swal.fire({
      title: "Delivery Cost Breakdown",
      icon: "info",
      html: `
      <div class="text-left text-sm space-y-2 p-1">
        <p><strong>Parcel Name:</strong> ${data.title}</p>
        <p><strong>Parcel Type:</strong> <span class="capitalize">${data.type}</span></p>
        <p><strong>Weight:</strong> ${finalWeight} kg</p>
        <p><strong>Delivery Zone:</strong> ${
          sameDistrict ? "Within Same District" : "Outside District"
        }</p>
        <div class="border-t border-slate-200 my-2"></div>
        <p><strong>Base Cost:</strong> ৳${baseCost}</p>
        ${extraCost > 0 ? `<p><strong>Extra Charges:</strong> ৳${extraCost}</p>` : ""}
        <p class="text-xs text-slate-500">${breakdown}</p>
        <div class="border-t border-slate-200 my-2"></div>
        <p class="text-xl font-bold text-emerald-600">Total Delivery Cost: ৳${totalCost}</p>
      </div>
    `,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#20363A",
      denyButtonColor: "#94a3b8",
      customClass: {
        popup: "rounded-3xl shadow-xl px-6 py-6 font-sans",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const tracking_id = generateTrackingID();
        const parcelData = {
          ...data,
          cost: totalCost,
          created_by: user?.email,
          payment_status: "unpaid",
          delivery_status: "not_collected",
          creation_date: new Date().toISOString(),
          tracking_id: tracking_id,
        };

        axiosSecure.post("/business", parcelData).then(async (res) => {
          if (res.data.insertedId) {
            Swal.fire({
              title: "Parcel Registered!",
              text: "Redirecting to your parcels dashboard...",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            await logTracking({
              tracking_id: parcelData.tracking_id,
              status: "parcel_created",
              details: `Created by ${user?.displayName || "User"}`,
              updated_by: user?.email || undefined,
            });

            navigate("/dashboard/myParcels");
          }
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#20363A] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#CAEB66] text-xs font-semibold mb-3 backdrop-blur-md">
            <FaTruck className="text-xs" /> Express Courier Dispatch
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
            Create & Dispatch a Parcel
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Fast, secure, and end-to-end tracked courier delivery service across all 64 districts in Bangladesh with guaranteed doorstep pickup.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Specifications */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#20363A]/5 text-[#20363A] flex items-center justify-center font-bold">
                <FaBox className="text-base" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Parcel Specifications</h2>
                <p className="text-xs text-slate-400">Describe the items being shipped</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Parcel Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Parcel Name / Description <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#20363A] transition-all"
                  placeholder="e.g., Legal Documents, Electronics Package, Birthday Gift"
                />
                {errors.title && (
                  <p className="text-rose-500 text-xs mt-1">Parcel name is required</p>
                )}
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Parcel Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-[#20363A] cursor-pointer transition-all has-checked:border-[#20363A] has-checked:bg-[#20363A]/5">
                    <input
                      type="radio"
                      value="document"
                      {...register("type", { required: true })}
                      className="radio radio-primary radio-sm text-[#20363A]"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FaFileAlt className="text-slate-400 text-xs" /> Document
                      </div>
                      <p className="text-[11px] text-slate-400">Letters, contracts, books</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-[#20363A] cursor-pointer transition-all has-checked:border-[#20363A] has-checked:bg-[#20363A]/5">
                    <input
                      type="radio"
                      value="non-document"
                      {...register("type", { required: true })}
                      className="radio radio-primary radio-sm text-[#20363A]"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FaBox className="text-slate-400 text-xs" /> Non-Document
                      </div>
                      <p className="text-[11px] text-slate-400">Products, parcels, merchandise</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Package Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    {...register("weight")}
                    disabled={parcelType !== "non-document"}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#20363A] transition-all ${
                      parcelType !== "non-document" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""
                    }`}
                    placeholder={parcelType === "document" ? "Standard document (N/A)" : "Enter package weight in kg (e.g. 2.5)"}
                  />
                  <FaWeightHanging className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                </div>
                {parcelType === "non-document" && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Base tariff covers up to 3 kg. Additional weight is billed at ৳40 per extra kg.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sender & Receiver Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <FaUserAlt className="text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sender Details</h3>
                  <p className="text-[11px] text-slate-400">Origin pickup contact</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    {...register("sender_name", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="Sender Name"
                    defaultValue={user?.displayName || ""}
                  />
                  {errors.sender_name && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Number</label>
                  <input
                    {...register("sender_contact", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="Phone or Email"
                    defaultValue={user?.email || ""}
                  />
                  {errors.sender_contact && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Region</label>
                  <select
                    {...register("sender_region", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                  >
                    <option value="">Select Region</option>
                    {uniqueRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.sender_region && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">District Service Center</label>
                  <select
                    {...register("sender_center", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                  >
                    <option value="">Select Service Center</option>
                    {getDistrictsByRegion(senderRegion).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.sender_center && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pickup Address</label>
                  <input
                    {...register("sender_address", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="House, Street, Area"
                  />
                  {errors.sender_address && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pickup Instructions</label>
                  <textarea
                    rows={2}
                    {...register("pickup_instruction", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none resize-none"
                    placeholder="e.g. Ring the bell on 3rd floor"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Receiver Details</h3>
                  <p className="text-[11px] text-slate-400">Destination drop-off contact</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Recipient Name</label>
                  <input
                    {...register("receiver_name", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="Recipient Full Name"
                  />
                  {errors.receiver_name && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone</label>
                  <input
                    {...register("receiver_contact", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="e.g. +880 1700-000000"
                  />
                  {errors.receiver_contact && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Region</label>
                  <select
                    {...register("receiver_region", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                  >
                    <option value="">Select Region</option>
                    {uniqueRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_region && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Center</label>
                  <select
                    {...register("receiver_center", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                  >
                    <option value="">Select Service Center</option>
                    {getDistrictsByRegion(receiverRegion).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_center && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Address</label>
                  <input
                    {...register("receiver_address", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none"
                    placeholder="Full street address, apartment, road"
                  />
                  {errors.receiver_address && <p className="text-rose-500 text-[11px] mt-0.5">Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Instructions</label>
                  <textarea
                    rows={2}
                    {...register("delivery_instruction", { required: true })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#20363A] focus:outline-none resize-none"
                    placeholder="e.g. Call before delivery, gate code"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Dispatch Action (1 span) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-[#20363A] text-[#CAEB66] flex items-center justify-center font-bold">
                <FaCalculator className="text-xs" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Tariff Estimation</h3>
                <p className="text-[11px] text-slate-400">Live dynamic calculation</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Category:</span>
                <span className="font-bold capitalize text-slate-800">{parcelType}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Routing:</span>
                <span className="font-semibold text-slate-800">
                  {senderCenter && receiverCenter
                    ? isSameDistrict
                      ? "Within Same District"
                      : "Inter-District"
                    : "Select centers"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Base Fare:</span>
                <span className="font-bold text-slate-800">৳{estimatedBaseCost}</span>
              </div>
              {estimatedExtraCost > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Weight Surcharge:</span>
                  <span className="font-bold text-slate-800">৳{estimatedExtraCost}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-slate-700">Estimated Total:</span>
                <span className="text-2xl font-black text-[#20363A]">
                  ৳{estimatedTotalCost}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-start gap-1 mt-1">
                <FaInfoCircle className="text-slate-400 text-xs shrink-0 mt-0.5" />
                {breakdownText}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#CAEB66] hover:bg-[#bfe259] text-[#20363A] font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaTruck className="text-xs" />
                Proceed to Checkout
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Doorstep pickup scheduled instantly upon confirmation
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
