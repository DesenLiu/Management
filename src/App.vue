<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
	img{
		width: 100%;
		height: 100%;
	}
	body{
		padding:0;
		margin: 0;
	}
	ul{
		padding: 0;
		list-style: none;
		margin: 0;
	}
	#app{
		min-width: 1366px;
	}
	.el-card {
		margin-top: 15px;
	}
	.el-steps{
		margin: 15px 0;
	}
	.ql-editor{
		min-height: 300px;
	}
</style>
