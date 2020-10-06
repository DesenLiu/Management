<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片 -->
		<el-card>
			<!-- 添加按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addRoleBool = true">添加角色</el-button>
				</el-col>
			</el-row>

			<!-- 角色列表数据 -->
			<el-table :data="rolelist" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- {{scope.row}} -->
						<el-row :class="['bdBottom' , i1 === 0 ? 'bdTop':'','vcenter']" v-for=" (item1 , i1) in scope.row.children" :key="item1.id">
							<!-- 一级权限 -->
							<el-col :span="5">
								<el-tag  closable @close="removeRightsById(scope.row , item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 23权限 -->
							<el-col :span="19">
								<!-- 二次循环 -->
								<el-row :class="['bdTop', i2 ===  0? 'rmBd':'','vcenter']" v-for="(item2 , i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag closable @close="removeRightsById(scope.row , item2.id)" type="success">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag closable type="warning" v-for="(item3 , i3) in item2.children" :key="item3.id" @close="removeRightsById(scope.row , item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleClick(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>



		<!-- 添加用户的对话框 -->
		<el-dialog title="修改用户" :visible.sync="addRoleBool" width="50%" @close="roleDialogClosed">
			<el-form :model="roleInfo" label-width="70px" :rules="roleFormRules" ref="addRoleRef">
				<el-form-item label="角色名称">
					<el-input v-model="roleInfo.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="roleInfo.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="addRoleBool = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改 -->
		<el-dialog title="修改用户" :visible.sync="editRoleBool" width="50%">
			<el-form :model="editRole" label-width="70px" :rules="roleFormRules" ref="editRoleRef">
				<el-form-item label="角色名称">
					<el-input v-model="editRole.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="editRole.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editRoleBool = false">取 消</el-button>
				<el-button type="primary" @click="editRoleSuccess">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 分配权限 -->
		<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
			<el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeysArr"></el-tree>
			<span slot="footer">
				<el-button @click="setRightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allotRights">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 所有角色列表数据
				rolelist: [],
				addRoleBool: false,
				roleInfo: {
					roleName: '',
					roleDesc: ''
				},
				// 验证规则
				roleFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					roleDesc: [{
						required: false,
						message: '请输入角色描述',
						trigger: 'blur'
					}]
				},
				editRoleBool: false,
				editRole: {},
				// 分配权限对话框
				setRightDialogVisible:false,
				// 所有权限数据
				rightsList:[],
				// 树形控件属性绑定对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				//默认选中的节点默认值
				defKeysArr:[],
				// 当前即将分配权限的id
				roleId:''
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
			// 获取角色列表
			async getRoleList() {
				let {
					data: res
				} = await this.$axios.get('roles');
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败');
				}

				this.rolelist = res.data;
			},
			// 添加角色
			addRole() {
				this.$refs.addRoleRef.validate(async valid => {
					if (!valid) {
						return;
					}
					const {
						data: res
					} = await this.$axios.post('/roles', this.roleInfo)
					console.log(res);
					if (res.meta.status !== 201) {
						return this.$message.error('添加角色失败');
					}
					this.$message.success('添加角色成功');
					this.addRoleBool = false;
					this.getRoleList();
				})

			},
			// 关闭对话框
			roleDialogClosed() {
				this.$refs.roleRef.resetFields();
				this.roleInfo.roleName = ''
			},
			// 编辑
			async editRoleClick(id) {
				this.editRoleBool = true;
				let {
					data: res
				} = await this.$axios.get('roles/' + id);

				if (res.meta.status !== 200) {
					return this.$message.error('角色信息获取失败');
				}
				this.editRole = res.data;
			},
			// 确认修改
			editRoleSuccess() {
				this.$refs.editRoleRef.validate(async valid => {
					if (!valid) {
						return;
					}
					let {
						data: res
					} = await this.$axios.put('roles/' + this.editRole.roleId, {
						roleName: this.editRole.roleName,
						roleDesc: this.editRole.roleDesc
					});
					if (res.meta.status !== 200) {
						return this.$message.error('修改信息失败');
					}

					this.editRoleBool = false;
					this.getRoleList();
				})
			},
			// 根据id删除对应的权限
			async removeRightsById(role , rightId) {
				console.log()
				// 弹框提示是否删除
				let rmRightsBool = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err);
				
				if(rmRightsBool !== 'confirm'){
					return this.$message.info('取消了删除');
				}
				
				console.log('确认了删除');
				let {data : res} = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`);
				console.log(res);
				if(res.meta.status !== 200){
					return this.$message.error('删除权限失败');
				}
				// 会导致刷新
				// this.getRoleList();
				
				role.children = res.data
			},
			// 分配权限的对话框
			async showSetRightDialog(role){
				this.roleId = role.id;
				// 获取全部权限数据
				let {data : res} =await this.$axios.get('rights/tree');
				console.log(res)
				if(res.meta.status !== 200){
					return this.$message.error('获取权限数据失败');
				}
				// 把获取到的权限存起来
				this.rightsList = res.data;
				this.getLeafKeys(role,this.defKeysArr)
				this.setRightDialogVisible = true
			},
			// 递归获取三级权限id
			getLeafKeys(node , arr){
				if(!node.children){
					return arr.push(node.id)
				}
				
				node.children.forEach(item => {
					this.getLeafKeys(item , arr)
				})
			},
			// 监听分配权限关闭
			setRightDialogClosed(){
				this.defKeysArr = [];
			},
			// 分配权限
			async allotRights(){
				let keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
				let idStr = keys.join(',');
				let {data:res} = await this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr});
				if(res.meta.status !== 200){
					return this.$message.error('分配权限失败');
					
				}
				 this.$message.success('分配权限成功');
				 this.getRoleList();
				 this.setRightDialogVisible = false;
			}
		}
	}
</script>

<style scoped>
	.el-card {
		margin-top: 15px;
	}

	.el-table {
		margin-top: 15px;
	}

	.el-tag {
		margin: 7px;
	}

	.bdTop {
		border-top: 1px solid #eee;
	}

	.bdBottom {
		border-bottom: 1px solid #eee;
	}

	.rmBd {
		border: 0;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
