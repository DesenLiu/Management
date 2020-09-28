import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/js/runtime.js'
// 引入element-ui 的注册信息
import './plugins/element.js'
import axios from 'axios'


axios.defaults.baseURL="http://ttapi.research.itcast.cn/mp/v1_0"
// axios.interceptors.request.use(config => {
//     NProgress.start()
//     config.headers.Authorization = window.sessionStorage.getItem('token')
//     return config
// })

// axios.interceptors.response.use(config => {
//     NProgress.done()
//     return config
// })

// 请求头设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
