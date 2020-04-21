<template>
  <div class="admin">
    <el-container>
      <!--头部-->
      <el-header>
        <div>
          <img src="@/assets/logo.png" alt />
          <span>Vue后台管理系统后台</span>
        </div>
        <div>
          <span style="margin-right:6px">{{username}}</span>
          <el-button type="info" @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!--头部折叠-->
          <div class="menu-collapse" @click="isCollapse = !isCollapse">|||</div>
          <!--左侧菜单列表-->
          <el-menu
            background-color="#313643"
            text-color="#ffffff"
            :collapse="isCollapse"
            :collapse-transition="false"
            :unique-opened="true"
            :router="true"
            :default-active="defaultActive"
          >
            <el-submenu :index="subMenu.path" v-for="subMenu in menuList" :key="subMenu.id">
              <template slot="title">
                <i :class="menuIcon[subMenu.id]"></i>
                <span>{{ subMenu.authName }}</span>
              </template>
              <template v-if="subMenu.children[0].children.length > 0">
                <el-submenu :index="menuItem.path" v-for="menuItem in subMenu.children" :key="menuItem.id">
                  <template slot="title">
                    <i :class="menuIcon[menuItem.id]"></i>
                    <span>{{ menuItem.authName }}</span>
                  </template>
                  <el-menu-item
                  @click="clickMenuItem(menuItem1.path)"
                    :index="menuItem1.path"
                    v-for="menuItem1 in menuItem1.children"
                    :key="menuItem1.id"
                  >
                    <i class="el-icon-menu"></i>
                    <span>{{ menuItem1.authName }}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item
                  @click="clickMenuItem(menuItem.path)"
                  :index="menuItem.path"
                  v-for="menuItem in subMenu.children"
                  :key="menuItem.id"
                 >
                  <i class="el-icon-menu"></i>
                  <span>{{ menuItem.authName }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--内容区域-->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { reqMenus } from '@/api/index.js'
export default {
  name: 'Admin',
  data () {
    return {
      username: '', // 记录登录的用户名
      isCollapse: false, // 控制是否收缩左侧菜单
      menuList: [], // 左侧菜单
      menuIcon: { // 左侧菜单对应的图标
        125: 'el-icon-s-custom',
        103: 'el-icon-s-management',
        101: 'el-icon-s-comment',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      defaultActive: '' // 左侧菜单默认激活的path
    }
  },
  created () {
    this.getMenus()
    this.defaultActive = sessionStorage.getItem('menuItemPath') || ''
    this.username = JSON.parse(window.sessionStorage.getItem('userInfo')).username || ''
  },
  methods: {
    // 退出登录按钮
    loginOut () {
      window.sessionStorage.clear('token')
      this.$router.push({
        name: 'Home'
      })
    },
    // 请求左侧菜单
    async getMenus () {
      const { data } = await reqMenus()
      if (data.meta.status === 200) {
        this.menuList = data.data
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // 点击munu-item事件 利用sessionStorage来保存点击事件path，来完成刷新页面菜单高亮
    clickMenuItem (path) {
      sessionStorage.setItem('menuItemPath', path)
      this.defaultActive = path
    }
  }
}
</script>

<style lang="scss" scoped>
.admin {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #373c41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      div {
        display: flex;
        align-items: center;
        img {
          width: 60px;
          margin-right: 10px;
        }
      }
    }
    .el-aside {
      background-color: #313643;
      .menu-collapse {
        height: 30px;
        background-color: #475063;
        text-align: center;
        line-height: 30px;
        font-size: 18px;
        letter-spacing: 0.2em;
        cursor: pointer;
        color: #fff;
      }
    }
    .el-main {
      background-color: #eaedf2;
    }
  }
  .el-menu {
    border: 0 !important;
  }
}
</style>
