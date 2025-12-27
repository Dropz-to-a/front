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

export type SaveAmountRequest = {
  orderId: string
  amount: string
}

export type VerifyAmountRequest = {
  orderId: string
  amount: string
}

export type ConfirmPaymentRequest = {
  paymentKey: string
  orderId: string
  amount: string
  backendOrderId: string
}

export type CancelPaymentRequest = {
  paymentKey: string
  cancelReason: string
}

export type ProcessPaymentRequest = {
  orderId: string
  orderName: string
  amount: string
  cardNumber: string
  expiry: string
  birth: string
  password: string
  installment?: string
  customerKey?: string
}

export const paymentApi = {
  /** 개별 연동 결제 처리 (카드 정보 포함) - 백엔드에서 Toss Payments API 호출 */
  async processPayment(body: ProcessPaymentRequest) {
    try {
      const { data } = await apiClient.post('/api/payments/process', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.processPayment]', error)
      throw error
    }
  },
  /** 결제 금액 임시 저장 */
  async saveAmount(body: SaveAmountRequest) {
    try {
      const { data } = await apiClient.post('/api/payments/saveAmount', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.saveAmount]', error)
      throw error
    }
  },

  /** 결제 금액 검증 */
  async verifyAmount(body: VerifyAmountRequest) {
    try {
      const { data } = await apiClient.post('/api/payments/verifyAmount', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.verifyAmount]', error)
      throw error
    }
  },

  /** 결제 승인 요청 */
  async confirm(body: ConfirmPaymentRequest) {
    try {
      const { data } = await apiClient.post('/api/payments/confirm', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.confirm]', error)
      throw error
    }
  },

  /** 결제 취소 */
  async cancel(body: CancelPaymentRequest) {
    try {
      const { data } = await apiClient.post('/api/payments/cancel', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.cancel]', error)
      throw error
    }
  },

  /** 결제 정보 조회 */
  async getPayment(orderId: string) {
    try {
      const { data } = await apiClient.get(`/api/payments/${orderId}`)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[paymentApi.getPayment]', error)
      throw error
    }
  },
}

