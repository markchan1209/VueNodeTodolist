import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import Cookies from 'js-cookie'
import './registerServiceWorker'
import i18n from './lang'
import './plugins/element.js'
import '@/styles/index.scss' // global css
import './icons' // icon
import './permission' // permission control
import './utils/errorLog' // error log

import * as filters from './filters' // global filters

import { mockXHR } from '../mock' // simulation data

if (process.env.NODE_ENV === 'production999') { mockXHR() }

// Vue.use(Element, {
//   size: 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
