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
        this.loading = false
        localStorage.setItem('login', 'login')
        this.$router.push({
          name: 'CRMCustomerManage'
        })
      }).catch(_ => (this.loading = false))
    }
  }
}
</script>

<style>
</style>
