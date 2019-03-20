import axios from '@/libs/api.request'
// open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/daijianhua/Desktop/ivew/ddd
export const getMyFormData = () => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: '/aiassistant/formdesign/get/mycreate',
    method: 'post'
  })
}

export const getFormConfigData = (id) => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: `aiassistant/formdesign/get/formdesigndetail?formid=${id}`,
    method: 'post'
  })
}

export const getListData = () => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: 'aiassistant/formdesign/get/myformdesign',
    method: 'post'
  })
}
// 点击按钮获取对应表格数据 6号接口 定义表格数据类型
export const getTableData = (id) => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: 'aiassistant/formdesign/get/formdesigndetail?formid=' + id,
    method: 'post'
  })
}
// 展示表格数据 7号接口
export const getFormData = (pageObj) => {
  return axios.request({
    headers: {"Content-Type": "application/json"},
    url: 'aiassistant/formdata/get/myformpagedata',
    data: pageObj,
    method: 'post'
  })
}
// 查看当前条详情
export const showDetail = (obj) => {
  return axios.request({
    headers: {"Content-Type": "application/json"},
    url: 'aiassistant/formdata/get/formdatabyid',
    data: obj,
    method: 'post'
  })
}
// aiassistant/formdata/add/formrowdata?wxcode=ldkclk5l5k 提交新增数据
export const addData = (obj) => {
  return axios.request({
    headers: {"Content-Type": "application/json"},
    url: 'aiassistant/formdata/add/formrowdata?wxcode=ldkclk5l5k',
    data: obj,
    method: 'post'
  })
}
