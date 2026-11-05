export const clearClientSession = (): boolean => {
  if (typeof window === "undefined") return false;

  const hadActiveSession =
    localStorage.getItem("user") !== null ||
    localStorage.getItem("isLoggedIn") === "true";

  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  sessionStorage.clear();
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

  if (hadActiveSession) {
    window.dispatchEvent(new Event("loginStatusChanged"));
  }

  return hadActiveSession;
};
