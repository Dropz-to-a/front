import type { FormInputProps } from '@/types'

export function FormInput<T extends Record<string, unknown>>({
  className,
  label,
  name,
  placeholder,
  type = 'text',
  value,
  rules,
  error,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col items-start w-full mb-2">
      <label className="mb-2" htmlFor={String(name)}>
        {label}
      </label>

      <input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        className={`${className} w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg`}
        {...value(name, rules)}
      />

      <small className="font-semibold text-red-500 min-h-5" role="alert">
        {error && error.message}
      </small>
    </div>
  )
}
