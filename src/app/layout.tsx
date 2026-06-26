import Script from "next/script";
import ClientProviders from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles/bootstrap.min.css" />
        <link rel="stylesheet" href="/styles/all.min.css" />
        <link rel="stylesheet" href="/styles/slick.css" />
        <link rel="stylesheet" href="/styles/style.css" />
        <link rel="stylesheet" href="/styles/responsive.css" />
        <link
          rel="stylesheet"
          href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

// "use client";

// import StoreProvider from "@/store/StoreProvider";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Script from "next/script";
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
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
// import { Toaster } from "react-hot-toast";
// import DeleteAccountModal from "@/components/modals/deleteAccountModal";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [scriptsLoaded, setScriptsLoaded] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
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
//         // Added a timestamp cache-buster to ensure clean re-execution of script events
//         customScript.src = `/js/custom.js?v=${Date.now()}`;
//         customScript.className = "dynamic-script";
//         customScript.type = "module";

//         document.head.appendChild(progressScript);
//         document.head.appendChild(customScript);
//         setScriptsLoaded(true);
//       };

//       document.head.appendChild(jqueryUiScript);
//       document.head.appendChild(slickScript);
//     };

//     document.head.appendChild(jqueryScript);
//   }, [pathname]); // FIXED: Re-injects and re-binds your custom.js core events whenever a user switches pages!

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setTimeout(() => {
//         const $ = (window as any).$;
//         if (!$) return;

//         // Hero Slider
//         if (
//           $(".hero-slider").length &&
//           !$(".hero-slider").hasClass("slick-initialized")
//         ) {
//           $(".hero-slider").slick({
//             infinite: true,
//             slidesToShow: 2,
//             slidesToScroll: 2,
//             arrows: false,
//             dots: true,
//             autoplay: true,
//             responsive: [
//               {
//                 breakpoint: 767,
//                 settings: {
//                   slidesToShow: 1,
//                   slidesToScroll: 1,
//                 },
//               },
//             ],
//           });
//         }

//         // Upcoming Slider
//         if (
//           $(".upcoming-slider").length &&
//           !$(".upcoming-slider").hasClass("slick-initialized")
//         ) {
//           $(".upcoming-slider").slick({
//             dots: false,
//             infinite: true,
//             speed: 300,
//             slidesToShow: 1,
//             centerMode: true,
//             autoplay: true,
//             arrows: false,
//             variableWidth: true,
//           });
//         }
//       }, 300);
//     }
//   }, [pathname]);

//   return (
//     <html lang="en">
//       <head>
//         <link rel="stylesheet" href="/styles/bootstrap.min.css" />
//         <link rel="stylesheet" href="/styles/all.min.css" />
//         <link rel="stylesheet" href="/styles/slick.css" />
//         <link rel="stylesheet" href="/styles/style.css" />
//         <link rel="stylesheet" href="/styles/responsive.css" />
//         <link
//           rel="stylesheet"
//           href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css"
//         />
//         <link
//           rel="stylesheet"
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
//         />
//         <Script
//           src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
//           strategy="beforeInteractive"
//         />
//       </head>
//       <body>
//         <StoreProvider>
//           <Header />
//           {children}
//           <Footer />

//           {/* Global Modals */}
//           <LoginModal />
//           <OtpModal />
//           <WelcomeModal />
//           <LocationModal />
//           <AddCardModal />
//           <AddAddressModal />
//           <SevaServeWorkModal />
//           <LogOutModal />
//           <DeleteAccountModal />
//           <DeleteMyAccountModal />
//           <NewServiceRejectionModal />
//           <RateSevaServe feedback={"abcdefghijklmnopqrstuvwxyz"} />
//         </StoreProvider>
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }
