import { createContext, useContext, useState } from "react";

const InfoContext = createContext()

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')) || null)

  const [userInfo, setUserInfo] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)

  const exit = () => {
    setCurrentUser(null)
    localStorage.clear()
  }

  const value = {
    currentUser, setCurrentUser,
    exit, userInfo, setUserInfo,
    onlineUsers, setOnlineUsers,
    chats, setChats,
    currentChat, setCurrentChat
  }



  return (
    <InfoContext.Provider value={value}>
      <InfoContext.Consumer>
        {() => children}
      </InfoContext.Consumer>
    </InfoContext.Provider>
  )
}

// axios, react-toastify, component va page ni farqi API

