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

// Stock
const IndexProductStock = () => import(/* webpackChunkName: "stock" */ '@/views/Stock/Product/Index.vue');
const CreateProductStock = () => import(/* webpackChunkName: "stock" */ '@/views/Stock/Product/Create.vue');
const EditProductStock = () => import(/* webpackChunkName: "stock" */ '@/views/Stock/Product/Edit.vue');
const ShowProductStock = () => import(/* webpackChunkName: "stock" */ '@/views/Stock/Product/Show.vue');

// Catalog
const IndexTemplateCatalog = () => import(/* webpackChunkName: "catalog" */ '@/views/Catalog/Template/Index.vue');
const CreateTemplateCatalog = () => import(/* webpackChunkName: "catalog" */ '@/views/Catalog/Template/Create.vue');
const EditTemplateCatalog = () => import(/* webpackChunkName: "catalog" */ '@/views/Catalog/Template/Edit.vue');
const ShowTemplateCatalog = () => import(/* webpackChunkName: "catalog" */ '@/views/Catalog/Template/Show.vue');

// Starter
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Welcome = () => import(/* webpackChunkName: "home" */ '@/views/Welcome.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');

// Config
const withPrefix = (prefix, as, auth, routes) =>
  routes.map((route) => {
    route.name = as + route.name;
    route.path = prefix + route.path;
    if (auth) route.meta ? route.meta.requiresAuth = true : route.meta = {requiresAuth: true}
    return route;
  });

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
  {
    path: '/employees',
    component: DefaultLayout,
    redirect: {name: 'employee.index'},
    name: 'employee',
    children: [
      ...withPrefix('/employees', 'employee.', true, [
        {path: '/', name: 'index', component: IndexEmployee},
        {path: '/create', name: 'create', component: CreateEmployee},
        {path: '/edit', name: 'edit', component: EditEmployee, props: true},
        {path: '/show', name: 'show', component: ShowEmployee, props: true},
      ])
    ]
  },
  {
    path: '/customers',
    component: DefaultLayout,
    redirect: {name: 'customer.index'},
    name: 'customer',
    children: [
      ...withPrefix('/customers', 'customer.', true, [
        {path: '/', name: 'index', component: IndexCustomer},
        {path: '/create', name: 'create', component: CreateCustomer},
        {path: '/edit', name: 'edit', component: EditCustomer, props: true},
        {path: '/show', name: 'show', component: ShowCustomer, props: true},
      ])
    ]
  },
  {
    path: '/catalog',
    component: DefaultLayout,
    redirect: {name: 'catalog.template.index'},
    name: 'catalog',
    children: [
      ...withPrefix('/catalog/templates', 'catalog.template.', true, [
        {path: '/', name: 'index', component: IndexTemplateCatalog},
        {path: '/create', name: 'create', component: CreateTemplateCatalog},
        {path: '/edit', name: 'edit', component: EditTemplateCatalog, props: true},
        {path: '/show', name: 'show', component: ShowTemplateCatalog, props: true},
      ])
    ]
  },
  {
    path: '/stock',
    component: DefaultLayout,
    redirect: {name: 'stock.product.index'},
    name: 'stock',
    children: [
      ...withPrefix('/stock/products', 'stock.product.', true, [
        {path: '/', name: 'index', component: IndexProductStock},
        {path: '/create', name: 'create', component: CreateProductStock},
        {path: '/edit', name: 'edit', component: EditProductStock, props: true},
        {path: '/show', name: 'show', component: ShowProductStock, props: true},
      ])
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    name: 'auth',
    children: [
      {component: Login, path: '/login', name: 'login', meta: {guest: true}},
      {path: '*', component: NotFound, name: 'notFound'}
    ]
  }
];

export default routes;
