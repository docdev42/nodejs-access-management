const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/InitialLayout.vue'),
    children: [
      { path: '/auth', component: () => import('pages/AuthPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
