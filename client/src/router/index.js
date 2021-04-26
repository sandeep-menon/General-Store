import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NewOrder from '../views/NewOrder.vue'
import Products from '../views/Products.vue'
import Orders from '../views/Orders.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/newOrder',
    name: 'newOrder',
    component: NewOrder
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
