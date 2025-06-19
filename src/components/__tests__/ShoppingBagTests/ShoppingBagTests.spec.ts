import { vi } from 'vitest'

vi.mock('@/composables/useCategoryStore', () => ({
  useCategoriesStore: () => ({
    loadCategories: vi.fn().mockResolvedValue(undefined),
    categories: [],
  }),
}))

vi.mock('@/composables/useShoppingBag', () => ({
  useShoppingBag: () => ({
    getBag: vi.fn(),
    getItemsList: vi.fn().mockResolvedValue([
      { id: '1', name: 'Book1', quantity: 1 },
      { id: '2', name: 'Book2', quantity: 2 },
    ]),
    // нужно ли что-то еще?
  }),
}))
