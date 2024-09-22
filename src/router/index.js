import Vue from 'vue'
import VueRouter from 'vue-router'
import MSGHometView from '@/views/MSGHomeView.vue'
import TopologyCalculateView from '@/views/TopologyCalculateView.vue'
import GetkdotpView from '@/views/GetkdotpView.vue'
import GetPairingView from '@/views/GetPairingView.vue'
import TestView from '@/views/TestView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'msgHome',
    component: MSGHometView
  },
  {
    path: '/calTopo',
    name: 'calTopo',
    component: TopologyCalculateView
  },
  {
    path: '/getkdotp',
    name: 'getkdotp',
    component: GetkdotpView
  },
  {
    path: '/getPairing',
    name: 'getPairing',
    component: GetPairingView
  },
  {
    path: '/test',
    name: 'test',
    component: TestView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
