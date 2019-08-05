import Vue from 'vue'
import store from "./store";
import VueTailwind from 'vue-tailwind';
import Vuelidate from 'vuelidate';

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueTailwind);
Vue.use(Vuelidate);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
