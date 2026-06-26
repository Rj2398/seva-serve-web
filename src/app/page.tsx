import Image from "next/image";
import LoginPage from "./(user)/login/page";
import Homepage from "./home/page";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LoginModal from "@/components/modals/LoginModal";
import OtpModal from "@/components/modals/OtpModal";
import WelcomeModal from "@/components/modals/WelcomeModal";
import AddCardModal from "@/components/modals/AddCardModal";
import LocationModal from "@/components/modals/LocationModal";

export default function Home() {
  return (
    <>
      <Homepage />
    </>
  );
}
