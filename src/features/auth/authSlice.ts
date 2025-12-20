/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loginUser } from '@/api/auth'
import { getUserTypeFromToken, getUsernameFromToken, getOnBoardedFromToken } from '@/utils/jwt'
import type { UserLoginData } from '@/types'

type UserType = 'user' | 'company' | null

type AuthState = {
  token: string | null
  userType: UserType
  username: string | null
  onboarded: boolean | null   
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('jwtToken'),
  userType: (localStorage.getItem('userType') as UserType) ?? null,
  username: localStorage.getItem('username'),
  onboarded: localStorage.getItem('onboarded') === 'true' ? true : localStorage.getItem('onboarded') === 'false' ? false : null, // ✅ 추가
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: UserLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUser(payload)
      const token = data?.accessToken
      if (!token) return rejectWithValue('accessToken이 없습니다.')

      console.log('[AuthSlice] 로그인 성공, 토큰 받음')
      
      const userType = getUserTypeFromToken(token)
      const username = getUsernameFromToken(token)
      const onboarded = getOnBoardedFromToken(token) 

      console.log('[AuthSlice] 추출된 정보:', {
        userType,
        username,
        onboarded,
      })

      localStorage.setItem('jwtToken', token)

      if (userType) localStorage.setItem('userType', userType)
      else localStorage.removeItem('userType')

      if (username) localStorage.setItem('username', username)
      else localStorage.removeItem('username')

      //  onboarded 저장
      if (onboarded !== null) {
        localStorage.setItem('onboarded', String(onboarded))
        console.log('[AuthSlice] 온보딩 상태 저장:', onboarded)
      } else {
        localStorage.removeItem('onboarded')
        console.warn('[AuthSlice] 온보딩 상태를 추출할 수 없음')
      }

      return { token, userType, username, onboarded } 
    } catch (e: any) {
      return rejectWithValue(e?.message ?? '로그인 실패')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      if (action.payload) localStorage.setItem('jwtToken', action.payload)
      else localStorage.removeItem('jwtToken')
    },
    logout(state) {
      state.token = null
      state.userType = null
      state.username = null
      state.onboarded = null
      state.loading = false
      state.error = null
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('username')
      localStorage.removeItem('onboarded')
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.userType = action.payload.userType
        state.username = action.payload.username ?? null
        state.onboarded = action.payload.onboarded ?? null 
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload ?? '로그인 실패')
      })
  },
})

export const { logout, setToken } = authSlice.actions
export default authSlice.reducer
