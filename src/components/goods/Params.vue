<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon>
			</el-alert>

			<!-- 选择商品分类区 -->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!-- 选择框 -->
					<el-cascader expand-trigger="hover" v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
				</el-col>
			</el-row>
			<!-- tabs 区 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 添加动态参数面板 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<!-- 循环渲染 -->
								<el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i , scope.row)">{{item}}</el-tag>
								<!-- 输入文本框 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
								 size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 静态属性面板 -->
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加属性</el-button>
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i , scope.row)">{{item}}</el-tag>
								
								<!-- 输入文本框 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
								 size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>


		<!-- 添加参数对话框 -->
		<el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="addForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 编辑对话框 -->
		<el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 商品分类列表
				cateList: [],
				// 配置对象
				cateProps: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				// 选择框双向绑定
				selectedCateKeys: [],
				// tabs 被激活的页签
				activeName: 'many',
				// 静态动态
				manyTableData: [],
				onlyTableData: [],
				// 对话框隐藏
				addDialogVisible: false,
				// 添加参数对象
				addForm: {
					attr_name: ''
				},
				// 验证规则
				addFormRules: {
					attr_name: [{
						require: true,
						message: '请输入参数名称',
						trigger: 'blur'
					}]
				},
				// 控制修改框显示隐藏
				editDialogVisible: false,
				// 修改表单数据对象
				editForm: {
					attr_name: ''
				},
				editFormRules: {
					attr_name: [{
						require: true,
						message: '请输入参数名称',
						trigger: 'blur'
					}]
				},
				// // 文本框输入框切换
				// inputVisible:false,
				// // 文本框输入的值
				// inputValue:''
			}
		},
		created() {
			// 获取所有商品分类列表
			this.getCateList();
		},
		methods: {
			async getCateList() {
				let {
					data: res
				} = await this.$axios.get('categories');
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类失败');
				}
				this.cateList = res.data;
			},
			// 选择框事件
			handleChange() {
				this.getParamsData();
			},
			async getParamsData() {
				// 不是三级分类
				if (this.selectedCateKeys.length !== 3) {
					this.selectedCateKeys = [];
					this.manyTableData = [];
					this.onlyTableData = [];
					return;
				}

				// 根据所选分类id和当前所处的面板获取对应数据
				let {
					data: res
				} = await this.$axios.get(`categories/${this.cateId}/attributes`, {
					params: {
						sel: this.activeName
					}
				});
				if (res.meta.status !== 200) {
					return this.$message.error('获取参数列表失败');
				}

				// 切割成数组
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
					// 控制文本框显示隐藏
					item.inputVisible = false;
					item.inputValue = '';
				})

				console.log(res.data)

				// 判断是动态还是静态
				if (this.activeName === 'many') {
					this.manyTableData = res.data;
				} else {
					this.onlyTableData = res.data
				}
			},
			// tab点击事件
			handleTabClick() {
				this.getParamsData();
			},
			// 关闭对话框
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},
			// 确认提交
			async addParams() {

				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					let {
						data: res
					} = await this.$axios.post(`categories/${this.cateId}/attributes`, {
						attr_name: this.addForm.attr_name,
						attr_sel: this.activeName
					})

					if (res.meta.status !== 201) {
						return this.$message.error('添加失败');
					}

					this.$message.success('添加参数成功');
					this.addDialogVisible = false;
					this.getParamsData();

				})
			},

			async showEditDialog(id) {
				// 查询当前参数信息
				let {
					data: res
				} = await this.$axios.get(`categories/${this.cateId}/attributes/${id}`, {
					params: {
						attr_sel: this.activeName
					}
				})

				if (res.meta.status !== 200) {
					return this.$message.error('获取参数信息失败')
				}

				this.editForm = res.data;
				this.editDialogVisible = true;
			},
			// 清空表单
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			// 确认修改
			editParams() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					let {
						data: res
					} = await this.$axios.put(`categories/${this.cateId}}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name,
						attr_sel: this.activeName
					})

					if (res.meta.status !== 200) {
						return this.$message.error('修改参数失败')
					}

					this.getParamsData();
					this.editDialogVisible = false;
				})
			},
			// 删除参数
			async removeParams(id) {
				let confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err);

				if (confirmResult !== 'confirm') {
					return this.$message.info('取消了删除');
				}

				// 删除接口
				let {
					data: res
				} = await this.$axios.delete(`categories/${this.cateId}/attributes/${id}`);

				if (res.meta.status !== 200) {
					return this.$message.error('删除参数失败');
				}

				this.$message.success('删除参数成功');
				this.getParamsData();
			},
			// 失去脚点 回车 都会更新内容
			handleInputConfirm(row) {
				if(row.inputValue.trim().length == 0){
					row.inputValue = '';
					row.inputVisible = false;
					return;
				}
				
				// 没有return 响应修改
				console.log(row.inputVisible)
				row.attr_vals.push(row.inputValue.trim());
				
				row.inputValue = '';
				row.inputVisible = false;
				
				// 发起请求 保存到数据库
				this.saveAttrVals(row);
			},
			showInput(row) {
				row.inputVisible = true;
				// 让文本框自动获得焦点
				this.$nextTick(() => {
					this.$refs.saveTagInput.$refs.input.focus()

				})
			},
			// 发送修改请求
			async saveAttrVals(row){
				let {data : res} = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
					attr_name:row.attr_name,
					attr_sel:row.attr_sel,
					attr_vals:row.attr_vals.join(' ')
				})
				
				if(res.meta.status !== 200){
					return this.$message.error('修改参数项失败');
				}
				
				this.$message.success('修改参数项成功');
			},
			// 删除参数项
			handleClose(idx , row){
				row.attr_vals.splice(idx , 1);
				this.saveAttrVals(row);
			}
		},
		computed: {
			// 是否
			isBtnDisable() {
				if (this.selectedCateKeys.length !== 3) {
					return true;
				}
				return false;
			},
			// 当前选中三级分类id
			cateId() {
				if (this.selectedCateKeys.length = 3) {
					return this.selectedCateKeys[2];
				}
				return null;
			},
			titleText() {
				if (this.activeName === 'many') {
					return '动态参数'
				}
				return '静态属性'
			}
		}
	}
</script>

<style scoped>
	.cat_opt {
		margin: 15px 0;
	}

	.el-table {
		margin-top: 15px;
	}

	.el-tag {
		margin: 5px;
	}

	.input-new-tag {
		width: 150px;
	}
</style>
