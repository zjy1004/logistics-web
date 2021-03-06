import axios from 'axios'
import axiosFromData from './axios.config.form.data'
import { Loading, Notification } from 'element-ui'
import router from '../router/index'

axios.defaults.timeout = 90000
axios.defaults.baseURL = process.env.API_BASE_URL
// axios.defaults.baseURL = 'http://127.0.0.1:8085'

// request 拦截器
axios.interceptors.request.use(config => {
  let token = sessionStorage.getItem('token')
  if (token) {
    config.headers['token'] = `${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

function errorAction (message, type, timeout) {
  Notification({
    message: message,
    type: type,
    duration: timeout
  })
  setTimeout(() => {
    router.replace({
      path: '/'
    })
  }, timeout)
}

function loading () {
  let loadingInstance = Loading.service({
    text: '拼命加载中',
    target: document.querySelector('#app'),
    customClass: 'loadingDefined'
  })
  return loadingInstance
}

// response 拦截器
axios.interceptors.response.use(response => {
  if (!response.data || response.data.code === 500 || response.data.code !== 200) {
    Notification({
      message: response.data.message,
      type: 'error',
      duration: 1500
    })
    // return Promise.reject(response)
  }
  return response
}, error => {
  switch (error.response.status) {
    case 401:
      if (router.app.$route.name !== 'Login') {
        localStorage.removeItem('tabsArr')
        localStorage.removeItem('tabsFlagArr')
        sessionStorage.removeItem('sendFormVal')
        errorAction('用户信息已失效, 请重新登录.', 'error', 1500)
      }
      break
    case 403:
      // errorAction('由于您长时间没有操作, 用户信息已失效, 请重新登录.', 'error', 1500)
      break
    case 500:
      Notification({
        message: '服务器内部错误！',
        type: 'error',
        duration: 1500
      })
      break
    default:
      Notification({
        message: '请求失败！',
        type: 'error'
      })
      return Promise.reject(error)
  }
})

// 封装get请求
export function Get (url, params = {}, withCredentials = false) {
  let loadingInstance = loading()
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }, {withCredentials: withCredentials}).then(response => {
      loadingInstance.close()
      resolve(response.data)
    }).catch(error => {
      loadingInstance.close()
      reject(error)
    })
  })
}

// 获取get请求的response对象
export function GetResponse (url, params = {}, withCredentials = false) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }, {withCredentials: withCredentials}).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

// 封装postFromData请求
export function PostFromData (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, axiosFromData).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 封装postFromData文件请求
export function PostFromDataFile (url, data = {}, callback) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      header: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 封装postFromData文件上传请求进度条config配置
export function PostFromDataFileProgress (url, data = {}, callback) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      header: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress (progressEvent) {
        if (progressEvent.lengthComputable) {
          callback(progressEvent)
        }
      }
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 封装post请求
export function Post (url, data = {}, config = {}) {
  let loadingInstance = loading()
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(response => {
      loadingInstance.close()
      resolve(response.data)
    }).catch(error => {
      loadingInstance.close()
      reject(error)
    })
  })
}

// 封装put请求
export function Put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 封装delete请求
export function Delete (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// 账簿中的打印、导出
export function printExport (url, type, hasYear, data) {
  let link = ''
  let formatType = ''
  let excelBlank = ''
  for (var key in data) {
    if (data[key] !== '') {
      link += '&' + key + '=' + data[key]
    }
  }
  if (type === 'print-pdf') {
    formatType = 'print-pdf'
    excelBlank = '_blank'
  } else if (type === 'pdf') {
    formatType = 'pdf'
    excelBlank = '_self'
  } else {
    formatType = 'excel'
    excelBlank = '_self'
  }
  let linkUrl
  if (hasYear === 0 || hasYear === 1) {
    linkUrl = process.env.API_BASE_URL + url + `?format=${formatType}${link}&hasYear=${hasYear}&token=` + sessionStorage.getItem('token')
  } else {
    linkUrl = process.env.API_BASE_URL + url + `?format=${formatType}${link}&token=` + sessionStorage.getItem('token')
  }
  window.open(linkUrl, excelBlank)
}
// 封装导出、打印
export function handleFun (url, type, data, callBack) {
  console.log(url, type, data)
  if (type.format === 'print-pdf') {
    let params = `format=${type.format}&printType=${data.printType}&voucherIds=`
    data.voucherIds.forEach((item, index) => {
      if (index === data.voucherIds.length - 1) {
        params += `${item}`
      } else {
        params += `${item}` + ','
      }
    })
    let action = process.env.API_BASE_URL + url + `?${params}&token=` + sessionStorage.getItem('token')
    if (callBack && typeof (callBack) === 'function') {
      callBack('done')
    }
    window.open(action, '_blank')
    // window.location.href = action
  }
  if (type.format === 'excel') {
    let params = `format=${type.format}&voucherIds=`
    data.voucherIds.forEach((item, index) => {
      if (index === data.voucherIds.length - 1) {
        params += `${item}`
      } else {
        params += `${item}` + ','
      }
    })
    let action = process.env.API_BASE_URL + url + `?${params}&token=` + sessionStorage.getItem('token')
    if (callBack && typeof (callBack) === 'function') {
      callBack('done')
    }
    window.location.href = action
  }
}
// 页面跳转
export function goHelpTopic (type) {
  let linkUrl
  linkUrl = process.env.API_BASE_URL + '/kf5' + `?returnTo=${type}&token=` + sessionStorage.getItem('token')
  window.open(linkUrl, '_blank')
}

export {
  axios
}
