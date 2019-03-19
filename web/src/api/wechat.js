import axios from '@/libs/api.request'

export const login = (data) => {
  return axios.request({
    url: 'aiassistant/user/wx/binding',
    data,
    method: 'post'
  })
}



