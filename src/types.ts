import type { Lang } from "@/lib/i18n";

export type ServiceId =
  | "contract-drafting"
  | "contract-management"
  | "dispute-resolution"
  | "infrastructure-projects"
  | "international-arbitration"
  | "corporate-law";

export interface Localized {
  en: string;
  fr: string;
  ar: string;
}

export interface Service {
  id: ServiceId;
  title: Localized;
  blurb: Localized;
  rate: string;
  icon: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: ServiceId;
  date: string;
  slot: string;
  notes: string;
  createdAt: number;
}

export type AttorneyRole = "founder" | "partner" | "attorney";

export interface Attorney {
  name: string;
  role: AttorneyRole;
  cred: 1 | 2;
}