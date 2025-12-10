// {
//   "username": "alvin",
//   "email": "alvin@example.com",
//   "phone": "010-1234-5678",
//   "password": "1234",
//   "roleCode": "ROLE_COMPANY"
// }
import api from './instance'
import type { UserRegisterData, UserLoginData, UserOnBoardData } from '../types/index'

export const registerUser = async (data: UserRegisterData) => {
  const response = await api.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const loginUser = async (data: UserLoginData) => {
  const response = await api.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const OnBoardUser = async (data: UserOnBoardData) => {
  const response = await api.post('/auth/onboarding/user', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}
