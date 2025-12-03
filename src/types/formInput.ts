import type { RegisterOptions, UseFormRegister, FieldError, Path } from 'react-hook-form'

export type FormInputProps<T extends object> = {
  label: string
  name: Path<T>
  placeholder?: string
  type?: string
  register: UseFormRegister<T>
  rules?: RegisterOptions<T, Path<T>>
  error?: FieldError
}
