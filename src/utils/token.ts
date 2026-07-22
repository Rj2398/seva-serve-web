import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 <= Date.now();
  } catch (error) {
    // Invalid token
    return true;
  }
};