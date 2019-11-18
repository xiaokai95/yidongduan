// 配置axios  使用配置好的axios发请求
// 处理js最大安全数值   在每次请求携带token  响应后获取有效数据   响应失败token失效（TODO）
// 导出一个发请求的工具函数
import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store/index'
import router from '@/router'

const instance = axios.create({
  // 基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 最大安全数值
  transformResponse: [(data) => {
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截 设置token
instance.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => {
  Promise.reject(err)
})
// 响应拦截器
instance.interceptors.response.use(res => {
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, async err => {
  // 实现token失效处理
  // 1. 判断是否是401状态
  // 2. 如果未登录（拦截到登录页面，预留回跳功能）
  // 3. token失效，发请求给后台刷新token
  // 3.1 刷新成功  更新vuex中token和本地存储的token
  // 3.2 刷新成功  把原本失败的请求继续发送出去
  // 3.3 刷新失败  删除vuex中token和本地存储的token （拦截到登录页面，预留回跳功能）
  if (err.response && err.response === 401) {
    // 拦截到登录页面并携带当前路径
    const { user } = store.state
    if (!user || !user.token || !user.refresh_token) {
      return router.push('/login')
    }
    try {
      // token失效
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 刷新本地和vuex中的token
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      return instance(err.config)
    } catch (e) {
      store.commit('delUser')
      return router.push('/login')
    }
  }
  return Promise.reject(err)
})
// 导出一个发送请求的函数

export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
