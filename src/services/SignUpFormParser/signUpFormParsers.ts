import { formData } from '@/consts/signUpFormConsts'
import type { CreateCustomerData, FormData } from '@/interfaces/signUpFormInterfaces'
import { countriesSelect } from '@/consts/signUpFormConsts'

export function parseStreet(street: string) {
  const streetParts = street.split(' ')
  const streetName = streetParts.slice(0, -1).join(' ')
  const streetNumber = streetParts[streetParts.length - 1]
  return { streetName, streetNumber }
}

export function getCountryCode(countryName: string): string | undefined {
  for (const country of countriesSelect.value) {
    if (country.name === countryName) {
      return country.code
    }
  }
  return undefined
}

export function parseSignUpFormData(signUpFormData: FormData): CreateCustomerData {
  const { streetName, streetNumber } = parseStreet(formData.value.street)
  const countryCode = getCountryCode(signUpFormData.country) || ''
  return {
    email: signUpFormData.email,
    firstName: signUpFormData.firstName,
    lastName: signUpFormData.lastName,
    password: signUpFormData.password,
    city: signUpFormData.city,
    postalCode: signUpFormData.postalCode,
    country: countryCode,
    birthDate: signUpFormData.birthDate,
    streetName,
    streetNumber,
  }
}
