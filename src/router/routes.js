export const routes = [{
		path: '/home',
		name: 'Home',
		// redirect:'/users',
		component: r => require(['../views/Home.vue'], r),
		children: [{
				path: '/users',
				name: 'Users',
				component: r => require(['../components/users/Users.vue'], r),
			},
			{
				path: '/comments',
				name: 'Comments',
				component: r => require(['../components/comments/Comments.vue'],r),
			},
			{
				path: '/content',
				name: 'Content',
				component: r => require(['../components/content/Content.vue'],r),
			},
			{
				path: '/fans',
				name: 'Fans',
				component: r => require(['../components/fans/Fans.vue'],r),
			},
			{
				path: '/material',
				name: 'Material',
				component: r => require(['../components/material/Material.vue'],r),
			},
			{
				path: '/personal', 
				name: 'Personal',
				component: r => require(['../components/personal/Personal.vue'],r),
			},
			{
				path: '/pubarticles', 
				name: 'Pubarticles',
				component: r => require(['../components/pubarticles/Pubarticles.vue'],r),
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: r => require(['../components/Login.vue'], r)
	},
	// {
	// 	path: '*',
	// 	redirect: {
	// 		name: 'Login'
	// 	}
	// }
]
