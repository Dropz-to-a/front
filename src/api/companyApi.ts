import { AxiosError } from 'axios'
import apiClient from './Api'

type ApiErrorRes = { code?: string; message?: string }

const parseAxiosError = (e: unknown) => {
  const err = e as AxiosError<ApiErrorRes>
  return {
    status: err.response?.status,
    code: err.response?.data?.code,
    message: err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.',
  }
}

export type Team = {
  teamId: number
  name: string
  description?: string
}

export type CreateTeamRequest = {
  name: string
  description?: string
}

export type AssignEmployeeRequest = {
  employeeId: number
  teamId: number
}

export type RegisterEmployeeRequest = {
  employeeId: number
}

export type EmployeeInfo = {
  employeeAccountId: number
  name: string
  teamId: number | null
  teamName: string | null
  joinedAt: string
}

export const companyApi = {
  /** 부서(팀) 목록 조회 */
  async getTeams() {
    try {
      const { data } = await apiClient.get<Team[]>('/api/company/manage/teams')
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.getTeams]', error)
      throw error
    }
  },

  /** 직원 목록 조회 (부서 포함) */
  async getEmployees() {
    try {
      const { data } = await apiClient.get<EmployeeInfo[]>('/api/company/manage/employees')
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.getEmployees]', error)
      throw error
    }
  },

  /** 부서(팀) 생성 */
  async createTeam(body: CreateTeamRequest) {
    try {
      const { data } = await apiClient.post<Team>('/api/company/manage/teams', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.createTeam]', error)
      throw error
    }
  },

  /** 직원 부서 최초 지정 */
  async assignEmployee(body: AssignEmployeeRequest) {
    try {
      const { data } = await apiClient.post<string>('/api/company/manage/teams/assign', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.assignEmployee]', error)
      throw error
    }
  },

  /** 직원 등록 */
  async registerEmployee(body: RegisterEmployeeRequest) {
    try {
      const { data } = await apiClient.post<string>('/api/company/assign-employee', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.registerEmployee]', error)
      throw error
    }
  },

  /** 직원 부서 변경 */
  async changeEmployeeTeam(body: AssignEmployeeRequest) {
    try {
      const { data } = await apiClient.patch<string>('/api/company/manage/teams/change', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.changeEmployeeTeam]', error)
      throw error
    }
  },

  /** 부서(팀) 삭제 */
  async deleteTeam(teamId: number) {
    try {
      const { data } = await apiClient.delete<string>(`/api/company/manage/teams/${teamId}`)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.deleteTeam]', error)
      throw error
    }
  },

  /** 직원 해제 */
  async removeEmployee(employeeId: number) {
    try {
      const { data } = await apiClient.delete<string>('/api/company/remove-employee', {
        params: { employeeId },
      })
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[companyApi.removeEmployee]', error)
      throw error
    }
  },
}

