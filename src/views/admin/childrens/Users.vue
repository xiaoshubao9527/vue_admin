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
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--卡片表格-->
      <el-table :data="users" border stripe style="width: 100%" class="el-table">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="role_name" label="状态"></el-table-column>
        <el-table-column prop="role_name" label="操作"></el-table-column>
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
      >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { reqUsers } from '@/api/index.js'
export default {
  name: 'Users',
  data () {
    return {
      users: [], // 用户列表
      total: 0, // 总的用户数量
      userParams: {
        // 请求用户列表携带给后台的参数
        query: '', // 根据关键字搜索用户，默认''为搜索全部用户
        pagenum: 1, // 页码数
        pagesize: 2 // 每页显示几条数据
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
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .box-card {
    margin-top: 30px;
    .el-table {
      margin-top: 20px;
    }
    .el-pagination{
      margin-top: 16px;
    }
  }
}
</style>
