import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main'
import Login from './views/login'
import { Auth } from 'aws-amplify'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(user)
        next()
       })
      .catch(err => {
        console.log(err)
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      })
  } else {
    next()
  }
})

export default router