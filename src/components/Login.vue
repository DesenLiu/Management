<template>
	<div class="login">
		<div class="container">
			<div class="login_box">
				<div class="icon_box">
					<img src="../assets/logo.png" alt="" class="img_box">
				</div>
				<el-form :model="loginForm" :rules="loginRules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
					<el-form-item prop="username">
						<el-input type="text" v-model="loginForm.mobile" prefix-icon="el-icon-user-solid"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" v-model="loginForm.code" prefix-icon="el-icon-s-open"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="rightFromItem">
							<el-button type="primary" @click="login('ruleForm')" :loading="isLoding">登录</el-button>
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
		name:'Login',
		data() {
			return {
				// 验证
				loginRules: {
					mobile: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					code: [{
						require: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				},
				loginForm: {
					mobile: "13911111111",
					code: "246810"
				},
				// 登录状态修改
				isLoding:false
			}
		},
		methods: {
			login(formName) {
				this.isLoding = true;
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let {data} = await this.$axios.post('/authorizations', this.loginForm)
						if (data.message =='OK') {
							this.$message({
								showClose: true,
								message: "登录成功",
								type: 'success'
							});
							localStorage.setItem('token',data.data.token)
							this.$router.push({name:'Home'})
							this.loading = false;
						
						}else{
							this.$message({
								showClose: true,
								message: "验证码或手机号错误",
								type:'error'
							});
							this.loading = false;
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
