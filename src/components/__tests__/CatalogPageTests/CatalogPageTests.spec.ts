import { describe, it, expect, beforeEach } from 'vitest'
import {
  mount,
  VueWrapper,
  //VueWrapper
} from '@vue/test-utils'
import PrimeVue from 'primevue/config'
//import ToastService from 'primevue/toastservice'
// import router from '@/router'
//import FormInputField from '@/components/FormInputField/FormInputField'
import Paginator from 'primevue/paginator'
import { Slider, Card, Button } from 'primevue'
import PaginatorComponent from '/Users/roman.kargin/Documents/GitHub/ecommerce-app/src/components/Paginator/PaginatorComponent.vue'
import ProductCard from '/Users/roman.kargin/Documents/GitHub/ecommerce-app/src/components/ProductCard/ProductCard.vue'

describe('Paginator', () => {
  it('Paginator: buttons exists', async () => {
    const wrapper = mount(PaginatorComponent, {
      props: {
        totalRecords: 12,
        rows: 3,
        currentPage: 0,
      },
      global: {
        plugins: [PrimeVue],
        components: {
          Paginator,
        },
      },
    })

    const pageButton = wrapper.find('button.p-paginator-page.p-paginator-page-selected')
    expect(pageButton.exists()).toBe(true)

    const page1Button = wrapper.find('[aria-label="Page 1"]')
    expect(page1Button.exists()).toBe(true)
  })

  it('Paginator: buttons value is correct', async () => {
    const wrapper = mount(PaginatorComponent, {
      props: {
        totalRecords: 12,
        rows: 3,
        currentPage: 0,
      },
      global: {
        plugins: [PrimeVue],
        components: {
          Paginator,
        },
      },
    })

    const pageButton = wrapper.find('button.p-paginator-page.p-paginator-page-selected')
    expect(pageButton.exists()).toBe(true)

    const page1Button = wrapper.find('[aria-label="Page 1"]')
    expect(page1Button.exists()).toBe(true)

    expect(page1Button.text()).toContain('1')

    const page2Button = wrapper.find('[aria-label="Page 2"]')
    expect(page2Button.exists()).toBe(true)

    expect(page2Button.text()).toContain('2')
  })

  it('Price Range: exists on the page', async () => {
    const wrapper = mount(Slider, {
      props: {
        min: 0,
        max: 1599,
        range: true,
      },
      global: {
        plugins: [PrimeVue],
        components: {
          Slider,
        },
      },
    })

    const priceSlider = wrapper.find('.p-slider')
    expect(priceSlider.exists()).toBe(true)
  })
})

describe('ProductCard', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(ProductCard, {
      props: {
        title: 'Alice in Wonderland',
        price: '$14.99',
        discountedPrice: '$9.99',
        shortDescription: 'Example of short description',
        imageURL: 'https://example.com',
        slug: 'alice-in-wonderland',
      },
      global: {
        plugins: [PrimeVue],
        components: {
          Card,
          Button,
        },
      },
    })
  })

  it('ProductCard: Exists', async () => {
    const productCard = wrapper.find('.product-card-link')
    expect(productCard.exists()).toBe(true)
  })

  it('ProductCard: Title props parses correctly', () => {
    const title = wrapper.find('[data-pc-section="title"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toContain('Alice in Wonderland')
  })

  it('ProductCard: Price without discount parses correctly', () => {
    const price = wrapper.find('[data-pc-section="subtitle"] .price')
    expect(price.exists()).toBe(true)
    expect(price.text()).toContain('$14.99')
  })

  it('ProductCard: Short Price parses correctly', () => {
    const shortDescription = wrapper.find('[data-pc-section="content"] p')
    expect(shortDescription.exists()).toBe(true)
    expect(shortDescription.text()).toContain('Example of short description')
  })

  it('ProductCard: Image Src and Alt parses correctly', () => {
    const image = wrapper.find('[data-pc-section="header"] img')
    expect(image.exists()).toBe(true)
    expect(image.attributes())
    expect(image.attributes('src')).toBe('https://example.com')
    expect(image.attributes('alt')).toBe('Alice in Wonderland')
  })

  it('ProductCard: Discounted price parses correctly', () => {
    const discountedPrice = wrapper.find('[data-pc-section="subtitle"] .highlighted')
    expect(discountedPrice.exists()).toBe(true)
    expect(discountedPrice.text()).toContain('$9.99')
  })
})
