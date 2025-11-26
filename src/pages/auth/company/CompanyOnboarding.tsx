import { useForm, Controller, type SubmitHandler } from 'react-hook-form'

type FormValues = {
  cardNumber: string
  expiry: string
  cvc: string
}

const digitsOnly = (v: string) => v.replace(/\D/g, '')

const luhnCheck = (num: string) => {
  // num: digits only
  let sum = 0
  let shouldDouble = false
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

const formatCardNumber = (v: string) => {
  const d = digitsOnly(v).slice(0, 16)
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

const formatExpiry = (v: string) => {
  const d = digitsOnly(v).slice(0, 4) // MMYY
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

const isValidExpiry = (v: string) => {
  // MM/YY
  if (!/^\d{2}\/\d{2}$/.test(v)) return false
  const [mmStr, yyStr] = v.split('/')
  const mm = parseInt(mmStr, 10)
  const yy = parseInt(yyStr, 10)
  if (mm < 1 || mm > 12) return false

  // 카드 만료는 보통 해당 월의 말일까지 유효. 현재 "월/연도" 기준으로 미래/현재월 유효 처리
  const now = new Date()
  const currYY = now.getFullYear() % 100
  const currMM = now.getMonth() + 1

  // YY가 현재 세기라는 가정(00~99). 필요하면 세기 보정 로직 추가 가능.
  if (yy < currYY) return false
  if (yy === currYY && mm < currMM) return false
  return true
}

export default function CompanyOnboarding() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { cardNumber: '', expiry: '', cvc: '' },
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<FormValues> = data => {
    const payload = {
      cardNumber: digitsOnly(data.cardNumber),
      expiry: digitsOnly(data.expiry),
      cvc: data.cvc,
    }
    console.log(payload)
    alert('기업 카드 정보가 제출되었습니다!')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">기업 온보딩</h2>

        {/* 카드 번호 */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">카드 번호</label>
          <Controller
            name="cardNumber"
            control={control}
            rules={{
              required: '카드 번호를 입력해주세요.',
              validate: {
                len16: v =>
                  digitsOnly(v).length === 16 || '카드 번호는 16자리여야 합니다.',
                luhn: v => luhnCheck(digitsOnly(v)) || '유효하지 않은 카드 번호입니다.',
              },
            }}
            render={({ field }) => (
              <input
                type="text"
                inputMode="numeric"
                value={field.value}
                onChange={e => field.onChange(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                className="w-full px-3 py-2 tracking-widest border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            )}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* 만료일 / CVC */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-600">만료일 (MM/YY)</label>
            <Controller
              name="expiry"
              control={control}
              rules={{
                required: '만료일을 입력해주세요.',
                validate: v =>
                  isValidExpiry(v) || '만료일 형식(MM/YY) 또는 날짜가 유효하지 않습니다.',
              }}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="numeric"
                  value={field.value}
                  onChange={e => field.onChange(formatExpiry(e.target.value))}
                  placeholder="12/27"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              )}
            />
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-500">{errors.expiry.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-600">CVC</label>
            <Controller
              name="cvc"
              control={control}
              rules={{
                required: 'CVC를 입력해주세요.',
                validate: v => /^\d{3}$/.test(v) || 'CVC는 숫자 3자리여야 합니다.',
              }}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="numeric"
                  value={field.value}
                  onChange={e => field.onChange(digitsOnly(e.target.value).slice(0, 3))}
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              )}
            />
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-500">{errors.cvc.message}</p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
          등록하기
        </button>
      </form>
    </div>
  )
}
