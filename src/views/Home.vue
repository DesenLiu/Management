<template>
	<div class="home" style="height: 100vh;">
		<header class="el-header">
			<div class="el-header-left">
				<img src="../assets/logo.png"></img>
				<div>Vue商城后台管理系统</div>
			</div>
			<el-button type="warning" class="el-header-btn">退出</el-button>
		</header>
		<!--  -->
		<section class="el-container">
			<aside class="el-aside" :style=" {width:isCollapse ?'64px':'200px' }">
				<div class="toggle-btn" @click="toggleCollapse">|||</div>
				<el-menu 
				router
				background-color="#333744" 
				text-color="#fff" 
				active-text-color="#409EFF" 
				:collapse="isCollapse"
				unique-opened 
				:collapse-transition="false">
					<el-menu-item index="/homes">
						<i class="el-icon-document"></i>
						<span slot="title">首页</span>
					</el-menu-item>
					
					<el-menu-item index="/content">
						<i class="el-icon-document"></i>
						<span slot="title">内容管理</span>
					</el-menu-item>
					
					<el-menu-item index="/material">
						<i class="el-icon-document"></i>
						<span slot="title">素材管理</span>
					</el-menu-item>
					
					<el-menu-item index="/pubarticles">
						<i class="el-icon-document"></i>
						<span slot="title">发布文章</span>
					</el-menu-item>
					
					<el-menu-item index="/comments">
						<i class="el-icon-document"></i>
						<span slot="title">评论管理</span>
					</el-menu-item>
					
					<el-menu-item index="/fans">
						<i class="el-icon-document"></i>
						<span slot="title">粉丝管理</span>
					</el-menu-item>
					
					<el-menu-item index="/personal">
						<i class="el-icon-document"></i>
						<span slot="title">个人设置</span>
					</el-menu-item>

				</el-menu>
			</aside>
			<main class="el-main">
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
			}
		},
		methods: {
			toggleCollapse() {
				this.isCollapse = !this.isCollapse
			},
			async getMenuList() {
				console.log(this.$axios)
				let {
					data
				} = await this.$axios.get("menus");
				console.log(data);
			}
		},

		created() {
			// this.getMenuList();
		},
		components: {}
	}
</script>
<style lang="less" scoped>
	@import "~@/assets/less/home.less";
</style>
