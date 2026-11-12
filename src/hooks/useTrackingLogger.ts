import useAxiosSecure from "./useAxiosSecure";

export interface LogTrackingParams {
  tracking_id: string;
  status: string;
  details?: string;
  location?: string;
  updated_by?: string;
}

export interface UseTrackingLoggerReturn {
  logTracking: (params: LogTrackingParams) => Promise<void>;
}

const useTrackingLogger = (): UseTrackingLoggerReturn => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({
    tracking_id,
    status,
    details,
    location,
    updated_by,
  }: LogTrackingParams): Promise<void> => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        location,
        updated_by,
      };
      await axiosSecure.post("/tracking", payload);
    } catch (error) {
      console.error("Failed to log tracking:", error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
