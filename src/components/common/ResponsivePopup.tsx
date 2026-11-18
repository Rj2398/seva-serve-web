"use client";

import { useEffect, useState } from "react";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/search?q=SevaServe&c=apps";
const APP_STORE_URL = "https://apps.apple.com/us/search?term=SevaServe";

const ResponsivePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const updateVisibility = () => setIsOpen(mobileViewport.matches);

    updateVisibility();
    mobileViewport.addEventListener("change", updateVisibility);

    return () => mobileViewport.removeEventListener("change", updateVisibility);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="app-download-overlay"
      onClick={() => setIsOpen(false)}
    >
      <section
        className="app-download-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-download-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="app-download-close"
          type="button"
          aria-label="Close app download popup"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>

        <div className="app-download-icon" aria-hidden="true">
          <i className="fa-solid fa-mobile-screen-button"></i>
        </div>
        <h2 id="app-download-title">Get the SevaServe App</h2>
        <p>Download our app for a smoother SevaServe experience.</p>

        <a
          className="app-download-link"
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-google-play" aria-hidden="true"></i>
          Download on Google Play
        </a>
        <a
          className="app-download-link"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-apple" aria-hidden="true"></i>
          Download on the App Store
        </a>
      </section>
    </div>
  );
};

export default ResponsivePopup;