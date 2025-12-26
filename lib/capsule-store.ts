"use client";

import { Capsule } from "./types";
import { SEED_CAPSULES } from "./constants";

const STORAGE_KEY = "timecapsule_data";

export const getCapsules = (): Capsule[] => {
  if (typeof window === "undefined") return SEED_CAPSULES;

  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    return JSON.parse(localData);
  }

  // Initialize with seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CAPSULES));
  return SEED_CAPSULES;
};

export const saveCapsule = (capsule: Capsule): Capsule[] => {
  const capsules = getCapsules();
  const updatedCapsules = [capsule, ...capsules];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCapsules));
  return updatedCapsules;
};

export const getCapsuleById = (id: string): Capsule | undefined => {
  const capsules = getCapsules();
  return capsules.find((c) => c.id === id);
};

export const deleteCapsule = (id: string): Capsule[] => {
  const capsules = getCapsules();
  const updatedCapsules = capsules.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCapsules));
  return updatedCapsules;
};

export const getPublicCapsules = (): Capsule[] => {
  return getCapsules().filter((c) => c.isPublic);
};
