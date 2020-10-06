<template>
	<div class="users">


		<!-- 卡片 -->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<!-- 面包屑 -->
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item>用户列表</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- <div class="text item"> -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialog = true">添加用户</el-button>
				</el-col>
			</el-row>

			<el-table :data="userList" style="width: 100%" border stripe>
				<el-table-column type="index">
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="email" label="邮箱" width="180">
				</el-table-column>
				<el-table-column prop="mobile" label="电话" width="180">
				</el-table-column>
				<el-table-column prop="role_name" label="角色" width="180">
				</el-table-column>
				<el-table-column label="状态" width="180">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 修改 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
						<!-- 分配角色 -->
						<el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip>

					</template>
				</el-table-column>
			</el-table>
			<!-- </div> -->

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>

		</el-card>


		<!-- 添加用户对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialog" width="30%" @close="addDialogClose">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialog = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改用户的对话框 -->
		<el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClosed">
			<el-form :model="editForm" label-width="70px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editDialog = false">取 消</el-button>
				<el-button type="primary" @click="EditDialogClick">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			// 验证邮箱规则
			var checkEmail = (rule, value, cb) => {
				console.log(value)
				let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

				if (regEmail.test(value)) {
					return cb();
				}

				cb(new Error('请输入合法邮箱'));
			}
			// 验证手机号规则
			var checkMobile = (rule, value, cb) => {
				let regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/
				console.log(value)
				if (regMobile.test(value)) {
					return cb()
				}

				cb(new Error('请输入合法手机号'))
			}

			return {
				// 获取用户列表的参数对象
				queryInfo: {
					query: '',
					// 当前页数
					pagenum: 1,
					// 每一页显示多少条数据
					pagesize: 2
				},
				userList: [],
				total: 0,
				// 控制用户对话框显示或者隐藏
				addDialog: false,
				// 添加用户表单数据
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				// 表单验证对象
				addFormRules: {
					username: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '长度在 3 到 10 个字符',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入正确手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}],
				},
				// ------------------------- 修改start --------------------->
				editDialog: false,
				editForm: {},
				editFormRules: {
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入正确手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}],
				},
				// ------------------------- 修改end --------------------->
			}
		},
		created() {
			this.getUserList();
		},
		methods: {
			async getUserList() {
				let {
					data: res
				} = await this.$axios.get('users', {
					params: this.queryInfo
				});
				// console.log(res);
				if (res.meta.status !== 200) return this.$message.error('获取列表数据失败');
				this.userList = res.data.users;
				this.total = res.data.total;

			},
			// 监听pagesize改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize;
				this.getUserList();
			},
			// 切换页面 监听页码值改变
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage;
				this.getUserList();
			},
			// 状态修改
			async changeState(userinfo) {
				console.log(userinfo);

				let {
					data: res
				} = await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
				if (res.meta.status !== 200) {
					userinfo.mg_state = !userinfo.mg_state
					return this.$message.error('更新用户状态失败');
				}

				this.$message.success('更新用户状态成功');
			},
			// 关闭对话框
			addDialogClose() {
				this.$refs.addFormRef.resetFields();
			},
			// 点击添加用户
			addUser() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加用户请求
					let {
						data: res
					} = await this.$axios.post('users', this.addForm)
					console.log(res);

					if (res.meta.status !== 201) {
						this.$message.error('添加用户失败');
					}

					if (res.meta.status == 400) {
						this.$message.error('用户名已存在');
						return;
					}

					this.$message.success('添加用户成功');
					this.addDialog = false;
					this.getUserList();
				})
			},
			async showEditDialog(userinfoId) {
				this.editDialog = true;
				let {
					data: res
				} = await this.$axios.get(`users/${userinfoId}`);
				console.log(res);

				if (res.meta.status !== 200) {
					return this.$message.error('查询用户信息失败');
				}


				this.editForm = res.data;

			},
			editDialogClosed() {
				this.$refs.editFormRef.resetFields();
			},
			EditDialogClick() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加用户请求
					let {
						data: res
					} = await this.$axios.put('users/' + this.editForm.id, {
						email: this.editForm.email,
						mobile: this.editForm.mobile
					})

					if (res.meta.status !== 201) {
						this.$message.error('更新用户失败');
					}

					this.$message.success('更新用户成功');
					this.editDialog = false;
					this.getUserList();
				})
			},
			async removeUserById(userInfoId) {
				let confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				
				if(confirmResult !== 'confirm') return this.$message.info('已取消删除');
				
				let {data : res} = await this.$axios.delete('users/' + userInfoId);
				console.log(res)
				if(res.meta.status !== 200){
					return this.$message.error('删除用户失败');
				}
				this.$message.success('删除用户成功');
				this.getUserList()
			},

		}
	}
</script>

<style lang="less" scoped="">
	@import '~@/assets/less/users.less';
</style>
