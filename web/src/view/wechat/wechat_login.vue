<template>
    <div class="wrapper">
        <div class="logo-wrapper">
          <img src="../../assets/logoNew.png" alt="">
        </div>
        <van-cell-group class="inner">
          <van-field
            v-model="username"
            required
            clearable
            label="账户"
            @focus="usernameError = false"
            placeholder="请输入账户"
            :error="usernameError"
          />

          <van-field
            v-model="password"
            type="password"
            @focus="passwordError = false"
            label="密码"
            placeholder="请输入密码"
            :error="passwordError"
            required
          />

          <van-button @click="submitCount" :loading="isSubmit" class="btn" type="info" size="large">绑定</van-button>
        </van-cell-group>
    </div>
</template>
<script>
import { login } from '@/api/wechat'
export default {
  data () {
    return {
      isSubmit: false,
      usernameError: false,
      passwordError: false,
      username:'',
      password:''
    }
  },
  created () {
    localStorage.setItem('login','login')
  },
  methods: {
    submitCount () {
      if (this.username === '') {
        this.usernameError = true
        return 
      }
      if (this.password === '') {
        this.passwordError = true
        return 
      }
      let data = {
        userName: this.username,
        password: this.password,
        wxCode: this.getQueryString('code')
      }
      this.isSubmit = true
      login(data).then( res => {
        if (res.data.code === 200) {
          this.$toast.success('绑定成功！')
          setTimeout(() => {
            
          }, 600);
        }else{
          this.$toast.fail('提交失败！')
        }
        this.isSubmit = false
      }).catch(_ => {
        console.log('fale')
        this.isSubmit = false
      })
    },
    getQueryString (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
  }
}
</script>
<style scoped>
.wrapper{
  display: flex;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  flex-wrap: wrap;
  align-content: center;
  margin-bottom: 50px;
}
.inner {
  width: 100%;
}
.btn {
  margin-top: 20px;
}
.logo-wrapper{
  width: 500px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 50px;
}
</style>


