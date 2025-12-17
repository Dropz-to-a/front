// {
//   "username": "alvin",
//   "email": "alvin@example.com",
//   "phone": "010-1234-5678",
//   "password": "1234",
//   "roleCode": "ROLE_COMPANY"
// }
import api from './Api'
import type { UserRegisterData, UserLoginData } from '../types/index'

export const registerUser = async (data: UserRegisterData) => {
  const response = await api.post('/api/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const loginUser = async (data: UserLoginData) => {
  const response = await api.post('/api/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { accessToken } = response.data

  if (accessToken) {
    localStorage.setItem('JwtToken', accessToken)
  }

  return response.data
}
