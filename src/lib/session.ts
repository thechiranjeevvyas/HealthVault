import { cookies } from "next/headers";

const SESSION_COOKIE = "healthvault_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in ms

export async function createSession(): Promise<void> {
  const expires = new Date(Date.now() + SESSION_DURATION);
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: "unlocked:" + Date.now(),
    httpOnly: true,
    sameSite: "strict",
    secure: false, // local only
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return false;

  const [status, timestampStr] = sessionCookie.value.split(":");
  if (status !== "unlocked") return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check if within 8 hours
  if (Date.now() - timestamp > SESSION_DURATION) {
    return false;
  }

  return true;
}
