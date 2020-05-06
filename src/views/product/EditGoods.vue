<template>
  <div class="deit-goods">
      <!--头部-->
      <el-page-header @back="goBack" :content="id?'修改商品页面':'添加商品页面'">
      </el-page-header>
      <!--卡片区域-->
      <el-card>
        <el-form :model="editGoodsruleForm" :rules="editGoodsrules" ref="editGoodsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称：" prop="goods_name" width="200px" >
          <el-input v-model="editGoodsruleForm.goods_name" :disabled="id?true:false"></el-input>
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
        <el-form-item label="商品分类：" prop="goods_cat">
            <el-alert el-alert
              title="注意：只允许为商品添加为第三级分类！"
              type="warning"
              :closable="false"
              show-icon>
            </el-alert>
            <el-cascader
              :options="options"
              v-model="editGoodsruleForm.goods_cat"
              :props="props"
              clearable
           ></el-cascader>
        </el-form-item>
        <!--图片上传-->
        <el-form-item label="商品图片：">
          <div>
            <el-upload
            :action="'http://127.0.0.1:8888/api/private/v1/goods/' + this.$route.query.id"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            class="upload-demo"
            :limit="8"
            :on-preview="handlePreview"
            :file-list="showPics"
            list-type="picture">
            <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          </div>
        </el-form-item>
        <!--富文本编辑器-->
        <el-form-item label="商品描述：" style="width:1200px">
          <quill-editor
            ref="myQuillEditor"
            v-model="content"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateCategory">提交</el-button>
        </el-form-item>
        </el-form>
      </el-card>
      <!--预览图片-->
      <div class="preview-img" :style="{display:isPreview?'block':'none'}">
          <div class="cover" @click="isPreview = false"></div>
          <div class="pic">
            <img :src="previewSrc" alt="">
          </div>
      </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'EditGoods',
  data () {
    return {
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      options: [],
      previewSrc: '', // 预览的图片地址
      isPreview: false, // 是否预览图片
      goodsInfo: {}, // 获取商品的数据
      editGoodsruleForm: {
        goods_cat: '', // 商品分类
        goods_name: '', // 商品名称
        goods_price: '', // 商品价格
        goods_number: '', // 商品数量
        goods_weight: '', // 商品重量
        attrs: [] // 商品的分类
      },
      goods_introduce: '', // 商品描述
      showPics: [], // 显示的商品图片
      pics: [], // 提交给后台的商品图片
      uploadPics: [], // 要上传的商品图片
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
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 富文本数据
      content: '',
      editorOption: {
      }
    }
  },
  created () {
    this.getGoods()
  },
  components: {
    quillEditor
  },
  methods: {
    // 请求商品分类列表
    async getCategories () {
      const { data } = await this.$http.get('/categories')
      if (data.meta.status === 200) {
        this.options = data.data
      }
    },
    // 请求商品详情页面
    async getGoods () {
      this.id = +this.$route.query.id
      this.getCategories()
      if (this.id) { // 有id代表点击的是编辑按钮，没有则是添加商品按钮
        const { data } = await this.$http.get('/goods/' + this.id)
        const arr = []
        data.data.goods_cat.split(',').forEach(async item => {
          const { data } = await this.$http.get('/categories/' + item)
          if (data.meta.status === 200) {
            arr.push(data.data)
          }
          this.editGoodsruleForm.goods_cat = arr.sort((a, b) => a.cat_id - b.cat_id).map(item => item.cat_id)
        })
        if (data.meta.status === 200) {
          const editGoodsruleForm = this.editGoodsruleForm
          this.goodsInfo = data.data
          this.editGoodsruleForm.attrs = data.data.attrs
          this.editGoodsruleForm.goods_cat = data.data.goods_cat
          editGoodsruleForm.goods_name = this.goodsInfo.goods_name
          editGoodsruleForm.goods_price = this.goodsInfo.goods_price
          editGoodsruleForm.goods_number = this.goodsInfo.goods_number
          editGoodsruleForm.goods_weight = this.goodsInfo.goods_weight
          this.content = this.goodsInfo.goods_introduce
          this.goods_introduce = this.goodsInfo.goods_introduce
          this.goodsInfo.pics.forEach(img => {
            const picSuffix = img.pics_sma_url.split('.')
            this.showPics.push({
              url: img.pics_sma_url,
              name: img.pics_id + '.' + picSuffix[picSuffix.length - 1]
            })
            this.pics.push({
              pic: img.pics_sma_url
            })
          })
        } else {
          this.$message.error('获取商品失败')
        }
      }
    },
    // 头部返回按钮
    goBack () {
      this.$router.go(-1)
    },
    // 预览图片
    handlePreview (file) {
      this.isPreview = true
      this.previewSrc = file.url
      this.pics.push({
        pic: file.url
      })
    },
    // 上传失败
    uploadError () {
      this.$message.error('图片上传失败')
    },
    // 上次成功
    uploadSuccess (result, file, fileList) {
      this.$message.success('图片上传成功')
      this.uploadPics = fileList
      this.pics.push({
        pic: file.url
      })
    },
    // 点击提交
    updateCategory () {
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        if (valid) {
          this.editGoodsruleForm.goods_introduce = this.content
          this.editGoodsruleForm.pics = this.pics
          if (this.id) { // 修改商品提交
            const { data } = await this.$http.put('/goods/' + this.id, this.editGoodsruleForm)
            if (data.meta.status === 200) {
              this.$message.success(data.meta.msg)
              this.$refs.editGoodsFormRef.resetFields()
              this.content = ''
              this.pics = []
              this.$router.push({
                name: 'Goods'
              })
            } else {
              this.$message.error('修改商品信息错误')
            }
          } else {
            const { data } = await this.$http.post('/goods', this.editGoodsruleForm)
            if (data.meta.status === 201) {
              this.$message.success(data.meta.msg)
              this.$router.push({
                name: 'Goods'
              })
            }
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px
}
.el-input-number {
  width: 100%;
}
.preview-img,.preview-img .cover{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.preview-img .cover{
  background-color: rgba(0,0,0,0.5);
}
.pic {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.el-form-item {
  width: 800px;
}
.deit-goods /deep/ .ql-container {
  height: 500px !important;
}
.el-alert{
  margin-bottom: 20px;
  height: 34px;
}
</style>
