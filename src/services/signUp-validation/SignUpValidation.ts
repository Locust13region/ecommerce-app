import { z } from 'zod'
import { countriesSelect } from '@/consts/signUpFormConsts'
import type { CountrySelect } from '@/interfaces/signUpFormInterfaces'
import { parseDate } from '../ParseDate/parseDate'

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
