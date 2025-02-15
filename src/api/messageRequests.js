import axios from "axios"


const serverUrl = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: serverUrl})

export let addMessage = (formData) => {

  const token = JSON.parse(localStorage.getItem('token'));
  return API.post(`/api/message`, formData, {headers: {token}})
};

export let getMessages = (id) => {

  const token = JSON.parse(localStorage.getItem('token'));
  return API.get(`/api/message/${id}`, {headers: {token}})
};


export let deleteMessage = (messageId) => {

  const token = JSON.parse(localStorage.getItem('token'));
  return API.delete(`/api/message/${messageId}`, {headers: {token}})
};