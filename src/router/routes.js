export const routes = [{
		path: '/home',
		name: 'Home',
		component: r => require(['../views/Home.vue'], r),
		children: [{
				path: '/homes',
				name: 'Homes',
				component: r => require(['../components/homes/homes.vue'], r),
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
	{
		path: '*',
		redirect: {
			name: 'Login'
		}
	}
]
