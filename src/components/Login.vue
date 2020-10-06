<template>
	<div class="login">
		<div class="container">
			<div class="login_box">
				<div class="icon_box">
					<img src="../assets/logo.png" alt="" class="img_box">
				</div>
				<el-form :model="loginForm" :rules="loginRules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
					<el-form-item prop="mobile">
						<el-input type="text" v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
					</el-form-item>
					<el-form-item prop="code">
						<el-input type="text" v-model="loginForm.password" prefix-icon="el-icon-s-open"></el-input>
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
					username: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					},{
						pattern:/^[a-zA-Z1-9]$/,
						message:'请输入正确的账号格式',
						trigger:'blur'
					}],
					password: [{
						require: true,
						message: '请输入密码',
						trigger: 'blur'
					},{
						pattern:/^\d{6}$/,
						message:'请输入正确的密码格式',
						trigger:'blur'
					}
					]
				},
				loginForm: {
					username: "admin",
					password: "123456"
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
						let {data} = await this.$axios.post('/login', this.loginForm);
						console.log(data);
						
						if (data.meta.status == 200) {
							this.$message({
								showClose: true,
								message: "登录成功",
								type: 'success'
							});
							localStorage.setItem('user',JSON.stringify(data.data))
							this.$router.push({name:'Users'})
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
