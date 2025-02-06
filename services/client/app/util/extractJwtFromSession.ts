import base64url from "base64url";
// ✅ Extract JWT from session cookie
export const extractJwtFromSession = (sessionCookie: string): string | null => {
  try {
    const decoded = base64url.decode(sessionCookie);
    const sessionData = JSON.parse(decoded);
    return sessionData.jwt || null;
  } catch (error: any) {
    console.error("Failed to extract JWT from session cookie:", error?.message);
    return null;
  }
};
