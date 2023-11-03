import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('./pages/Home.vue'),
  },
  { path: '/:catchAll(.*)', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ROOT_DIRECTORY),
  routes: routes,
  linkActiveClass: 'active',
});

router.beforeEach(async (_to, _from, next) => {
  return next();
});

export default router;
