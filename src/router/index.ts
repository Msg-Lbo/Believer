import store from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'App',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import(/* webpackChunkName: "about" */ '../views/Goods.vue')
  },
  {
    path: '/navigations',
    name: 'Navigations',
    component: () => import(/* webpackChunkName: "about" */ '../views/Navigations.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginRegister.vue')
  },
  {
    path: '/:catchAll(.*)',/*正则判断找不到的页面*/
    name: '/404',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  },
  // 其他设置
  // {
  //   path: '/other-settings',
  //   name: '/OtherSettings',
  //   component: () => import('../views/OtherSettings.vue'),
  //   beforeEnter: (to, from, next) => {
  //     if (store.state.userinfo.token) {
  //       //判断用户权限
  //       let checkInfo = {
  //         contentType: 'auth_user',
  //         permissions: ['add', 'change', 'delete', 'view']
  //       }
  //       store.dispatch("checkUserPerm", checkInfo).then((res)=>{
  //         if (res) {
  //           next()
  //         }
  //       })
  //     } else {
  //       next('/login')
  //     }
  //   }
  // },
  //添加文章
  {
    path: '/add-Article',
    name: 'AddArticle',
    component: () => import('../views/AddArticle.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        //判断用户权限
        let checkInfo = {
          contentType: 'mweb_article',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res)=>{
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
  //文章内容
  {
    path: '/article',
    name: 'Article',
    component: () => import('../views/Article.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        //判断用户权限
        let checkInfo = {
          contentType: 'mweb_article',
          permissions: ['view']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res)=>{
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
  //文章列表
  {
    path: '/article-list',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        //判断用户权限
        let checkInfo = {
          contentType: 'mweb_article',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res)=>{
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
  //用户管理
  {
    path: '/user-permission',
    name: 'UserPerm',
    component: () => import('../views/UserPerm.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        //判断用户权限
        let checkInfo = {
          contentType: 'auth_user',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res)=>{
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
  //分类管理
  {
    path: '/fenlei-admin',
    name: 'FenleiAdmin',
    component: () => import('../views/FenleiAdmin.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.userinfo.token) {
        //判断用户权限
        let checkInfo = {
          contentType: 'mweb_fenlei',
          permissions: ['add', 'change', 'delete', 'view']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res)=>{
          if (res) {
            next()
          }
        })
      } else {
        next('/login')
      }
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
