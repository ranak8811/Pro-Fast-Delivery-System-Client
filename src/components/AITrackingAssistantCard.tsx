import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRobot, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaClock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BsCpu } from "react-icons/bs";
import { format, parseISO } from "date-fns";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AITrackingExplainResponse } from "../types/ai";

export interface AITrackingAssistantCardProps {
  trackingId: string;
  className?: string;
}

export const AITrackingAssistantCard: React.FC<AITrackingAssistantCardProps> = ({
  trackingId,
  className = "",
}) => {
  const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<AITrackingExplainResponse, Error>({
    queryKey: ["aiTrackingExplanation", trackingId],
    queryFn: async () => {
      if (!trackingId) throw new Error("Tracking ID is required");
      const res = await axiosSecure.get<AITrackingExplainResponse>(
        `/tracking/ai-explain/${encodeURIComponent(trackingId)}`
      );
      return res.data;
    },
    enabled: Boolean(trackingId && trackingId.trim().length > 0),
    staleTime: 1000 * 60 * 3, // 3 minutes stale time (server caches for 5 minutes)
    retry: 1,
  });

  const formatTimestamp = (isoString?: string): string => {
    if (!isoString) return "Just now";
    try {
      return format(parseISO(isoString), "MMM d, yyyy · h:mm a");
    } catch {
      return isoString;
    }
  };

  // If no tracking ID provided
  if (!trackingId) {
    return null;
  }

  // Loading state with animated shimmer skeleton
  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-primary/20 bg-base-100 p-5 shadow-sm ${className}`}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse flex items-center justify-center text-primary">
              <HiSparkles className="text-xl animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-36 bg-base-300 rounded-md animate-pulse" />
              <div className="h-3 w-24 bg-base-200 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-20 bg-base-200 rounded-full animate-pulse" />
        </div>

        <div className="space-y-2.5 my-4">
          <div className="h-3.5 w-full bg-base-200 rounded animate-pulse" />
          <div className="h-3.5 w-11/12 bg-base-200 rounded animate-pulse" />
          <div className="h-3.5 w-3/4 bg-base-200 rounded animate-pulse" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-base-200 text-xs text-base-content/60">
          <div className="h-4 w-28 bg-base-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-base-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state with retry action
  if (isError) {
    return (
      <div
        className={`rounded-2xl border border-error/30 bg-error/5 p-5 shadow-sm text-base-content ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error flex-shrink-0 mt-0.5">
              <FaExclamationTriangle className="text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-error text-sm md:text-base">
                AI Tracking Unavailable
              </h4>
              <p className="text-xs md:text-sm text-base-content/70 mt-1">
                {error?.message || "Could not retrieve the AI summary for this parcel."}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-sm btn-ghost gap-1 text-xs hover:bg-error/10"
            title="Retry AI Explanation"
          >
            <FaSyncAlt className={isFetching ? "animate-spin" : ""} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const isFallback = Boolean(data.is_fallback);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
        isFallback
          ? "border-warning/30 bg-gradient-to-br from-base-100 via-base-100 to-warning/5"
          : "border-primary/25 bg-gradient-to-br from-base-100 via-base-100 to-primary/5"
      } p-5 ${className}`}
    >
      {/* Top Banner Accent Glow */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isFallback
            ? "bg-gradient-to-r from-warning via-amber-400 to-warning"
            : "bg-gradient-to-r from-primary via-indigo-500 to-secondary"
        }`}
      />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isFallback
                ? "bg-warning/15 text-warning"
                : "bg-primary/15 text-primary shadow-inner"
            }`}
          >
            {isFallback ? (
              <FaRobot className="text-xl" />
            ) : (
              <HiSparkles className="text-xl text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm md:text-base text-base-content tracking-tight">
                AI Tracking Assistant
              </h4>
              {isFallback ? (
                <span className="badge badge-warning badge-xs font-semibold gap-1 py-1 px-2">
                  Offline Fallback
                </span>
              ) : (
                <span className="badge badge-primary badge-xs font-semibold gap-1 py-1 px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-base-100 animate-ping inline-block" />
                  Live AI Summary
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60">
              Parcel ID: <span className="font-mono font-medium">{data.tracking_id}</span>
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
          title="Refresh AI explanation"
          aria-label="Refresh explanation"
        >
          <FaSyncAlt
            className={`text-xs text-base-content/70 ${isFetching ? "animate-spin text-primary" : ""}`}
          />
        </button>
      </div>

      {/* AI Explanation Body */}
      <div className="my-3 pl-3.5 border-l-2 border-primary/40 bg-base-200/40 rounded-r-lg p-3">
        <p className="text-xs md:text-sm text-base-content/90 leading-relaxed font-normal">
          {data.explanation}
        </p>
      </div>

      {/* Footer Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-base-200 text-xs text-base-content/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span className="badge badge-sm badge-outline gap-1 font-medium capitalize">
            <FaCheckCircle className="text-[10px] text-success" />
            {data.delivery_status ? data.delivery_status.replace(/_/g, " ") : "Unknown"}
          </span>

          {/* Model Badge */}
          <span
            className="badge badge-sm badge-ghost gap-1 font-mono text-[11px] opacity-75"
            title={`Processed by: ${data.model_used}`}
          >
            <BsCpu className="text-[11px]" />
            {data.model_used?.split("/").pop() || data.model_used}
          </span>

          {/* Cache Indicator */}
          {data.from_cache && (
            <span
              className="badge badge-sm badge-ghost text-info gap-1 text-[11px]"
              title="Served from in-memory cache"
            >
              Cached
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-[11px] text-base-content/50">
          <FaClock className="text-[10px]" />
          <span>{formatTimestamp(data.generated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default AITrackingAssistantCard;
