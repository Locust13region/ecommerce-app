import { mount } from '@vue/test-utils'
import CheckboxComponent from '@/components/Checkbox/CheckboxComponent.vue'
import { describe, it, expect } from 'vitest'
import { Checkbox } from 'primevue'

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
