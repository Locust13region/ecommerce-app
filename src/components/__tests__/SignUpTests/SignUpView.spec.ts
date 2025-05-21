import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import SignUpView from '@/views/SignUpView.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import router from '@/router'
import FormInputField from '@/components/FormInputField/FormInputField.vue'
import { InputText, Message, Select } from 'primevue'
import { useSignUpForm } from '@/composables/signUpValidation/SignUpValidation'
import { formData, formErrors } from '@/consts/signUpFormConsts'
import { nextTick } from 'vue'
import SignUpFormCountry from '@/components/signUp/SignUpFormCountry.vue'

const { validateEmailField, validateField } = useSignUpForm()

describe('SignUpView', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          media: '',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }
      }
  })

  beforeEach(async () => {
    wrapper = mount(SignUpView, {
      global: {
        plugins: [PrimeVue, ToastService, router],
        stubs: [
          'FormInputField',
          'SignUpPassword',
          'SignUpBirthDate',
          'countrySelect',
          'CheckboxComponent',
          'SignUpForm',
          'RouterLink',
        ],
      },
    })
    router.push('/')
    await router.isReady()
  })

  it('find H1 text', () => {
    expect(wrapper.find('h1').text()).toContain('You are new here? Create your account!')
  })
})

describe('SignUpForm', () => {
  it('Form Input Field insode SignUp Form renders properly', () => {
    const wrapper = mount(SignUpForm, {
      global: {
        plugins: [PrimeVue, ToastService, router],
        stubs: [
          'FormInputField',
          'SignUpPassword',
          'SignUpBirthDate',
          'countrySelect',
          'CheckboxComponent',
        ],
        components: {
          FormInputField,
        },
      },
    })
    const formInputField = wrapper.findComponent(FormInputField)
    expect(formInputField.exists()).toBe(true)
  })
  it('Form Input Field inside SignUp Form renders properly with props', () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'email',
        modelValue: '',
        type: 'text',
        label: 'Email',
        placeholder: 'Email',
        errorMessage: '',
        validate: () => validateEmailField(),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        stubs: ['FormInputField', 'InputText'],
        components: {
          FormInputField,
          InputText,
        },
      },
    })
    const inputText = wrapper.findComponent(InputText)
    expect(inputText.exists()).toBe(true)

    inputText.setValue('test@test.test')

    const emitted = wrapper.emitted('update:modelValue')

    expect(emitted![0][0]).toEqual('test@test.test')
  })

  it('Email input: set correct email on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'email',
        modelValue: '',
        type: 'text',
        label: 'Email',
        placeholder: 'Email',
        errorMessage: '',
        validate: vi.fn(),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('test@test.test')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('test@test.test')
  })

  it('Email input: set correct error message on invalid input', async () => {
    formData.value.email = ''
    formErrors.value.email = ''

    const wrapper = mount(FormInputField, {
      props: {
        name: 'email',
        modelValue: formData.value.email,
        type: 'text',
        label: 'Email',
        placeholder: 'Email',
        errorMessage: formErrors.value.email,
        //validate: validateField('email'),
        validate: () => validateField('email'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('12345')
    await input.trigger('blur')
    await nextTick()

    await validateField('email')

    await wrapper.setProps({ error: formErrors.value.email })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('Please enter a valid email address')
  })

  it('First Name input: set correct first name on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'firstName',
        modelValue: '',
        type: 'text',
        label: 'First Name',
        placeholder: 'First Name',
        errorMessage: '',
        validate: () => validateField('firstName'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('John')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('John')
  })
  it('First Name input: set correct error message on invalid input', async () => {
    formData.value.firstName = ''
    formErrors.value.firstName = ''

    const wrapper = mount(FormInputField, {
      props: {
        name: 'firstName',
        modelValue: formData.value.firstName,
        type: 'text',
        label: 'First Name',
        placeholder: 'First Name',
        errorMessage: formErrors.value.firstName,
        validate: () => validateField('firstName'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('12345')
    await input.trigger('blur')
    await nextTick()

    await validateField('firstName')

    await wrapper.setProps({ error: formErrors.value.firstName })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('First name should contain only letters')
  })

  it('Last Name input: set correct last name on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'lastName',
        modelValue: '',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Last Name',
        errorMessage: '',
        validate: () => validateField('lastName'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('Doe')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('Doe')
  })
  it('Last Name input: set correct error message on invalid input', async () => {
    formData.value.lastName = ''
    formErrors.value.lastName = ''

    const wrapper = mount(FormInputField, {
      props: {
        name: 'lastName',
        modelValue: formData.value.lastName,
        type: 'text',
        label: 'Last Name',
        placeholder: 'Last Name',
        errorMessage: formErrors.value.lastName,
        validate: () => validateField('lastName'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('12345')
    await input.trigger('blur')
    await nextTick()

    await validateField('lastName')

    await wrapper.setProps({ error: formErrors.value.lastName })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('Last name should contain only letters')
  })

  it('Street input: set correct street on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'street',
        modelValue: '',
        type: 'text',
        label: 'Street',
        placeholder: 'Street',
        errorMessage: '',
        validate: () => validateField('street'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('Main St 17')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('Main St 17')
  })
  it('Street input: set correct error message on invalid input', async () => {
    formData.value.street = ''
    formErrors.value.street = ''

    const wrapper = mount(FormInputField, {
      props: {
        name: 'street',
        modelValue: formData.value.street,
        type: 'text',
        label: 'Street',
        placeholder: 'Street',
        errorMessage: formErrors.value.street,
        validate: () => validateField('street'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('12345')
    await input.trigger('blur')
    await nextTick()

    await validateField('street')

    await wrapper.setProps({ error: formErrors.value.street })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('Street is required')
  })
  it('Postal Code input: set correct postal code on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'postalCode',
        modelValue: '',
        type: 'text',
        label: 'Postal Code',
        placeholder: 'Postal Code',
        errorMessage: '',
        validate: () => validateField('postalCode'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('12345')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('12345')
  })
  it('Postal Code input: set correct error message on invalid input', async () => {
    formData.value.postalCode = ''
    formErrors.value.postalCode = ''

    const wrapper = mount(FormInputField, {
      props: {
        name: 'postalCode',
        modelValue: formData.value.postalCode,
        type: 'text',
        label: 'Postal Code',
        placeholder: 'Postal Code',
        errorMessage: formErrors.value.postalCode,
        validate: () => validateField('postalCode'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          InputText,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('123454124124124')
    await input.trigger('blur')
    await nextTick()

    await validateField('postalCode')

    await wrapper.setProps({ error: formErrors.value.postalCode })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('Postal code is required')
  })
  it('Country input: set correct country on input', async () => {
    const wrapper = mount(FormInputField, {
      props: {
        name: 'country',
        modelValue: '',
        type: 'text',
        label: 'Country',
        placeholder: 'Country',
        errorMessage: '',
        validate: () => validateField('country'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          SignUpFormCountry,
          Message,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('United States')
    await input.trigger('blur')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('United States')
  })
  it('Country input: set correct error message on invalid input', async () => {
    formData.value.country = '123'
    formErrors.value.country = ''

    const wrapper = mount(SignUpFormCountry, {
      props: {
        id: 'country',
        modelValue: formData.value.country,
        error: formErrors.value.country,
        validate: () => validateField('country'),
      },
      global: {
        plugins: [PrimeVue, ToastService],
        components: {
          SignUpFormCountry,
          Select,
          Message,
        },
      },
    })

    const input = wrapper.find('#country input')
    expect(input.exists()).toBe(true)

    await input.setValue('Georgia123')
    await input.trigger('blur')
    await nextTick()

    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    await wrapper.setProps({ modelValue: formData.value.country })

    await wrapper.setProps({ error: formErrors.value.country })

    const message = wrapper.find('.p-message-text')
    expect(message.exists()).toBe(true)

    await select.vm.$emit('change', 'Georgia123')
    await validateField('country')

    expect(message.text()).toContain('Not a valid country')
  })
  it('does not show error when country is valid', async () => {
    formData.value.country = ''
    formErrors.value.country = ''

    const wrapper = mount(SignUpFormCountry, {
      props: {
        id: 'country',
        modelValue: formData.value.country,
        error: formErrors.value.country,
        validate: () => validateField('country'),
      },
      global: {
        plugins: [PrimeVue],
        components: { Select, Message },
      },
    })

    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    await select.vm.$emit('input', 'Germany')

    await wrapper.setProps({ error: formErrors.value.country })

    await validateField('country')

    const message = wrapper.findComponent(Message)
    expect(message.exists()).toBe(false)
  })
})
