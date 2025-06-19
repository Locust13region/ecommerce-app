import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
    },
    {
      path: '/bag',
      name: 'bag',
      component: () => import('../views/BagView.vue'),
    },
    {
      path: '/product/:productSlug',
      name: 'Product',
      component: () => import('../views/productView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404View.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
    },
    {
      path: '/catalog/:categorySlug', // TODO: rename 'slug' to 'categorySlug'
      name: 'category',
      component: () => import('../views/CatalogView.vue'),
    },
  ],
})

export default router
