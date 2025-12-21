import type { FormInputProps } from '@/types'

type FormatKind = 'businessNumber' | 'phone' | undefined

const onlyDigits = (v: string) => v.replace(/\D/g, '')

const formatBizNo = (v: string) => {
  const d = onlyDigits(v).slice(0, 10) // 사업자번호는 숫자 10자리
  const a = d.slice(0, 3)
  const b = d.slice(3, 5)
  const c = d.slice(5, 10)
  return [a, b, c].filter(Boolean).join('-') // 3-2-5
}

export function FormInput<T extends Record<string, unknown>>({
  className,
  label,
  name,
  placeholder,
  type = 'text',
  value, // register
  rules,
  error,
  min,
  max,
  readOnly,
  format, //  추가
  disabled, // disabled prop 추가
}: FormInputProps<T> & { format?: FormatKind; disabled?: boolean }) {
  const reg = value(name, {
    ...rules,
    ...(format === 'businessNumber'
      ? {
          setValueAs: (v: unknown) => onlyDigits(String(v ?? '')).slice(0, 10), //  백엔드는 숫자만
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value
            e.target.value = formatBizNo(raw) // 화면은 888-88-88888
          },
        }
      : {}),
  })

  return (
    <div className="flex flex-col items-start w-full mb-2">
      <label className="mb-2" htmlFor={String(name)}>
        {label}
      </label>

      <input
        id={String(name)}
        type={type}
        min={min}
        max={max}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={format === 'businessNumber' ? 12 : undefined} // 10 + 하이픈2
        inputMode={format === 'businessNumber' ? 'numeric' : undefined}
        className={`${className} w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...reg}
      />

      <small className="font-semibold text-red-500 min-h-5" role="alert">
        {error && error.message}
      </small>
    </div>
  )
}
