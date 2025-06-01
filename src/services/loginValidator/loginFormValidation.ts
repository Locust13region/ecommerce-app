import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref } from 'vue'

export const loginValidator = ref(
  zodResolver(
    z.object({
      email: z
        .string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email address.' }),
      password: z
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
    }),
  ),
)
