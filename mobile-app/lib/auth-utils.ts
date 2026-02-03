import { AuthError } from "@supabase/supabase-js";

export function normalizeAuthError(error: AuthError | null): string | null {
  if (!error) return null;

  const message = error.message.toLowerCase();

  if (message.includes("invalid phone")) {
    return "Please enter a valid phone number.";
  }

  if (message.includes("invalid token")) {
    return "Incorrect verification code. Please try again.";
  }

  if (message.includes("expired")) {
    return "This code has expired. Please request a new one.";
  }

  if (message.includes("rate limit")) {
    return "Too many attempts. Please wait before trying again.";
  }

  return "Something went wrong. Please try again.";
}
