<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片 -->
		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>

			<!-- 表格 -->
			<el-table :data="orderList" stripe style="width: 100%">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="order_number" label="订单编号">
				</el-table-column>
				<el-table-column prop="order_price" label="订单价格">
				</el-table-column>
				<el-table-column prop="pay_status" label="是否付款">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
						<el-tag v-else type="danger">未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="is_send" label="是否发货">
				</el-table-column>
				<el-table-column prop="create_time" label="下单时间">
					<template slot-scope="scope">
						{{scope.row.create_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
						<el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination style="margin-top: 15px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 8, 12]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-card>

		<!-- 修改地址的对话框 -->
		<el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
			<el-form :model="addressForm" status-icon :rules="addressRules" ref="addressFormRef" label-width="100px">
				<el-form-item label="市区县" prop="address1">
					<el-cascader expandTrigger='hover' v-model="addressForm.address1" :options="cityData"></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address2">
					<el-input type="password" v-model="addressForm.address2"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addressVisible = false">取 消</el-button>
				<el-button type="primary" @click="addressVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 物流对话框 -->
		<el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
			<div class="block">
			  <el-timeline>
			    <el-timeline-item
			      v-for="(item, index) in progressInfo"
			      :key="index"
			      :timestamp="item.time">
			      {{item.context}}
			    </el-timeline-item>
			  </el-timeline>
			</div>

			
		</el-dialog>
	</div>
</template>

<script>
	import cityData from './citydata.js'
	export default {
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				// 订单列表数据
				orderList: [],
				// 总数
				total: 0,
				addressVisible: false,
				// 验证规则
				addressRules: {
					address1: [{
						required: true,
						message: '请选择省市区',
						trigger: 'blur'
					}],
					address2: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}]
				},
				addressForm: {
					address1: [],
					address2: ''
				},
				// 地址数据
				cityData,
				// 物流对话框
				progressVisible:false,
				// 物流信息
				progressInfo:[]
			}
		},
		created() {
			this.getOrderList()
		},
		methods: {
			// 获取订单列表
			async getOrderList() {
				let {
					data: res
				} = await this.$axios.get('orders', {
					params: this.queryInfo
				})

				if (res.meta.status !== 200) {
					return this.$message.error('获取订单列表失败');
				}

				this.orderList = res.data.goods;
				this.total = res.data.total;

			},
			handleSizeChange(newsize) {
				this.queryInfo.pagesize = newsize;
				this.getOrderList();
			},
			handleCurrentChange(newpage) {
				this.queryInfo.pagenum = newpage;
				this.getOrderList();
			},
			// 展示修改地址的对话框
			showBox() {
				this.addressVisible = true;
			},
			// 关闭对话框
			addressDialogClosed(){
				this.$refs.addressFormRef.resetFields()
			},
			// 查询物流对话框(显示)
			async showProgressBox(){
				let {data:res} = await this.$axios.get('/kuaidi/1106975712662');
				
				if(res.meta.status !== 200){
					return this.$message.error('获取物流进度失败');
				}
				
				this.progressInfo = res.data;
				this.progressVisible = true;
			}
		}
	}
</script>

<style scoped>
.el-cascader{
	width: 100%;
}
</style>
