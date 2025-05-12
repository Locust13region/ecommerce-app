import type { ValidationResult } from '@/interfaces/interfaces'

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { valid: false, message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }

  return { valid: true }
}

export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name) {
    return { valid: false, message: `${fieldName} is required` }
  }

  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ]+$/
  if (!nameRegex.test(name)) {
    return { valid: false, message: `${fieldName} should contain only letters` }
  }

  return { valid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit' }
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' }
  }

  return { valid: true }
}
