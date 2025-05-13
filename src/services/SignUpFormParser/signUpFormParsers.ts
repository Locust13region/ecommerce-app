import { formData } from '@/consts/signUpFormConsts'
import type { CreateCustomerData, FormData } from '@/interfaces/signUpFormInterfaces'
import { countriesSelect } from '@/consts/signUpFormConsts'

export function parseSignUpInputDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

export function parseSignUpDate(dateStr: string): string {
  const date = parseSignUpInputDate(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  return date.toLocaleDateString('en-US', options).split('/').reverse().join('-')
}

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
  const dateOfBirth = parseSignUpDate(signUpFormData.birthDate)
  return {
    email: signUpFormData.email,
    firstName: signUpFormData.firstName,
    lastName: signUpFormData.lastName,
    password: signUpFormData.password,
    city: signUpFormData.city,
    postalCode: signUpFormData.postalCode,
    country: countryCode,
    birthDate: dateOfBirth,
    streetName,
    streetNumber,
  }
}
