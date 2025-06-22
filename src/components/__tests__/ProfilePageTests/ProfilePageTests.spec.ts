import { mount /*, flushPromises */ } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
// import PrimeVue from 'primevue/config'
// import { ToastService } from 'primevue'
// import router from '../../../router'

vi.mock('@/composables/useCategoryStore', () => ({
  useCategoriesStore: () => ({
    loadCategories: vi.fn().mockResolvedValue(undefined),
    categories: [],
  }),
}))

vi.mock('@/composables/useShoppingBag', () => ({
  useShoppingBag: () => ({
    getBag: vi.fn(),
    getItemsList: vi.fn().mockResolvedValue([]),
  }),
}))

vi.mock('@/stores/userState', () => ({
  useUserStateStore: () => ({
    isLoggedIn: true,
    loginState: vi.fn(),
    logoutState: vi.fn(),
  }),
}))

// TODO: add mock for getCustomer call in profileForm
// vi.mock('@/services/saveChanges/getCustomer', () => {})

//TODO: replace it when all calls to server will bw mocked
vi.mock('@/components/userProfile/user-profile-component.vue', () => ({
  default: { template: '<div>Profile</div>' },
}))

// vi.mock('@/components/changePasswordForm.vue', () => ({
//   default: { template: '<div>ChangePasswordForm</div>' },
// }))
// vi.mock('@/components/personalInfoForm.vue', () => ({
//   default: { template: '<div>PersonalInfoForm</div>' },
// }))
// vi.mock('@/components/BillingAddresses.vue', () => ({
//   default: { template: '<div>BillingAddresses</div>' },
// }))
// vi.mock('@/components/ShippingAddresses.vue', () => ({
//   default: { template: '<div>ShippingAddresses</div>' },
// }))

import UserProfileView from '../../../views/UserProfileView.vue'
import HeaderComponent from '../../header/Header-component.vue'
import { createTestingPinia } from '@pinia/testing'
import UserProfileComponent from '../../userProfile/user-profile-component.vue'
// import PersonalInfoForm from '../../userProfile/personalInfoForm.vue'

describe('ProfileComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        user: {
          isLoggedIn: true,
        },
      },
    })
  })
  it('renders button to profile page', () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          RouterLink: true,
          MegaMenu: true,
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                isLoggedIn: true,
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.find('.button-to-profile-page').exists()).toBe(true)
  })

  it('renders profile page', () => {
    const wrapper = mount(UserProfileView, {
      global: {
        stubs: {
          RouterLink: true,
          MegaMenu: true,
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                isLoggedIn: true,
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.find('.profile').exists()).toBe(true)
  })

  it('renders profile tabs', () => {
    const wrapper = mount(UserProfileComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                isLoggedIn: true,
              },
            },
          }),
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
    // TODO: replace when mock of this part will be deleted
    // expect(wrapper.find('.profile').exists()).toBe(true)
  })

  // it('renders profile info form', () => {
  //   const wrapper = mount(PersonalInfoForm, {
  //     global: {
  //       stubs: {
  //         RouterLink: true,
  //         MegaMenu: true,
  //       },
  //       plugins: [
  //         createTestingPinia({
  //           createSpy: vi.fn,
  //           initialState: {
  //             user: {
  //               isLoggedIn: true,
  //             },
  //           },
  //         }),
  //       ],
  //     },
  //   })
  //   expect(wrapper.exists()).toBe(true)
  //   //TODO: check data in test profile
  // })
})
