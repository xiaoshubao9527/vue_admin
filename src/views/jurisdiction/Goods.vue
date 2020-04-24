<template>
  <div class="goods">
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--头部搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="pageReqParams.query" clearable @clear="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!--table表格区域-->
      <el-table :data="goods" style="width: 100%" stripe border size="small">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" min-width="600px" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" min-width="100px" label="创建时间">
            <template slot-scope="scope">
                <p>{{new Date(scope.row.add_time).toLocaleString()}}</p>
            </template>
        </el-table-column>
        <el-table-column prop="add_time" label="操作" min-width="200px">
            <template slot-scope="scope">
                <el-button size="small" type="info" @click="detailGoods(scope)">详情</el-button>
                <el-button size="small" type="primary" @click="deitGoods(scope)">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageReqParams.pagenum"
      :page-sizes="[10, 15, 30, 50]"
      :page-size="pageReqParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      goods: [], // 商品列表
      pageReqParams: { // 请求分页的商品列表
        pagenum: 1,
        pagesize: 5,
        query: ''
      },
      total: 0 // 商品的总数
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    // 请求商品列表数据
    async getGoods () {
      const { data } = await this.$http.get('/goods', { params: this.pageReqParams })
      if (data.meta.status === 200) {
        this.goods = data.data.goods
        this.total = data.data.total
      } else {
        this.$message.error('获取商品列表失败')
      }
    },
    // 每页显示的size发生改变
    handleSizeChange (newsize) {
      this.pageReqParams.pagesize = newsize
      this.getGoods()
    },
    // 页数发生改变
    handleCurrentChange (newpage) {
      this.pageReqParams.pagenum = newpage
      this.getGoods()
    },
    // 去编辑商品信息页面
    deitGoods (good) {
      console.log(good.row.goods_id)
      this.$router.push({
        name: 'editGoods',
        query: {
          id: good.row.goods_id
        }
      })
    },
    // 去商品详情页面
    detailGoods (good) {
      this.$router.push({
        name: 'detailGoods',
        query: {
          id: good.row.goods_id
        }
      })
    }
  }
}
</script>

<style lang="scss">
table {
    tr {
        height: 60px !important;
    }
}
</style>
