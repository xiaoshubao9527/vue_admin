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
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/Welcome.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '../views/user/Users.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "roles" */ '../views/jurisdiction/Roles.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'rights',
        name: 'Rights',
        component: () => import(/* webpackChunkName: "rights" */ '../views/jurisdiction/Rights.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'goodCategory',
        component: () => import(/* webpackChunkName: "goodCategory" */ '../views/product/GoodCategory.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import(/* webpackChunkName: "goods" */ '../views/product/Goods.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'editGoods',
        name: 'editGoods',
        component: () => import(/* webpackChunkName: "editGoods" */ '../views/product/EditGoods.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'detailGoods',
        name: 'detailGoods',
        component: () => import(/* webpackChunkName: "detailGoods" */ '../views/product/DetailGoods.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'params',
        name: 'Params',
        component: () => import(/* webpackChunkName: "params" */ '../views/product/Params.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName: "orders" */ '../views/order/Orders.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import(/* webpackChunkName: "orders" */ '../views/report/Reports.vue'),
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
router.beforeEach((to, from, next) => { // 若需要加上权限的验证则需要 在路由元信息meta加入 requiresAuth： true即可s
  if (to.meta.requiresAuth && !sessionStorage.getItem('token')) { // 如果访问的路由需要验证并且没有token的话就重定向到登录页面
    next({
      name: 'Home'
    })
  } else {
    next()
  }
})
export default router
