<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			 <el-alert
			    title="添加商品信息"
			    type="info"
			    center
			    show-icon
				:closable="false">
			  </el-alert>
			  
			  
			  <!-- 步骤条 -->
			  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
			    <el-step title="基本信息"></el-step>
			    <el-step title="商品参数"></el-step>
			    <el-step title="商品属性"></el-step>
			    <el-step title="商品图片"></el-step>
			    <el-step title="商品内容"></el-step>
			    <el-step title="完成"></el-step>
			  </el-steps>
			  <!-- tab区域 -->
			  <el-form :model="addForm" :rules="addRules" ref="addRuleFormRef" label-width="100px" label-position="top">
			    <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabsLeave" @tab-click="tabClick">
			      <el-tab-pane label="基本信息" name="0">
					    <el-form-item label="商品名称" prop="goods_name">
					      <el-input v-model="addForm.goods_name"></el-input>
					    </el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
						  <el-input v-model="addForm.goods_price"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
						  <el-input v-model="addForm.goods_weight"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
						  <el-input v-model="addForm.goods_number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<!-- 级联选择器 -->
							 <el-cascader
								expandTrigger='hover'
							    v-model="addForm.goods_cat"
							    :options="cateList"
							    :props='cateProps'
							    @change="handleChange"></el-cascader>
						</el-form-item>
				  </el-tab-pane>
			      <el-tab-pane label="商品参数" name="1">
					  <el-form-item v-for="(v , i) in manyTableData" :key="v.attr_id" :label="v.attr_name">
						  <el-checkbox-group v-model="v.attr_vals">
						     <el-checkbox border :label="val" v-for="(val , idx) in v.attr_vals" :key="idx"></el-checkbox>
						   </el-checkbox-group>
					  </el-form-item>
				  </el-tab-pane>
			      <el-tab-pane label="商品属性" name="2">
					  <el-form-item :label="item.attr_name" v-for="(item , i) in onlyTableData" :key="item.attr_id">
						  <el-input v-model="item.attr_vals"></el-input>
					  </el-form-item>
				  </el-tab-pane>
			      <el-tab-pane label="商品图片" name="3">
					  <!-- action api上传地址 -->
					  <el-upload
					    action="http://rambuild.cn:8888/api/private/v1/upload"
					    :on-preview="handlePreview"
					    :on-remove="handleRemove"
						:on-success="handleSuccess"
						:headers="headerObj"
					    list-type="picture">
					    <el-button size="small" type="primary">点击上传</el-button>
					  </el-upload>
				  </el-tab-pane>
			      <el-tab-pane label="商品内容" name="4">
					  <!-- 富文本编辑器 -->
					   <quill-editor
					      ref="myQuillEditor"
					      v-model="addForm.goods_introduce"
					    
					    />
						<!--   :options="editorOption"
					      @blur="onEditorBlur($event)"
					      @focus="onEditorFocus($event)"
					      @ready="onEditorReady($event)" -->
						<!-- 添加商品按钮	 -->
						<el-button type="primary" style="margin-top:15px;" @click="add">添加商品</el-button>
				  </el-tab-pane>
			    </el-tabs>
			 </el-form>
		</el-card>
		
		<!-- 图片预览 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="imgDialogVisible"
		  width="50%">
		  <img :src="previewPath" alt="" class="previewPathImg">
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				activeIndex:'0',
				// 添加商品的表单数据对象
				addForm:{
					goods_name:'',
					goods_price:'',
					goods_weight:'',
					goods_number:'',
					// 商品所处的分类数组
					goods_cat:[],
					// 数组图片
					pics:[],
					// 商品详情描述
					goods_introduce:'',
					attrs:[]
				},
				addRules:{
					goods_name:[
						{required:true,message:'请输入商品名称',trigger:'blur'}
					],
					goods_price:[
						{required:true,message:'请输入商品价格',trigger:'blur'}
					],
					goods_weight:[
						{required:true,message:'请输入商品重量',trigger:'blur'}
					],
					goods_number:[
						{required:true,message:'请输入商品数量',trigger:'blur'}
					],
					goods_cat:[
						{required:true,message:'请输入选中商品分类',trigger:'blur'}
					]
				},
				// 商品分类列表
				cateList:[],
				cateProps:{
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				
				// 动态参数列表
				manyTableData:[],
				// 静态
				onlyTableData:[],
				
				// 图片上传组件请求头
				headerObj:{
					Authorization:window.sessionStorage.getItem('token')
				},
				
				// 真实存在图片
				previewPath:'',
				imgDialogVisible:false
				
			}
		},
		created() {
			this.getCateList();
		},
		methods:{
			// 获取商品分类数据
			async getCateList(){
				let {data : res} = await this.$axios.get('categories');
				
				if(res.meta.status !== 200){
					return this.$message.error('获取分类数据失败');
				}
				
				this.cateList = res.data;
			},
			// 级联选择器选中项触发
			handleChange(){

				if(this.addForm.goods_cat.length !== 3){
					this.addForm.goods_cat = [];
					return;
				}
				
				
			},
			beforeTabsLeave(actName , oldName){
				if(oldName === '0' && this.addForm.goods_cat.length !== 3){
					// tishi
					this.$message.error('请先选择商品分类')
					return false;
				}
				
				return true;
			},
			async tabClick(){
				// 动态参数面板
				if(this.activeIndex == '1'){
					let {data:res} = await this.$axios.get(`categories/${this.cateId}/attributes`,{
						params:{sel:'many'}
					}) 
					
					if(res.meta.status !== 200){
						return this.$message.error('获取动态参数列表失败');
					}
					
					
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals.length === 0 ?  [] : item.attr_vals.split(' ')
					})
					this.manyTableData = res.data
				}else if(this.activeIndex == '2'){
					let { data : res} = await this.$axios.get(`categories/${this.cateId}/attributes`,{
						params:{sel:'only'}
					})
					
					if(res.meta.status !== 200){
						return this.$message.error('获取静态属性失败');
					}
					
					this.onlyTableData = res.data;
				}
			},
			//处理图片预览效果
			handlePreview(file){
				this.previewPath = file.response.data.url;
				this.imgDialogVisible = true;
				
				
			},
			// 移除图片操作
			handleRemove(file){
				// 临时路径
				let filePath = file.response.data.tmp_path;
				// 删除的索引
				let i = this.addForm.pics.findIndex(item => {
					item.pic === filePath
				})
				// 删除
				this.addForm.pics.splice(i , 1);
			},
			// 监听图片上传成功
			handleSuccess(response){
				let picInfo = {
					pic:response.data.tmp_path
				}
				
				this.addForm.pics.push(picInfo);
			},
			// 添加
			add(){
				this.$refs.addRuleFormRef.validate(async valid => {
					if(!valid) return this.$message.error('请填写必要的表单项');
					
					// 执行添加的逻辑
					
					// （深拷贝）
					let newObj = Object.assign({},this.addForm);
					newObj.goods_cat = newObj.goods_cat.join(',');
					
					// 处理动态参数 静态参数
					this.manyTableData.forEach(item => {
						let newInfo = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.addForm.attrs.push(newInfo)
					})
					
					this.onlyTableData.forEach(item => {
						let newInfo = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals
						}
						this.addForm.attrs.push(newInfo)
					})
					
					newObj.attrs = this.addForm.attrs ;
					
					// 发起添加请求
					// 商品的名称 必须唯一
					let {data:res} = await this.$axios.post('goods',newObj);
					
					if(res.meta.status !== 201){
						return this.$message.error('添加商品失败');
					}
					
					this.$message.success('添加商品成功');
					this.$router.push('/goods')
				})
			}
		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length == 3){
					return this.addForm.goods_cat[2]
				}
				
				return null
			}
		}
	}
</script>

<style scoped>
	.el-checkbox{
		margin-right: 0 !important;
	}
	.previewPathImg{
		width: 100%;
	}
</style>
