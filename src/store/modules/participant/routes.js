import DashboardLayout from '@views/Layout/DefaultLayout';

import Widgets from '@views/Widgets.vue';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/widgets',
    name: 'tes.',
    children: [
      {
        path: 'widgets',
        name: 'widgets',
        component: Widgets
      }
    ]
  }
];

export default routes;
