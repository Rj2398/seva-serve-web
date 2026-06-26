import Header from "@/components/common/Header";
import Booking from "./Booking";

export default  function BookingPage(){

  return(
    <>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
          {/* <Header/> */}
            <Booking/>
          </div>
    </>
  )

}