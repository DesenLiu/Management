<template>
	<div class="login">
		<div class="container">
			<div class="login_box">
				<div class="icon_box">
					<img src="../assets/logo.png" alt="" class="img_box">
				</div>
				<el-form :model="loginForm" :rules="loginRules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
					<el-form-item prop="username">
						<el-input type="text" v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-s-open"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="rightFromItem">
							<el-button type="primary" @click="login('ruleForm')">登录</el-button>
							<el-button type="info">重置</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 验证
				loginRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						require: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				},
				loginForm: {
					username: "admin",
					password: "123456"
				}
			}
		},
		methods: {
			login(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let {data} = await this.$axios.post('login', this.loginForm)
						console.log(data)
						if (data.meta.status == 200) {
							this.$message({
								showClose: true,
								message: data.meta.msg,
								type: 'success'
							});
							localStorage.setItem('token',data.data.token)
							this.$router.push({name:'Home'})
						
						}else{
							this.$message({
								showClose: true,
								message: data.meta.msg,
								type:'error'
							});
						}
					}
				})
			}
		}
	}
</script>

<style>
	@import "~@/assets/less/login.less";
</style>
