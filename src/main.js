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
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme





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

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue.use(ZkTable)
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dateFormat',function(originVal){
	let dt = new Date(originVal)
	
	let y = dt.getFullYear();
	let m = (dt.getMonth() + 1 + '').padStart(2,'0');
	let d = (dt.getDate() + '').padStart(2,'0');
	
	let hh = (dt.getHours() + '').padStart(2,'0');
	let mm = (dt.getMinutes() + '').padStart(2,'0');
	let ss = (dt.getSeconds() + '').padStart(2,'0');
	
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
