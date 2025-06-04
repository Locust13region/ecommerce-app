import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref } from 'vue'

export const personalDataValidator = ref(
  zodResolver(
    z.object({
      firstName: z.string().min(1, { message: 'Name is required.' }).nullable(),
      lastName: z.string().min(1, { message: 'Last name is required' }).nullable(),
      dateOfBirth: z.coerce.date().refine(
        (date) => {
          const minAgeDate = new Date()
          minAgeDate.setFullYear(minAgeDate.getFullYear() - 13)
          return date <= minAgeDate
        },
        {
          message: 'You must be at least 13 years old',
        },
      ),
      email: z
        .string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email address.' }),
      currentPassword: z
        .string()
        .min(8, { message: 'Minimum 8 characters.' })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Must have a lowercase letter.',
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Must have an uppercase letter.',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Must have a number.',
        })
        .refine((value) => /[!@#$%^&*]/.test(value), {
          message: 'Must have at least one special character (e.g., !@#$%^&*)',
        })
        .refine((value) => /^[^\s]+$/.test(value), {
          message: 'Password cannot contain spaces.',
        }),
      newPassword: z
        .string()
        .min(8, { message: 'Minimum 8 characters.' })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Must have a lowercase letter.',
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Must have an uppercase letter.',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Must have a number.',
        })
        .refine((value) => /[!@#$%^&*]/.test(value), {
          message: 'Must have at least one special character (e.g., !@#$%^&*)',
        })
        .refine((value) => /^[^\s]+$/.test(value), {
          message: 'Password cannot contain spaces.',
        }),

      streetName: z.string().min(1, { message: 'Street is required' }),
      streetNumber: z.string().min(1, { message: 'Street is required' }),
      city: z
        .string()
        .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, {
          message: 'City should contain only letters',
        })
        .min(1, { message: 'City is required' }),
      country: z.object({
        name: z.string(),
        code: z.string(),
      }),
      postalCode: z.string().min(1, { message: 'Postal code is required' }),
    }),
  ),
)
