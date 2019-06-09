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
    url: 'aiassistant/user/login/userlogout',
    method: 'post'
  })
}

export const getCurrentUser = () => {
  return axios.request({
    url: 'aiassistant/user/get/loginuser',
    method: 'post'
  })
}

export const getAllUsers = () => {
  return axios.request({
    url: 'aiassistant/business/crm/user/list',
    method: 'post'
  })
}

export const changeUsers = (data) => {
  return axios.request({
    data,
    url: '',
    method: 'post'
  })
}
