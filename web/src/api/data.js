import axios from '@/libs/api.request'

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
