﻿import axios from 'axios'
import router from '@/router'
// import { Spin } from 'iview'

function getCode (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
const addErrorLog = errorInfo => {
  // const { statusText, status, request: { responseURL } } = errorInfo
  // let info = {
  //   type: 'ajax',
  //   code: status,
  //   mes: statusText,
  //   url: responseURL
  // }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      let wxCode = getCode('code')
      // console.log(config)
      if (wxCode) {
        if (config.url.includes('?')) {
          config.url += `&wxCode=${wxCode}`
        } else {
          config.url += `?wxCode=${wxCode}`
        }
      }

      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(new Error(error))
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      let contentType = res.headers['content-type']
      if (contentType.includes('text/html') || data.code === 505) {
        localStorage.setItem('login', '')
        router.push('/login')
        return Promise.reject((new Error()))
      } else {
        return { data, status }
      }
    }, error => {
      if (error.response.status === 505) {
        localStorage.setItem('login', '')
        router.push('/login')
        return Promise.reject(new Error())
      }
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))

        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
