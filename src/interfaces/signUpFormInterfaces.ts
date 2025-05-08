export interface ValidationResult {
  valid: boolean
  message?: string
}

export interface FormFieldConfig {
  key: string | keyof FormData
  label: string
  type: string
}

export interface FormData {
  email: string
  firstName: string
  lastName: string
  password: string
  city: string
  street: string
  postalCode: string
  country: string
}

export interface FormErrors {
  email?: string
  firstName?: string
  lastName?: string
  password?: string
  city?: string
  street?: string
  postalCode?: string
  country?: string
}

export type FieldValidator = (value: string, fieldName?: string) => ValidationResult

export type FormErrorsType = Partial<Record<keyof FormData, string>>

export type ValidatorFn = (value: string, fieldName: string) => { valid: boolean; message?: string }
