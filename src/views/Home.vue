<template>
  <div class="home">
    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/logo.png" alt />
      </div>
      <div class="login-form">
        <el-form class="demo-ruleForm" :model="loginForm" :rules="loginFormRules" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              autocomplete="off"
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user11"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
              prefix-icon="iconfont icon-password"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { reqLogin } from '@/api/index.js'
export default {
  name: 'Home',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { data } = await reqLogin(this.loginForm)
          if (data.meta.status === 200) {
            sessionStorage.setItem('token', data.data.token)
            sessionStorage.setItem('userInfo', JSON.stringify(this.loginForm))
            this.$router.push({
              name: 'Admin'
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>
<style lang="scss">
.home {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: skyblue;
  .login-container {
    width: 500px;
    height: 400px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    .login-header {
      position: absolute;
      width: 90px;
      height: 90px;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      padding: 20px;
      box-shadow: 0 0 10px #ccc;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        background-color: #ddd;
        border-radius: 50%;
      }
    }
    .login-form {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      input {
        width: 100%;
      }
      .form-btns {
        margin-top: 20px;
        float: right;
      }
    }
  }
}
</style>
