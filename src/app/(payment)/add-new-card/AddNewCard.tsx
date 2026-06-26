// "use client";
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React from 'react'

// const AddNewCard = () => {
//   const router =useRouter()

//   return (
//     <div className="container home-wraper my-profile">
//       <section>
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="browse-wrp">
//                 <div className="browse-ctg-head my-con-head">
//                   <h2 className="sub-cate-page"> <Link href="/" onClick={()=>router.back()}><img src="images/home/left-arrow.svg" alt="" /></Link>Add New Card</h2>

//                 </div>
//                 <div className="card-wrp-surname">
//                   <div className="card-wrp form">

//                   <div className="single-card">
//                     <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
//                   </div>
//                       <form className="Cardholder">
//                               <div className="Cardholder-form">
//                                   <label>Cardholder’s Name</label>
//                               <input type="text" placeholder="Enter Cardholder’s Name" />

//                               <label>Card Number</label>
//                               <input type="text" placeholder="Enter Card Number" />

//                               <div className="multi-row">
//                                   <div className="cvv-exp">
//                                       <label>CVV</label>
//                                       <input type="text" placeholder="CVV" />
//                                   </div>
//                                   <div className="cvv-exp">
//                                       <label>Expiry Date</label>
//                                       <input type="text" placeholder="MM/YYYY" />
//                                   </div>
//                               </div>

//                               <button className="primary-cta add-card">Add Card</button>
//                               </div>
//                           </form>
//                 </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//     </div>

//   )
// }

// export default AddNewCard




"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Interface for Form Data
interface CardFormData {
  bankName: string;
  cardNumber: string;
  holderName: string;
  expiry: string;
  cvv: string;
}

// Interface for Errors
interface FormErrors {
  holderName?: string;
  cardNumber?: string;
  cvv?: string;
  expiry?: string;
}



const AddNewCard = () => {
  const router = useRouter();

  // 1. Form Data State (CVV add kiya hai yahan)
 const [formData, setFormData] = useState<CardFormData>({
    bankName: 'Universal Bank',
    cardNumber: '',
    holderName: '',
    expiry: '',
    cvv: ''
  });

  // 2. Error State
 const [errors, setErrors] = useState<FormErrors>({});

  // Input Change Handler
 // Correct Event Type for Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      // Allow only numbers and format with spaces
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    if (name === "expiry") {
      // Auto-insert slash for MM/YY
      value = value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5);
    }

    setFormData({ ...formData, [name]: value });
  };

const validate = () => {
    let newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!formData.holderName.trim()) {
      newErrors.holderName = "Holder name is required";
    }

    const cleanCardNumber = formData.cardNumber.replace(/\s+/g, '');
    if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "Enter a valid 16-digit card number";
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV (3 digits)";
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const match = formData.expiry.match(expiryRegex);

    if (!match) {
      newErrors.expiry = "Use MM/YY format (e.g., 05/28)";
    } else {
      const expMonth = parseInt(match[1]);
      const expYear = parseInt(match[2]);
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiry = "Card has expired";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Saving Card Data:", formData);
      alert("Card Added Successfully!");
      router.push("/payment-method");
    }
  };
  return (
    <div className="container home-wraper my-profile">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="browse-wrp">
                <div className="browse-ctg-head my-con-head">
                  <h2 className="sub-cate-page">
                    {/* back button functionality */}
                    <span onClick={() => router.back()} style={{ cursor: 'pointer' }}>
                      <img src="images/home/left-arrow.svg" alt="back" />
                    </span>
                    Add New Card
                  </h2>
                </div>

                <div className="card-wrp-surname">
                  <div className="card-wrp form">
                    {/* Visual Card Preview */}
                    <div className="single-card">
                      <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
                      {/* Optional: Yahan live preview dikha sakte ho card number ka */}
                    </div>

                    <form className="Cardholder" onSubmit={handleSubmit}>
                      <div className="Cardholder-form">

                        {/* Holder Name */}
                        <label>Cardholder’s Name</label>
                        <input
                          type="text"
                          name="holderName"
                          placeholder="Enter Cardholder’s Name"
                          value={formData.holderName}
                          onChange={handleChange}
                          className={errors.holderName ? "error-border" : ""}
                        />
                        {errors.holderName && <span className="text-danger small">{errors.holderName}</span>}

                        {/* Card Number */}
                        <label className="mt-3">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          maxLength={19}
                          placeholder="Enter Card Number"
                          value={formData.cardNumber}
                          onChange={handleChange}
                        />
                        {errors.cardNumber && <span className="text-danger small">{errors.cardNumber}</span>}

                        <div className="multi-row mt-3">
                          {/* CVV */}
                          <div className="cvv-exp">
                            <label>CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              maxLength={3}
                              placeholder="CVV"
                              value={formData.cvv}
                              onChange={handleChange}
                            />
                            {errors.cvv && <span className="text-danger small">{errors.cvv}</span>}
                          </div>

                          {/* Expiry */}
                          <div className="cvv-exp">
                            <label>Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/YYYY"
                              value={formData.expiry}
                              onChange={handleChange}
                            />
                            {errors.expiry && <span className="text-danger small">{errors.expiry}</span>}
                          </div>
                        </div>

                        <button type="submit" className="primary-cta add-card mt-4">Add Card</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Error Styling Inline (Optional) */}
      <style jsx>{`
        .text-danger { color: #dc3545; display: block; margin-top: 5px; }
        .small { font-size: 12px; }
        .error-border { border-color: #dc3545 !important; }
      `}</style>
    </div>
  );
}

export default AddNewCard;