<template>
  <van-field v-model="formItem.input"
             input-align="right"
             type="number"
             :label="info.chineseName"
             :error="err"
             :required="info.empty === 0"
             @focus="err = false"
             :placeholder="'请输入' + info.chineseName" />
</template>
<script>
import { uniquedData } from '@/api/data'
export default {
  props: {
    isEdit: {
      type: Boolean
    },
    editVal: {
      type: Object
    },
    info: {
      type: Object
    },
    tableConfig: {
      type: Object
    }
  },
  data () {
    return {
      formItem: {
        input: ''
      },
      err: false
    }
  },
  watch: {
    editVal (v) {
      this.formItem.input = v[this.info.englishName] || ''
    }
  },
  methods: {
    async sendVal () {
      if (this.info.empty === 0 && this.formItem.input.trim() === '') {
        this.err = true
        return false
      }
      if (this.info.uniqued === 1 && !this.isEdit) {
        let data = {
          tableId: this.tableConfig.id, // [必填]表单主键ID，由当面所在表单查询页面维护
          tableName: this.tableConfig.englishName, // [必填]表单配置的表名称
          columnName: this.info.englishName, // [必填]判断重复的字段名
          columnValue: this.formItem.input.trim()
        }
        let res = await uniquedData(data)
        if (res.data.code === 500) {
          this.$notify({
            message: res.data.message,
            duration: 1000,
            background: '#f44'
          })
          this.err = true
          return false
        } else {
          return {
            [this.info.englishName]: this.formItem.input
          }
        }
      }
      return {
        [this.info.englishName]: this.formItem.input
      }
    }
  }
}
</script>
<style scoped>
.err-tip {
  height: 24px;
  font-size: 14px;
  color: #f44;
  line-height: 24px;
}
.err-tip .van-icon {
  font-size: 16px;
  vertical-align: middle;
}
</style>
