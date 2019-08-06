// Layout
import DefaultLayout from '@/views/Layout/DefaultLayout';
import AuthLayout from '@/views/Layout/AuthLayout';

// GeneralViews
import NotFound from '@/views/GeneralViews/NotFoundPage';

// Employee
const IndexEmployee = () => import(/* webpackChunkName: "employee" */ '@/views/Employee/Index.vue');
const CreateEmployee = () => import(/* webpackChunkName: "employee" */ '@/views/Employee/Create.vue');
const EditEmployee = () => import(/* webpackChunkName: "employee" */ '@/views/Employee/Edit.vue');
const ShowEmployee = () => import(/* webpackChunkName: "employee" */ '@/views/Employee/Show.vue');

// Customer
const IndexCustomer = () => import(/* webpackChunkName: "customer" */ '@/views/Customer/Index.vue');
const CreateCustomer = () => import(/* webpackChunkName: "customer" */ '@/views/Customer/Create.vue');
const EditCustomer = () => import(/* webpackChunkName: "customer" */ '@/views/Customer/Edit.vue');
const ShowCustomer = () => import(/* webpackChunkName: "customer" */ '@/views/Customer/Show.vue');

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

let customerPages = {
  path: '/customers',
  component: DefaultLayout,
  redirect: {name: 'customer.index'},
  name: 'customer',
  children: [
    {
      path: '/',
      name: 'customer.index',
      component: IndexCustomer,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/customers/create',
      name: 'customer.create',
      component: CreateCustomer,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/customers/edit/:id',
      name: 'customer.edit',
      component: EditCustomer,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/customers/show/:id',
      name: 'customer.show',
      component: ShowCustomer,
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
  customerPages,
  authPages
];

export default routes;
