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
  birthDate: string
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
  birthDate?: string
}

export interface CountrySelect {
  name: string
  code: string
}

export interface CreateCustomerData extends Omit<FormData, 'street'> {
  streetName: string
  streetNumber: string
}

export type FieldValidator = (value: string, fieldName?: string) => ValidationResult

export type FormErrorsType = Partial<Record<keyof FormData, string>>

export type ValidatorFn = (value: string, fieldName: string) => { valid: boolean; message?: string }

export interface CommerceToolsError {
  name: string
  message: string
  code: number
  statusCode: number
  status: number
  body: {
    statusCode: number
    message: string
    errors: CommerceToolsFieldError[]
  }
  headers: {
    [key: string]: string
  }
  originalRequest: {
    baseUri: string
    method: string
    uriTemplate: string
    pathVariables: {
      [key: string]: string
    }
    headers: {
      [key: string]: string
    }
    body: Record<string, unknown>
    uri: string
    queryParams?: Record<string, string>
  }
  retryCount: number
  stack?: string
}

export interface CommerceToolsFieldError {
  code: string
  message: string
  field?: string
  duplicateValue?: string
}
