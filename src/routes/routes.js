// Layout
import DefaultLayout from '@/views/Layout/DefaultLayout';
import AuthLayout from '@/views/Layout/AuthLayout';

// GeneralViews
import NotFound from '@/views/GeneralViews/NotFoundPage';

// Employee
const IndexEmployee = () => import(/* webpackChunkName: "home" */ '@/views/Employee/Index.vue');
const CreateEmployee = () => import(/* webpackChunkName: "home" */ '@/views/Employee/Create.vue');
const EditEmployee = () => import(/* webpackChunkName: "home" */ '@/views/Employee/Edit.vue');
const ShowEmployee = () => import(/* webpackChunkName: "home" */ '@/views/Employee/Show.vue');

// Starter
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Welcome = () => import(/* webpackChunkName: "home" */ '@/views/Welcome.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');

let employeePages = {
  path: '/employees',
  component: DefaultLayout,
  redirect: {name: 'employee.index'},
  name: 'employee',
  children: [
    {
      path: '/',
      name: 'employee.index',
      component: IndexEmployee,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/employees/create',
      name: 'employee.create',
      component: CreateEmployee,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/employees/edit/:id',
      name: 'employee.edit',
      component: EditEmployee,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/employees/show/:id',
      name: 'employee.show',
      component: ShowEmployee,
      meta: {
        requiresAuth: true
      },
      props: true
    }
  ]
};

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'auth',
  children: [
    {
      component: Login,
      path: '/login',
      name: 'login',
      meta: {
        guest: true
      }
    },
    {path: '*', component: NotFound, name: 'notFound'}
  ]
};

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome,
    meta: {
      noBodyBackground: true
    }
  },
  {
    path: '/',
    component: DefaultLayout,
    name: 'dashboard',
    redirect: '/home',
    children: [
      {
        component: Home,
        path: '/home',
        name: 'home',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  employeePages,
  authPages
];

export default routes;
