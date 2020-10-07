import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/js/runtime.js'
// 引入element-ui 的注册信息
import './plugins/element.js'
import axios from 'axios'
import './styles/iconStyle.css'

import ZkTable from 'vue-table-with-tree-grid'


axios.defaults.baseURL="http://rambuild.cn:8888/api/private/v1/"
axios.interceptors.request.use(config => {
	let user = JSON.parse(localStorage.getItem('user'))
	if(user){
		config.headers.Authorization = user.token;
		return config;
	}
    
}, error => {
	return Promise.reject(error)
}
)

 router.beforeEach((to , from , next) => {
	let userToken = JSON.parse(localStorage.getItem('user'));
	// 非登录页面
	if(to.path !== "/login"){
		if(userToken.token){
			next();
		}else{
			// 没有登录 跳转登录页面
			next('/login')
		}
	}else{
		next();
	}
})

// axios.interceptors.response.use(config => {
//     NProgress.done()
//     return config
// })

// 请求头设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ZkTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
