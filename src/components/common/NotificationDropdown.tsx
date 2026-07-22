
import React, { useEffect, useState } from 'react'
// import { notifications } from '../../json/notification.json'
import { globalServerRequest } from '@/actions/globalApi';

const NotificationDropdown = () => {
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


  // const fetchNotifications = async () => {
  //   try {
  //     const response = await globalServerRequest({
  //       endpoint: "notification",
  //       method: "POST",
  //       payload: {
  //         type: typeMap[activeTab as keyof typeof typeMap],
  //       }
  //     });

  //     if (response?.success) {
  //       setNotificationsData(response?.data?.data?.notifications || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

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


  const markNotificationAsRead = async (id: number) => {
    try {

      const unreadIds = notificationsData.filter((notification: any) => !notification.isRead).map((notification: any) => notification.notificationId);

      if (unreadIds.length === 0) return;

      const response = await globalServerRequest({
        endpoint: "notification/read",
        method: "POST",
        payload: {
          // id,
          id: unreadIds,
        },
      });

      if (response?.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // useEffect(() => {
  //   fetchNotifications();
  // }, [activeTab]);

  useEffect(() => {
    setPageNo(1);
    setHasNextPage(true);
    fetchNotifications(1);
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

  return (
    <div className="icon bell-icon position-relative dropdown">
      <img
        src="images/header/bell-icon.svg"
        alt="Logo"
        className="logo dropdown-toggle"
        // type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
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

          {/* <div className="notification-item"> */}


          {/* </div> */}
          {/* <div className="notification-in" > */}
            {/* {notification?.map((notif: any) => (

                  <div className="notification-item" key={notif.id}>
                    <div className="notification-data">
                      <h3>{notif.title}</h3>
                      <p>{notif.message}</p>
                    </div>
                    <span>{notif.time}</span>
                  </div>
                  ))} */}
            <div className="notification-in" onScroll = {handleScroll}>
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
                  onClick={() => markNotificationAsRead(notif.notificationId)}
                >
                  <div className="notification-data">
                    <h3>{notif.title}</h3>
                    <p>{notif.body}</p>
                  </div>
                  <span>{notif.displayTime}</span>
                </div>
              ))}

              {loading && (
                <p style={{textAlign: "center"}}>Loading...</p>
              )}
            </div>
          {/* </div> */}
          {/* <div className="notification-in">
                  <div className="notification-item">

                    <div className="notification-data">
                      <h3>Contractor suggested a new time</h3>
                      <p>
                        Your contractor proposed a new service time for Plumbing –
                        Sink Installation.
                      </p>
                    </div>
                    <span>Just Now</span>
                  </div>
                  <div className="notification-item">
                    <div className="notification-data">
                      <h3>Your booking is confirmed</h3>
                      <p>
                        Your plumbing service is scheduled for 20 Nov, 11:30 AM.
                      </p>
                    </div>
                    <span>1h ago</span>
                  </div>
                  <div className="notification-item">
                    <div className="notification-data">
                      <h3>Flat 20% Off <button type="button" className="code-copy">HOME20</button></h3>
                      <p>
                        Avail discount on all home repair services. Valid till
                        tonight.
                      </p>
                    </div>
                    <span>5h ago</span>
                  </div>
                  <div className="notification-item">
                    <div className="notification-data">
                      <h3>Safety Alert</h3>
                      <p>
                        Please verify the technician identity before allowing
                        entry.
                      </p>
                    </div>
                    <span>Yesterday</span>

                  </div>
                </div>

                  </div> 
                  </div> */}


        </div>
      </div>
    </div>
    // </div>
  )
}

export default NotificationDropdown;