<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card>
			<div id="main" style="width:800px;height:400px"></div>
		</el-card>
	</div>
</template>

<script>
	// 导入echarts
	import echarts from 'echarts'

	export default {
		data() {
			return {
				// 需要合并的对象
				options: {
					title: {
						text: '用户来源'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#E9EEF3'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value'
					}]
				}
			}
		},
		// 页面渲染完毕
		mounted() {
			var myChart = echarts.init(document.getElementById('main'));
			// 配置项
			var option = {
				title: {
					text: 'ECharts 入门示例'
				},
				tooltip: {},
				legend: {
					data: ['销量']
				},
				xAxis: {
					data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
				},
				yAxis: {},
				series: [{
					name: '销量',
					type: 'bar',
					data: [5, 20, 36, 10, 10, 20]
				}]
			};


			this.getReportList().then(res => {
				// 配置项
				let newOptions = Object.assign({}, this.options);
				let newRes = Object.assign({},res);
				let newOptionRes = Object.assign(newOptions,newRes)
				// 展示数据
				myChart.setOption(newOptionRes);
			});


		},
		methods: {
			// 获取列表数据
			async getReportList() {
				let {
					data: res
				} = await this.$axios.get(`reports/type/1`);
				if (res.meta.status !== 200) {
					return this.$message.error('获取折线图数据失败');
				}
				return res.data
			}
		}
	}
</script>

<style>

</style>
