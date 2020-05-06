<template>
  <div class="roles">
    <!--头部面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容区域-->
    <el-card class="box-card">
      <el-button type="primary" @click="clickaddUserBtn">添加角色</el-button>
      <!--表格区域-->
      <el-table :data="comPageData" stripe border style="width: 100%">
        <!--下拉显示权限信息-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bottom',i1 === 0 ? 'top' : '']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!--一级权限-->
              <el-col :span="5">
                  <el-tag closable @close="deleteExpandRoles(scope, item1.id)">{{ item1.authName }}</el-tag>
              </el-col>
              <!--权限二-->
              <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '' : 'top']" v-for="(item2, i2) in item1.children" :key="item2.id">
                        <el-col :span="4">
                            <el-tag @close="deleteExpandRoles(scope, item2.id)" closable type="success">{{ item2.authName }}</el-tag>
                        </el-col>
                        <!--权限三-->
                        <el-col :span="20" v-for="item3 in item2.children" :key="item3.id">
                          <el-tag @close="deleteExpandRoles(scope, item3.id)" closable type="warning">{{ item3.authName }}</el-tag>
                        </el-col>
                  </el-row>
            </el-col>
        </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" :index="methodPageIndex"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column prop="level" label="操作">
           <template slot-scope="scope">
             <el-row>
              <el-button size="small" icon="el-icon-edit" type="primary" @click="editRoles(scope)">编辑</el-button>
              <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteRoles(scope)">删除</el-button>
              <el-button size="small" icon="el-icon-setting" type="warning" @click="allowRoles(scope.row)">分配权限</el-button>
            </el-row>
           </template>
        </el-table-column>
      </el-table>
      <!--底部分页器-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="roles.length"
        :page-size="pagesize"
        :current-page="page"
        @current-change="pageChange"
      ></el-pagination>
    </el-card>
    <!--添加角色-->
    <el-dialog
      :title="isAddUser ? '添加角色' : '编辑角色'"
      :visible.sync="addRolesDialogVisible"
      width="30%"
      @close="addRoleDialogClose"
      >
      <el-form :model="addRolesFormData" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
   </el-dialog>
   <!--分配权限-->
   <el-dialog
      title="分配权限"
      :visible.sync="allowRolesDialogVisible"
      width="30%"
      @close = "defaultCheckedkeys = []"
      >
      <el-tree
        ref="tree"
        :data="RolesList"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckedkeys"
        :props="defaultProps"
        default-expand-all
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allowRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoles">确 定</el-button>
      </span>
   </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      defaultCheckedkeys: [], // 默认权限的tree选中的key
      RolesList: [], // 请求权限的tree
      allowRolesDialogVisible: false, // 控制分配权限弹窗
      roleId: '', // 角色id
      isAddUser: false, // 标记是否点击了添加角色按钮
      addRolesDialogVisible: false, // 控制是否显示添加角色弹窗
      roles: [], // 角色列表
      page: 1, // 当前页码
      pagesize: 5, // 每页显示多少条数据
      addRolesFormData: { // 添加角色表单数据
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 请求角色列表
    async getRoles () {
      const { data } = await this.$http.get('/roles')
      if (data.meta.status === 200) {
        this.roles = data.data
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // 页码改变时触发
    pageChange (page) {
      this.page = page
    },
    // 表格显示的索引
    methodPageIndex (index) {
      return (this.page - 1) * this.pagesize + index + 1
    },
    // 点击添加角色按钮
    clickaddUserBtn () {
      this.isAddUser = true
      this.addRolesDialogVisible = true
    },
    // 点击添加角色弹窗的确定按钮
    async addRoles (id) {
      if (this.isAddUser) {
        const { data } = await this.$http.post('/roles', this.addRolesFormData)
        if (data.meta.status === 201) {
          this.$message.success(data.meta.msg)
        } else {
          this.$message.error('添加角色失败')
        }
      } else {
        const { data } = await this.$http.put('/roles/' + this.roleId, this.addRolesFormData)
        if (data.meta.status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      }
      this.getRoles()
      this.addRolesDialogVisible = false
    },
    // 点击编辑角色按钮
    editRoles (data) {
      this.roleId = data.row.id
      this.isAddUser = false
      this.addRolesDialogVisible = true
      this.addRolesFormData.roleName = data.row.roleName
      this.addRolesFormData.roleDesc = data.row.roleDesc
    },
    // 添加角色dialog关闭事件
    addRoleDialogClose () {
      this.$refs.addRolesFormRef.resetFields()
      this.addRolesFormData.roleName = ''
      this.addRolesFormData.roleDesc = ''
    },
    // 点击删除角色按钮
    deleteRoles (role) {
      this.roleId = role.row.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$http.delete('/roles/' + this.roleId)
        if (data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoles()
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击expand删除权限
    async deleteExpandRoles (scope, rightId) {
      const { data } = await this.$http.delete(`roles/${scope.row.id}/rights/${rightId}`)
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
        const currentRoleIndex = this.roles.findIndex(item => item.id === scope.row.id)
        this.roles[currentRoleIndex].children = data.data
      } else {
        this.$message.error('删除权限失败')
      }
    },
    // 递归选中所有的角色id，主要第三层chidren的id即可 来更改用户的权限
    selectRolesID (roleInfo, arr) {
      if (!roleInfo.children) {
        return arr.push(roleInfo.id)
      }
      roleInfo.children.forEach(item => {
        this.selectRolesID(item, arr)
      })
    },
    // 点击分配角色按钮
    async allowRoles (roleInfo) {
      this.roleId = roleInfo.id
      const { data } = await this.$http.get('/rights/tree')
      if (data.meta.status === 200) {
        this.RolesList = data.data
        this.selectRolesID(roleInfo, this.defaultCheckedkeys)
        this.allowRolesDialogVisible = true
      }
    },
    // 修改角色权限
    async updateRoles () {
      // 获取半选中和全选中的id
      const rids = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()].join(',')
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
        this.getRoles()
        this.allowRolesDialogVisible = false
      }
    }
  },
  computed: {
    // 计算每页显示的数据 分页器和表格联动
    comPageData () {
      const start = (this.page - 1) * this.pagesize
      const len = this.roles.length
      const totalLen = start + this.pagesize
      const end = totalLen >= len ? len : totalLen
      return this.roles.slice(start, end)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  padding-right: 30px !important;
}
.el-tag{
  margin-bottom: 10px;
}
.el-row {
  padding-top: 10px;
  display: flex;
  align-items: center;
}
.bottom {
  border-bottom: 1px solid #eee
}
.top {
  border-top: 1px solid #eee
}
</style>
