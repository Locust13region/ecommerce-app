import { z } from 'zod'
import type { CountrySelect } from '@/interfaces/signUpFormInterfaces'
import { countriesSelect, formData } from '@/consts/signUpFormConsts'
import { parseSignUpInputDate } from '../SignUpFormParser/signUpFormParsers'
import { postcodeValidator } from 'postcode-validator'

export const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(1, { message: 'Email is required' }),

  firstName: z
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'First name should contain only letters',
    })
    .min(1, { message: 'First name is required' }),

  lastName: z
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'Last name should contain only letters',
    })
    .min(1, { message: 'Last name is required' }),

  password: z
    .string()
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one digit',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character',
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .min(1, { message: 'Password is required' }),

  street: z.string().min(1, { message: 'Street is required' }),

  city: z
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'City should contain only letters',
    })
    .min(1, { message: 'City is required' }),

  postalCode: z
    .string()
    .min(1, { message: 'Postal code is required' })
    .refine(
      (data) => {
        let selectedCountry = formData.value.country
        if (
          typeof selectedCountry === 'object' &&
          countriesSelect.value.includes(selectedCountry)
        ) {
          selectedCountry = countriesSelect.value[selectedCountry].name
        }
        const countryCode = countriesSelect.value.find(
          (country) => country.name === selectedCountry,
        )?.code
        console.log(formData.value.country, 'formData country')
        console.log('countryCode', countryCode)
        return postcodeValidator(data, countryCode || 'INTL')
      },
      {
        message: 'Please enter a valid postal code for the selected country',
      },
    ),

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
    .min(1, { message: 'Birth date is required' })
    .refine(
      (dateStr) => {
        const date = parseSignUpInputDate(dateStr)
        return date instanceof Date && !isNaN(date.getTime())
      },
      {
        message: 'Please enter a valid date',
      },
    )
    .refine(
      (dateStr) => {
        const date = parseSignUpInputDate(dateStr)
        const minAgeDate = new Date()
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 13)
        return date <= minAgeDate
      },
      {
        message: 'You must be at least 13 years old',
      },
    ),

  billingStreet: z.string().min(1, { message: 'Street is required' }),

  billingCity: z
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
      message: 'City should contain only letters',
    })
    .min(1, { message: 'City is required' }),

  billingPostalCode: z
    .string()
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z0-9] \d[A-Za-z0-9]\d$/, {
      message: 'Please enter a valid postal code',
    })
    .min(1, { message: 'Postal code is required' }),

  billingCountry: z
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
})
