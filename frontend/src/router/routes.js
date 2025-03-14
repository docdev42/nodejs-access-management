const routes = [
  {
    path: '/',
    component: () => import('layouts/InitialLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/AuthPage.vue') }
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/WelcomePage.vue') },
      { path: 'admin', component: () => import('src/pages/AdminPage.vue') },
      { path: 'admin/permissoes-de-usuario/:id', component: () => import('src/pages/UserPermissionsPage.vue') },
      { path: 'usuarios/:id', component: () => import('src/pages/UserPage.vue') },
      { path: 'usuarios', component: () => import('src/pages/UsersListPage.vue') },
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
