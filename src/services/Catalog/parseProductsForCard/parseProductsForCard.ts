import type { ProductCardItem } from '@/interfaces/catalogInterfaces'
import type { Product } from '@commercetools/platform-sdk'

export function parseProductsForCards(productsData: Product[]): ProductCardItem[] {
  return productsData.map((product) => {
    const title = product.masterData.current.name?.['en-US'] ?? ''
    const price =
      product.masterData.current.masterVariant.prices?.find(
        (item) => item.value.currencyCode === 'USD',
      )?.value.centAmount || product.masterData.current.masterVariant.price
    const parsedPrice = formatPrice(price as number)

    const description = product.masterData.current.description?.['en-US'] ?? ''
    const shortDescription = getShortDescription(description)

    const imageURL = product.masterData.current.masterVariant.images?.[0].url ?? ''

    return {
      title,
      price: parsedPrice,
      shortDescription,
      imageURL,
    }
  })
}

function formatPrice(cents: number, locale: string = 'en-US', currency: string = 'USD'): string {
  const dollars = cents / 100
  return dollars.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getShortDescription(description: string, limit: number = 100): string {
  if (description.length <= limit) {
    return description
  }

  return description.slice(0, limit).trim() + '...'
}
