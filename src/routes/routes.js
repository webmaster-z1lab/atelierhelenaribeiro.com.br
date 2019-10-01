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

// Sale
const IndexSalePacking = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Packing/Index.vue');
const CreateSalePacking = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Packing/Create.vue');
const EditSalePacking = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Packing/Edit.vue');
const ShowSalePacking = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Packing/Show.vue');
const CheckoutSalePacking = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Packing/Checkout.vue');

const IndexSaleVisit = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Visit/Index.vue');
const CreateSaleVisit = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Visit/Create.vue');
const EditSaleVisit = () => import(/* webpackChunkName: "sale" */ '@/views/Sale/Visit/Edit.vue');

// Starter
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Welcome = () => import(/* webpackChunkName: "home" */ '@/views/Welcome.vue');

// Auth
const Login = () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue');

// Config
const withPrefix = (prefix, as, auth, subTitle, routes) =>
  routes.map((route) => {
    route.name = as + route.name;
    route.path = prefix + route.path;
    if (auth) route.meta ? route.meta.requiresAuth = true : route.meta = {requiresAuth: true}
    if (subTitle) route.meta ? route.meta.subTitle = subTitle : route.meta = {subTitle: subTitle}
    return route;
  });

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'dashboard',
    redirect: '/home',
    meta: {BreadCrumb: 'Dashboard'},
    children: [
      {
        component: Home,
        path: '/home',
        name: 'home',
        meta: {
          BreadCrumb: 'Home',
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
    meta: {BreadCrumb: 'Funcionários'},
    children: [
      ...withPrefix('/employees', 'employee.', true, 'Funcionários', [
        {path: '/', name: 'index', component: IndexEmployee, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateEmployee, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditEmployee, props: true, meta: {BreadCrumb: 'Edição'}},
        {path: '/show/:id', name: 'show', component: ShowEmployee, props: true, meta: {BreadCrumb: 'Exibição'}},
      ])
    ]
  },
  {
    path: '/customers',
    component: DefaultLayout,
    redirect: {name: 'customer.index'},
    name: 'customer',
    meta: {BreadCrumb: 'Clientes'},
    children: [
      ...withPrefix('/customers', 'customer.', true, 'Clientes',[
        {path: '/', name: 'index', component: IndexCustomer, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateCustomer, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditCustomer, props: true, meta: {BreadCrumb: 'Edição'}},
        {path: '/show/:id', name: 'show', component: ShowCustomer, props: true, meta: {BreadCrumb: 'Exibição'}},
      ])
    ]
  },
  {
    path: '/catalog',
    component: DefaultLayout,
    redirect: {name: 'catalog.template.index'},
    name: 'catalog',
    meta: {BreadCrumb: 'Catálogo'},
    children: [
      ...withPrefix('/catalog/templates', 'catalog.template.', true, 'Catálogo',  [
        {path: '/', name: 'index', component: IndexTemplateCatalog, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateTemplateCatalog, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditTemplateCatalog, props: true, meta: {BreadCrumb: 'Edição'}},
        {path: '/show/:id', name: 'show', component: ShowTemplateCatalog, props: true, meta: {BreadCrumb: 'Exibição'}},
      ])
    ]
  },
  {
    path: '/stock',
    component: DefaultLayout,
    redirect: {name: 'stock.product.index'},
    name: 'stock',
    meta: {BreadCrumb: 'Estoque'},
    children: [
      ...withPrefix('/stock/products', 'stock.product.', true, 'Estoque', [
        {path: '/', name: 'index', component: IndexProductStock, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateProductStock, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditProductStock, props: true, meta: {BreadCrumb: 'Edição'}},
        {path: '/show/:id', name: 'show', component: ShowProductStock, props: true, meta: {BreadCrumb: 'Exibição'}},
      ])
    ]
  },
  {
    path: '/sale',
    component: DefaultLayout,
    redirect: {name: 'sale.packing.index'},
    name: 'sale',
    meta: {BreadCrumb: 'Vendas'},
    children: [
      ...withPrefix('/sale/packing', 'sale.packing.', true, 'Romaneio', [
        {path: '/', name: 'index', component: IndexSalePacking, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateSalePacking, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditSalePacking, props: true, meta: {BreadCrumb: 'Edição'}},
        {path: '/show/:id', name: 'show', component: ShowSalePacking, props: true, meta: {BreadCrumb: 'Exibição'}},
        {path: '/checkout/:id', name: 'checkout', component: CheckoutSalePacking, props: true, meta: {BreadCrumb: 'Baixa'}}
      ]),
      ...withPrefix('/sale/visit', 'sale.visit.', true, 'Visita', [
        {path: '/', name: 'index', component: IndexSaleVisit, meta: {BreadCrumb: 'Listagem'}},
        {path: '/create', name: 'create', component: CreateSaleVisit, meta: {BreadCrumb: 'Criação'}},
        {path: '/edit/:id', name: 'edit', component: EditSaleVisit, props: true, meta: {BreadCrumb: 'Edição'}}
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
