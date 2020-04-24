<template>
  <div class="deit-goods">
      <!--头部-->
      <el-page-header @back="goBack" content="修改商品页面">
      </el-page-header>
      <!--卡片区域-->
      <el-card>
        <el-form :model="editGoodsruleForm" :rules="editGoodsrules" ref="editGoodsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称：" prop="goods_name">
          <el-input v-model="editGoodsruleForm.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品价格：" prop="goods_price">
          <el-input-number :min="1" v-model="editGoodsruleForm.goods_price"></el-input-number>
        </el-form-item>
        <el-form-item label="商品数量：" prop="goods_number">
          <el-input-number :min="1" v-model="editGoodsruleForm.goods_number"></el-input-number>
        </el-form-item>
        <el-form-item label="商品重量：" prop="goods_weight">
          <el-input-number :min="1" v-model="editGoodsruleForm.goods_weight"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片：">
          <div>
            <!-- <el-image
                style="width: 100px; height: 100px"
                :src="img.pics_sma_url"
                :key="img.pics_id"
                v-for="img in pics"
                :preview-src-list="previewSrcList"
            ></el-image> -->
            <el-upload
            :action="'http://127.0.0.1:8888/api/private/v1/goods/' + this.$route.query.id"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            class="upload-demo"
            :limit="8"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="pics"
            list-type="picture">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="商品描述：">
          1
        </el-form-item>
        </el-form>
      </el-card>
      <!--预览图片-->
      <div class="preview-img" :style="{display:isPreview?'block':'none'}">
          <div class="cover"></div>
          <div class="pic">
            <img :src="previewSrc" alt="">
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'EditGoods',
  data () {
    return {
      previewSrc: '', // 预览的图片地址
      isPreview: false, // 是否预览图片
      goodsInfo: {}, // 获取商品的数据
      editGoodsruleForm: {
        goods_name: '', // 商品名称
        goods_price: '', // 商品价格
        goods_number: '', // 商品数量
        goods_weight: '' // 商品重量
      },
      goods_introduce: '', // 商品描述
      pics: [], // 商品图片
      previewSrcList: [],
      editGoodsrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动重量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    // 请求商品详情页面
    async getGoods () {
      const { data } = await this.$http.get('/goods/' + this.$route.query.id)
      console.log(data)
      if (data.meta.status === 200) {
        const editGoodsruleForm = this.editGoodsruleForm
        this.goodsInfo = data.data
        editGoodsruleForm.goods_name = this.goodsInfo.goods_name
        editGoodsruleForm.goods_price = this.goodsInfo.goods_price
        editGoodsruleForm.goods_number = this.goodsInfo.goods_number
        editGoodsruleForm.goods_weight = this.goodsInfo.goods_weight
        this.goods_introduce = this.goodsInfo.goods_introduce
        const arr = this.goodsInfo.pics.map(img => img.pics_sma_url)
        arr.forEach(item => {
          this.pics.push({
            url: item
          })
        })
      } else {
        this.$message.error('获取商品失败')
      }
    },
    // 头部返回按钮
    goBack () {
      this.$router.go(-1)
    },
    // 预览图片
    handlePreview (file) {
      console.log(file)
      this.isPreview = true
      this.previewSrc = file.b
    },
    // 移除图片
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 上传失败
    uploadError () {
      this.$message.error('图片上传失败')
    },
    beforeUpload () {
      console.log(1)
    },
    uploadSuccess () {
      this.$message.success('图片上传成功')
      console.log('上传成功', arguments)
    }
  }
}
</script>

<style lang="scss">
.el-card {
  margin-top: 20px
}
.el-input-number {
  width: 100%;
}
</style>
