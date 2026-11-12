import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useTitle from "../../../hooks/useTitle";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaCopy,
  FaEdit,
  FaIdCard,
  FaBoxOpen,
  FaMotorcycle,
  FaPaperPlane,
  FaSearchLocation,
  FaWallet,
  FaTasks,
  FaClock,
  FaUserShield,
} from "react-icons/fa";

interface UserProfileData {
  email: string;
  role: string;
  created_at: string;
  last_log_in?: string;
}

const MyProfile: React.FC = () => {
  useTitle("My Profile");
  const { user, role, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || "");
  const [photoInput, setPhotoInput] = useState(user?.photoURL || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: userInfo, isLoading } = useQuery<UserProfileData>({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosInstance.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading || !userInfo) {
    return <Loading />;
  }

  const handleCopyUid = (): void => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast.success("Account ID copied to clipboard!");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Updating profile...");

    try {
      await updateUserProfile({
        displayName: nameInput.trim(),
        photoURL: photoInput.trim() || null,
      });
      toast.success("Profile updated successfully!", { id: toastId });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderRoleBadge = (roleName?: string | null): React.ReactNode => {
    const normalized = (roleName || "user").toLowerCase();

    if (normalized === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white shadow-md ring-2 ring-purple-300/30">
          <FaUserShield className="text-xs text-purple-200" />
          Administrator
        </span>
      );
    }

    if (normalized === "rider") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-600 via-orange-600 to-orange-700 text-white shadow-md ring-2 ring-amber-300/30">
          <FaMotorcycle className="text-xs text-amber-200" />
          Delivery Rider
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800 text-white shadow-md ring-2 ring-emerald-300/30">
        <FaUser className="text-xs text-teal-200" />
        Customer / Merchant
      </span>
    );
  };

  const memberSinceFormatted = userInfo.created_at
    ? new Date(userInfo.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const lastLoginFormatted = userInfo.last_log_in
    ? new Date(userInfo.last_log_in).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Active Today";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Header Banner & Profile Card */}
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-base-200">
        {/* Cover Banner with geometric gradient */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#20363A] via-[#2A484D] to-[#122326] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polygon
                fill="currentColor"
                className="text-emerald-400"
                points="0,100 100,0 100,100"
              />
              <polygon
                fill="currentColor"
                className="text-lime-300"
                points="0,0 100,0 0,100"
              />
            </svg>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                setNameInput(user?.displayName || "");
                setPhotoInput(user?.photoURL || "");
                setIsEditModalOpen(true);
              }}
              className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md shadow-sm gap-2"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Info Row with Overlapping Avatar */}
        <div className="px-6 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
            {/* Avatar with status indicator ring */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-base-200">
                <img
                  src={
                    user?.photoURL ||
                    "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                  }
                  alt={user?.displayName || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-md"
                title="Account Active"
              />
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user?.displayName || "ProFast User"}
                </h1>
                {user?.emailVerified && (
                  <FaCheckCircle
                    className="text-emerald-500 text-lg"
                    title="Verified Email"
                  />
                )}
              </div>

              <p className="text-gray-500 font-medium text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                <FaEnvelope className="text-gray-400" />
                {userInfo.email}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {renderRoleBadge(role || userInfo.role)}
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  <FaClock className="text-gray-400" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-base-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl shadow-inner">
            <FaShieldAlt />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Account Role
            </p>
            <p className="text-base font-bold text-gray-800 capitalize">
              {role || userInfo.role || "User"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-base-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner">
            <FaCalendarAlt />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Member Since
            </p>
            <p className="text-base font-bold text-gray-800">
              {memberSinceFormatted}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-base-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shadow-inner">
            <FaEnvelope />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Email Status
            </p>
            <p className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              {user?.emailVerified ? (
                <>
                  <FaCheckCircle className="text-emerald-500 text-sm" /> Verified
                </>
              ) : (
                <>
                  <FaExclamationCircle className="text-amber-500 text-sm" /> Unverified
                </>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-base-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl shadow-inner">
            <FaClock />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Last Login
            </p>
            <p className="text-base font-bold text-gray-800">
              {lastLoginFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Information & Quick Shortcuts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal & Security Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Account & Personal Details
                </h2>
                <p className="text-xs text-gray-400">
                  Manage your public profile and core identity information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-400 block mb-1">
                  Full Name
                </span>
                <span className="font-bold text-gray-800 text-base">
                  {user?.displayName || "Not specified"}
                </span>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-400 block mb-1">
                  Primary Email
                </span>
                <span className="font-bold text-gray-800 text-base break-all">
                  {userInfo.email}
                </span>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-400 block mb-1">
                  Account Role
                </span>
                <div className="mt-1">
                  {renderRoleBadge(role || userInfo.role)}
                </div>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-gray-400 block mb-1">
                  Auth Provider
                </span>
                <span className="font-bold text-gray-800 text-base capitalize">
                  {user?.providerData?.[0]?.providerId === "google.com"
                    ? "Google Authentication"
                    : "Email & Password"}
                </span>
              </div>
            </div>

            {/* Account ID Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FaIdCard className="text-gray-400 text-2xl" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    User Identifier (UID)
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-gray-700 break-all">
                    {user?.uid}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopyUid}
                className="btn btn-xs btn-outline border-gray-300 hover:border-gray-400 gap-1 self-start sm:self-center"
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Role Actions & Quick Shortcuts (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-base-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-100">
              Quick Shortcuts
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/sendParcel"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-lime-50 hover:text-black border border-transparent hover:border-lime-200 transition-all font-semibold text-sm group"
              >
                <span className="flex items-center gap-3 text-gray-700 group-hover:text-black">
                  <FaPaperPlane className="text-primary" />
                  Send a Parcel
                </span>
                <span className="text-xs text-gray-400 group-hover:text-black">
                  →
                </span>
              </Link>

              <Link
                to="/dashboard/track"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-black border border-transparent hover:border-emerald-200 transition-all font-semibold text-sm group"
              >
                <span className="flex items-center gap-3 text-gray-700 group-hover:text-black">
                  <FaSearchLocation className="text-emerald-600" />
                  Track Any Parcel
                </span>
                <span className="text-xs text-gray-400 group-hover:text-black">
                  →
                </span>
              </Link>

              <Link
                to="/dashboard/myParcels"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-black border border-transparent hover:border-blue-200 transition-all font-semibold text-sm group"
              >
                <span className="flex items-center gap-3 text-gray-700 group-hover:text-black">
                  <FaBoxOpen className="text-blue-600" />
                  My Parcel Bookings
                </span>
                <span className="text-xs text-gray-400 group-hover:text-black">
                  →
                </span>
              </Link>

              <Link
                to="/dashboard/paymentHistory"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-black border border-transparent hover:border-amber-200 transition-all font-semibold text-sm group"
              >
                <span className="flex items-center gap-3 text-gray-700 group-hover:text-black">
                  <FaWallet className="text-amber-600" />
                  Payment History
                </span>
                <span className="text-xs text-gray-400 group-hover:text-black">
                  →
                </span>
              </Link>

              {role === "rider" && (
                <>
                  <div className="divider my-2"></div>
                  <Link
                    to="/dashboard/pending-deliveries"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 font-semibold text-sm group"
                  >
                    <span className="flex items-center gap-3 text-amber-900">
                      <FaTasks className="text-amber-600" />
                      Pending Rider Deliveries
                    </span>
                    <span className="text-xs text-amber-700">→</span>
                  </Link>
                </>
              )}

              {role === "admin" && (
                <>
                  <div className="divider my-2"></div>
                  <Link
                    to="/dashboard/assign-rider"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200 font-semibold text-sm group"
                  >
                    <span className="flex items-center gap-3 text-purple-900">
                      <FaMotorcycle className="text-purple-600" />
                      Assign Riders
                    </span>
                    <span className="text-xs text-purple-700">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-base-200 overflow-hidden">
            <div className="bg-[#20363A] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaEdit /> Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-sm btn-ghost btn-circle text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="label text-xs font-bold text-gray-600">
                  Display Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-gray-600">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="input input-bordered w-full"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Provide a direct image URL (e.g., from ImgBB or GitHub).
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-black font-semibold"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
