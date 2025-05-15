import { formData } from '@/consts/signUpFormConsts'

export const setBillingAddressIfSameAsShipping = () => {
  if (formData.value.isBillingSameAsShipping) {
    formData.value.billingStreet = formData.value.street
    formData.value.billingCity = formData.value.city
    formData.value.billingPostalCode = formData.value.postalCode
    formData.value.billingCountry = formData.value.country
  }
}
