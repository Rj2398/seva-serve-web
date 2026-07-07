'use client'
import React, { useEffect, useRef, useState } from 'react'
import NewAddressModal from './Address/NewAddressModal';
import { globalServerRequest } from '@/actions/globalApi';
import toast from 'react-hot-toast';
import { MdOutlineShareLocation } from 'react-icons/md';

const LocationModal = () => {
  const dummyPlaces = [
    "Sector 62, Noida, Uttar Pradesh, India",
    "Connaught Place, New Delhi, Delhi, India",
    "Andheri East, Mumbai, Maharashtra, India",
    "Whitefield, Bengaluru, Karnataka, India",
    "Salt Lake Sector V, Kolkata, West Bengal, India",
    "Hitech City, Hyderabad, Telangana, India",
    "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    "4517 Washington Ave. Manchester, Kentucky 39495"
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentLocationText, setCurrentLocationText] = useState('Enable your current location for better services');
  const dropdownRef = useRef(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('autoLocation') === 'true';
    }
    return false;
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Fetch saved addresses from API on mount (if logged in)
  useEffect(() => {
    const fetchAddresses = async () => {
      const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") : null;
      if (isLoggedIn === "true") {
        const response = await globalServerRequest({
          endpoint: "profile/address",
          method: "GET",
        });
        if (response?.success) {
          const data = response?.data?.data || response?.data;
          setSavedAddresses(Array.isArray(data) ? data : []);
        }
      }
    };
    fetchAddresses();
  }, []);

  const handleSelectDefault = async (item: any, formattedAddress: string) => {
    // 1. Mark as default in the backend if it has an id

    console.log("i am calling", item, formattedAddress)
    // if (item.id) {
    //   await globalServerRequest({
    //     endpoint: `profile/address/default/${item.id}`,
    //     method: "PUT",
    //   });
    //   toast.success("Address selected successfully");
    // }
    if (item.id) {
      const response = await globalServerRequest({
        endpoint: `profile/address/default/${item.id}`,
        method: "PUT",
      })
      console.log(response, "resssss")
      if (response?.success) {
        toast.success("Address marked as default successfully");
        const getResponse = await globalServerRequest({
          endpoint: "profile/address",
          method: "GET",
        });
        if (getResponse?.success) {
          const data = getResponse?.data?.data || getResponse?.data;
          setSavedAddresses(Array.isArray(data) ? data : []);
        }
      } else {
        toast.error("Failed to set address as default");
      }
    }

    // 2. Update local storage for Header
    if (typeof window !== 'undefined') {
      localStorage.setItem('homeUserData', formattedAddress);
      // 3. Trigger header update event
      window.dispatchEvent(new Event("loginStatusChanged"));
    }

    // 4. Hide Modal
    const currentModal = document.getElementById("your-location-popup");
    if (currentModal) {
      const bootstrapModal = (window as any).bootstrap?.Modal.getInstance(currentModal);
      bootstrapModal?.hide();
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlaces([]);
      return;
    }

    const results: any = dummyPlaces.filter(place =>
      place.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(results);
  }, [searchTerm]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setShowDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const handleSelectAddress = (address: string) => {
    setSearchTerm(address);
    setShowDropdown(false);
    console.log("Selected Location Data:", address);

    // Close Location Modal
    const locationModalEl = document.getElementById("your-location-popup");
    if (locationModalEl) {
      const locationModal = (window as any).bootstrap?.Modal.getInstance(locationModalEl);
      locationModal?.hide();
    }

    // Open New Address Modal
    const addAddressModalEl = document.getElementById("add-address-popup");
    if (addAddressModalEl) {
      const addAddressModal = (window as any).bootstrap?.Modal.getOrCreateInstance(addAddressModalEl);
      addAddressModal?.show();
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocationText("Geolocation is not supported by your browser");
      return;
    }

    setCurrentLocationText("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Actual Lat/Lng Captured:", latitude, longitude);

        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyALi3glNPQSOD1n4mnjK0RmfGCws8-4nIg";
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();
          
          if (data.status === "OK" && data.results && data.results.length > 0) {
            const place = data.results[0];
            const fullAddr = place.formatted_address;
            
            let area = "";
            for (const result of data.results) {
               result.address_components.forEach((component: any) => {
                  const types = component.types;
                  if (!area && (types.includes("sublocality") || types.includes("neighborhood") || types.includes("locality"))) {
                     area = component.long_name;
                  }
               });
            }
            if (!area) area = "Detected Location";

            setCurrentLocationText(`Detected: ${area}`);
            setSearchTerm(fullAddr);

            // Set in header by default
            if (typeof window !== 'undefined') {
              localStorage.setItem('homeUserData', fullAddr);
              window.dispatchEvent(new Event("loginStatusChanged"));
            }

            toast.success("Location set as default!");

            // Hide Modal
            const currentModal = document.getElementById("your-location-popup");
            if (currentModal) {
              const bootstrapModal = (window as any).bootstrap?.Modal.getInstance(currentModal);
              bootstrapModal?.hide();
            }
          }
        } catch (err) {
          console.error("Error fetching address details", err);
          setCurrentLocationText(`Detected (Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)})`);

          // Fallback if fetch fails
          if (typeof window !== 'undefined') {
            localStorage.setItem('homeUserData', `Lat ${latitude.toFixed(2)}, Lng ${longitude.toFixed(2)}`);
            window.dispatchEvent(new Event("loginStatusChanged"));
          }
          const currentModal = document.getElementById("your-location-popup");
          if (currentModal) {
            const bootstrapModal = (window as any).bootstrap?.Modal.getInstance(currentModal);
            bootstrapModal?.hide();
          }
        }
      },
      (error) => {
        console.error(error);
        setCurrentLocationText("Location access denied. Please enable permissions.");
      }
    );
  };


  // --- Logic: Reverse Geocoding & Fetch ---
  const fetchAddress = async () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    setCurrentLocationText("Detecting your area...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyALi3glNPQSOD1n4mnjK0RmfGCws8-4nIg";
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();

          if (data.status === "OK" && data.results && data.results.length > 0) {
            const place = data.results[0];
            const fullAddr = place.formatted_address;
            
            let area = "";
            for (const result of data.results) {
               result.address_components.forEach((component: any) => {
                  const types = component.types;
                  if (!area && (types.includes("sublocality") || types.includes("neighborhood") || types.includes("locality"))) {
                     area = component.long_name;
                  }
               });
            }
            if (!area) area = "Detected Location";

            setCurrentLocationText(`Detected: ${area}`);
            setSearchTerm(fullAddr); // Search bar mein pura address fill kar dena
          }
        } catch (err) {
          setCurrentLocationText("Error fetching address details.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setCurrentLocationText("Location access denied.");
        setLoading(false);
        setIsAutoEnabled(false); // Permission denied toh auto off
      }
    );
  };

  // --- Logic: Auto-trigger on Load or Toggle ---
  useEffect(() => {
    localStorage.setItem('autoLocation', isAutoEnabled.toString());
    if (isAutoEnabled) {
      fetchAddress();
    }
  }, [isAutoEnabled]);


  // const makeDefaultAddress = async (id: any) => {

  //   const response = await globalServerRequest({
  //     endpoint: `profile/address/default/${id}`,
  //     method: "PUT",
  //   })
  //   console.log(response, "resssss")
  //   if (response?.success) {
  //     toast.success("Address marked as default successfully");
  //     const getResponse = await globalServerRequest({
  //       endpoint: "profile/address",
  //       method: "GET",
  //     });
  //     if (getResponse?.success) {
  //       const data = getResponse?.data?.data || getResponse?.data;
  //       setSavedAddresses(Array.isArray(data) ? data : []);
  //     }
  //   } else {
  //     toast.error("Failed to set address as default");
  //   }
  // };




  return (
    <>
      <div
        className="modal fade"
        id="your-location-popup"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="modal-body">
              <div className="select-date-time-wrp">
                <h1>Your Location</h1>
                {/* <form action="">
                <div className="your-location-top">
                  <input
                    type="text"
                    placeholder="Search a new address"
                    className="top-srch"
                  />
                  <div className="your-location-top-in">
                    <div className="use-location">
                      <img src="images/saved-addresses/location.svg" alt="" />
                      <div className="use-location-data">
                        <h5>Use My Current Location</h5>
                        <p>Enable your current location for better services</p>
                      </div>
                      <button type="button" className="reject-btn">Enable</button>
                    </div>
                    <hr />
                    <button
                      type="button"
                      data-bs-target="#add-address-popup"
                      data-bs-toggle="modal"
                      className="add-address"
                    >
                      <i className="fa-solid fa-plus"></i> Add New Address
                    </button>
                  </div>
                  <h5>Your Saved Addresses</h5>
                  <div className="svd-add-wrp">
                    <input
                      type="radio"
                      id="address-1"
                      value="1"
                      name="saved-addresses"
                      hidden
                      defaultChecked
                    />
                    <label htmlFor="address-1" className="saved-addresses-in">
                      <div className="saved-addresses-icon">
                        <img src="images/saved-addresses/1.svg" alt="" />
                      </div>
                      <div className="saved-addresses-data">
                        <h4>Home</h4>
                        <p>2118 Thornridge Cir. Syracuse, Connecticut 35624</p>
                      </div>
                    </label>
                    <input
                      type="radio"
                      id="address-2"
                      value="2"
                      name="saved-addresses"
                      hidden
                    />
                    <label htmlFor="address-2" className="saved-addresses-in">
                      <div className="saved-addresses-icon">
                        <img src="images/saved-addresses/2.svg" alt="" />
                      </div>
                      <div className="saved-addresses-data">
                        <h4>Office</h4>
                        <p>4517 Washington Ave. Manchester, Kentucky 39495</p>
                      </div>
                    </label>
                  </div>
                </div>
              </form> */}



                <form onSubmit={(e) => e.preventDefault()} >
                  <div className="your-location-top" style={{ position: 'relative' }} ref={dropdownRef}>

                    {/* Search Input Field */}
                    <input
                      type="text"
                      placeholder="Search a new address"
                      className="top-srch"
                      value={searchTerm}
                      // onChange={(e) => {
                      //   setSearchTerm(e.target.value);
                      //   setShowDropdown(true);
                      // }}
                      // onFocus={() => setShowDropdown(true)}

                      // type="button"
                      data-bs-target="#add-address-popup"
                      data-bs-toggle="modal"
                    // className="add-address"
                    />

                    {/* CUSTOM DUMMY DROPDOWN (Bina CSS disturbance ke inline setup) */}
                    {showDropdown && filteredPlaces.length > 0 && (
                      <ul className="list-group" style={{
                        position: 'absolute',
                        top: '10%',
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        {filteredPlaces.map((place, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer', fontSize: '14px' }}
                            onClick={() => handleSelectAddress(place)}
                          >
                            <i className="fa-solid fa-location-dot me-2 text-secondary"></i>
                            {place}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="your-location-top-in">
                      <div className="use-location">
                        <img src="images/saved-addresses/location.svg" alt="" />
                        <div className="use-location-data">
                          <h5>Use My Current Location</h5>
                          <p>{currentLocationText}</p>
                        </div>
                        <button
                          type="button"
                          className="reject-btn"
                          onClick={handleGetCurrentLocation}
                        >
                          Enable
                        </button>
                      </div>
                      <hr />
                      <button
                        type="button"
                        data-bs-target="#add-address-popup"
                        data-bs-toggle="modal"
                        className="add-address"
                      >
                        <i className="fa-solid fa-plus"></i> Add New Address
                      </button>
                    </div>

                    {savedAddresses.length > 0 && (
                      <>
                        <h5>Your Saved Addresses</h5>
                        <div className="svd-add-wrp">
                          {savedAddresses.map((item: any, idx: number) => {
                            const displayType = item.type || item.label || 'Home';
                            const displayFlat = item.flat || item.flat_house_building || '';
                            const displayFloor = item.floor || '';
                            const displayArea = item.area || item.area_sector_locality || '';
                            const displayLandmark = item.landmark || item.nearby_landmark || '';
                            // const displayIcon = item.icon || (
                            //   displayType?.toLowerCase() === 'home' ? 'images/saved-addresses/1.svg' :
                            //     displayType?.toLowerCase() === 'office' ? 'images/saved-addresses/2.svg' :
                            //       'images/saved-addresses/3.svg'
                            // );

                            const displayIcon =
                              displayType?.toLowerCase() === "home" ? (
                                <img
                                  src="/images/saved-addresses/1.svg"
                                  alt="Home"
                                  width={24}
                                  height={24}
                                />
                              ) : displayType?.toLowerCase() === "office" ? (
                                <img
                                  src="/images/saved-addresses/2.svg"
                                  alt="Office"
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <MdOutlineShareLocation size={24} />
                              );
                            const formattedAddress = `${displayFlat}${displayFloor ? ', ' + displayFloor : ''}, ${displayArea}`;

                            return (
                              <React.Fragment key={item.id || idx}>
                                <input
                                  type="radio"
                                  id={`address-${item.id || idx}`}
                                  value={item.id}
                                  name="saved-addresses"
                                  hidden
                                  defaultChecked={item.is_default || idx === 0}

                                />
                                <label htmlFor={`address-${item.id || idx}`} className="saved-addresses-in">
                                  <div className="saved-addresses-icon">
                                    {/* <img src={displayIcon} alt={displayType} /> */}
                                    {displayIcon}
                                  </div>
                                  <div className="saved-addresses-data">


                                    <h4>{displayType}</h4>
                                    <p>{formattedAddress}</p>
                                  </div>
                                  <div className='last' >

                                    {!item.is_default ? <a type="button" className="primary-cta" style={{ fontSize: '12px', padding: '3px 15px' }} onClick={() => handleSelectDefault(item, formattedAddress)}><i
                                    ></i> Set as default</a> :
                                      <a type="button" style={{ background: '#363636', border: "1px solid    #363636", color: "#fff", cursor: "not-allowed", borderRadius: '20px', width: 'fit-content', padding: '3px 15px', fontSize: '12px' }}><i
                                      ></i> Default</a>
                                    }
                                  </div>
                                </label>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewAddressModal
        selectedAddress={null}
        onSave={() => {
          // Re-fetch addresses so the new one appears in the list
          const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") : null;
          if (isLoggedIn === "true") {
            globalServerRequest({
              endpoint: "profile/address",
              method: "GET",
            }).then((response) => {
              if (response?.success) {
                const data = response?.data?.data || response?.data;
                setSavedAddresses(Array.isArray(data) ? data : []);
              }
            });
          }
        }}
        onClose={() => { }}
      />
    </>
  )
}

export default LocationModal