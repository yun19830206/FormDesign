import axios from '@/libs/api.request'
// open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/daijianhua/Desktop/ivew/ddd
export const getMyFormData = () => {
  return axios.request({
    header: { 'Content-Type': 'application/json' },
    url: '/aiassistant/formdesign/get/mycreate',
    method: 'post'
  })
}

export const getFormConfigData = (id) => {
  return axios.request({
    header: { 'Content-Type': 'application/json' },
    url: `aiassistant/formdesign/get/formdesigndetail?formid=${id}`,
    method: 'post'
  })
}

export const getListData = () => {
  return axios.request({
    header: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdesign/get/myformdesign',
    method: 'post'
  })
}
// 点击按钮获取对应表格数据 6号接口 定义表格数据类型
export const getTableData = (id) => {
  return axios.request({
    header: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdesign/get/formdesigndetail?formid=' + id,
    method: 'post'
  })
}
// 展示表格数据 7号接口
export const getFormData = (pageObj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdata/get/myformpagedata',
    data: pageObj,
    method: 'post'
  })
}
// 查看当前条详情
export const showDetail = (obj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdata/get/formdatabyid',
    data: obj,
    method: 'post'
  })
}
// aiassistant/formdata/add/formrowdata 提交修改数据
export const modifyData = (obj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdata/modify/formrowdata',
    data: obj,
    method: 'post'
  })
}

// aiassistant/formdata/add/formrowdata 提交新增数据
export const addData = (obj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdata/add/formrowdata',
    data: obj,
    method: 'post'
  })
}

export const uploadFile = (data) => {
  return axios.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: 'aiassistant/file/add/file',
    data,
    method: 'post'
  })
}

export const uniquedData = (obj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: 'aiassistant/formdata/judge/formdata/duplicate',
    data: obj,
    method: 'post'
  })
}

export const exchangeData = (obj) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: `aiassistant/business/crm/trans?customerId=${customerId}&toUserId=${toUserId}`,
    method: 'post'
  })
}

export const getCustomerData = (id) => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: `aiassistant/business/crm/get/customer?customerId=${id}`,
    method: 'post'
  })
}

export const exportCustomerData = () => {
  return axios.request({
    headers: { 'Content-Type': 'application/json' },
    url: `aiassistant/business/crm/customer/export`,
    method: 'post'
  })
}
