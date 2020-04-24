<template>
  <div class="good-category">
    <!--头部面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--商品列表-->
    <el-card class="box-card">
     <el-button type="primary" @click="addCategory">添加分类</el-button>
     <!--显示的tree-->
     <zk-table
        class="zk-table"
        :data="categories"
        :columns="columns"
        show-index
        :selection-type="false"
        border stripe
        :expand-type="false"
        index-text="#"
      >
      <!--是否有效插槽-->
      <template slot="isValid" scope="scope">
          <i class="el-icon-success" style="color:#20B2AA" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color:#ccc" v-else></i>
      </template>
      <!--排序-->
      <template slot="order" scope="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">等级一</el-tag>
          <el-tag size="small" v-else-if="scope.row.cat_level === 1" type="success">等级二</el-tag>
          <el-tag size="small" v-else type="info">等级三</el-tag>
      </template>
      <!--操作-->
      <template slot="opt" scope="scope">
          <el-button size="small" icon="el-icon-edit" type="primary" @click="editCategoryOpt(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteCategory(scope.row)">删除</el-button>
      </template>
     </zk-table>
     <!--底部分页-->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getCategorysParams.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="getCategorysParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    </el-card>
     <!--添加分类弹窗-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="30%"
      >
      <el-form :model="addCategoryFormData"  :rules="addCategoryFormRules" ref="addCategoryFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分类名称" prop="cat_name" >
        <el-input v-model="addCategoryFormData.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader
          v-model="selectData"
          :options="categorieyList"
          :props="props"
          :value="addCategotySelectValue"
          clearable
          @change="handleChange"
         ></el-cascader>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatagorySure">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑分类弹窗-->
    <el-dialog
      title="修改分类"
      :visible.sync="updateCategoryDialogVisible"
      width="30%"
      >
      <el-form :model="updateCategoryFormData"  :rules="updateCategoryFormRules" ref="updateCategoryFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分类名称" prop="cat_name" >
        <el-input v-model="updateCategoryFormData.cat_name"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goodCategory',
  data () {
    return {
      selectData: [], // 记录下拉的数组
      props: { // 级联选择器的选项
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 修改分类表单的数据
      updateCategoryFormData: {
        cat_name: ''
      },
      // 修改分类弹窗
      updateCategoryDialogVisible: false,
      // 添加分类的数据
      addCategoryFormData: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCategotySelectValue: '', // 添加分类的类名
      // 控制添加分类弹窗
      addCategoryDialogVisible: false,
      total: 0, // 数据的总数
      getCategorysParams: {
        type: '3',
        pagenum: 1, // 显示商品列表的第几页
        pagesize: 5 // 显示商品列表每页显示多少条数据
      },
      categorieyList: [], // 请求全部商品列表
      categories: [], // 商品列表
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isValid'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 分类规则
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      updateCategoryFormRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 请求商品列表数据
    async getCategories () {
      const { data } = await this.$http.get('/categories', {
        params: this.getCategorysParams
      })
      if (data.meta.status === 200) {
        this.categories = data.data.result
        this.total = data.data.total
      }
    },
    // 当页码显示的数据发生改变时触发
    handleSizeChange (newsize) {
      this.getCategorysParams.pagesize = newsize
      this.getCategories()
    },
    // 当页码发生改变时触发
    handleCurrentChange (newpage) {
      this.getCategorysParams.pagenum = newpage
      this.getCategories()
    },
    // 点击添加分类按钮
    async addCategory () {
      this.addCategoryDialogVisible = true
      this.selectData = []
      this.addCategoryFormData.cat_name = ''
      this.addCategoryFormData.cat_pid = 0
      this.addCategoryFormData.cat_level = 0
      const { data } = await this.$http.get('/categories', {
        params: {
          type: '2'
        }
      })
      if (data.meta.status === 200) {
        this.categorieyList = data.data
      }
    },
    // 点击添加分类弹窗的确定按钮
    addCatagorySure () {
      this.$refs.addCategoryFormRef.validate(async (valid) => {
        if (valid) {
          this.addCategoryDialogVisible = false
          if (this.selectData.length === 1) {
            this.addCategoryFormData.cat_pid = this.selectData[0]
            this.addCategoryFormData.cat_level = 1
          } else if (this.selectData.length === 2) {
            this.addCategoryFormData.cat_pid = this.selectData[1]
            this.addCategoryFormData.cat_level = 2
          }
          const { data } = await this.$http.post('/categories', this.addCategoryFormData)
          if (data.meta.status === 201) {
            this.$message.success(data.meta.msg)
            this.getCategories()
          } else {
            this.$message.error('添加分类失败')
          }
        } else {
          return false
        }
      })
    },
    editCategoryOpt (category) {
      this.cateId = category.cat_id
      this.updateCategoryDialogVisible = true
      this.updateCategoryFormData.cat_name = category.cat_name
    },
    updateCategory () {
      this.$refs.updateCategoryFormRef.validate(async (valid) => {
        if (valid) {
          const { data } = await this.$http.put('/categories/' + this.cateId, {
            cat_name: this.updateCategoryFormData.cat_name
          })
          if (data.meta.status === 200) {
            this.$message.success(data.meta.msg)
            this.getCategories()
            this.updateCategoryDialogVisible = false
          } else {
            this.$message.error('更新失败')
          }
        } else {
          return false
        }
      })
    },
    deleteCategory (category) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete('/categories/' + category.cat_id)
        console.log(data)
        if (data.meta.status === 200) {
          this.getCategories()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChange (data) {
      this.selectData = data
    }
  }
}
</script>

<style lang="scss">
.zk-table{
  margin-top: 15px;
}
.el-cascader {
  width: 100%
}
</style>
