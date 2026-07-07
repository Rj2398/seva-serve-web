// import React, { useEffect, useState } from 'react'

// const NewAddressModal = ({ selectedAddress, onSave, onClose }) => {


//   const [addressType, setAddressType] = useState('Home');
//   const [formData, setFormData] = useState({
//     flat: '',
//     floor: '',
//     area: '',
//     landmark: ''
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (selectedAddress) {
//       setAddressType(selectedAddress.type || 'Home');
//       setFormData({
//         flat: selectedAddress.flat || '',
//         floor: selectedAddress.floor || '',
//         area: selectedAddress.area || '',
//         landmark: selectedAddress.landmark || ''
//       });
//     } else {
//       setAddressType('Home');
//       setFormData({ flat: '', floor: '', area: '', landmark: '' });
//     }
//     setErrors({}); // Modal khulne par errors clear kar do
//   }, [selectedAddress]);


//   const validate = () => {
//     let newErrors = {};

//     if (!formData.flat.trim()) {
//       newErrors.flat = "Flat/House no. is required";
//     }

//     if (!formData.area.trim()) {
//       newErrors.area = "Area/Locality is required";
//     } else if (formData.area.trim().length < 3) {
//       newErrors.area = "Area name is too short";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Typing karte waqt error remove karna
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };



//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validate()) {
//       const updatedData = {
//         id: selectedAddress ? selectedAddress.id : Date.now(),
//         type: addressType,
//         fullAddress: `${formData.flat}, ${formData.area}`,
//         ...formData
//       };

//       onSave(updatedData);
//       onClose()
//       const closeBtn = document.querySelector("#add-address-popup .btn-close");
//       if (closeBtn) closeBtn.click();
//     }
//   };

//   return (
//     <>
//       <div className="modal fade" id="add-address-popup" data-bs-backdrop="static" tabIndex={-1}
//         aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
//             <div className="modal-body">
//               <div className="select-date-time-wrp">
//                 <h1>{selectedAddress ? "Edit Address" : "Add New Address"}</h1>
//                 <form onSubmit={handleSubmit}>
//                   <div className="your-location-top">
//                     <div className="your-location-top-in">
//                       <div className="use-location">
//                         <img src="images/saved-addresses/location.svg" alt="" />
//                         <div className="use-location-data">
//                           <h5>Use My Current Location</h5>
//                           <p>Enable your current location for better services</p>
//                         </div>
//                         <button type="button" className="reject-btn">Enable</button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="edit-add">
//                     <h2>Save Address as <span>*</span></h2>
//                     <div className="address-tags">
//                       {['Home', 'Office', 'Other'].map((tag) => (
//                         <button
//                           key={tag}
//                           type="button"
//                           className={addressType === tag ? "active" : ""}
//                           onClick={() => setAddressType(tag)}
//                         >
//                           {tag}
//                         </button>
//                       ))}
//                     </div>
//                     <div className="addres-form">
//                       {/* <input type="text" placeholder="Flat/ House no/ Building name" value="8502" /> */}

//                       <input
//                         type="text"
//                         name="flat"
//                         placeholder="Flat/ House no/ Building name"
//                         value={formData.flat}
//                         onChange={handleChange}
//                         style={errors.flat ? { borderColor: 'red' } : {}}
//                       />
//                       {errors.flat && <span style={{ color: 'red', fontSize: '12px' }}>{errors.flat}</span>}

//                       {/* Floor */}
//                       <input
//                         type="text"
//                         name="floor"
//                         placeholder="Floor (Optional)"
//                         value={formData.floor}
//                         onChange={handleChange}
//                       />

//                       {/* Area */}
//                       <input
//                         type="text"
//                         name="area"
//                         placeholder="Area/ Sector/ Locality"
//                         value={formData.area}
//                         onChange={handleChange}
//                         style={errors.area ? { borderColor: 'red' } : {}}
//                       />
//                       {errors.area && <span style={{ color: 'red', fontSize: '12px' }}>{errors.area}</span>}

//                       {/* Landmark */}
//                       <input
//                         type="text"
//                         name="landmark"
//                         placeholder="Nearby Landmark (Optional)"
//                         value={formData.landmark}
//                         onChange={handleChange}
//                       />
//                       <button type="submit" className="primary-cta mt-3">
//                         {selectedAddress ? "Update Address" : "Save Address"}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default NewAddressModal








