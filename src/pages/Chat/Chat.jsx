import React, { useEffect, useState } from 'react'
import "./Chat.css"
import { useInfoContext } from '../../context/Context'
import Search from '../../components/Search/Search'
import Modal from '../../components/Modal/Modal'
import { io } from 'socket.io-client'
import { getUsersChat } from '../../api/chatRequests'
import Conversation from '../../components/Conversation/Conversation'
import ChatBox from '../../components/ChatBox/ChatBox'
const serverUrl = process.env.REACT_APP_SERVER_URL

const socket = io(serverUrl)

const Chat = () => {
  const {exit, setUserInfo, currentUser, setOnlineUsers, chats, setChats} = useInfoContext()
  const [modal, setModal] = useState(false)

  
  // socket
  useEffect(() => {
    socket.emit("new-user-add", currentUser._id)

    socket.on("get-users", (users) => {
      setOnlineUsers(users)
    })
  }, [currentUser._id])


  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await getUsersChat()
        setChats(res.data.chats)
      } catch (error) {
        if(error.response.data.message === "jwt expired") {
          exit()
        }           
      }
    }

    getChats()
  }, [])

  return (
    <div className='chat-page'>
      <div className="chat-left-side">
        {/* search andusers list */}
        <Search modal = {modal} setModal = {setModal}/>
      </div>
      <div className="middle-side">
        <ChatBox setModal={setModal} socket={socket} />

      </div>

      <div className="chat-right-side">
        <div className="right-side-top">
          <button onClick={() => {
            exit()
            socket.emit("disconnect2")
          }} className="button">Exit</button>
          <button onClick={() => {
            setUserInfo(currentUser)
            setModal("settings")
          }} className="button">Settings</button>

        </div>
        <div className="chats-list">
          <h2>Chat list</h2>
          {
            chats.length > 0 
            ?
             chats.map(chat => {
              return (
              <div key={chat._id} className="chat-item">
                <Conversation chat = {chat}/>
              </div>)
             }) 
            : <h2>Chats not found</h2>
          }
        </div>

      </div>

      {modal && <Modal modal = {modal} setModal = {setModal}/>}
      
    </div>
  )
}

export default Chat