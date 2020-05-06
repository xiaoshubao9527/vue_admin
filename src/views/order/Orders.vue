<template>
  <div class="orders">
      <!--头部面包屑-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--头部卡片区域-->
      <el-card>
          <!--头部搜索-->
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model="reqOrdersParams.query" class="input-with-select" clearable @clear="this.getOrders">
            <el-button slot="append" icon="el-icon-search" @click="this.getOrders"></el-button>
            </el-input>
          </div>
          <!--表格区域-->
          <el-table
            :data="orders"
            size="small"
            stripe
            border
            style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="order_number"
              label="订单编号"
              min-width="600px"
              >
            </el-table-column>
            <el-table-column
              prop="order_price"
              label="订单价格">
            </el-table-column>
            <el-table-column
              prop="order_pay"
              label="是否付款"
              >
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                <el-tag type="success" v-else>已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_send"
              label="是否发款"
              >
            </el-table-column>
            <el-table-column
              prop="create_time"
              min-width="180px"
              label="下单时间">
              <template slot-scope="scope">
                 {{scope.row.create_time | filterTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="updateAddressDialogVisible = true"></el-button>
                  <el-button type="success" icon="el-icon-location-outline" circle size="mini" @click="checklogis(scope)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页器-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.reqOrdersParams.pagenum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="this.reqOrdersParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
         </el-pagination>
         <!--修改订单信息-->
         <el-dialog
          title="修改地址"
          :visible.sync="updateAddressDialogVisible"
          width="30%">
          <el-form :model="updateAddressForm" :rules="updateAddressRules" ref="updateAddressRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address">
             <el-cascader
              :options="cityOptions"
              :value="city"
              @change="changeProvince"
              change-on-select
            >
             </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input v-model="updateAddressForm.detailAddress"></el-input>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateAddressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateAddressDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!--步骤条窗口-->
        <el-dialog
          class="check-dialog"
          title="查看物流进度"
          :visible.sync="checkLogisticsDialogVisible"
          width="40%">
          <el-steps :active="active" finish-status="success" direction="vertical">
              <el-step
                v-for="(item, index) in logis"
                :key="index"
                :title="item.time"
                :description="item.context"
                :space="100"
              >
              </el-step>
          </el-steps>
          <span slot="footer" class="dialog-footer">
            <el-button @click="checkLogisticsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="checkLogisticsDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
import cityOptions from '@/config/city_data2017_element.js'
export default {
  name: 'order',
  data () {
    return {
      logis: [], // 物流信息
      active: 0, // 代表从0开始
      checkLogisticsDialogVisible: false, // 控制查看物流进度窗口
      city: [],
      cityOptions: cityOptions,
      updateAddressDialogVisible: false, // 控制是否显示修改地址窗口
      orders: [], // 订单列表
      reqOrdersParams: {
        query: '', // 关键字搜索
        pagenum: 1, // 请求的页码
        pagesize: 5 // 每页显示多少条数据
      },
      total: 0, // 订单列表的总数
      updateAddressRules: { // 修改订单地址表单的规则
        address: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      updateAddressForm: {
        address: '',
        detailAddress: ''
      }
    }
  },
  created () {
    this.getOrders()
  },
  filters: {
    filterTime (time) {
      const date = new Date(time)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      let hour = date.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return `${year}-${month}-${day}-${hour}-${minute}-${second}`
    }
  },
  methods: {
    // 请求订单列表
    async getOrders () {
      const { data } = await this.$http.get('/orders', { params: this.reqOrdersParams })
      if (data.meta.status === 200) {
        this.orders = data.data.goods
        this.total = data.data.total
      } else {
        this.$message.error('获取订单列表失败')
      }
    },
    // 当每页显示的数据发生变化
    handleSizeChange (newsize) {
      this.reqOrdersParams.pagesize = newsize
      this.getOrders()
    },
    // 当页码发生变化时触发
    handleCurrentChange (newpage) {
      this.reqOrdersParams.pagenum = newpage
      this.getOrders()
    },
    // 级联选择器改变时候出发
    changeProvince (data) {
      console.log(data)
    },
    // 查看物流按钮
    async checklogis (good) {
      this.checkLogisticsDialogVisible = true
      const { data } = await this.$http.get('/kuaidi/1106975712662')
      if (data.meta.status === 200) {
        this.logis = data.data
      }
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.orders {
  .el-card {
    margin-top: 30px;
    /deep/ .el-input-group {
      width: 500px;
      margin-bottom: 20px;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
  /deep/ .el-step__title{
    font-size: 12px !important;
  }
  .el-cascader{
    width: 100%;
  }
}
</style>
