import { z } from 'zod'
import { countriesSelect } from '@/consts/signUpFormConsts'
import type { CountrySelect } from '@/interfaces/signUpFormInterfaces'

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),

  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'First name should contain only letters',
    }),

  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'Last name should contain only letters',
    }),

  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one digit',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character',
    })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  street: z.string().min(1, { message: 'Street is required' }),

  city: z
    .string()
    .min(1, { message: 'City is required' })
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'City should contain only letters',
    }),

  postalCode: z
    .string()
    .min(1, { message: 'Postal code is required' })
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z0-9] \d[A-Za-z0-9]\d$/, {
      message: 'Please enter a valid postal code',
    }),

  country: z
    .string()
    .min(1, { message: 'Country is required' })
    .refine(
      (val: string | CountrySelect) => {
        if (typeof val === 'object') {
          val = val.name
        }

        return countriesSelect.value.some((country) => country.name === val)
      },
      {
        message: 'Not a valid country',
      },
    ),

  birthDate: z
    .string()
    // .min(1, { message: 'Birth date is required' })
    // .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, {
    //   message: 'Please enter a valid date in DD/MM/YYYY format'
    // })
    .refine(
      (dateStr) => {
        const date = parseDate(dateStr)
        return date instanceof Date && !isNaN(date.getTime())
      },
      {
        message: 'Please enter a valid date',
      },
    )
    .refine(
      (dateStr) => {
        const date = parseDate(dateStr)
        const minAgeDate = new Date()
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 13)
        return date <= minAgeDate
      },
      {
        message: 'You must be at least 13 years old',
      },
    ),
})

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

export type SignUpFormData = z.infer<typeof signUpSchema>

import {
  formData as existingFormData,
  formErrors as existingFormErrors,
} from '@/consts/signUpFormConsts'

export function useSignUpForm() {
  const formData = existingFormData
  const formErrors = existingFormErrors

  const validateField = (field: keyof SignUpFormData) => {
    try {
      if (
        typeof formData.value[field] === 'object' &&
        countriesSelect.value.includes(formData.value[field])
      ) {
        const country = countriesSelect.value.indexOf(formData.value[field])
        formData.value[field] = countriesSelect.value[country].name
      }

      const fieldSchema = z.object({ [field]: signUpSchema.shape[field] })
      fieldSchema.parse({ [field]: formData.value[field] })
      formErrors.value[field] = ''
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === field)
        formErrors.value[field] = fieldError?.message || ''
      }
      return false
    }
  }

  const validateForm = () => {
    try {
      signUpSchema.parse(formData.value)
      Object.keys(formErrors.value).forEach((key) => {
        formErrors.value[key as keyof SignUpFormData] = ''
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof SignUpFormData
          formErrors.value[field] = err.message
        })
      }
      return false
    }
  }

  const validateEmailField = () => validateField('email')
  const validateFirstName = () => validateField('firstName')
  const validateLastName = () => validateField('lastName')
  const validatePasswordField = () => validateField('password')
  const validateStreetField = () => validateField('street')
  const validateCityField = () => validateField('city')
  const validatePostalCodeField = () => validateField('postalCode')
  const validateCountryField = () => validateField('country')
  const validateBirthDateField = () => validateField('birthDate')

  return {
    formData,
    formErrors,
    validateField,
    validateForm,
    validateEmailField,
    validateFirstName,
    validateLastName,
    validatePasswordField,
    validateStreetField,
    validateCityField,
    validatePostalCodeField,
    validateCountryField,
    validateBirthDateField,
  }
}

export const validateEmailField = () => {
  try {
    signUpSchema.shape.email.parse(existingFormData.value.email)
    existingFormErrors.value.email = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.email = error.errors[0].message
    }
    return false
  }
}

export const firstNameValidation = () => {
  try {
    signUpSchema.shape.firstName.parse(existingFormData.value.firstName)
    existingFormErrors.value.firstName = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.firstName = error.errors[0].message
    }
    return false
  }
}

export const lastNameValidation = () => {
  try {
    signUpSchema.shape.lastName.parse(existingFormData.value.lastName)
    existingFormErrors.value.lastName = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.lastName = error.errors[0].message
    }
    return false
  }
}

export const passwordValidation = () => {
  try {
    signUpSchema.shape.password.parse(existingFormData.value.password)
    existingFormErrors.value.password = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.password = error.errors[0].message
    }
    return false
  }
}

export const validateStreet = () => {
  try {
    signUpSchema.shape.street.parse(existingFormData.value.street)
    existingFormErrors.value.street = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.street = error.errors[0].message
    }
    return false
  }
}

export const validateCity = () => {
  try {
    signUpSchema.shape.city.parse(existingFormData.value.city)
    existingFormErrors.value.city = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.city = error.errors[0].message
    }
    return false
  }
}

export const postalCodeValidation = () => {
  try {
    signUpSchema.shape.postalCode.parse(existingFormData.value.postalCode)
    existingFormErrors.value.postalCode = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.postalCode = error.errors[0].message
    }
    return false
  }
}

export const countryValidation = () => {
  try {
    signUpSchema.shape.country.parse(existingFormData.value.country)
    existingFormErrors.value.country = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.country = error.errors[0].message
    }
    return false
  }
}

export const validateDateField = () => {
  try {
    signUpSchema.shape.birthDate.parse(existingFormData.value.birthDate)
    existingFormErrors.value.birthDate = ''
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      existingFormErrors.value.birthDate = error.errors[0].message
    }
    return false
  }
}

export const validateForm = () => {
  try {
    signUpSchema.parse(existingFormData.value)

    Object.keys(existingFormErrors.value).forEach((key) => {
      existingFormErrors.value[key as keyof SignUpFormData] = ''
    })

    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignUpFormData
        existingFormErrors.value[field] = err.message
      })
    }
    return false
  }
}

export const validateInput = (name: string, fieldName: string) => {
  if (!name) {
    return { valid: false, message: `${fieldName} is required` }
  }
  return { valid: true, message: '' }
}

export const validateName = (name: string, fieldName: string) => {
  try {
    const schema = z
      .string()
      .min(1, { message: `${fieldName} is required` })
      .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, { message: `${fieldName} should contain only letters` })

    schema.parse(name)
    return { valid: true, message: '' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, message: error.errors[0].message }
    }
    return { valid: false, message: `Invalid ${fieldName}` }
  }
}

export const validateCountry = (countryName: string | CountrySelect) => {
  const name = typeof countryName === 'object' ? countryName.name : countryName

  try {
    signUpSchema.shape.country.parse(name)
    return { valid: true, message: '' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, message: error.errors[0].message }
    }
    return { valid: false, message: 'Invalid country' }
  }
}

export const validatePostalCode = (postalCode: string) => {
  try {
    signUpSchema.shape.postalCode.parse(postalCode)
    return { valid: true, message: '' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, message: error.errors[0].message }
    }
    return { valid: false, message: 'Invalid postal code' }
  }
}

export const validateDate = (date: string | Date) => {
  const dateStr = typeof date === 'string' ? date : formatDate(date)

  try {
    signUpSchema.shape.birthDate.parse(dateStr)
    return { valid: true, message: '' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, message: error.errors[0].message }
    }
    return { valid: false, message: 'Invalid date' }
  }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
