// Layout
import DefaultLayout from '@/views/Layout/DefaultLayout';
import AuthLayout from '@/views/Layout/AuthLayout';

// GeneralViews
import NotFound from '@/views/GeneralViews/NotFoundPage';

// Starter
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Welcome = () => import(/* webpackChunkName: "home" */ '@/views/Welcome.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      meta: {
        noBodyBackground: true
      }
    },
    {
      component: Login,
      path: '/login',
      name: 'Login'
    },
    {path: '*', component: NotFound}
  ]
};

let dashboardPages = {
  path: '/',
  component: DefaultLayout,
  name: 'Dashboard',
  redirect: '/home',
  children: [
    {
      component: Home,
      path: '/home',
      name: 'Home',
      meta: {
        requiresAuth: true,
        noBodyBackground: true
      }
    }
  ]
};

const routes = [
  {
    path: '/',
    redirect: '/welcome',
    name: 'Starter',
  },
  dashboardPages,
  authPages
];

export default routes;
