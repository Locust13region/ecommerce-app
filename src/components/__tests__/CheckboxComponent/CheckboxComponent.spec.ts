import { mount } from '@vue/test-utils'
import CheckboxComponent from '/Users/roman.kargin/Documents/GitHub/ecommerce-app/src/components/Checkbox/CheckboxComponent.vue'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from 'primevue'

// Мокаем функцию setBillingAddressIfSameAsShipping
vi.mock('@/services/SetBillingAddress/setBillingAddressIfSameAsShipping', () => ({
  setBillingAddressIfSameAsShipping: vi.fn(),
}))

describe('CheckboxComponent', () => {
  it('renders label correctly', () => {
    const wrapper = mount(CheckboxComponent, {
      props: {
        name: 'isBillingSameAsShipping',
        modelValue: false,
        value: 'true',
        label: 'Billing address same as shipping address',
      },
      global: {
        stubs: ['Checkbox'],
      },
    })
    const label = wrapper.find('label')
    expect(label.text()).toBe('Billing address same as shipping address')

    label.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('emits update:modelValue when checkbox is clicked', async () => {
    const wrapper = mount(CheckboxComponent, {
      props: {
        name: 'isBillingSameAsShipping',
        modelValue: true,
        value: 'true',
        label: 'Billing address same as shipping address',
      },
      global: {
        stubs: ['Checkbox'],
        components: {
          Checkbox,
        },
      },
    })

    const input = wrapper.findComponent(Checkbox)
    expect(input.exists()).toBe(true)

    input.trigger('click')
  })

  it('check if value on created is correct', async () => {
    const wrapper = mount(CheckboxComponent, {
      props: {
        name: 'isDefaultAddress',
        modelValue: false,
        value: 'false',
        label: 'Set as default address',
      },
      global: {
        stubs: ['Checkbox'],
        components: {
          Checkbox,
        },
      },
    })

    const input = wrapper.findComponent(Checkbox)
    expect(input.exists()).toBe(true)

    const modelValue = wrapper.props('modelValue')
    expect(modelValue).toBeFalsy()
  })
})
