<template>
  <Modal v-model="show"
         title="转让数据"
         :loading="loading"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form v-if="show"
          ref="form"
          :rules="rules"
          :model="formItem"
          :label-width="80">
      <FormItem label="选择用户"
                prop="user">
        <Select v-model="formItem.user"
                filterable>
          <Option v-for="item in userList"
                  :value="item.id + ''"
                  :key="item.id">{{ item.userName }}</Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { getAllUsers } from '@/api/user'
import { exchangeData } from '@/api/data'
// console.log(exchangeData)

export default {
  props: {
    visible: {
      type: Boolean
    },
    cdata: Object
  },
  // 当前页面的全局变量区
  data () {
    return {
      loading: true,
      formItem: {
        user: ''
      },
      // 当前用户id
      userId: localStorage.getItem('id') - 0,
      userList: [],
      form: {},
      rules: {
        user: [{ required: true, message: '请选择用户', trigger: 'change' }]
      }
    }
  },
  watch: {
    show (v) {

    }
  },
  created () {
    getAllUsers().then(res => {
      if (res.data.code === 200) {
        this.userList = res.data.data.filter(i => i.id !== this.userId)
      }
    })
  },

  computed: {
    show: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('close', val)
      }
    }
  },

  // methods代表本页面公共方法区
  methods: {

    /** 数据提交 */
    ok () {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            customerId: this.cdata.id,
            toUserId: this.formItem.user
          }
          exchangeData(data).then(res => {
            if (res.data.code === 200) {
              this.loading = false
              this.showDetail = false
              this.$emit('success')
            }
          })
        } else {
          this.loading = false
        }
      })
      this.$nextTick(_ => {
        this.loading = true
      })
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
</style>
