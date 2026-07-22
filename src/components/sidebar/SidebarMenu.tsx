"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const SidebarMenu = () => {
  const router = useRouter();

  // Helper function to cleanly close BOTH the offcanvas sidebar and the mobile header panel
  const handleLinkClick = () => {
    const bootstrap = (window as any).bootstrap;

    // 1. CLOSE THE OFFCANVAS SIDEBAR PANEL
    const offcanvasElement = document.getElementById('home-end-offcanvasRight');
    if (offcanvasElement && bootstrap?.Offcanvas) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement) 
        || new bootstrap.Offcanvas(offcanvasElement);
      offcanvasInstance.hide();
    }

    // 2. FIXED: CLOSE THE RESPONSIVE MOBILE HEADER
    // Targets both 'show' and your custom 'showData' classes to make sure it closes completely
    const rightSection = document.querySelector(".right-section");
    if (rightSection) {
      rightSection.classList.remove("showData");
      rightSection.classList.remove("show");
    }

    // 3. RESET THE TOGGLE HAMBURGER ICON BACK TO BARS
    const barCrossIcon = document.getElementById("bar-cross");
    if (barCrossIcon) {
      barCrossIcon.className = "fa-solid fa-bars";
    }
  };

  return (
    <div className="offcanvas offcanvas-end custom-home-right" tabIndex={-1} id="home-end-offcanvasRight"
      aria-labelledby="offcanvasRightLabel-logo">
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel-logo">
          <img src="/images/header/logo.svg" alt="123" />
        </h5>
        <button type="button" className="btn-close my-cross" data-bs-dismiss="offcanvas" aria-label="Close">
          <img src="/images/off-canvas/cross-icon-off-canvas.svg" alt="" />
        </button>
      </div>
      <div className="offcanvas-body custom-home-list">
        {/* Captures clicks on any list option to clear active structural layouts */}
        <ul onClick={handleLinkClick}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/booking">My Bookings</Link></li>
          <li><Link href="/quotes">My Quotes</Link></li>
          <li><Link href="/my-payment">My Payments</Link></li>
          <li><Link href="/choose-plan">Subscription</Link></li>
          <li><Link href="/saved-address">Saved Address</Link></li>
          <li><Link href="/referral">Referral History</Link></li>
          <li><Link href="#logout-popup" data-bs-toggle="modal">Logout</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;