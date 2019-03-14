import axios from '@/libs/api.request'

export const getRouterReq = () => {
  return axios.request({
    url: 'aiassistant/formdesign/get/formdata',
    method: 'get'
  })
}
