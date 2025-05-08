import { countriesSelect, formData, formErrors } from '@/consts/signUpFormConsts'
import type { CountrySelect, ValidationResult } from '@/interfaces/signUpFormInterfaces'

export const validateInput = (name: string, fieldName: string): ValidationResult => {
  if (!name) {
    return { valid: false, message: `${fieldName} is required` }
  }

  return { valid: true }
}

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

export const validatePostalCode = (postalCode: string): ValidationResult => {
  if (!postalCode) {
    return { valid: false, message: 'Postal code is required' }
  }
  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z0-9] \d[A-Za-z0-9]\d$/
  if (!postalCodeRegex.test(postalCode)) {
    return { valid: false, message: 'Please enter a valid postal code' }
  }
  return { valid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }

  if (password.length < 8) {
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

export const validateCountry = (countryName: string | CountrySelect): ValidationResult => {
  if (!countryName) {
    return { valid: false, message: 'Country is required' }
  }

  if (typeof countryName === 'object') {
    countryName = countryName.name
  }

  if (countriesSelect.value.filter((count) => count.name === countryName).length === 0) {
    return { valid: false, message: `${countryName} is not a valid country` }
  }

  const countryRegex = /^[a-zA-Zа-яА-ЯёЁ]+$/
  if (!countryRegex.test(countryName)) {
    return { valid: false, message: 'Country should contain only letters' }
  }
  return { valid: true }
}

export const validateEmailField = (): boolean => {
  const emailValidation = validateEmail(formData.value.email)
  formErrors.value.email = emailValidation.message || ''
  return emailValidation.valid
}

export const firstNameValidation = (): boolean => {
  const firstNameValidation = validateName(formData.value.firstName, 'First name')
  formErrors.value.firstName = firstNameValidation.message || ''
  return firstNameValidation.valid
}

export const lastNameValidation = (): boolean => {
  const lastNameValidation = validateName(formData.value.lastName, 'Last name')
  formErrors.value.lastName = lastNameValidation.message || ''
  return lastNameValidation.valid
}

export const validateCity = () => {
  const cityValidation = validateName(formData.value.city, 'City')
  formErrors.value.city = cityValidation.message || ''
  return cityValidation.valid
}

export const passwordValidation = (): boolean => {
  const passwordValidation = validatePassword(formData.value.password)
  formErrors.value.password = passwordValidation.message || ''
  return passwordValidation.valid
}

export const validateStreet = () => {
  const streetValidation = validateInput(formData.value.street, 'Street')
  formErrors.value.street = streetValidation.message || ''
  return streetValidation.valid
}

export const postalCodeValidation = () => {
  const postalCodeValidation = validatePostalCode(formData.value.postalCode)
  formErrors.value.postalCode = postalCodeValidation.message || ''
  return postalCodeValidation.valid
}

export const countryValidation = () => {
  const countryValidation = validateCountry(formData.value.country)
  formErrors.value.country = countryValidation.message || ''
  return countryValidation.valid
}

export const validateForm = (): boolean => {
  const isEmailValid = validateEmailField()
  const isFirstNameValid = firstNameValidation()
  const isLastNameValid = lastNameValidation()
  const isPasswordValid = passwordValidation()
  const isStreetValid = validateStreet()
  const isCityValid = validateCity()
  const isPostalCodeValid = postalCodeValidation()
  const isCountryValid = countryValidation()

  return (
    isEmailValid &&
    isFirstNameValid &&
    isLastNameValid &&
    isPasswordValid &&
    isStreetValid &&
    isCityValid &&
    isPostalCodeValid &&
    isCountryValid
  )
}
