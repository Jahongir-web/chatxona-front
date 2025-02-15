import React, { useEffect, useState } from 'react'
import "./Conversation.css"
import { useInfoContext } from '../../context/Context'
import { getUser } from '../../api/userRequests'
import userIcon from "../../images/user.png"
const serverUrl = process.env.REACT_APP_SERVER_URL

const Conversation = ({chat}) => {
  const {currentUser, exit, onlineUsers, setCurrentChat} = useInfoContext()

  const [user, setUser] = useState(null)

  const userId = chat.members.find(id => id !== currentUser._id)
  
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getUser(userId)
        setUser(res.data.user)
        
      } catch (error) {
        if(error.response.data.message === "jwt expired") {
          exit()
        }   
      }
    }

    getData()
  }, [userId])

  const isOnline = (id) => {
    const online = onlineUsers.find(user => user.userId === id)

    return online ? true : false
  }

  return (
    <div onClick={() => setCurrentChat(chat)} className="user-ifo-box">
      {
        isOnline(user?._id) && <div className="dot-online"></div>
      }
      
      <img width={50} className='profile-img' src={user?.profilePicture ? `${serverUrl}/${user.profilePicture}` : userIcon} alt="profile_img" />
      <div className="user-name">
        <h3 className='name'>{user?.firstname} {user?.lastname}</h3>
        <span className={isOnline(user?._id) ? "status" : "status-off"}>{isOnline(user?._id) ? "online" : "offline"}</span>
      </div>
    </div>

  )
}

export default Conversation