'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { globalServerRequest } from '@/actions/globalApi';


interface NewAddressModalProps {
  selectedAddress: any; // Agar aapke paas Address ka specific interface hai toh 'any' ki jagah wo use karein
  onSave: (data: any) => void;
  onClose: () => void;
}


// const NewAddressModal = ({ selectedAddress, onSave, onClose }) => {
const NewAddressModal: React.FC<NewAddressModalProps> = ({ selectedAddress, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const autocompleteService = useRef<any>(null);
  const geocoder = useRef<any>(null);

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMaps = () => {
      // @ts-ignore
      if (window.google && window.google.maps && window.google.maps.places) {
        // @ts-ignore
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        // @ts-ignore
        geocoder.current = new window.google.maps.Geocoder();
      } else {
        const apiKey = "AIzaSyALi3glNPQSOD1n4mnjK0RmfGCws8-4nIg";
        if (apiKey) {
          const existingScript = document.getElementById("google-maps-script");
          if (!existingScript) {
            const script = document.createElement("script");
            script.id = "google-maps-script";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
              // @ts-ignore
              autocompleteService.current = new window.google.maps.places.AutocompleteService();
              // @ts-ignore
              geocoder.current = new window.google.maps.Geocoder();
            };
            document.head.appendChild(script);
          } else {
            existingScript.addEventListener("load", () => {
              // @ts-ignore
              autocompleteService.current = new window.google.maps.places.AutocompleteService();
              // @ts-ignore
              geocoder.current = new window.google.maps.Geocoder();
            });
          }
        } else {
          console.error("Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env");
        }
      }
    };
    loadGoogleMaps();
  }, []);

  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (value.trim().length > 3) {
      const timeout = setTimeout(() => {
        fetchSuggestions(value);
      }, 500); // reduced timeout since Google API is faster
      setSearchTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchSuggestions = (query: string) => {
    if (!autocompleteService.current) return;
    autocompleteService.current.getPlacePredictions(
      { input: query },
      (predictions: any, status: any) => {
        // @ts-ignore
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleSuggestionClick = (suggestion: any) => {
    const { place_id, description, structured_formatting } = suggestion;
    
    let currentGeocoder = geocoder.current;
    // @ts-ignore
    if (!currentGeocoder && window.google && window.google.maps) {
      // @ts-ignore
      currentGeocoder = new window.google.maps.Geocoder();
      geocoder.current = currentGeocoder;
    }
    
    if (!currentGeocoder) {
      toast.error("Google Maps API is not loaded yet");
      return;
    }

    currentGeocoder.geocode({ placeId: place_id }, (results: any, status: any) => {
      if (status === "OK" && results && results.length > 0) {
        const place = results[0];
        const lat = place.geometry.location.lat().toString();
        const lng = place.geometry.location.lng().toString();

        let houseInfo = "";
        let areaName = "";
        let postcodeInfo = "";
        let landmarkInfo = "";

        // Build house info from the most specific result
        place.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes("street_number") || types.includes("premise") || types.includes("subpremise")) {
            houseInfo = houseInfo ? `${houseInfo} ${component.long_name}` : component.long_name;
          }
          if (types.includes("route")) {
            houseInfo = houseInfo ? `${houseInfo}, ${component.long_name}` : component.long_name;
          }
        });

        // Search through all results to reliably find area and postal code
        for (const result of results) {
          result.address_components.forEach((component: any) => {
            const types = component.types;
            if (!areaName && (types.includes("sublocality") || types.includes("neighborhood") || types.includes("locality"))) {
              areaName = component.long_name;
            }
            if (!postcodeInfo && types.includes("postal_code")) {
              postcodeInfo = component.long_name;
            }
            if (!landmarkInfo && (types.includes("administrative_area_level_2") || types.includes("administrative_area_level_1"))) {
              landmarkInfo = component.long_name;
            }
          });
        }

        // Fallbacks
        if (!houseInfo) houseInfo = structured_formatting?.main_text || description.split(',')[0];
        if (!areaName) areaName = structured_formatting?.secondary_text?.split(',')[0] || description.split(',')[1]?.trim() || "";

        formik.setFieldValue("house", houseInfo);
        formik.setFieldValue("area", areaName);
        formik.setFieldValue("lat", lat);
        formik.setFieldValue("long", lng);
        if (postcodeInfo) formik.setFieldValue("Zip_code", postcodeInfo);
        if (landmarkInfo) formik.setFieldValue("landmark", landmarkInfo);
      } else {
        toast.error("Could not fetch address details");
      }
    });

    setSuggestions([]);
    setShowSuggestions(false);
  };


  // 1. Validation Schema
  const validationSchema = Yup.object({
    house: Yup.string()
      .min(3, "Building name or House no is too short")
      .required("Building name or House no is required"),
    area: Yup.string()
      .min(5, "Please provide a more detailed area")
      .required("Area/Locality is required"),
    floor: Yup.string(),
    landmark: Yup.string(),
    addressType: Yup.string().required(),
    Zip_code: Yup.string(),
    lat: Yup.string(),
    long: Yup.string(),
  });

  // 2. Formik Configuration
  const formik = useFormik({
    initialValues: {
      house: "",
      floor: "",
      area: "",
      landmark: "",
      addressType: "Home",
      Zip_code: "",
      lat: "28.006046",
      long: "77.297758",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Build payload matching the API spec
        const payload: any = {
          flat_house_building: values.house,
          floor: values.floor,
          area_sector_locality: values.area,
          nearby_landmark: values.landmark,
          label: values.addressType.toLowerCase(),

          is_default: false,
          lat: values.lat,
          long: values.long,
          // zip_code: values.Zip_code,
          // pin_code: values.Zip_code,
          // pincode: values.Zip_code,
          zip: values.Zip_code,
        };

        // If editing, pass the address id
        if (selectedAddress?.id) {
          payload.id = selectedAddress.id;
        }

        const response = await globalServerRequest({
          endpoint: "profile/address/save",
          method: "POST",
          payload: payload,
        });

        if (response.success) {
          const savedAddress = response.data?.data || response.data;
          const finalData = {
            id: savedAddress?.id || selectedAddress?.id || Date.now(),
            type: values.addressType,
            flat: savedAddress?.flat_house_building || values.house,
            floor: savedAddress?.floor || values.floor,
            area: savedAddress?.area_sector_locality || values.area,
            landmark: savedAddress?.nearby_landmark || values.landmark,
            Zip_code: savedAddress?.zip_code || savedAddress?.pin_code || savedAddress?.pincode || savedAddress?.postal_code || savedAddress?.zip || values.Zip_code || "",
            lat: savedAddress?.lat || values.lat,
            long: savedAddress?.long || values.long,
            addressType: values.addressType,
            fullAddress: `${values.house}${values.floor ? ', ' + values.floor : ''}, ${values.area}${values.Zip_code ? ', ' + values.Zip_code : ''}`,
          };

          console.log(response)

          toast.success(selectedAddress?.id ? "Address updated successfully!" : "Address added successfully!");
          onSave(finalData);
          formik.resetForm();
          onClose();
          handleModalClose();
        } else {
          toast.error(response.error || "Failed to save address");
        }
      } catch (err) {
        console.error("Address save error:", err);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });




  // 3. Handle Edit Mode (Populate form when selectedAddress changes)
  useEffect(() => {
    if (selectedAddress && !isAutoEnabled) {
      // API might return different keys, so we check both variations
      const typeLabel = selectedAddress.label || selectedAddress.type || selectedAddress.addressType || "Home";
      const formattedType = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);

      formik.setValues({
        house: selectedAddress.flat_house_building || selectedAddress.house || selectedAddress.flat || "",
        floor: selectedAddress.floor || "",
        area: selectedAddress.area_sector_locality || selectedAddress.area || "",
        landmark: selectedAddress.nearby_landmark || selectedAddress.landmark || "",
        addressType: formattedType,
        Zip_code: selectedAddress.zip || selectedAddress.Zip_code || selectedAddress.zip_code || selectedAddress.pin_code || selectedAddress.pincode || selectedAddress.postal_code || "",
        lat: selectedAddress.lat || selectedAddress.latitude || "28.006046",
        long: selectedAddress.long || selectedAddress.longitude || "77.297758",
      });
    } else {
      formik.resetForm();
    }
    setIsAutoEnabled(false);
  }, [selectedAddress]);





  // 4. Geolocation Logic
  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsAutoEnabled(false);
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        let currentGeocoder = geocoder.current;
        // @ts-ignore
        if (!currentGeocoder && window.google && window.google.maps) {
          // @ts-ignore
          currentGeocoder = new window.google.maps.Geocoder();
          geocoder.current = currentGeocoder;
        }

        if (currentGeocoder) {
          currentGeocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: any, status: any) => {
              setLocationLoading(false);
              if (status === "OK" && results && results.length > 0) {
                const place = results[0];
                let houseInfo = "";
                let areaName = "";
                let postcodeInfo = "";
                let landmarkInfo = "";

                // Build house info from the most specific result
                place.address_components.forEach((component: any) => {
                  const types = component.types;
                  if (types.includes("street_number") || types.includes("premise") || types.includes("subpremise")) {
                    houseInfo = houseInfo ? `${houseInfo} ${component.long_name}` : component.long_name;
                  }
                  if (types.includes("route")) {
                    houseInfo = houseInfo ? `${houseInfo}, ${component.long_name}` : component.long_name;
                  }
                });

                // Search through all results to reliably find area and postal code
                for (const result of results) {
                  result.address_components.forEach((component: any) => {
                    const types = component.types;
                    if (!areaName && (types.includes("sublocality") || types.includes("neighborhood") || types.includes("locality"))) {
                      areaName = component.long_name;
                    }
                    if (!postcodeInfo && types.includes("postal_code")) {
                      postcodeInfo = component.long_name;
                    }
                    if (!landmarkInfo && (types.includes("administrative_area_level_2") || types.includes("administrative_area_level_1"))) {
                      landmarkInfo = component.long_name;
                    }
                  });
                }

                if (!houseInfo) houseInfo = place.formatted_address.split(',')[0];
                if (!areaName) areaName = place.formatted_address.split(',')[1]?.trim() || "";

                formik.setFieldValue("house", houseInfo);
                formik.setFieldValue("area", areaName);
                formik.setFieldValue("lat", latitude.toString());
                formik.setFieldValue("long", longitude.toString());
                if (landmarkInfo) formik.setFieldValue("landmark", `Near ${landmarkInfo}`);
                if (postcodeInfo) formik.setFieldValue("Zip_code", postcodeInfo);
                toast.success("Location detected successfully!");
              } else {
                toast.error("Could not detect area from location");
              }
            }
          );
        } else {
          setLocationLoading(false);
          toast.error("Google Maps API is not loaded yet");
        }
      },
      (error) => {
        setLocationLoading(false);
        setIsAutoEnabled(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please allow location access.");
        } else {
          toast.error("Unable to retrieve your location");
        }
      }
    );
  };

  useEffect(() => {
    if (isAutoEnabled) fetchCurrentLocation();
  }, [isAutoEnabled]);

  const handleModalClose = (): void => {
    formik.resetForm();

    // TypeScript ko batana padega ki ye ek Button element hai
    const closeBtn = document.querySelector<HTMLButtonElement>("#add-address-popup .btn-close");

    onClose();

    // Optional chaining use karein taaki agar null ho toh crash na ho
    closeBtn?.click();
  };





  // const [addressType, setAddressType] = useState('Home');
  // const [formData, setFormData] = useState({
  //   flat: '',
  //   floor: '',
  //   area: '',
  //   landmark: ''
  // });

  // const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (selectedAddress) {
  //     setAddressType(selectedAddress.type || 'Home');
  //     setFormData({
  //       flat: selectedAddress.flat || '',
  //       floor: selectedAddress.floor || '',
  //       area: selectedAddress.area || '',
  //       landmark: selectedAddress.landmark || ''
  //     });
  //   } else {
  //     setAddressType('Home');
  //     setFormData({ flat: '', floor: '', area: '', landmark: '' });
  //   }
  //   setErrors({}); // Modal khulne par errors clear kar do
  // }, [selectedAddress]);


  // const validate = () => {
  //   let newErrors = {};

  //   if (!formData.flat.trim()) {
  //     newErrors.flat = "Flat/House no. is required";
  //   }

  //   if (!formData.area.trim()) {
  //     newErrors.area = "Area/Locality is required";
  //   } else if (formData.area.trim().length < 3) {
  //     newErrors.area = "Area name is too short";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });

  //   // Typing karte waqt error remove karna
  //   if (errors[name]) {
  //     setErrors({ ...errors, [name]: "" });
  //   }
  // };

  return (
    <>
      <div className="modal fade" id="add-address-popup" data-bs-backdrop="static" tabIndex={-1}
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}></button>
            <div className="modal-body">
              <div className="select-date-time-wrp">
                <h1>{selectedAddress ? "Edit Address" : "Add New Address"}</h1>

                <form onSubmit={formik.handleSubmit}>
                  <div className="your-location-top">
                    <div className="your-location-top-in">
                      <div className="use-location">
                        <img src="images/saved-addresses/location.svg" alt="" />
                        <div className="use-location-data">
                          {/* <h5>Use My Current Location</h5>
                          <p>Enable your current location for better services</p> */}


                          <h5>Use My Current Location</h5>
                          <p>{isAutoEnabled ? "Auto-detection is ON" : "Enable for automatic location fetch"}</p>



                        </div>
                        {/* <button type="button" className="reject-btn">Enable</button> */}

                        <button
                          type="button"
                          className={`reject-btn ${isAutoEnabled ? "active-mode" : ""}`}
                          onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                          style={{
                            backgroundColor: isAutoEnabled ? "#ff4d4d" : "#4CAF50",
                            color: "white",
                          }}
                          disabled={locationLoading}
                        >
                          {locationLoading ? "Detecting..." : isAutoEnabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="edit-add">
                    <h2>Save Address as <span>*</span></h2>
                    <div className="address-tags">
                      {["Home", "Office", "Other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={formik.values.addressType === type ? "active" : ""}
                          onClick={() => formik.setFieldValue("addressType", type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="addres-form">
                      {/* <input type="text" placeholder="Flat/ House no/ Building name" value="8502" /> */}

                      <div className="mb-3" style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder="Flat/ House no/ Building name *"
                          {...formik.getFieldProps("house")}
                          onChange={(e) => {
                            formik.handleChange(e);
                            handleSearchChange(e.target.value);
                          }}
                          onBlur={(e) => {
                            formik.handleBlur(e);
                            setTimeout(() => setShowSuggestions(false), 200);
                          }}
                          style={formik.touched.house && formik.errors.house ? { borderColor: 'red' } : {}}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <ul className="suggestions-dropdown" style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            listStyle: "none",
                            padding: "0",
                            margin: "4px 0 0 0",
                            zIndex: 1000,
                            maxHeight: "200px",
                            overflowY: "auto",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}>
                            {suggestions.map((s, i) => (
                              <li key={i} onMouseDown={() => handleSuggestionClick(s)} style={{
                                padding: "10px 15px",
                                cursor: "pointer",
                                borderBottom: i === suggestions.length - 1 ? "none" : "1px solid #f0f0f0",
                                fontSize: "14px",
                                color: "#333",
                                textAlign: "left"
                              }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                              >
                                <strong>{s.structured_formatting?.main_text || s.description.split(',')[0]}</strong>
                                <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>{s.structured_formatting?.secondary_text || s.description}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                        {formik.touched.house && formik.errors.house && (
                          <span style={{ color: 'red', fontSize: '12px' }}>{formik.errors.house}</span>
                        )}
                      </div>

                      {/* Floor Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Floor (Optional)"
                          {...formik.getFieldProps("floor")}
                        />
                      </div>

                      {/* Area Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Area/ Sector/ Locality *"
                          {...formik.getFieldProps("area")}
                          style={formik.touched.area && formik.errors.area ? { borderColor: 'red' } : {}}
                        />
                        {formik.touched.area && formik.errors.area && (
                          <span style={{ color: 'red', fontSize: '12px' }}>{formik.errors.area}</span>
                        )}
                      </div>

                      {/* Landmark Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Nearby Landmark (Optional)"
                          {...formik.getFieldProps("landmark")}
                        />
                      </div>

                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Postal code / Zip code"
                          {...formik.getFieldProps("Zip_code")}
                          style={formik.touched.Zip_code && formik.errors.Zip_code ? { borderColor: 'red' } : {}}
                        />
                        {formik.touched.Zip_code && formik.errors.Zip_code && (
                          <span style={{ color: 'red', fontSize: '12px' }}>{formik.errors.Zip_code}</span>
                        )}
                      </div>
                      <button type="submit" className="primary-cta mt-3" disabled={loading}>
                        {loading ? "Saving..." : selectedAddress ? "Update Address" : "Save Address"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewAddressModal


















