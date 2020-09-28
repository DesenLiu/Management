<template>
  <div class="home" style="height: 100vh;">
	<header class="el-header">
		<div class="el-header-left">
			<img src="../assets/logo.png"></img>
			<div>Vue商城后台管理系统</div>
		</div>
		<el-button type="warning" class="el-header-btn">退出</el-button>
	</header>
	
	<section class="el-container">
		<aside class="el-aside" :style=" {width:isCollapse ?'64px':'200px' }">
			<div class="toggle-btn" @click="toggleCollapse">|||</div>
			 <el-menu
				background-color="#333744"
				text-color="#fff"
				active-text-color="#409EFF"
				:collapse="isCollapse"
				unique-opened
				:collapse-transition="false"
				>
			      <el-submenu index="1">
			        <template slot="title">
			          <i class="el-icon-user-solid"></i>
			          <span>导航一</span>
			        </template>
			        <el-menu-item index="3">
			            <i class="el-icon-document"></i>
			            <span slot="title">导航三</span>
			        </el-menu-item>
			      </el-submenu>
			    </el-menu>
		</aside>
		<main class="el-main"></main>
	</section>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data(){
	  return{
		  isCollapse:true
	  }
  },
  methods:{
	  toggleCollapse(){
		  this.isCollapse = !this.isCollapse
	  },
	  async getMenuList(){
		  console.log(this.$axios)
		  let {data} = await this.$axios.get("menus");
		  console.log(data);
	  }
  },
  
  created(){
	  this.getMenuList();
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
	@import "~@/assets/less/home.less";
</style>
