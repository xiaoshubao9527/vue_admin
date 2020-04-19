import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    redirect: { name: 'Welcome' },
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/Admin.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/admin/childrens/Welcome.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/admin/childrens/Users.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/admin/childrens/Roles.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  // 匹配不存在的路由則重定向到home
  {
    path: '*',
    redirect: { name: 'Home' }
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem('token')) { // 如果访问的路由需要验证并且没有token的话就重定向到登录页面
    next({
      name: 'Home'
    })
  } else {
    next()
  }
})
export default router
