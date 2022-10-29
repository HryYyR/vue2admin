// 路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'

import Users from '@/components/user/Users'

import rights from '@/components/power/rights'

import Roles from '@/components/power/Roles'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {path: '/welcome',component: welcome},
      {path: '/users',component: Users},
      {path:'/rights' , component: rights},
      {path:'/Roles' , component: Roles},
  ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// to 将要访问的路径
// from 从哪个路径跳转而来
// next  放行函数，是否放行   next()     强制跳转 next('/login')
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token'); //  获取token
  if (!tokenStr) return next('/login') //判断是否存在token，不存在则强制定向到login
  next() // 否则放行到home
})



export default router