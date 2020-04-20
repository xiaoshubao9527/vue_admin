import axios from 'axios'
// 添加拦截器
axios.interceptors.request.use(function (config) {
  config.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
  config.timeout = 1000
  if (config.url !== '/login') {
    config.headers = {
      Authorization: sessionStorage.getItem('token'),
      'content-type': 'application/json;charset=UTF-8'
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

const api = {}

api.get = function (url, data = {}) {
  return axios.get(url, {
    params: data
  })
}
api.post = function (url, data) {
  return axios.post(url, data)
}
api.put = function (url, data) {
  return axios.put(url, data)
}

export default api
