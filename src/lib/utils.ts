// src/lib/utils.ts

export const DEFAULT_AVATAR = "/default-avatar.png";

export function getProfileImage(url?: string | null): string {
  if (!url || url.trim() === "" || url.includes("i.pravatar.cc")) {
    return DEFAULT_AVATAR;
  }
  return url;
}