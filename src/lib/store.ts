import { useSyncExternalStore } from "react";
import type { Booking } from "@/types";

const KEY = "hblaw.bookings.v1";
const listeners = new Set<() => void>();

let bookings: Booking[] = load();

function load(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Booking[];
  } catch {}
  return [];
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(bookings));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return bookings;
}

export function useBookings() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function addBooking(b: Booking) {
  bookings = [b, ...bookings];
  persist();
  emit();
}

export function cancelBooking(id: string) {
  bookings = bookings.filter((b) => b.id !== id);
  persist();
  emit();
}