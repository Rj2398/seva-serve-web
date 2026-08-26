import React, { useEffect, useState } from 'react'
// import { notifications } from '../../json/notification.json'
import { globalServerRequest } from '@/actions/globalApi';
import { useRouter } from 'next/navigation';


// function getNotificationDetails(title: string) {
//   console.log("title", title)
//   const notificationMap = {
//     "Quote request submitted": { screenName: "Quote", status: "requested" },
//     "Your Quotes Are Ready": { screenName: "Quote", status: "Received" },
//     "Booking Request Submitted": { screenName: "Booking", status: "upcoming" },
//     "Contractor Assigned": { screenName: "Tracking", status: null },
//     "Contractor Suggested a New Time": { screenName: "Tracking", status: null },
//     "Contractor Declined the Job": { screenName: "Booking", status: "Cancel" },
//     "Upcoming Booking Reminder": { screenName: "Booking", status: "upcoming" },
//     "Contractor Has Arrived": { screenName: "Tracking", status: null },
//     "Contractor On The Way": { screenName: "Tracking", status: null },
//     "Job started": { screenName: "Tracking", status: null },
//     "Additional Task Requested": { screenName: "Quote", status: "received" },
//     "Job Completed": { screenName: "Booking", status: "completed" },
//     "Booking Rescheduled": { screenName: "Booking", status: "upcoming" },
//     "payment pending / due": { screenName: "Payment", status: null },
//     "Payment Confirmed": { screenName: "Payment", status: null },
//     "Contractor Running Late": { screenName: "Tracking", status: null },
//     "Booking Cancelled": { screenName: "Booking", status: "cancelled" },
//     "Rate Your Service": { screenName: "Booking", status: "completed" },
//     "Referral reward credited": { screenName: "referral", status: null }
//   };

//   if (!title) {
//     return { error: "Title is required" };
//   }

//   const normalizedTitle = title.toLowerCase().trim();
//   const result = notificationMap[normalizedTitle];

//   if (result) {
//     return {
//       screenName: result.screenName,
//       status: result.status
//     };
//   }

//   return {
//     screenName: "DefaultScreen",
//     status: null
//   };
// }




function getNotificationDetails(title: string) {
  console.log("title received:", title);

  if (!title) {
    return { screenName: null, status: null };
  }

  // 1. Lowercase karo, trim karo aur last ka dot (.) hatao
  const normalizedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\.$/, ""); // Strips trailing dot

  // 2. Saari keys bilkul lowercase me rakhi gayi hain
  const notificationMap: Record<string, { screenName: string; status: string | null }> = {
    "quote request submitted": { screenName: "Quote", status: "Requested" },
    "your quotes are ready": { screenName: "Quote", status: "Received" },
    "booking request submitted": { screenName: "Booking", status: "upcoming" },
    "contractor assigned": { screenName: "Tracking", status: null },
    "contractor suggested a new time": { screenName: "Tracking", status: null },
    "contractor declined the job": { screenName: "Booking", status: "Cancel" },
    "upcoming booking reminder": { screenName: "Booking", status: "upcoming" },
    "contractor has arrived": { screenName: "Tracking", status: null },
    "contractor on the way": { screenName: "Tracking", status: null },
    "job started": { screenName: "Tracking", status: null },
    "additional task requested": { screenName: "Quote", status: "Received" },
    "job completed": { screenName: "Booking", status: "completed" },
    "booking rescheduled": { screenName: "Booking", status: "upcoming" },
    "payment pending / due": { screenName: "Payment", status: null },
    "payment confirmed": { screenName: "Payment", status: null },
    "contractor running late": { screenName: "Tracking", status: null },
    "booking cancelled": { screenName: "Booking", status: "cancelled" },
    "rate your service": { screenName: "Booking", status: "completed" },
    "referral reward credited": { screenName: "referral", status: null }
  };

  const result = notificationMap[normalizedTitle];

  if (result) {
    return {
      screenName: result.screenName,
      status: result.status
    };
  }

  return {
    screenName: null,
    status: null
  };
}





