export const dynamic = "force-dynamic";

import Header from "@/components/common/Header";
import Booking from "./Booking";
import { globalServerRequest } from "@/actions/globalApi";

export default async function BookingPage() {
  let initialBookingData = {
    upcoming: [],
    previous: [],
    cancelled: [],
  };

  try {
    const [upcomingRes, previousRes, cancelledRes] = await Promise.all([
      globalServerRequest({
        endpoint: "booking",
        method: "POST",
        payload: { type: "upcoming", pageNo: 1, limit: 100 },
      }),
      globalServerRequest({
        endpoint: "booking",
        method: "POST",
        payload: { type: "previous", pageNo: 1, limit: 100 },
      }),
      globalServerRequest({
        endpoint: "booking",
        method: "POST",
        payload: { type: "cancelled", pageNo: 1, limit: 100 },
      }),
    ]);

    if (upcomingRes.success) {
      initialBookingData.upcoming =
        upcomingRes.data?.data || upcomingRes.data || [];
    }
    if (previousRes.success) {
      initialBookingData.previous =
        previousRes.data?.data || previousRes.data || [];
    }
    if (cancelledRes.success) {
      initialBookingData.cancelled =
        cancelledRes.data?.data || cancelledRes.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch bookings on server side:", e);
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        {/* <Header/> */}
        <Booking initialBookingData={initialBookingData} />
      </div>
    </>
  );
}