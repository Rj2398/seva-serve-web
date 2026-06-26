"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddAddressModal = () => {
  const [selectedType, setSelectedType] = useState("Home");
  const [loading, setLoading] = useState(false);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);

  const validationSchema = Yup.object({
    house: Yup.string()
      .min(3, "House name/no is too short")
      .required("Building name or House no is required"),
    area: Yup.string()
      .min(5, "Please provide a more detailed area")
      .required("Area/Locality is required"),
    floor: Yup.string(),
    landmark: Yup.string(),
    addressType: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      house: "",
      floor: "",
      area: "",
      landmark: "",
      addressType: "Home",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const finalData = {
        id: Date.now(),
        ...values,
        fullAddress: `${values.house}, ${values.floor ? values.floor + "," : ""} ${values.area}`,
        createdAt: new Date().toISOString()
      };
      console.log("Final Saved Data:", finalData);

      resetForm();
      const modalElement = document.getElementById("add-address-popup");
      if (modalElement) {
        const bootstrap = require("bootstrap");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    },
  });

  // const handleGetLocation = () => {
  //   if (!navigator.geolocation) {
  //     return;
  //   }

  //   setLoading(true);

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       try {
  //         // OpenStreetMap ki Free Nominatim API ka use karke address nikalna
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  //         );
  //         const data = await response.json();

  //         if (data && data.address) {
  //           const areaName = data.address.suburb || data.display_name.split(',')[1] || data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.town || "Unknown Area";
  //           const houseInfo = data.address.road || data.address.amenity || "Detected Building";
  //           const landmarkInfo = data.address.suburb || data.display_name.split(',')[1];
  //           formik.setFieldValue("house", houseInfo);
  //           formik.setFieldValue("area", areaName);
  //           formik.setFieldValue("landmark", `Near${landmarkInfo}`);
  //         }
  //       } catch (error) {
  //         console.error("Geocoding failed:", error);
  //         formik.setFieldValue("area", `Near Lat: ${latitude.toFixed(2)}`);
  //       } finally {
  //         setLoading(false);
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //       setLoading(false);
  //       alert("Location access denied. Please type manually.");
  //     }
  //   );
  // };


  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
           if (data && data.address) {
            const areaName = data.address.suburb || data.display_name.split(',')[1] || data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.town || "Unknown Area";
            const houseInfo = data.address.road || data.address.amenity || "Detected Building";
            const landmarkInfo = data.address.suburb || data.display_name.split(',')[1];
            formik.setFieldValue("house", houseInfo);
            formik.setFieldValue("area", areaName);
            formik.setFieldValue("landmark", `Near${landmarkInfo}`);
          }
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  };


  useEffect(() => {
    if (isAutoEnabled) {
      fetchCurrentLocation();
    }
  }, [isAutoEnabled]);



  return (
    <div
      className="modal fade"
      id="add-address-popup"
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

              <h1>Add New Address</h1>

              <form onSubmit={formik.handleSubmit}>

                <div className="your-location-top">

                  <div className="your-location-top-in">

                    <div className="use-location">

                      <img
                        src="images/saved-addresses/location.svg"
                        alt=""
                      />
                      <div className="use-location-data">
                        <h5>Use My Current Location</h5>
                        <p>{isAutoEnabled ? "Auto-detection is ON" : "Enable for automatic location fetch"}</p>
                      </div>
                      <button
                        type="button"
                        className={isAutoEnabled ? "reject-btn active-mode" : "reject-btn"}
                        onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                        style={{
                          backgroundColor: isAutoEnabled ? "#ff4d4d" : "#4CAF50", 
                          color: "white"
                        }}
                      >
                        {loading ? "..." : (isAutoEnabled ? "Disable" : "Enable")}
                      </button>

                    </div>

                  </div>

                </div>

                <div className="edit-add">

                  <h2>
                    Save Address as <span>*</span>
                  </h2>

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
                  {/* <div className="addres-form">
                    <input
                      type="text"
                      name="house"
                      placeholder="Flat/ House no/ Building name *"
                      value={formData.house}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="text"
                      name="floor"
                      placeholder="Floor (Optional)"
                      value={formData.floor}
                      onChange={handleChange}
                    />

                    <input
                      type="text"
                      name="area"
                      placeholder="Area/ Sector/ Locality *"
                      value={formData.area}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="text"
                      name="landmark"
                      placeholder="Nearby Landmark (Optional)"
                      value={formData.landmark}
                      onChange={handleChange}
                    />

                    <button type="submit" className="primary-cta">
                      Save Address
                    </button>
                  </div> */}

                  <div className="addres-form">
                    {/* House Input */}
                    <div className="input-group-wrp mb-3">
                      <input
                        type="text"
                        placeholder="Flat/ House no/ Building name *"
                        {...formik.getFieldProps("house")}
                        className={formik.touched.house && formik.errors.house ? "input-error" : ""}
                      />
                      {formik.touched.house && formik.errors.house && (
                        <span className="error-text" style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {formik.errors.house}
                        </span>
                      )}
                    </div>

                    {/* Floor Input */}
                    <div className="input-group-wrp mb-3">
                      <input
                        type="text"
                        placeholder="Floor (Optional)"
                        {...formik.getFieldProps("floor")}
                      />
                    </div>

                    {/* Area Input */}
                    <div className="input-group-wrp mb-3">
                      <input
                        type="text"
                        placeholder="Area/ Sector/ Locality *"
                        {...formik.getFieldProps("area")}
                        className={formik.touched.area && formik.errors.area ? "input-error" : ""}
                      />
                      {formik.touched.area && formik.errors.area && (
                        <span className="error-text" style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {formik.errors.area}
                        </span>
                      )}
                    </div>

                    {/* Landmark Input */}
                    <div className="input-group-wrp mb-3">
                      <input
                        type="text"
                        placeholder="Nearby Landmark (Optional)"
                        {...formik.getFieldProps("landmark")}
                      />
                    </div>

                    <button type="submit" className="primary-cta mt-2 w-100">
                      Save Address
                    </button>
                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AddAddressModal;