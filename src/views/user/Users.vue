<template>
  <div class="users">
    <!--头部面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'Admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--内容卡片-->
    <el-card class="box-card">
      <!--卡片头部搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="userParams.query"
            clearable
            @clear="()=>{this.getUsers()}"
          >
            <el-button slot="append" icon="el-icon-search" @click="()=>this.getUsers()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUsersDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--卡片表格-->
      <el-table :data="users" border stripe style="width: 100%" class="el-table">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="roleStatusChange(scope)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户信息"
              :enterable="false"
              placement="top-start"
            >
              <el-button size="small" type="primary" icon="el-icon-edit" @click="editUserInfo($event, scope)"></el-button>
            </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除用户"
            :enterable="false"
            placement="top-start"
          >
            <el-button size="small" type="warning" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="设置用户权限"
            :enterable="false"
            placement="top-start"
          >
            <el-button size="small" type="danger" icon="el-icon-setting"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器-->
      <el-pagination
        class="el-pagination"
        :current-page="userParams.pagenum"
        :page-sizes="[2, 4, 10, 20]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="CurrentChange"
      ></el-pagination>
    </el-card>
    <!--添加用户弹窗-->
    <el-dialog
      title="添加用户"
      :visible.sync="addUsersDialog"
      width="30%"
      @close="()=>this.$refs.addUsersFormRef.resetFields()"
    >
      <!--添加用户表单-->
      <el-form
        :model="addUsersFormData"
        :rules="addUsersFormRules"
        ref="addUsersFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsersFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUsersFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsersFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUsersFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUsersDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑修改用户信息弹窗-->
    <el-dialog
      title="修改用户"
      :visible.sync="editUsersDialog"
      width="30%"
      @close="()=>this.$refs.editUsersFormRef.resetFields()"
    >
      <!--修改用户表单-->
      <el-form
        :model="editUsersFormData"
        :rules="editUsersFormRules"
        ref="editUsersFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUsersFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUsersFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUsersFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUsersDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqUsers, addUser } from '@/api/index.js'
export default {
  name: 'Users',
  data () {
    var checkEmail = (rule, value, callback) => {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    var checkMobile = (rule, value, callback) => {
      const reg = /^1[3-9][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      users: [], // 用户列表
      total: 0, // 总的用户数量
      userParams: {
        // 请求用户列表携带给后台的参数
        query: '', // 根据关键字搜索用户，默认''为搜索全部用户
        pagenum: 1, // 页码数
        pagesize: 2 // 每页显示几条数据
      },
      addUsersDialog: false, // 控制是否显示添加用户弹窗
      addUsersFormData: {
        // 添加用户表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUsersFormRules: {
        // 添加用户规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUsersDialog: false, // 控制是否显示编辑用户弹窗
      editUsersFormData: {
        // 修改用户的表单数据
        username: '',
        email: '',
        mobile: ''
      },
      editUsersFormRules: {
        // 添加用户规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    // 请求用户列表
    async getUsers () {
      const { data } = await reqUsers(this.userParams)
      if (data.meta.status === 200) {
        this.users = data.data.users
        this.total = data.data.total
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // 修改 每页请求多少条数据
    pageSizeChange (pagesize) {
      this.userParams.pagesize = pagesize
      this.getUsers()
    },
    // 修改 指定页面，跳转到第几页,请求指定页面的数据
    CurrentChange (pagenum) {
      this.userParams.pagenum = pagenum
      this.getUsers()
    },
    // table中的状态开关改变时触发
    async roleStatusChange (userInfo) {
      const { data } = await this.$http.put(
        `users/${userInfo.row.id}/state/${userInfo.row.mg_state}`
      )
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // 点击添加用户提交按钮
    addUserInfo (formName) {
      this.$refs.addUsersFormRef.validate(async valid => {
        if (valid) {
          const { data } = await addUser(this.addUsersFormData)
          if (data.meta.status === 201) {
            this.$message.success(data.meta.msg)
            this.addUsersDialog = false
            this.getUsers()
          }
        } else {
          return false
        }
      })
    },
    // 点击修改用户按钮
    editUserInfo (e, { row }) {
      this.editUsersDialog = true
      this.editUsersFormData.username = row.username
      this.editUsersFormData.id = row.id
      this.editUsersFormData.email = row.email
      this.editUsersFormData.mobile = row.mobile
    },
    // 点击修改用户表单的确定按钮
    async updateUserInfo () {
      const editUsersFormData = this.editUsersFormData
      const { data } = await this.$http.put(`/users/${editUsersFormData.id}`, {
        email: editUsersFormData.email,
        mobile: editUsersFormData.mobile
      })
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
        this.editUsersDialog = false
        this.getUsers()
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // 点击删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete('/users/' + id)
        if (data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: data.meta.msg
          })
          this.getUsers()
        } else {
          this.$message.error(data.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  /deep/ .el-dialog__body {
    padding-right: 30px !important;
  }
}
</style>
