import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from './components/HelloWorld'
import login from './components/login'
import { Auth } from 'aws-amplify'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login
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