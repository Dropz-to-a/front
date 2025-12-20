import type { RegisterOptions, UseFormRegister, FieldError, Path } from 'react-hook-form'

export type FormInputProps<T extends object> = {
  className?: string
  label: string
  name: Path<T>
  placeholder?: string
  type?: string
  value: UseFormRegister<T>
  rules?: RegisterOptions<T, Path<T>>
  error?: FieldError
  min?: string
  max?: string
  readOnly?: boolean
}
