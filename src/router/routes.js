export const routes = [
	{
	  path: '/home',
	  name: 'Home',
	  component: r => require(['../views/Home.vue'],r)
	},
	{
        path:'/login',
        name:'Login',
        component: r => require(['../components/Login.vue'],r)
    },
	{
		path:'*',
		redirect:{
			name:'Login'
		}
	}
]