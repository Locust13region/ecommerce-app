import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import SignUpView from '@/views/SignUpView.vue'
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import router from '@/router'
import FormInputField from '@/components/FormInputField/FormInputField.vue'
import { InputText, Message } from 'primevue'
import { useSignUpForm } from '@/composables/signUpValidation/SignUpValidation'
import { formData, formErrors } from '@/consts/signUpFormConsts'
import { nextTick } from 'vue'

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
})
