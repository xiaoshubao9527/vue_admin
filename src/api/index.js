import api from './base'
// login
// 请求登录接口
export const reqLogin = (data) => api.post('/login', data)

// admin
// 請求左侧菜单列表
export const reqMenus = () => api.get('/menus')
// 用户管理 请求用户列表
export const reqUsers = (data) => api.get('/users', data)
