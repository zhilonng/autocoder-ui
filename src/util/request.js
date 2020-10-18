import axios from 'axios'
import NProgress from 'nprogress'
import { serialize } from './util'
import errorCode from './errorCode'
import { Message } from 'element-ui'
const baseURL = 'http://localhost:3001'
// 创建axios实例
const service = axios.create({
  baseURL, // api 的 base_url
  timeout: 60000 // 请求超时时间
})

export function doUrl(url) {
  return baseURL + url
}

export function doGet(url, params) {
  return service({
    method: 'get',
    url: url,
    params: params || {},
    timeout: 60000
  }).then(res => {
    return Promise.resolve(res)
  }).catch(e => {
    console.error(e)
  })
}
export function doDelet(url, params) {
  return service({
    method: 'delete',
    url: url,
    params: params || {},
    timeout: 60000
  }).then(res => {
    return Promise.resolve(res)
  }).catch(e => {
    console.error(e)
  })
}
export function doDictItem(no) {
  return service.get('/common/queryDictItem?no=' + no).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject({
        status: res.code,
        msg: res.msg
      })
    }
  }).catch(e => {
    console.error(e)
  })
}

export function doPost(url, para) {
  return service({
    method: 'post',
    url: url,
    data: para || {},
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 60000
  }).then(res => {
    return Promise.resolve(res)
  }).catch(e => {
    console.error(e)
  })
}
export function doPut(url, para) {
  return service({
    method: 'put',
    url: url,
    data: para || {},
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 60000
  }).then(res => {
    return Promise.resolve(res)
  }).catch(e => {
    console.error(e)
  })
}

export function doDownload(url) {
  return service({
    method: 'get',
    url,
    responseType: 'arraybuffer',
    timeout: 60000
  })
}

export function doPostMulti(url, para) {
  return service({
    method: 'post',
    url: url,
    data: para || {},
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 1000 * 60 * 60 * 10
  }).then(res => {
    return Promise.resolve(res)
  }).catch(e => {
    console.error(e)
  })
}
// HTTPrequest拦截
service.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  // headers中配置serialize为true开启序列化
  if (config.methods === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }
  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
service.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    return
  }
  if (status !== 200 || res.data.code === 1) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }
  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})
export default service
