import axios from "axios"


const serverUrl = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: serverUrl})

export let register = (formData) => API.post('/api/signup', formData);

export let login = (formData) => API.post('/api/login', formData);


