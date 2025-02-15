import React, { useEffect, useRef, useState } from 'react'

import "./ChatBox.css"
import { useInfoContext } from '../../context/Context'
import { toast } from 'react-toastify'
import { getUser } from '../../api/userRequests'
import userIcon from "../../images/user.png"
import { addMessage, getMessages } from '../../api/messageRequests'
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'
const serverUrl = process.env.REACT_APP_SERVER_URL

const ChatBox = ({setModal, socket}) => {

  const {currentChat, currentUser, exit, setUserInfo, onlineUsers} = useInfoContext()

  const [user, setUser] = useState(null)

  const [messages, setMessages] = useState([])  

  const [sendMessage, setSendMessage] = useState(null)  
  const [answerMessage, setAnswerMessage] = useState(null)  
  
  const [textMessage, setTextMessage] = useState("")

  const imgRef = useRef()
  const scrollRef = useRef()

  const id = currentChat?.members.find(id => id !== currentUser._id)

  const isOnline = (id) => {
    const online = onlineUsers.find(user => user.userId === id)

    return online ? true : false
  }
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        toast.loading("please wait...")
        const res = await getUser(id)        
        setUser(res.data.user)
        toast.dismiss()
        
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message)
        if(error.response.data.message === "jwt expired") {
          exit()
        }         
      }
    }

    currentChat && getUserData()
  }, [currentChat])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        toast.loading("please wait...")
        const res = await getMessages(currentChat._id)        
        setMessages(res.data.messages)
        toast.dismiss()
        
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message)  
        if(error.response.data.message === "jwt expired") {
          exit()
        }       
      }
    }

    currentChat && fetchMessages()
  }, [currentChat])

  // send message to socket server
  useEffect(() => {
    if(sendMessage !== null) {
      socket.emit("send-message", sendMessage)
    }
  }, [sendMessage])

  useEffect(() => {
    socket.on("answer-message", (data) => {
      setAnswerMessage(data)
    })
  }, [sendMessage])

  useEffect(() => {
    if(currentChat && answerMessage !== null && answerMessage.chatId === currentChat._id) {
      setMessages([...messages, answerMessage])
    }
  }, [answerMessage])

  const handleText = (e) => {
    setTextMessage(e)
  }

  const handleSend = async () => {
    const message = {
      senderId: currentUser._id,
      chatId: currentChat._id,
      text: textMessage,
      createdAt: new Date().getTime()
    }

    if(textMessage === "") {
      return
    }

    setSendMessage({...message, receivedId: id})
    try {
      const res = await addMessage(message)
      console.log(res);
      setMessages([...messages, res.data.newMessage])
      setTextMessage("")
    } catch (error) {
      console.log(error);
      if(error.response.data.message === "jwt expired") {
        exit()
      } 
    }
  }
  
  return (
    <div className='chat-box'>
      {
        currentChat ? 
        <>
          <div onClick={() => {
              setUserInfo(user)
              setModal("info")
            }} className="user-ifo-box">                       
            <img width={50} className='profile-img' src={user?.profilePicture ? `${serverUrl}/${user.profilePicture}` : userIcon} alt="profile_img" />
            <div className="user-name">
              <h3 className='name'>{user?.firstname} {user?.lastname}</h3>
              <span className={isOnline(user?._id) ? "status" : "status-off"}>{isOnline(user?._id) ? "online" : "offline"}</span>
            </div>
          </div>

          <div className="chat-body">
            {
              messages.map(message => {
                return (
                  <div key={message._id} className={message.senderId === currentUser._id ? "message own" : "message"}>
                    {message.file && <img src="" alt="" className="message-img" />}                    
                    <span className="message-text">{message.text}</span>
                    <span className="message-data">{format(message.createdAt)}</span>
                  </div>
                )
              })
            }
          </div>
          <div className="chat-sender">
            <button onClick={() => imgRef.current.click()} className="sender-file-btn button">+</button>
            <InputEmoji value={textMessage} onChange={handleText}/>
            <button onClick={handleSend} className="send-btn button">Send</button>
            <input ref={imgRef} type="file" name='image' className="message-file-input"  />
          </div>
        </> :
        <>
          <h2>Tap on a chat to start conversation...</h2>
        </>
      }
    </div>
  )
}

export default ChatBox