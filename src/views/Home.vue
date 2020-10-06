<template>
	<div class="home" style="height: 100vh;">
		<header class="el-header">
			<div class="el-header-left">
				<img src="../assets/logo.png"></img>
				<div>Vue商城后台管理系统</div>
			</div>
			<el-button type="warning" class="el-header-btn" @click="removeToken">退出</el-button>
		</header>
		<!--  -->
		<section class="el-container">
			<aside class="el-aside" :style=" {width:isCollapse ?'64px':'200px' }">
				<div class="toggle-btn" @click="toggleCollapse">|||</div>
				<el-menu class="icon_menu" router background-color="#333744" text-color="#fff" active-text-color="#409EFF"
				 :collapse="isCollapse" :default-active="activePath" unique-opened :collapse-transition="false">
					<!-- 一级菜单 -->
					<el-submenu :index="item.id + ''" v-for="(item , idx) in menuList" :key="item.id">
						<template slot="title">
							<i :class="['iconfont' ,iconArr[idx]]"></i>
							<span slot="title">{{item.authName}}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item :index="'/' + v.path" v-for="(v , i) in item.children" :key="i" @click="saveNavState('/' + v.path)">{{v.authName}}</el-menu-item>
					</el-submenu>
				</el-menu>
			</aside>
			<main class="el-main" style="background-color: #E8EEF4;">
				<router-view></router-view>
			</main>
		</section>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				isCollapse: true,
				menuList: [],
				iconArr: ['icon-yonghuguanli', 'icon-sucaiguanli', 'icon-zhifeiji', 'icon-wenzhang', 'icon-tongji'],
				// 被激活的链接地址
				activePath:''
			}
		},
		methods: {
			// 伸缩导航栏
			toggleCollapse() {
				this.isCollapse = !this.isCollapse
			},
			// 退出登录
			removeToken() {
				localStorage.removeItem('token');
				this.$router.push({
					name: 'Login'
				})
			},
			async getMenuList() {
				let {
					data: res
				} = await this.$axios.get('/menus');
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.menuList = res.data;
			},
			// 保存链接的激活状态
			saveNavState(val){
				// console.log(val);
				sessionStorage.setItem('activePath',val);
				this.activePath = val;
			}
		},

		created() {
			this.getMenuList();
			this.activePath = sessionStorage.getItem('activePath');
		},
	}
</script>
<style lang="less" scoped>
	@import "~@/assets/less/home.less";
</style>
