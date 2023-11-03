import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router.js';
import { Buffer } from 'buffer';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
// Import Quasar css
import 'quasar/src/css/index.sass';

import { AppFullscreen, Loading, LocalStorage, Notify, Quasar } from 'quasar';
import '@quasar/extras/mdi-v6/mdi-v6.css';

import AuthService from './common/services/integration/AuthService';
import NoAccessPage from '@/pages/NoAccessPage.vue';

const run = async () => {
  const authService = new AuthService();
  if (!authService.isAuthenticated) {
    const response = await authService.instance.handleRedirectPromise();
    if (response !== null) {
      authService.loginWithResponse(response);
    } else {
      await authService.login();
    }
  }

  const app = createApp(
    !(await authService.isAuthorized()) ? NoAccessPage : App
  );

  const config = {
    plugins: { Notify, LocalStorage, AppFullscreen, Loading }, // import Quasar plugins and add here
  };

  const global = window;
  global.Buffer = Buffer;
  window.process = {
    env: {
      NODE_ENV: import.meta.env.NODE_ENV,
    },
  };
  const pinia = createPinia();

  const modules = import.meta.globEager('/src/modules/*.ts');

  // install all modules under `modules/`
  // @ts-ignore
  Object.values(modules).forEach((module) => module.install?.(app));

  // In case of redeployed frontend the currently active users might have problems to dynamically load JS modules.
  // For that problem we catch the resulting error and force a reloading of the page.
  window.addEventListener('unhandledrejection', function (event) {
    console.log(event);

    if (event instanceof PromiseRejectionEvent && event.isTrusted) {
      const messageToCheck = event.reason.toString();
      console.log(messageToCheck);

      const messagesToReload = [
        'TypeError: Failed to fetch dynamically imported module',
        'Error: Unable to preload CSS for',
        'TypeError: error loading dynamically imported module',
      ];

      messagesToReload.forEach((messageToReload) => {
        console.log(
          'checking for reloadMessage starting with: ' + messageToReload
        );
        if (
          messageToCheck.toLowerCase().startsWith(messageToReload.toLowerCase())
        ) {
          console.log('force reloading of the page...');
          window.location.reload();
        }
      });
    }
  });

  app.use(pinia);
  app.use(router);
  app.use(Quasar, config);
  app.mount('#app');
};

run();
