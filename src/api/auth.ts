// {
//   "username": "alvin",
//   "email": "alvin@example.com",
//   "phone": "010-1234-5678",
//   "password": "1234",
//   "roleCode": "ROLE_COMPANY"
// }
import Api from './Api'
import type { UserRegisterData, UserLoginData } from '../types/index'

export const registerUser = async (data: UserRegisterData) => {
  const response = await Api.post('/auth/register', data)
  return response.data
}

export const loginUser = async (data: UserLoginData) => {
  const response = await Api.post('/auth/login', data)
  return response.data
}
