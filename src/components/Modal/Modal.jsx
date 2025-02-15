import React, { useState } from 'react'
import "./Modal.css"
import { useInfoContext } from '../../context/Context'
import userIcon from "../../images/user.png"
import CoverImg from "../../images/cover.png"
import { updateUser } from '../../api/userRequests'
const serverUrl = process.env.REACT_APP_SERVER_URL


const Modal = ({modal, setModal}) => {
  const {userInfo, setUserInfo, currentUser, setCurrentUser, exit} = useInfoContext()

  const [update, setUpdate] = useState(false)

  const handleEditForm = async(e) => {
    e.preventDefault()

    try {
      setUpdate(true)
      const formData = new FormData(e.target)
      const res = await updateUser(currentUser._id, formData)
      setCurrentUser(res.data.user)
      setUserInfo(res.data.user)
      localStorage.setItem('profile', JSON.stringify(res.data.user))
      setUpdate(false)
    } catch (error) {
      setUpdate(false)
      if(error.response.data.message === "jwt expired") {
        exit()
      }      
    }
  }

  return (
    <div className='info-modal'>
      <button onClick={() => setModal(false)} className="close-btn button">X</button>
      
      <div className="info-card">
        <div className="profile-images">
          <img src={userInfo?.coverPicture ? `${serverUrl}/${userInfo.coverPicture}` : CoverImg} alt="cover_image" className="cover-img" />
          <img src={userInfo?.profilePicture ? `${serverUrl}/${userInfo.profilePicture}` : userIcon} alt="profile_img" className="prof-img" />
        </div>

        {
          modal === "info" ? 
          <>
            <h3 className="name-user">Name: {userInfo.firstname}</h3>
            <h3 className="name-user">Lastname: {userInfo.lastname}</h3>
            <h3 className="name-user">Email: {userInfo.email}</h3>
            <h3 className="name-user">Relationship: {userInfo.relationship}</h3>
            <h3 className="name-user">About: {userInfo.about}</h3>
            <h3 className="name-user">Country: {userInfo.country}</h3>
            <h3 className="name-user">Works: {userInfo.works}</h3>
            <h3 className="name-user">LivesIn: {userInfo.livesIn}</h3>
          </>
          : 
          <>
            <form onSubmit={handleEditForm} action="" className="edit-form auth-form">
              <input type="text" className="info-input" name='firstname' required defaultValue={currentUser.firstname}/>
              <input type="text" className="info-input" name='lastname' required defaultValue={currentUser.lastname}/>
              <input type="email" className="info-input" name='email' required defaultValue={currentUser.email}/>
              <input type="text" className="info-input" name='about' required defaultValue={currentUser.about} placeholder='about...'/>
              <input type="text" className="info-input" name='country' required defaultValue={currentUser.country} placeholder='country...'/>
              <input type="text" className="info-input" name='works' required defaultValue={currentUser.works} placeholder='works...'/>
              <input type="text" className="info-input" name='livesIn' required defaultValue={currentUser.livesIn} placeholder='livesIn...'/>
              <input type="text" className="info-input" name='relationship' required defaultValue={currentUser.relationship} placeholder='relationship...'/>

              <div className="img-input-box">
                <label htmlFor="edit-file-input">
                  ProfilePicture
                  <input type="file" id="edit-file-input" name='profilePicture'/>
                </label>
                <label htmlFor="edit-file-input2">
                  coverPicture
                  <input type="file" id="edit-file-input2" name='coverPicture'/>
                </label>
              </div>

              <button disabled={update} className="update-btn button">{update ? 'Updating...' : 'Update'}</button>
            </form>
          </>
        }

      </div>

    </div>

  )
}

export default Modal