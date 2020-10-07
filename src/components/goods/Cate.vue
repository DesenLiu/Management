<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<zk-table :data="cartList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#"
			 border :show-row-hover="false">
				<!-- 是否有效 -->
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted === false"></i>
					<i class="el-icon-error" style="color:red;" v-else></i>
				</template>
				<!-- 排列 -->
				<template slot="sort" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 2" size="mini" type="warning">三级</el-tag>
				</template>
				<!-- 操作 -->
				<template slot="opt" slot-scope="scope">
					<el-button type="primary" size="mini" el-icon-edit @click="showOpen(scope.row)">编辑</el-button>
					<el-button type="danger" size="mini" el-icon-delete @click="removeOpen(scope.row.cat_id)">删除</el-button>
				</template>
			</zk-table>

			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[2, 5, 8, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>


		<!-- 对话框 -->
		<el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%" @close="addCateDialogClosed">
			<!-- 添加分类的表单 -->
			<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<!-- <el-input v-model="addCateForm.cat_name"></el-input> -->
					<el-cascader v-model="selectedKeys" :options="ParentCateList" @change="ParentCateChange" :props="cascaderProps"
					 clearable change-on-select></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCatedialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 编辑 -->
		<el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editCateDialogClosed">
			<el-form :model="editCateForm" :rules="editCateFormRules" ref="addCateFormRef" label-width="100px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="editCateForm.cat_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCate">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询条件
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				// 商品分类的数据列表
				cartList: [],
				// 总数据条数
				total: 0,
				columns: [{
						label: '分类名称',
						prop: 'cat_name',
						width: '400px'
					},
					{
						label: '是否有效',
						type: 'template',
						template: 'isok'
					},
					{
						label: '排序',
						type: 'template',
						template: 'sort'
					},
					{
						label: '操作',
						type: 'template',
						template: 'opt'
					},
				],
				// 添加分类对话框显示隐藏
				addCatedialogVisible: false,
				// 添加分类表单数据对象 
				addCateForm: {
					cat_name: '',
					cat_pid: 0,
					cat_level: 0
				},
				addCateFormRules: {
					cat_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}]
				},
				// 父级分类列表
				ParentCateList: [],
				// 配置对象
				cascaderProps: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				// 选中父级分类id数组
				selectedKeys: [],


				// 编辑对话框
				editDialogVisible: false,
				editCateForm: {
					cat_name: '',
				},
				editCateFormRules: {
					cat_name: [{
						required: true,
						message: '请输入新的分类名称',
						trigger: 'blur'
					}]
				},
				// 编辑哪一个的id
				editCateId:''
			}
		},
		created() {
			this.getCartList();
		},
		methods: {
			// 获取商品分类
			async getCartList() {
				let {
					data: res
				} = await this.$axios.get('categories', {
					params: this.queryInfo
				});

				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类失败')
				}

				this.cartList = res.data.result;
				this.total = res.data.total;
			},
			// 分页切换
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getCartList();
			},
			// 页码
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getCartList();
			},
			showAddCateDialog() {
				this.getParentCateList();
				this.addCatedialogVisible = true;

			},
			// 获取父级分类数据列表
			async getParentCateList() {
				let {
					data: res
				} = await this.$axios.get('categories', {
					params: {
						type: 2
					}
				});

				if (res.meta.status !== 200) {
					return this.$message.error('获取父级列表失败');
				}
				this.ParentCateList = res.data;
			},
			// 选择项发生变化
			ParentCateChange() {
				console.log(this.selectedKeys);
				if (this.selectedKeys.length > 0) {
					// 选中父级分类
					this.addCateForm.cat_pid =
						this.selectedKeys[this.selectedKeys.length - 1];
					this.addCateForm.cat_level = this.selectedKeys.length;

					return;
				} else {
					this.selectedKeys.cat_pid = 0;
					this.selectedKeys.cat_level = 0;
				}

			},

			// 确定添加
			addCate() {
				this.$refs.addCateFormRef.validate(async valid => {
					if (!valid) {
						return this.$message.error('校验未通过');
					}

					let {
						data: res
					} = await this.$axios.post('categories', this.addCateForm)
					if (res.meta.status !== 201) {
						return this.$message.error('添加分类失败')
					}

					this.$message.success('添加分类成功');

					this.getCartList();
					this.addCatedialogVisible = false;
				})
			},
			// 监听对话框关闭事件
			addCateDialogClosed() {
				this.$refs.addCateFormRef.resetFields();
				this.selectedKeys = [];
				this.selectedKeys.cat_pid = 0;
				this.selectedKeys.cat_level = 0;
			},

			// 编辑 (显示对话框)
			showOpen(ros) {
				this.editCateId = ros.cat_id
				this.editDialogVisible = true;
			},
			editCate(){
				this.$refs.addCateFormRef.validate(async valid => {
					if(!valid) return
					let {data:res} = await this.$axios.put(`categories/${this.editCateId}`,this.editCateForm)
					if(res.meta.status !== 200){
						return this.$message.error('编辑分类名称失败');''
					}
					
					this.getCartList();
					this.editDialogVisible = false;
				})
			},
			// 删除
			async removeOpen(id) {
				let rmBool = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err);
				
				
				
				if(rmBool === 'confirm'){
					let {data:res} = await this.$axios.delete(`categories/${id}`);
					
					if(res.meta.status !== 200){
						return this.$message.error('删除分类失败');
					}
					
					this.$message.success('删除分类成功');
					this.getCartList();
				}
			},
			editCateDialogClosed(){
				this.$refs.addCateFormRef.resetFields();
			}
		}
	}
</script>

<style scoped>
	.zk-table {
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.el-cascader {
		width: 100%;
	}
</style>
