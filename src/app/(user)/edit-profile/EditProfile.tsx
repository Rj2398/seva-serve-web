import React from 'react'

const EditProfile = () => {
  return (
    <main>
    <div className="container home-wraper my-profile">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="browse-wrp">
                <div className="browse-ctg-head my-con-head">
                  <h2 className="sub-cate-page"> <a href="#"><img src="images/home/left-arrow.svg" alt="" /></a>Edit Profile</h2>
                 
                </div>
                <div className="my-profile-wrapper">
                  <div className="my-profile-page">
                  <img className="bg-img" src="images/inner-page/profile-bg-icon.svg" alt="" />          
              </div>

              <div className="">
                <form className="">
                <div className="input-data-file">
                    <div className="user-img-circle">
                      <img src="images/inner-page/user-profile.svg" alt="" />
                      
                  </div>
                      <input type="file" id="fileInput" />

                      <label htmlFor="fileInput" className="upload-icon">
                      <img src="images/inner-page/upload-file-icon.svg" alt="" />
                      </label>

                  </div>
               <div className="roger-data">

                  <div className="input-group">
                    <img src="images/inner-page/roger-walker-img.svg" alt="" />
                    <input type="text" value="Roger Walker" />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <img src="images/inner-page/contact-icon.svg" alt="" />
                      <input type="text" value="+1 555 232 254" />
                    </div>

                    <div className="input-group">
                      <img src="images/inner-page/mail-icon.svg" alt="" />
                      <input type="email" value="roger@gmail.com" />
                    </div>
                  </div>

                

                  <button className="primary-cta edit-profile" type="button">Save Changes</button>

                </div>
              </form>
              </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>
       
    </div>
  </main>
  )
}

export default EditProfile