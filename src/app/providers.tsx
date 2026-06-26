"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import StoreProvider from "@/store/StoreProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";

// Global Modal Imports
import LoginModal from "@/components/modals/LoginModal";
import OtpModal from "@/components/modals/OtpModal";
import WelcomeModal from "@/components/modals/WelcomeModal";
import LocationModal from "@/components/modals/LocationModal";
import AddAddressModal from "@/components/modals/AddAddressModal";
import SevaServeWorkModal from "@/components/modals/SevaServeWorkModal";
import LogOutModal from "@/components/modals/LogOutModal";
import DeleteMyAccountModal from "@/components/modals/DeleteMyAccountModal";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import RateSevaServe from "@/components/modals/bookingmodals/RateSevaServe";
import DeleteAccountModal from "@/components/modals/deleteAccountModal";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Force component to wait until mounted on client to prevent structural hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Clean up stuck backgrounds and freeze-states across route navigations
    document
      .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
      .forEach((el) => el.remove());

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Clean up previous script blocks to prevent stacking nodes in <head>
    const existingCustomScripts = document.querySelectorAll(".dynamic-script");
    existingCustomScripts.forEach((script) => script.remove());

    // 1. Inject jQuery Core
    const jqueryScript = document.createElement("script");
    jqueryScript.src = "/js/jquery.min.js";
    jqueryScript.className = "dynamic-script";
    jqueryScript.async = false;

    jqueryScript.onload = () => {
      // 2. Map Window Bindings Safely
      if (typeof window !== "undefined") {
        (window as any).$ = (window as any).jQuery =
          (window as any).jQuery || (window as any).$;
      }

      // 3. Chain dependent plugins
      const jqueryUiScript = document.createElement("script");
      jqueryUiScript.src = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
      jqueryUiScript.className = "dynamic-script";
      jqueryUiScript.async = false;

      const slickScript = document.createElement("script");
      slickScript.src = "/js/slick.min.js";
      slickScript.className = "dynamic-script";
      slickScript.async = false;

      slickScript.onload = () => {
        // 4. Run custom execution scripts every single time the route updates
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

      // Hero Slider
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

      // Upcoming Slider
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
        // Render a flat stream matching server-side HTML to prevent hydration drift
        <>{children}</>
      ) : (
        <>
          <Header />
          {children}
          <Footer />

          {/* Global Modals */}
          <LoginModal />
          <OtpModal />
          <WelcomeModal />
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

// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import StoreProvider from "@/store/StoreProvider";
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
// import { Toaster } from "react-hot-toast";

// // Global Modal Imports
// import LoginModal from "@/components/modals/LoginModal";
// import OtpModal from "@/components/modals/OtpModal";
// import WelcomeModal from "@/components/modals/WelcomeModal";
// import LocationModal from "@/components/modals/LocationModal";
// import AddCardModal from "@/components/modals/AddCardModal";
// import AddAddressModal from "@/components/modals/AddAddressModal";
// import SevaServeWorkModal from "@/components/modals/SevaServeWorkModal";
// import LogOutModal from "@/components/modals/LogOutModal";
// import DeleteMyAccountModal from "@/components/modals/DeleteMyAccountModal";
// import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
// import RateSevaServe from "@/components/modals/bookingmodals/RateSevaServe";
// import DeleteAccountModal from "@/components/modals/deleteAccountModal";

// export default function ClientProviders({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [mounted, setMounted] = useState(false);

//   // Force component to wait until mounted on client to prevent structural hydration mismatches
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;

//     // Clean up stuck backgrounds and freeze-states across route navigations
//     document
//       .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
//       .forEach((el) => el.remove());

//     document.body.classList.remove("modal-open");
//     document.body.style.overflow = "";
//     document.body.style.paddingRight = "";

//     // Clean up previous script blocks to prevent stacking nodes in <head>
//     const existingCustomScripts = document.querySelectorAll(".dynamic-script");
//     existingCustomScripts.forEach((script) => script.remove());

//     // 1. Inject jQuery Core
//     const jqueryScript = document.createElement("script");
//     jqueryScript.src = "/js/jquery.min.js";
//     jqueryScript.className = "dynamic-script";
//     jqueryScript.async = false;

//     jqueryScript.onload = () => {
//       // 2. Map Window Bindings Safely
//       if (typeof window !== "undefined") {
//         (window as any).$ = (window as any).jQuery =
//           (window as any).jQuery || (window as any).$;
//       }

//       // 3. Chain dependent plugins
//       const jqueryUiScript = document.createElement("script");
//       jqueryUiScript.src = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
//       jqueryUiScript.className = "dynamic-script";
//       jqueryUiScript.async = false;

//       const slickScript = document.createElement("script");
//       slickScript.src = "/js/slick.min.js";
//       slickScript.className = "dynamic-script";
//       slickScript.async = false;

//       slickScript.onload = () => {
//         // 4. Run custom execution scripts every single time the route updates
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

//       // Hero Slider
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

//       // Upcoming Slider
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

//   // Fallback structural rendering block to neutralize server/client DOM delta mismatches
//   if (!mounted) {
//     return <>{children}</>;
//   }

//   return (
//     <StoreProvider>
//       <Header />
//       {children}
//       <Footer />

//       {/* Global Modals */}
//       <LoginModal />
//       <OtpModal />
//       <WelcomeModal />
//       <LocationModal />
//       {/* <AddCardModal /> */}
//       <AddAddressModal />
//       <SevaServeWorkModal />
//       <LogOutModal />
//       <DeleteAccountModal />
//       <DeleteMyAccountModal />
//       <NewServiceRejectionModal />
//       <RateSevaServe feedback={"abcdefghijklmnopqrstuvwxyz"} />
//       <Toaster position="top-right" />
//     </StoreProvider>
//   );
// }
