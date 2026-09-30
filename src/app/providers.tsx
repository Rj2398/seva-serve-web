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

declare global {
  interface Window {
    $: any;
    jQuery: any;
    __sevaScriptsLoaded?: boolean;
  }
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [networkErrorMsg, setNetworkErrorMsg] = useState("");

  // --------------------------------------------------
  // Mounted
  // --------------------------------------------------
  useEffect(() => {
    setMounted(true);
  }, []);

  // --------------------------------------------------
  // Firebase + Network Error
  // --------------------------------------------------
  useEffect(() => {
    initializeFirebaseNotifications();

    const handleNetworkError = (e: Event) => {
      const customEvent = e as CustomEvent;

      setNetworkErrorMsg(
        customEvent.detail || "Network connection failed."
      );
    };

    window.addEventListener("networkError", handleNetworkError);

    return () => {
      window.removeEventListener("networkError", handleNetworkError);
    };
  }, []);

  // --------------------------------------------------
  // Load jQuery -> jQuery UI -> Slick -> Other Scripts
  // Only ONCE
  // --------------------------------------------------
  useEffect(() => {
    if (!mounted) return;

    // Already loaded
    if (window.__sevaScriptsLoaded) {
      setScriptsLoaded(true);
      return;
    }

    const loadScript = (
      src: string,
      options?: {
        type?: string;
      }
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          `script[src="${src}"]`
        ) as HTMLScriptElement | null;

        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");

        script.src = src;
        script.async = false;

        if (options?.type) {
          script.type = options.type;
        }

        script.onload = () => resolve();

        script.onerror = () => {
          reject(new Error(`Failed to load script: ${src}`));
        };

        document.body.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        // 1. jQuery
        await loadScript("/js/jquery.min.js");

        // Make sure jQuery is globally available
        window.$ = window.jQuery = window.jQuery || window.$;

        // 2. jQuery UI
        await loadScript(
          "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"
        );

        // 3. Slick
        await loadScript("/js/slick.min.js");

        // 4. Circle Progress
        await loadScript("/js/circle-progress.min.js", {
          type: "module",
        });

        // 5. Custom JS
        await loadScript("/js/custom.js", {
          type: "module",
        });

        window.__sevaScriptsLoaded = true;

        setScriptsLoaded(true);

        console.log("SevaServe scripts loaded successfully");
      } catch (error) {
        console.error("Script loading error:", error);
      }
    };

    loadAllScripts();
  }, [mounted]);

  // --------------------------------------------------
  // Initialize Slick
  // Runs AFTER scripts are loaded
  // Also runs when pathname changes
  // --------------------------------------------------
  // useEffect(() => {
  //   if (!mounted || !scriptsLoaded) return;

  //   const initializeSliders = () => {
  //     const $ = window.jQuery;

  //     if (!$ || !$.fn || !$.fn.slick) {
  //       console.warn("Slick is not available yet.");
  //       return;
  //     }

  //     // ----------------------------------------------
  //     // Hero Slider
  //     // ----------------------------------------------
  //     $(".hero-slider").each(function () {
  //       const $slider = $(this);

  //       if ($slider.hasClass("slick-initialized")) {
  //         $slider.slick("unslick");
  //       }

  //       $slider.slick({
  //         infinite: true,
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //         arrows: false,
  //         dots: true,
  //         autoplay: true,
  //         responsive: [
  //           {
  //             breakpoint: 767,
  //             settings: {
  //               slidesToShow: 1,
  //               slidesToScroll: 1,
  //             },
  //           },
  //         ],
  //       });
  //     });

  //     // ----------------------------------------------
  //     // Upcoming Slider
  //     // ----------------------------------------------
  //     $(".upcoming-slider").each(function () {
  //       const $slider = $(this);

  //       if ($slider.hasClass("slick-initialized")) {
  //         $slider.slick("unslick");
  //       }

  //       $slider.slick({
  //         dots: false,
  //         infinite: true,
  //         speed: 300,
  //         slidesToShow: 1,
  //         centerMode: true,
  //         autoplay: true,
  //         arrows: false,
  //         variableWidth: true,
  //       });
  //     });

  //     console.log("Slick sliders initialized");
  //   };

  //   // Give React DOM time to render
  //   const timer = setTimeout(() => {
  //     initializeSliders();
  //   }, 100);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [pathname, mounted, scriptsLoaded]);

  // --------------------------------------------------
  // Cleanup Slick before component/page changes
  // --------------------------------------------------
  // useEffect(() => {
  //   return () => {
  //     const $ = window.jQuery;

  //     if (!$) return;

  //     $(".hero-slider.slick-initialized").each(function () {
  //       $(this).slick("unslick");
  //     });

  //     $(".upcoming-slider.slick-initialized").each(function () {
  //       $(this).slick("unslick");
  //     });
  //   };
  // }, [pathname]);

  // --------------------------------------------------
  // Remove Bootstrap Backdrops
  // --------------------------------------------------
  useEffect(() => {
    if (!mounted) return;

    document
      .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
      .forEach((el) => el.remove());

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, [pathname, mounted]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <StoreProvider>
      {!mounted ? (
        <ProtectedRoutes>{children}</ProtectedRoutes>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />

            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
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

          <RateSevaServe
            feedback="abcdefghijklmnopqrstuvwxyz"
            reviewPayload={undefined}
          />

          <Toaster position="top-right" />
        </>
      )}
    </StoreProvider>
  );
}





