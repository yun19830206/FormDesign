<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form :loading="loading"
                      @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入中文名字作为用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import {
  getListData,
  getTableData
} from '@/api/data'
export default {
  data () {
    return {
      loginAlert: false,
      loading: false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password }) {
      this.loading = true
      this.handleLogin({ userName, password }).then(res => {
        getListData().then(res => {
          let tabsDatas = res.data.data
          let tabConfig = {}
          let promiseArr = tabsDatas.map(i => {
            return new Promise((resolve, reject) => {
              getTableData(i.id).then(d => {
                if (d.data.code === 200) {
                  tabConfig[i.englishName] = d.data.data
                  resolve()
                } else {
                  reject(new Error())
                }
              })
            })
          })
          Promise.all(promiseArr).then(_ => {
            localStorage.setItem('tabConfig', JSON.stringify(tabConfig))
            localStorage.setItem('tabsDatas', JSON.stringify(tabsDatas))
            localStorage.setItem('login', 'login')
            this.$router.push({
              name: 'CRMCustomerManage'
            })
          })
        })
      })
    }
  }
}
</script>

<style>
</style>
