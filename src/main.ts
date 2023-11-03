import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify, Dialog } from 'quasar';
import piniaPersist from 'pinia-plugin-persist';

import App from './App.vue';
import './index.css';

import axios from 'axios';
import VueAxios from 'vue-axios';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
  },
});

app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');
