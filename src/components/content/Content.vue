<template>
	<div class="con">

		<el-card class="filter_card">
			<div slot="header" class="clearfix">
				<!-- 面包屑 -->
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>内容管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 表单 -->
			<el-form :model="form" label-width="80px" size="mini">

				<el-form-item label="状态">
					<el-radio-group>
						<el-radio label="全部"></el-radio>
						<el-radio label="草稿"></el-radio>
						<el-radio label="待审核"></el-radio>
						<el-radio label="审核通过"></el-radio>
						<el-radio label="审核失效"></el-radio>
						<el-radio label="已删除"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="频道">
					<el-select placeholder="请选择频道" v-model="form.region">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期">
					<el-date-picker v-model="form.date1" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
					 :default-time="['12:00:00']">
					</el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="list_table">
			<div slot="header" class="clearfix">
				根据查询条件共查询46147条结果
			</div>
			<el-table :data="tableData" style="width: 100%" stripe size="mini">
				<el-table-column prop="date" label="日期" width="180">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="address" label="地址">
				</el-table-column>
			</el-table>

			<div class="main_foot">
				<el-pagination layout="prev, pager, next" :total="1000" background>
				</el-pagination>
			</div>
		</el-card>


	</div>
</template>

<script>
	export default {
		name: 'Content',
		data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			
			// 获取列表数据
			async getActives(){
				let data = await this.$axios.get('/articles',{});
				// console.log(data);
			}
		},
		created() {
			// this.getActives();
		}
	}
</script>

<style>
	@import "~@/assets/less/content.less";
</style>
