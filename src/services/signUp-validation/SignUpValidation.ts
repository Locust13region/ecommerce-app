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
