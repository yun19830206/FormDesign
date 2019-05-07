<template>
  <div>
    欢迎使用云问CRM助手
  </div>
</template>

<script>
import { getAllUsers } from '@/api/user'

export default {
  name: 'home',
  components: {

  },
  data () {
    return {

    }
  },
  created () {
    getAllUsers()
  },
  mounted () {
    // //console.log(getMyFormData)
    // getMyFormData()
  }

}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
