import { toast } from 'react-toastify'

const baseOptions = {
  position: 'top-center' as const,
  autoClose: 1200,
}

/** 성공 토스트 */
export const showSuccessToast = (message: string) =>
  toast.success(message, {
    ...baseOptions,
    toastId: message, // 같은 메시지는 1번만
  })

/** 에러 토스트 */
export const showErrorToast = (message: string) =>
  toast.error(message, {
    ...baseOptions,
    toastId: message,
  })

/** 정보 토스트 */
export const showInfoToast = (message: string) =>
  toast.info(message, {
    ...baseOptions,
    toastId: message,
  })

/** 경고 토스트 */
export const showWarningToast = (message: string) =>
  toast.warn(message, {
    ...baseOptions,
    toastId: message,
  })
