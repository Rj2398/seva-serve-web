"use client";

import React from 'react';
import {useRouter} from 'next/navigation';

const DeleteAccountModal = () => {

  const router = useRouter();

    // JSON DATA
    const deleteReasons = [
      "I no longer use the app",
      "I’m concerned about my data privacy",
      "I found another app I prefer",
      "The app doesn’t meet my needs",
      "I want to remove all my personal data",
    ];
  

  const handleRedirect = (reason: string) => {
    console.log("Selected Reason:", reason);

    const modal = document.getElementById("deleteAccountModal");

    if(modal) {
      const modalInstance = window.bootstrap?.Modal.getInstance(modal);

      modalInstance?.hide();

            // REMOVE BACKDROP MANUALLY
            // document.body.classList.remove("modal-open");
  
            // const backdrops = document.getElementsByClassName("modal-backdrop");
        
            // while (backdrops.length > 0) {
            //   backdrops[0].remove();
            // }
        
            // document.body.style.overflow = "auto";
            // document.body.style.paddingRight = "0px";
    }

      router.push("/delete-account");
  }

  // const handleRedirect = (reason: string) => {

  //   console.log("Selected Reason:", reason);
  
  //   const modalElement = document.getElementById(
  //     "deleteAccountModal"
  //   );
  
  //   if (modalElement) {
  
  //     const modalInstance =
  //       window.bootstrap.Modal.getOrCreateInstance(
  //         modalElement
  //       );
  
  //     modalElement.addEventListener(
  //       "hidden.bs.modal",
  //       () => {
  
  //         // REMOVE BACKDROP
  //         document
  //           .querySelectorAll(".modal-backdrop")
  //           .forEach((el) => el.remove());
  
  //         // CLEAN BODY
  //         document.body.classList.remove("modal-open");
  //         document.body.style.overflow = "";
  //         document.body.style.paddingRight = "";
  
  //         // VERY IMPORTANT
  //         modalInstance.dispose();
  
  //         router.push("/delete-account");
  
  //       },
  //       { once: true }
  //     );
  
  //     modalInstance.hide();
  
  //   }
  
  // };

  return (
    <div className="modal fade delete-account" id="deleteAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Why would you like to delete your account</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body delete-account-bdy">
          <ul className="list-group list-group-flush">

            {deleteReasons?.map((reason, index) => (
              <li 
              key={index} className="list-group-item custom-item" onClick={() => handleRedirect(reason)} style={{cursor: "pointer"}}>
              <span>{reason}</span>
              <div className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></div>
            </li>
            ))}

    {/* <li className="list-group-item custom-item" onClick={handleRedirect} style={{cursor: "pointer"}}>
      <span>I no longer use the app</span>
      <a href="#" className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></a>
    </li>

    <li className="list-group-item custom-item">
      <span>I’m concerned about my data privacy</span>
       <a href="#" className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></a>
    </li>

    <li className="list-group-item custom-item">
      <span>I found another app I prefer</span>
       <a href="#" className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></a>
    </li>

    <li className="list-group-item custom-item">
      <span>The app doesn’t meet my needs</span>
       <a href="#" className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></a>
    </li>

    <li className="list-group-item custom-item">
      <span>I want to remove all my personal data</span>
       <a href="#" className="arrow"><img src="images/inner-page/right-side-move.svg" alt="" /></a>
    </li> */}

  </ul>
        </div>
        
      </div>
    </div>
  </div>
  )
}

export default DeleteAccountModal