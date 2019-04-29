<template>
  <div>
    <van-cell is-link
              :required="info.empty === 0"
              @click="showSelect = !showSelect,err = false"
              :title="info.chineseName"
              :value="formItem.input">
      <span v-if="err"
            slot="right-icon"
            class="err-tip">请选择{{info.chineseName}}
        <van-icon name="arrow" />
      </span>
    </van-cell>
    <van-popup position="bottom"
               v-model="showSelect">
      <van-picker :defaultIndex="defaultIndex"
                  show-toolbar
                  :title="info.chineseName"
                  @cancel="onCancel"
                  @confirm="onConfirm"
                  :columns="columns" />
    </van-popup>
  </div>

</template>
<script>
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
    }
  },
  data () {
    return {
      formItem: {
        input: ''
      },
      err: false,
      columns: [],
      showSelect: false
    }
  },
  watch: {
    editVal (v) {
      this.formItem.input = v[this.info.englishName] || ''
    }
  },
  created () {
    this.columns = this.info.dropValue.split(',')
    this.formItem.input = this.info.defaultValue || ''
  },
  computed: {
    defaultIndex () {
      return this.columns.indexOf(this.formItem.input)
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
    },
    onCancel () {
      this.showSelect = false
    },
    onConfirm (val, v2) {
      this.formItem.input = val
      this.showSelect = false
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
