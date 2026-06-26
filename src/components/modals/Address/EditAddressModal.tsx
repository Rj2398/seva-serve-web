import React from 'react'

const EditAddressModal = () => {
  return (
    <>
         <div className="modal fade" id="edit-address-popup" data-bs-backdrop="static" tabIndex={-1}
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div className="modal-body">
          <div className="select-date-time-wrp">
            <h1>Edit Address</h1>
            <form action="">
              <div className="edit-add">
                <h2>Save Address as <span>*</span></h2>
                <div className="address-tags">
                  <button type="button" className="active">Home</button>
                  <button type="button">Office</button>
                  <button type="button">Other</button>
                </div>
                <div className="addres-form">
                  <input type="text" placeholder="Flat/ House no/ Building name" value="8502"/>
                  <input type="text" placeholder="Floor (Optional)"/>
                  <input type="text" placeholder="Area/ Sector/ Locality"/>
                  <input type="text" placeholder="Nearby Landmark (Optional)"/>
                  <button type="submit" className="primary-cta">Save Changes</button>
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

export default EditAddressModal
