<template>
  <div class="deit-goods">
      <!--头部-->
      <el-page-header @back="goBack" content="商品详情页面">
      </el-page-header>
      <!--卡片内容区域-->
      <el-card class="box-card">
          <div>商品名称：<span>{{goodsInfo.goods_name}}</span></div>
          <div>商品价格：<span>{{goodsInfo.goods_price}}</span></div>
          <div>商品数量：<span>{{goodsInfo.goods_number}}</span></div>
          <div>商品重量：<span>{{goodsInfo.goods_weight}}</span></div>
          <div>商品分类：<span>{{goodsInfo.goods_cat}}</span></div>
          <div>商品创建时间：<span>{{new Date(goodsInfo.add_time).toLocaleString()}}</span></div>
          <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="img.pics_sma_url"
                :key="img.pics_id"
                v-for="img in goodsInfo.pics"
                :preview-src-list="previewSrcList"
                ></el-image>
          </div>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'EditGoods',
  data () {
    return {
      goodsInfo: {},
      previewSrcList: []
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    // 请求商品详情页面
    async getGoods () {
      const { data } = await this.$http.get('/goods/' + this.$route.query.id)
      if (data.meta.status === 200) {
        this.goodsInfo = data.data
        this.previewSrcList = data.data.pics.map(img => img.pics_big_url)
        const arr = []
        this.goodsInfo.goods_cat.split(',').forEach(async item => {
          const { data } = await this.$http.get('/categories/' + item)
          if (data.meta.status === 200) {
            arr.push(data.data)
          }
          this.goodsInfo.goods_cat = arr.sort((a, b) => a.cat_id - b.cat_id).map(item => item.cat_name)
          this.goodsInfo.goods_cat = this.goodsInfo.goods_cat.join('/')
        })
      } else {
        this.$message.error('获取商品失败')
      }
    },
    // 头部返回按钮
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  margin-bottom: 30px;
}
.el-image {
  margin-right: 20px;
}
</style>
