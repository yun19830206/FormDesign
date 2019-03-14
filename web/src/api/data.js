import axios from '@/libs/api.request'

export const getMyFormData = () => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: 'aiassistant/formdesign/get/mycreate',
    method: 'post'
  })
}
export const getFormConfigData = () => {
  return axios.request({
    header:{"Content-Type": "application/json"},
    url: 'aiassistant/formdesign/get/formdesigndetail?formid=1',
    method: 'post'
  })
}

