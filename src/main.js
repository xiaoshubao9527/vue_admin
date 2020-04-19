import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/font/iconfont.css'
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
  Pagination
} from 'element-ui'
Vue.config.productionTip = false
Vue.prototype.$message = Message
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
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