// "use client";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import StoreProvider from "@/store/StoreProvider";
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
// import { Toaster } from "react-hot-toast";
// import LoginModal from "@/components/modals/LoginModal";
// import OtpModal from "@/components/modals/OtpModal";
// import LocationModal from "@/components/modals/LocationModal";
// import AddAddressModal from "@/components/modals/AddAddressModal";
// import SevaServeWorkModal from "@/components/modals/SevaServeWorkModal";
// import LogOutModal from "@/components/modals/LogOutModal";
// import DeleteMyAccountModal from "@/components/modals/DeleteMyAccountModal";
// import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
// import RateSevaServe from "@/components/modals/bookingmodals/RateSevaServe";
// import DeleteAccountModal from "@/components/modals/deleteAccountModal";
// import NetworkErrorModal from "@/components/modals/NetworkErrorModal";
// import ProtectedRoutes from "@/components/common/ProtectedRoutes";
// import { initializeFirebaseNotifications } from "@/utils/notification";

// export default function ClientProviders({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [mounted, setMounted] = useState(false);
//   const [networkErrorMsg, setNetworkErrorMsg] = useState("");
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     initializeFirebaseNotifications();
//     const handleNetworkError = (e: Event) => {
//       const customEvent = e as CustomEvent;
//       if (customEvent.detail) {
//         setNetworkErrorMsg(customEvent.detail);
//       } else {
//         setNetworkErrorMsg("Network connection failed.");
//       }
//     };
//     window.addEventListener("networkError", handleNetworkError);
//     return () => window.removeEventListener("networkError", handleNetworkError);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     document
//       .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
//       .forEach((el) => el.remove());

//     document.body.classList.remove("modal-open");
//     document.body.style.overflow = "";
//     document.body.style.paddingRight = "";
//     const existingCustomScripts = document.querySelectorAll(".dynamic-script");
//     existingCustomScripts.forEach((script) => script.remove());
//     const jqueryScript = document.createElement("script");
//     jqueryScript.src = "/js/jquery.min.js";
//     jqueryScript.className = "dynamic-script";
//     jqueryScript.async = false;

//     jqueryScript.onload = () => {
//       if (typeof window !== "undefined") {
//         (window as any).$ = (window as any).jQuery =
//           (window as any).jQuery || (window as any).$;
//       }
//       const jqueryUiScript = document.createElement("script");
//       jqueryUiScript.src = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
//       jqueryUiScript.className = "dynamic-script";
//       jqueryUiScript.async = false;

//       const slickScript = document.createElement("script");
//       slickScript.src = "/js/slick.min.js";
//       slickScript.className = "dynamic-script";
//       slickScript.async = false;

//       slickScript.onload = () => {
//         const progressScript = document.createElement("script");
//         progressScript.src = "/js/circle-progress.min.js";
//         progressScript.className = "dynamic-script";
//         progressScript.type = "module";

//         const customScript = document.createElement("script");
//         customScript.src = "/js/custom.js";
//         customScript.className = "dynamic-script";
//         customScript.type = "module";

//         document.head.appendChild(progressScript);
//         document.head.appendChild(customScript);
//       };

//       document.head.appendChild(jqueryUiScript);
//       document.head.appendChild(slickScript);
//     };

//     document.head.appendChild(jqueryScript);
//   }, [pathname, mounted]);

//   useEffect(() => {
//     if (!mounted) return;

//     setTimeout(() => {
//       const $ = (window as any).$;
//       if (!$) return;
//       if (
//         $(".hero-slider").length &&
//         !$(".hero-slider").hasClass("slick-initialized")
//       ) {
//         $(".hero-slider").slick({
//           infinite: true,
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           arrows: false,
//           dots: true,
//           autoplay: true,
//           responsive: [
//             {
//               breakpoint: 767,
//               settings: {
//                 slidesToShow: 1,
//                 slidesToScroll: 1,
//               },
//             },
//           ],
//         });
//       }
//       if (
//         $(".upcoming-slider").length &&
//         !$(".upcoming-slider").hasClass("slick-initialized")
//       ) {
//         $(".upcoming-slider").slick({
//           dots: false,
//           infinite: true,
//           speed: 300,
//           slidesToShow: 1,
//           centerMode: true,
//           autoplay: true,
//           arrows: false,
//           variableWidth: true,
//         });
//       }
//     }, 300);
//   }, [pathname, mounted]);

//   return (
//     <StoreProvider>
//       {!mounted ? (
//         <>
//           {" "}
//           <ProtectedRoutes>{children}</ProtectedRoutes>{" "}
//         </>
//       ) : (
//         <>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               minHeight: "100vh",
//             }}
//           >
//             <Header />
//             <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//               {networkErrorMsg ? (
//                 <NetworkErrorModal
//                   message={networkErrorMsg}
//                   onRetry={() => setNetworkErrorMsg("")}
//                 />
//               ) : (
//                 children
//               )}
//             </main>
//             <Footer />
//           </div>
//           <LoginModal />
//           <OtpModal />
//           <LocationModal />
//           <AddAddressModal />
//           <SevaServeWorkModal />
//           <LogOutModal />
//           <DeleteAccountModal />
//           <DeleteMyAccountModal />
//           <NewServiceRejectionModal />
//           <RateSevaServe
//             feedback={"abcdefghijklmnopqrstuvwxyz"}
//             reviewPayload={undefined}
//           />
//           <Toaster position="top-right" />
//         </>
//       )}
//     </StoreProvider>
//   );
// }
