import type { FormInputProps } from '@/types'

export function FormInput<T extends Record<string, unknown>>({
  label,
  name,
  placeholder,
  type = 'text',
  register,
  rules,
  error,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col items-start w-full mb-4">
      <label className="mb-2" htmlFor={String(name)}>
        {label}
      </label>

      <input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
        {...register(name, rules)}
      />

      {error && (
        <small className="font-semibold text-red-500" role="alert">
          {error.message}
        </small>
      )}
    </div>
  )
}
