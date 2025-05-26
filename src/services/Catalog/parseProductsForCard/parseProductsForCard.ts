import type { ProductCardItem } from '@/interfaces/catalogInterfaces'
import type { Product } from '@commercetools/platform-sdk'

export function parseProductsForCards(productsData: Product[]): ProductCardItem[] {
  return productsData.map((product) => {
    const currentProduct = product.masterData.current
    const title = currentProduct.name?.['en-US'] ?? ''
    const price =
      currentProduct.masterVariant.prices?.find((item) => item.value.currencyCode === 'USD')?.value
        .centAmount || currentProduct.masterVariant.price
    const parsedPrice = formatPrice(price as number)

    const description = currentProduct.description?.['en-US'] ?? ''
    const shortDescription = getShortDescription(description)

    const imageURL = currentProduct.masterVariant.images?.[0].url ?? ''

    const slug = currentProduct.slug?.['en-US'] ?? ''

    return {
      title,
      price: parsedPrice,
      shortDescription,
      imageURL,
      slug,
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
