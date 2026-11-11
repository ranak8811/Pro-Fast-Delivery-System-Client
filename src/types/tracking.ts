import { DeliveryStatus } from "./parcel";

export interface TrackingEntry {
  _id?: string;
  tracking_id: string;
  parcel_id?: string;
  status: DeliveryStatus | string;
  message: string;
  note?: string;
  location?: string;
  updated_by?: string;
  timestamp: string;
}
