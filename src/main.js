import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/font/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import {
  Form,
  FormItem,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Message,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  table,
  TableColumn,
  Pagination,
  Switch,
  Tooltip,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Cascader,
  PageHeader,
  Image,
  InputNumber,
  Upload
} from 'element-ui'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItemGroup)
  .use(MenuItem)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Row)
  .use(Col)
  .use(table)
  .use(TableColumn)
  .use(Pagination)
  .use(Switch)
  .use(Tooltip)
  .use(Dialog)
  .use(Tag)
  .use(Tree)
  .use(Cascader)
  .use(PageHeader)
  .use(Image)
  .use(InputNumber)
  .use(Upload)
Vue.component('zk-table', ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
