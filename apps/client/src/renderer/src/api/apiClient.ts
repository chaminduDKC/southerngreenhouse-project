import axios from 'axios'
import { triggerLogout } from '../context/authEvents'


const TOKEN_KEY = 'sg_token'
export const API_BASE_URL = import.meta.env.VITE_API_LOCAL_URL
 


export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s for PDF generation
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let hasLoggedOut = false

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !hasLoggedOut) {
      hasLoggedOut = true
      triggerLogout() // flips isAuthenticated -> false via React state
      setTimeout(() => { hasLoggedOut = false }, 1000)
    }
    return Promise.reject(error)
  }
)