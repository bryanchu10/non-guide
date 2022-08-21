import { createApp } from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';

import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import 'bootstrap/js/dist/collapse';

import {
  Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import App from './App.vue';
import router from './router';
import emitter from './methods/emitter';
import currency from './methods/filters';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});

setLocale('zh_TW');

dayjs.extend(utc);
dayjs.extend(timezone);

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.provide('$emitter', emitter);
app.provide('$filters', { currency });
app.provide('$dayjs', dayjs);
app.component('VueLoading', Loading);
app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);
app.mount('#app');
