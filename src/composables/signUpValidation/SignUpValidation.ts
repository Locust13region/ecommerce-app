import { z } from 'zod'
import { countriesSelect } from '@/consts/signUpFormConsts'

import { signUpSchema } from '../../services/CustomerValidationScheme/CustomerValidationScheme'

import { setBillingAddressIfSameAsShipping } from '@/services/SetBillingAddress/setBillingAddressIfSameAsShipping'

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
      setBillingAddressIfSameAsShipping()
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
  const validateBillingCityField = () => validateField('billingCity')
  const validateBillingStreetField = () => validateField('billingStreet')
  const validateBillingPostalCodeField = () => validateField('billingPostalCode')
  const validateBillingCountryField = () => validateField('billingCountry')

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
    validateBillingCityField,
    validateBillingStreetField,
    validateBillingPostalCodeField,
    validateBillingCountryField,
  }
}
