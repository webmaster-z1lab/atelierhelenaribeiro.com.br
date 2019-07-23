// Layout
import DashboardLayout from '@/views/Layout/DefaultLayout';
import AuthLayout from '@/views/Layout/AuthLayout';

// GeneralViews
import NotFound from '@/views/GeneralViews/NotFoundPage';

// Home
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');
const Register = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Register.vue');

let authPages = {
    path: '/',
    component: AuthLayout,
    name: 'Authentication',
    children: [
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true,
                noBodyBackground: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        { path: '*', component: NotFound }
    ]
};

const routes = [
    {
        path: '/',
        redirect: '/home',
        name: 'Home'
    },
    authPages
];

export default routes;
