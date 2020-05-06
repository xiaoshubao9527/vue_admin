<template>
    <div class="report">
      <!--头部面包屑-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    <!--卡片内容区域-->
      <el-card>
        数据报表：<v-chart :options="polar"/>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'report',
  data () {
    return {
      polar: {}
    }
  },
  created () {
    this.getReports()
  },
  methods: {
    async getReports () {
      const { data } = await this.$http.get('/reports/type/1')
      if (data.meta.status === 200) {
        this.polar = data.data
      } else {
        this.$message.error('获取数据失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 30px;
}
</style>
