import { z } from 'zod'
import type { CountrySelect } from '@/interfaces/signUpFormInterfaces'
import { countriesSelect } from '@/consts/signUpFormConsts'
import { parseSignUpInputDate } from '../SignUpFormParser/signUpFormParsers'

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
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z0-9] \d[A-Za-z0-9]\d$/, {
      message: 'Please enter a valid postal code',
    })
    .min(1, { message: 'Postal code is required' }),

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
// billingStreet: isBillingAddressSameAsShipping
//   ? z.string().optional()
//   : z.string().min(1, { message: 'Street is required' }),

// billingCity: isBillingAddressSameAsShipping
//   ? z.string().optional()
//   : z
//       .string()
//       .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
//         message: 'City should contain only letters',
//       })
//       .min(1, { message: 'City is required' }),

// billingPostalCode: isBillingAddressSameAsShipping
//   ? z.string().optional()
//   : z
//       .string()
//       .regex(/^[0-9]{5}(?:-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z0-9] \d[A-Za-z0-9]\d$/, {
//         message: 'Please enter a valid postal code',
//       })
//       .min(1, { message: 'Postal code is required' }),

// billingCountry: isBillingAddressSameAsShipping
//   ? z.string().optional()
//   : z
//       .string()
//       .min(1, { message: 'Country is required' })
//       .refine(
//         (val: string | CountrySelect) => {
//           if (typeof val === 'object') {
//             val = val.name
//           }

//           return countriesSelect.value.some((country) => country.name === val)
//         },
//         {
//           message: 'Not a valid country',
//         },
//       ),

// .superRefine((data, ctx) => {
//   if (!data.isBillingSameAsShipping) {
//     if (!data.billingCity) {
//       ctx.addIssue({
//         path: ['billingCity'],
//         code: z.ZodIssueCode.custom,
//         message: 'Город для платежного адреса обязателен',
//       })
//     }
//     if (!data.billingStreet) {
//       ctx.addIssue({
//         path: ['billingStreet'],
//         code: z.ZodIssueCode.custom,
//         message: 'Улица для платежного адреса обязательна',
//       })
//     }
//     if (!data.billingPostalCode) {
//       ctx.addIssue({
//         path: ['billingPostalCode'],
//         code: z.ZodIssueCode.custom,
//         message: 'Почтовый индекс для платежного адреса обязателен',
//       })
//     }
//     if (!data.billingCountry) {
//       ctx.addIssue({
//         path: ['billingCountry'],
//         code: z.ZodIssueCode.custom,
//         message: 'Страна для платежного адреса обязательна',
//       })
//     }
//   }
// })

/*
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
*/
