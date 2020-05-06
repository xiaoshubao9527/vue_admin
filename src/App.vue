<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  user-select: none;
}
.el-container {
  min-width: 1375px;
  /deep/ .el-dialog__body {
    padding-right: 30px !important;
  }
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}
.box-card {
  margin-top: 30px;
  .el-table {
    margin-top: 20px;
    .cell {
      display: flex;
    }
  }
  .el-pagination {
    margin-top: 16px;
  }
}
 .el-cascader__dropdown {
    height: 260px !important;
  }
  .el-cascader-panel {
    height: 100% !important;
  }
</style>
