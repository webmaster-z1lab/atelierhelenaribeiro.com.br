import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes,
  mode: 'history', // activating friendly routes
  linkActiveClass: 'active',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {selector: to.hash};
    }
    return {x: 0, y: 0};
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('api_token') == null) {
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router;
