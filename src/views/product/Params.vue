<template>
    <div class="params">
        <!--头部面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--内容卡片区域-->
        <el-card>
             <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon>
            </el-alert>
            <!--商品分类-->
            <div class="product-category" style="margin:16px 0">
              <span>选择商品分类：</span>
              <el-cascader
                v-model="categoryCasData"
                :options="categoryCasOptions"
                :props="categoryCasProps"
                @change="categoryCasChange"
            ></el-cascader>
            </div>
            <!--tab切换动态参数和静态属性-->
            <el-tabs v-model="tabActiveParams" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="small" @click="addAttriDialogVisible = true" :disabled="!id ? true : false">添加参数</el-button>
                    <el-table
                        :data="params"
                        stripe
                        border
                        style="width: 100%">
                        <!--展开页-->
                        <el-table-column type="expand">
                          <template slot-scope="scoped">
                            <el-tag
                                :key="tag"
                                v-for="tag in scoped.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag, scoped.row)">
                                {{tag}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scoped.row.inputVisible"
                                v-model="scoped.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scoped.row)"
                                @blur="handleInputConfirm(scoped.row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scoped.row)">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <!--表格索引-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="参数名称"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" icon="el-icon-edit" circle @click="updateAttr(scope)"></el-button>
                                <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteAttr(scope)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="small" @click="addAttri" :disabled="!id ? true : false">添加属性</el-button>
                    <el-table
                        :data="params"
                        stripe
                        border
                        style="width: 100%">
                        <!--展开页-->
                        <el-table-column type="expand">
                        </el-table-column>
                        <!--表格索引-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="参数名称"
                        >
                        </el-table-column>
                        <el-table-column
                            label="操作"
                        >
                          <template slot-scope="scope">
                              <el-button type="primary" size="small" icon="el-icon-edit" circle @click="updateAttr(scope)"></el-button>
                              <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteAttr(scope)"></el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--添加动态参数或者静态属性-->
        <el-dialog
            :title="tabActiveParams === 'many' ? '添加动态参数' : '添加静态属性'"
            :visible.sync="addAttriDialogVisible"
            width="30%"
            @close="() => this.$refs.addAttriRuleFormRef.resetFields()"
        >
            <!--动态参数或者静态属性表单-->
            <el-form :model="addAttriRuleForm" :rules="addAttriRules" ref="addAttriRuleFormRef" label-width="120px" class="demo-ruleForm">
            <el-form-item label= '动态参数' prop="attr_name1" v-show="this.tabActiveParams === 'many'">
                <el-input v-model="addAttriRuleForm.attr_name1" ></el-input>
            </el-form-item>
            <el-form-item label='静态属性' prop="attr_name2" v-show="this.tabActiveParams !== 'many'">
                <el-input v-model="addAttriRuleForm.attr_name2"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAttriDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAttriSureBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑动态参数或者静态属性-->
        <el-dialog
            :title="tabActiveParams === 'many' ? '修改动态参数' : '修改静态属性'"
            :visible.sync="editAttriDialogVisible"
            width="30%"
            @close="() => this.$refs.editAttriRuleFormRef.resetFields()"
        >
            <!--动态参数或者静态属性表单-->
            <el-form :model="editAttriRuleForm" :rules="editAttriRules" ref="editAttriRuleFormRef" label-width="120px" class="demo-ruleForm">
            <el-form-item label= '动态参数' prop="attr_name1" v-show="this.tabActiveParams === 'many'">
                <el-input v-model="editAttriRuleForm.attr_name1" ></el-input>
            </el-form-item>
            <el-form-item label='静态属性' prop="attr_name2" v-show="this.tabActiveParams !== 'many'">
                <el-input v-model="editAttriRuleForm.attr_name2"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAttriDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAttriSureBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      addAttriRuleForm: { // 表单添加
        attr_name1: '',
        attr_name2: ''
      },
      editAttriRuleForm: { // 表单修改
        attr_name1: '',
        attr_name2: ''
      },
      editAttriDialogVisible: false, // 控制修改参数弹窗
      addAttriDialogVisible: false, // 控制添加参数弹窗
      params: [], // 参数数据
      tabActiveParams: 'many', // tab切换绑定的值
      categoryCasOptions: [], // 商品分类的级联选择器数据
      categoryCasData: [], // 商品分类级联选择器绑定的数据
      categoryCasProps: { // 商品分类级联选择器配置参数
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      },
      id: 0,
      addAttriRules: {
        attr_name1: [
          { required: true, message: '请添加参数名称', trigger: 'blur' }
        ],
        attr_name2: [
          { required: true, message: '请添加属性名称', trigger: 'blur' }
        ]
      },
      editAttriRules: {
        attr_name1: [
          { required: true, message: '请添加参数名称', trigger: 'blur' }
        ],
        attr_name2: [
          { required: true, message: '请添加属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 请求分类的数据
    async getCategories () {
      const { data } = await this.$http.get('/categories')
      if (data.meta.status === 200) {
        this.categoryCasOptions = data.data
      }
    },
    // 获取参数列表
    async getParams () {
      const { data } = await this.$http.get(`/categories/${this.id}/attributes`, { params: { sel: this.tabActiveParams } })
      if (data.meta.status === 200) {
        this.params = data.data
        this.params.forEach(item => {
          // 看vals的是否全是空格，若全是则返回空窜或者则用空格切割成数组
          item.inputValue = ''
          item.inputVisible = false
          item.attr_vals = item.attr_vals.trim().length ? item.attr_vals.split(' ') : []
        })
      } else {
        this.$message.error('获取参数失败')
      }
    },
    // 级联选择器选中发生变化
    categoryCasChange (arr) {
      if (arr.length !== 3) {
        this.categoryCasData = []
        return
      }
      this.id = arr[arr.length - 1]
      this.getParams()
    },
    // tab点击事件
    handleClick (tab, event) {
      this.getParams()
    },
    // 点击添加属性按钮
    addAttri () {
      this.addAttriDialogVisible = true
    },
    // 点击添加提示框的确定按钮
    async addAttriSureBtn () {
      let catName = ''
      if (this.tabActiveParams === 'many') {
        catName = this.addAttriRuleForm.attr_name1
      } else {
        catName = this.addAttriRuleForm.attr_name2
      }
      const { data } = await this.$http.post(`categories/${this.id}/attributes`, {
        attr_name: catName,
        attr_sel: this.tabActiveParams
      })
      if (data.meta.status === 201) {
        this.$message.success(data.meta.msg)
        this.addAttriDialogVisible = false
        this.getParams()
      }
    },
    // 点击修改提示框按钮
    updateAttr (attr) {
      this.editAttriDialogVisible = true
      if (this.tabActiveParams === 'many') {
        this.editAttriRuleForm.attr_name1 = attr.row.attr_name
      } else {
        this.editAttriRuleForm.attr_name2 = attr.row.attr_name
      }
      this.attrId = attr.row.attr_id
    },
    async deleteAttr (attr) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete(`categories/${this.id}/attributes/${attr.row.attr_id}`)
        if (data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getParams()
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
    // 点击修改提示框的确定按钮
    async editAttriSureBtn () {
      let attrName = ''
      if (this.tabActiveParams === 'many') {
        attrName = this.editAttriRuleForm.attr_name1
      } else {
        attrName = this.editAttriRuleForm.attr_name2
      }
      const { data } = await this.$http.put(`categories/${this.id}/attributes/${this.attrId}`, {
        attr_name: attrName,
        attr_sel: this.tabActiveParams
      })
      if (data.meta.status === 200) {
        this.editAttriDialogVisible = false
        this.getParams()
        this.$message.success(data.meta.msg)
      } else {
        this.$message.error('更新失败')
      }
    },
    // 展开列的事件
    async updateattr (row) {
      const { data } = await this.$http.put(`/categories/${this.id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.tabActiveParams,
        attr_vals: row.attr_vals.join(' ')
      })
      if (data.meta.status === 200) {
        this.$message.success('更新成功')
        row.inputValue = ''
      } else {
        this.$message.error('更新失败')
      }
    },
    // 删除匹配到的指定tag
    async handleClose (tag, row) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      this.updateattr(row)
    },
    showInput (row) { // 点击按钮让输入框显示并且获取焦点
      row.inputVisible = true
      row.inputValue = ''
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (row) { // 输入框失去焦点 里面不为空 则进行更新 并且清空选项
      row.inputVisible = false
      const inputValue = this.inputValue.trin().length // 输入框length不为0 就是不为空格
      if (inputValue) {
        this.updateattr(row)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
    margin-top: 30px;
    .el-row {
      display: flex;
      align-items: center;
      margin-top: 12px;
    }
    .el-table {
        margin-top: 16px;
    }
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
