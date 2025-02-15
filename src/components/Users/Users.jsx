import React, { useEffect, useState } from 'react'
import "./Users.css"
import { useInfoContext } from '../../context/Context'
import { toast } from 'react-toastify'
import { getAllUsers } from '../../api/userRequests'
import userIcon from "../../images/user.png"
import { findChat } from '../../api/chatRequests'
const serverUrl = process.env.REACT_APP_SERVER_URL

const Users = ({modal, setModal}) => {
  const {currentUser, setUserInfo, onlineUsers, exit, chats, setChats, setCurrentChat} = useInfoContext()

  const [users, setUsers] = useState([])

  const isOnline = (id) => {
    const online = onlineUsers.find(user => user.userId === id)

    return online ? true : false
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        toast.loading("please wait...")
        const res = await getAllUsers()
        setUsers(res.data.users)
        toast.dismiss()
        
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message)        
      }
    }

    getUsers()
  }, [])

  const createChat = async(firstId, secondId) => {
    try {
      const res = await findChat(firstId, secondId)
      if(!chats.some(chat => chat._id === res.data.chat._id)) {
        setChats([...chats, res.data.chat])
      }
      setCurrentChat(res.data.chat)
    } catch (error) {
      // console.log(error);
      if(error.response.data.message === "jwt expired") {
        exit()
      }
    }
  }

  return (
    <div className='users-list'>
      {
        users.map(user => {
          if(user._id !== currentUser._id) {
            return (
              <div key={user._id} className="user-ifo-box">
                {
                  isOnline(user._id) && <div className="dot-online"></div>
                }
                
                <img onClick={() => {
                  setUserInfo(user)
                  setModal("info")
                }} width={50} className='profile-img' src={user?.profilePicture ? `${serverUrl}/${user.profilePicture}` : userIcon} alt="profile_img" />
                <div className="user-name">
                  <h3 className='name'>{user.firstname} {user.lastname}</h3>
                  <span className={isOnline(user._id) ? "status" : "status-off"}>{isOnline(user._id) ? "online" : "offline"}</span>
                </div>
                <button onClick={() => createChat(user._id, currentUser._id)} className="message-btn button"></button>
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default Users