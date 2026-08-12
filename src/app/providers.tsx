"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import StoreProvider from "@/store/StoreProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modals/LoginModal";
import OtpModal from "@/components/modals/OtpModal";
import LocationModal from "@/components/modals/LocationModal";
import AddAddressModal from "@/components/modals/AddAddressModal";
import SevaServeWorkModal from "@/components/modals/SevaServeWorkModal";
import LogOutModal from "@/components/modals/LogOutModal";
import DeleteMyAccountModal from "@/components/modals/DeleteMyAccountModal";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import RateSevaServe from "@/components/modals/bookingmodals/RateSevaServe";
import DeleteAccountModal from "@/components/modals/deleteAccountModal";
import NetworkErrorModal from "@/components/modals/NetworkErrorModal";
import ProtectedRoutes from "@/components/common/ProtectedRoutes";
import { initializeFirebaseNotifications } from "@/utils/notification";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [networkErrorMsg, setNetworkErrorMsg] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

useEffect(() => {
  initializeFirebaseNotifications();
  const handleNetworkError = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail) {
      setNetworkErrorMsg(customEvent.detail);
    } else {
      setNetworkErrorMsg("Network connection failed.");
    }
  };
  window.addEventListener("networkError", handleNetworkError);
  return () => window.removeEventListener("networkError", handleNetworkError);
}, []);

  useEffect(() => {
    if (!mounted) return;
    document
      .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
      .forEach((el) => el.remove());

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    const existingCustomScripts = document.querySelectorAll(".dynamic-script");
    existingCustomScripts.forEach((script) => script.remove());
    const jqueryScript = document.createElement("script");
    jqueryScript.src = "/js/jquery.min.js";
    jqueryScript.className = "dynamic-script";
    jqueryScript.async = false;

    jqueryScript.onload = () => {
      if (typeof window !== "undefined") {
        (window as any).$ = (window as any).jQuery =
          (window as any).jQuery || (window as any).$;
      }
      const jqueryUiScript = document.createElement("script");
      jqueryUiScript.src = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
      jqueryUiScript.className = "dynamic-script";
      jqueryUiScript.async = false;

      const slickScript = document.createElement("script");
      slickScript.src = "/js/slick.min.js";
      slickScript.className = "dynamic-script";
      slickScript.async = false;

      slickScript.onload = () => {
        const progressScript = document.createElement("script");
        progressScript.src = "/js/circle-progress.min.js";
        progressScript.className = "dynamic-script";
        progressScript.type = "module";

        const customScript = document.createElement("script");
        customScript.src = "/js/custom.js";
        customScript.className = "dynamic-script";
        customScript.type = "module";

        document.head.appendChild(progressScript);
        document.head.appendChild(customScript);
      };

      document.head.appendChild(jqueryUiScript);
      document.head.appendChild(slickScript);
    };

    document.head.appendChild(jqueryScript);
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted) return;

    setTimeout(() => {
      const $ = (window as any).$;
      if (!$) return;
      if (
        $(".hero-slider").length &&
        !$(".hero-slider").hasClass("slick-initialized")
      ) {
        $(".hero-slider").slick({
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
          dots: true,
          autoplay: true,
          responsive: [
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        });
      }
      if (
        $(".upcoming-slider").length &&
        !$(".upcoming-slider").hasClass("slick-initialized")
      ) {
        $(".upcoming-slider").slick({
          dots: false,
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          centerMode: true,
          autoplay: true,
          arrows: false,
          variableWidth: true,
        });
      }
    }, 300);
  }, [pathname, mounted]);

  return (
    <StoreProvider>
      {!mounted ? (
        <> <ProtectedRoutes>{children}</ProtectedRoutes> </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {networkErrorMsg ? (
              <NetworkErrorModal 
                message={networkErrorMsg} 
                onRetry={() => setNetworkErrorMsg("")} 
              />
            ) : (
              children
            )}
          </main>
            <Footer />
          </div>
          <LoginModal />
          <OtpModal />
          <LocationModal />
          <AddAddressModal />
          <SevaServeWorkModal />
          <LogOutModal />
          <DeleteAccountModal />
          <DeleteMyAccountModal />
          <NewServiceRejectionModal />
          <RateSevaServe feedback={"abcdefghijklmnopqrstuvwxyz"} />
          <Toaster position="top-right" />
        </>
      )}
    </StoreProvider>
  );
}