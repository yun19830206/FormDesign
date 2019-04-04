<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
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
      loginAlert: false
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
      this.handleLogin({ userName, password }).then(res => {
        // //console.log('yun2', res)
        // this.$store.commit('getUserInfo', res)
        // //console.log('yun3', res)
        localStorage.setItem('login', 'login')
        this.$router.push({
          name: this.$config.homeName
        })
        // })
      })
    }
  }
}
</script>

<style>
</style>
