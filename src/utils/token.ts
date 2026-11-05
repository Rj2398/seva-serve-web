import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!Number.isFinite(decoded.exp)) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 <= Date.now();
  } catch (error) {
    // Invalid token
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const expiration = jwtDecode<JwtPayload>(token).exp;
    return Number.isFinite(expiration) ? expiration * 1000 : null;
  } catch {
    return null;
  }
};