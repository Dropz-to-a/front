export type UserRegisterData = {
  username: string
  email: string
  phone: string
  password: string
  roleCode: string
}

export type UserLoginData = {
  id: string
  password: string
}

export type UserOnBoardData = {
  realName: string
  birth: string
  address: string
  detailAddress: string
  zonecode: string
}
