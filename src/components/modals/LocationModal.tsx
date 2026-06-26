'use client'
import React, { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlaces([]);
      return;
    }

    const results:any = dummyPlaces.filter(place =>
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
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocationText("Geolocation is not supported by your browser");
      return;
    }

    setCurrentLocationText("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Actual Lat/Lng Captured:", latitude, longitude);

        // Dummy Reverse Geocoding text
        setCurrentLocationText(`Detected: Near Sector 62 (Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)})`);
        setSearchTerm("Detected Current Location");
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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data && data.address) {
            const area = data.address.suburb || data.address.neighbourhood || data.address.city_district || "Detected Location";
            const fullAddr = data.display_name;

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




  return (
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationModal