import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginComponent from '../../login/login-component.vue'
import PrimeVue from 'primevue/config'
import { ToastService } from 'primevue'
import router from '../../../router'

describe('LoginComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const wrapper = mount(LoginComponent, {
    global: {
      plugins: [PrimeVue, ToastService, router],
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })
  it('should contain email and password inputs', () => {
    expect(wrapper.find('.input-email').exists()).toBe(true)
    expect(wrapper.find('.input-password').exists()).toBe(true)
  })

  it('should show error message when input empty', async () => {
    const emailInput = wrapper.find('.input-email')
    const passwordInput = wrapper.find('.input-password').get('input')

    await emailInput.setValue('')
    await passwordInput.setValue('')
    await emailInput.trigger('blur')
    await passwordInput.trigger('blur')
    await flushPromises()
    const messageForEmail = wrapper.find('.email-validation-error-message')
    const messageForPassword = wrapper.find('.password-validation-error-block')

    expect(messageForEmail.exists()).toBe(true)
    expect(messageForEmail.text()).toMatch('Email is required.')
    expect(messageForPassword.exists()).toBe(true)
    expect(messageForPassword.text()).toContain('Minimum 8 characters.')
  })

  it('should show error message when input contain invalid data', async () => {
    const emailInput = wrapper.find('.input-email')
    const passwordInput = wrapper.find('.input-password').get('input')
    await emailInput.setValue('aaaa')
    await emailInput.trigger('blur')
    await passwordInput.setValue('aaaaaaaaaaa')
    await passwordInput.trigger('blur')
    await flushPromises()

    const messageForEmail = wrapper.find('.email-validation-error-message')
    const messageForPassword = wrapper.find('.password-validation-error-block')

    expect(messageForEmail.exists()).toBe(true)
    expect(messageForEmail.text()).toMatch('Invalid email address.')
    expect(messageForPassword.exists()).toBe(true)
    expect(messageForPassword.text()).toContain('Must have an uppercase letter.')
    console.log(messageForPassword.text())
    expect(messageForPassword.text()).toContain('Must have a number.')
    expect(messageForPassword.text()).toContain(
      'Must have at least one special character (e.g., !@#$%^&*)',
    )
  })

  it('should not show error message when input contain valid data', async () => {
    const emailInput = wrapper.find('.input-email')
    const passwordInput = wrapper.find('.input-password').get('input')
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')
    await passwordInput.setValue('Test1234!')
    await passwordInput.trigger('blur')
    await flushPromises()
    const messageForEmail = wrapper.find('.email-validation-error-message')
    const messageForPassword = wrapper.find('.password-validation-error-block')
    expect(messageForEmail.exists()).toBe(false)
    expect(messageForPassword.exists()).toBe(false)
  })
})
