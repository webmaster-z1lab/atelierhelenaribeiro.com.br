// Layout
import DashboardLayout from '@/views/Layout/DefaultLayout';
import AuthLayout from '@/views/Layout/AuthLayout';

// GeneralViews
import NotFound from '@/views/GeneralViews/NotFoundPage';

// Home
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
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
  component: DashboardLayout,
  name: 'Dashboard layout',
  redirect: '/dashboard',
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
    component: Home,
    path: '/',
    name: 'Starter',
  },
  dashboardPages,
  authPages
];

export default routes;
