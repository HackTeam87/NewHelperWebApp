import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import getAPI from './plugins/api';
import router from './router'

Vue.config.productionTip = false
Vue.use(getAPI)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
