<template>
  <div class="roles">
    <!--头部面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容区域-->
    <el-card class="box-card">
      <!--表格区域-->
      <el-table :data="comPageData" stripe border style="width: 100%">
        <el-table-column type="index" :index="methodPageIndex"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="300"></el-table-column>
        <el-table-column prop="path" label="路径" width="300"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==='0'">等级一</el-tag>
                <el-tag v-else-if="scope.row.level==='1'" type="success">等级二</el-tag>
                <el-tag v-else type="warning" @click="handleClick(scope)">等级三</el-tag>
            </template>
        </el-table-column>
      </el-table>
      <!--底部分页器-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="rights.length"
        :page-size="pagesize"
        :current-page="page"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      rights: [], // 权限列表
      page: 1, // 当前的页码
      pagesize: 10 // 每页显示多少条数据
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    // 请求权限列表
    async getRights () {
      const { data } = await this.$http.get('/rights/list')
      if (data.meta.status === 200) {
        this.rights = data.data
      } else {
        this.$message.error('获取角色权限列表失败')
      }
    },
    // 页码改变时触发
    pageChange (page) {
      this.page = page
    },
    methodPageIndex (index) {
      return (this.page - 1) * this.pagesize + index + 1
    }
  },
  computed: {
    // 计算每页显示的数据 分页器和表格联动
    comPageData () {
      const start = (this.page - 1) * this.pagesize
      const len = this.rights.length
      const totalLen = start + this.pagesize
      const end = totalLen >= len ? len : totalLen
      return this.rights.slice(start, end)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
