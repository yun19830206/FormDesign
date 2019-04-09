import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'aiassistant/user/login/userlogin',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'aiassistant/user/login/userlogout ',
    method: 'post'
  })
}