const NotificationDropdown = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [notificationsData, setNotificationsData] = useState<any>([]);

  const [pageNo, setPageNo] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);


  console.log("activeTab", activeTab);
  const typeMap = {
    All: "all",
    Offers: "offer",
    Alerts: "alert",
  };


  const fetchNotifications = async (page = 1) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await globalServerRequest({
        endpoint: "notification",
        method: "POST",
        payload: {
          type: typeMap[activeTab as keyof typeof typeMap],
          pageNo: page,
          limit: 10,
        },
      });

      if (response?.success) {
        const data = response?.data?.data;

        if (page === 1) {
          setNotificationsData(data?.notifications);
        } else {
          setNotificationsData((prev: any[]) => [
            ...prev,
            ...data.notifications,
          ])
        }

        setHasNextPage(data?.hasNextPage);
        // setNotificationsData(response?.data?.data?.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  };


  console.log(getNotificationDetails("Quote request submitted"));
  console.log(getNotificationDetails("Contractor assigned"));
  console.log(getNotificationDetails("Job completed — rate prompt"));




  const markNotificationAsRead = async () => {
    try {
      const unreadIds = notificationsData
        .filter((notification: any) => !notification.isRead)
        .map((notification: any) => notification.notificationId);

      if (unreadIds.length === 0) return;

      await Promise.all(
        unreadIds.map((id: number) =>
          globalServerRequest({
            endpoint: "notification/read",
            method: "POST",
            payload: {
              id,
            },
          })
        )
      );

      setNotificationsData((prev: any[]) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    setPageNo(1);
    setHasNextPage(true);
    fetchNotifications(1);
  }, [activeTab]);

  useEffect(() => {
    const handleNewNotification = () => {
      setPageNo(1);
      setHasNextPage(true);
      fetchNotifications(1);
    };
    window.addEventListener("newNotification", handleNewNotification);
    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 20 && hasNextPage && !loading
    ) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchNotifications(nextPage);
    }
  }

  console.log("notificationsData", notificationsData);

  const unreadCount = notificationsData.filter((notification: any) => !notification.isRead).length;
  const tabs = ["All", "Offers", "Alerts"];
  // const handleRediraction = (notif: any) => {
  //   console.log("handleRediraction", notif);
  //   if (notif) {
  //     let basedUrl = '';
  //     let screen_id;

  //     console.log(getNotificationDetails(notif.title));

  //     if (notif.meta.screen === "booking_detail") {
  //       basedUrl = "/view-booking-detail";

  //       // screen_id = `bookingId=${notif.meta.booking_id}`;
  //     }
  //     if (notif.meta.screen_type === "request-quote") {
  //       basedUrl = "/quotes";
  //       // screen_id = `bookingId=${notif.meta.target_id}`;
  //     }
  //     router.push(`${basedUrl}?${screen_id}`);
  //   }
  // };





  const handleRedirection = (notif: any) => {
    console.log("handleRedirection", notif);

    if (!notif) return;

    const { screenName, status } = getNotificationDetails(notif.title);

    console.log("screenName", screenName, "  status", status)

    let baseUrl = "";
    const queryParams = new URLSearchParams();

    if (status) {
      queryParams.append("status", status);
    }

    const metaScreen = notif.meta?.screen;
    const metaScreenType = notif.meta?.screen_type;

    if (metaScreen === "booking_detail" || screenName === "Booking") {
      baseUrl = "/view-booking-detail";

      if (notif.meta?.booking_id) {
        queryParams.append("bookingId", notif.meta.booking_id);
      }

    } else if (metaScreenType === "request-quote" || screenName === "Quote") {
      baseUrl = "/quotes";
      if (notif.meta?.quote_id) {
        queryParams.append("quoteId", notif.meta.quote_id);
      }
    } else if (screenName === "Tracking") {
      baseUrl = "/tracking";
      if (notif.meta?.booking_id) {
        queryParams.append("bookingId", notif.meta.booking_id);
      }
    } else if (screenName === "Payment") {
      baseUrl = "/payment";
      if (notif.meta?.booking_id) {
        queryParams.append("bookingId", notif.meta.booking_id);
      }
    } else if (screenName === "referral") {
      baseUrl = "/referral";
    }
    console.log("baseUrl", baseUrl)
    if (!baseUrl && notif.title) {
      const lowerTitle = notif.title.toLowerCase();
      const quoteIndex = lowerTitle.indexOf("quote");
      const bookingIndex = lowerTitle.indexOf("booking");
      if (quoteIndex !== -1 && (bookingIndex === -1 || quoteIndex < bookingIndex)) {
        baseUrl = "/quotes";
        if (notif.meta?.quote_id) {
          queryParams.append("quoteId", notif.meta.quote_id);
        }
      } else if (bookingIndex !== -1 && (quoteIndex === -1 || bookingIndex < quoteIndex)) {
        baseUrl = "/view-booking-detail";
        if (notif.meta?.booking_id) {
          queryParams.append("bookingId", notif.meta.booking_id);
        }
      }
    }

    if (!baseUrl) {
      console.warn("No matching route found for notification:", notif);
      return;
    }

    const queryString = queryParams.toString();
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    // console.log("finalUrl", finalUrl);
    router.push(finalUrl);
  };


  return (
    <div className="icon bell-icon position-relative dropdown">
      <img
        src="images/header/bell-icon.svg"
        alt="Logo"
        className="logo dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
        onClick={markNotificationAsRead}
      />

      {unreadCount > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
          style={{ backgroundColor: " #991318" }}
        >
          {/* {notificationsData.length} */}
          {unreadCount}
          <span className="visually-hidden">unread messages</span>
        </span>
      )}
      <div className="dropdown-menu dropdown-menu-end">
        <div className="notification-list" >
          <h1>Notifications</h1>
          <div className="top-fltr">
            {tabs.map((tab, index) => (
              <button
                key={index}
                type="button"
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="notification-in" onScroll={handleScroll}>
            {
              notificationsData?.length === 0 && (
                <div className="notification-item">
                  <div className="notification-data">
                    <p>No notifications to display.</p>
                  </div>
                </div>
              )}
            {notificationsData?.map((notif: any) => (
              <div
                className="notification-item"
                key={notif.notificationId}
                onClick={() => handleRedirection(notif)}
              >
                <div className="notification-data">
                  <h3>{notif.title}</h3>
                  <p>{notif.body}</p>
                </div>
                <span>{notif.displayTime}</span>
              </div>
            ))}
            {loading && (
              <p style={{ textAlign: "center" }}>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDropdown;