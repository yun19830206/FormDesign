<template>
  <div class="add-wrapper">
    <van-cell-group>
      <div ref="item"
           v-for="item in tableColumnConfigList"
           :key="item.id + '-' + item.tableId"
           :is="componentName[item.colType]"
           :info="item"
           :editVal="editVal"
           :isEdit="true"
           :tableConfig="tableConfig"
           :foreignKeyValues="foreignKeyValues"></div>
    </van-cell-group>
    <!-- <van-cell-group> -->
    <p style="padding:0 20px;margin:20px 0;">
      <van-button size="large"
                  :loading="loading"
                  @click="submitInfo"
                  type="info">提交</van-button>
    </p>

    <!-- </van-cell-group> -->
  </div>

</template>
<script>
import { getFormConfigData, showDetail, modifyData } from '@/api/data'
import wxInput from './components/wxInput.vue'
import wxArea from './components/wxArea.vue'
import wxDate from './components/wxDate.vue'
import wxFile from './components/wxFile.vue'
import wxKey from './components/wxKey.vue'
import wxMail from './components/wxMail.vue'
import wxNumber from './components/wxNumber.vue'
import wxPhone from './components/wxPhone.vue'
import wxRich from './components/wxRich.vue'
import wxSelect from './components/wxSelect.vue'
export default {
  data () {
    return {
      id: '',
      tid: '',
      loading: false,
      tableColumnConfigList: [],
      editVal: null,
      tableConfig: {},
      componentName: {
        COLUMN_SIGN_LINE_TEXT: 'wx-input',
        COLUMN_DROP_BOX: 'wx-select',
        COLUMN_RICH_TEXT: 'wx-rich',
        COLUMN_MANY_LINE_TEXT: 'wx-area',
        COLUMN_DATE_TIME: 'wx-date',
        COLUMN_NUMBER: 'wx-number',
        COLUMN_PHONE_NUMBER: 'wx-number',
        COLUMN_EMAIL: 'wx-input',
        COLUMN_FILE: 'wx-file',
        COLUMN_FOREIGN_KEY: 'wx-key'
      }
    }
  },
  components: {
    wxInput,
    wxArea,
    wxDate,
    wxFile,
    wxKey,
    wxMail,
    wxNumber,
    wxPhone,
    wxRich,
    wxSelect
  },
  created () {
    localStorage.setItem('login', 'login')
    document.title = '云问CRM助手-新增数据'
    this.id = this.$route.params.id
    this.tid = this.$route.params.tid
    this.onLoad(this.tid)
  },
  methods: {
    onLoad (id) {
      getFormConfigData(id)
        .then(res => {
          if (res.data.code === 200) {
            this.tableColumnConfigList = (res.data.data.tableColumnConfigList || []).filter(i => !['create_user_name', 'create_time', 'update_time'].includes(i.englishName))
            this.foreignKeyValues = res.data.data.foreignKeyValues
            this.tableName = res.data.data.tableConfig.englishName
            this.tableConfig = res.data.data.tableConfig
          } else {
          }
          // getSingleData() {
          let data = {
            tableId: this.tid, // [必填]表单主键ID，由当面所在表单查询页面维护
            dataIdList: [this.id]
          }
          showDetail(data).then(res => {
            this.editVal = res.data.data[0] || {}
          })
          // }
        })
        .catch(_ => (this.loading = false))
    },

    async submitInfo (pg) {
      this.loading = true
      let data = []
      let validate = true
      let promiseArr = []
      this.$refs.item.map(i => {
        let p = new Promise((resolve, reject) => {
          i.sendVal().then(d => {
            if (d) {
              let val =
                typeof Object.values(d)[0] === 'string'
                  ? Object.values(d)[0].trim()
                  : Object.values(d)[0]
              if (val) {
                data.push({
                  columnName: Object.keys(d)[0],
                  columnValue: val
                })
              }
            } else {
              validate = false
            }
            resolve()
          })
        })
        promiseArr.push(p)
      })
      await Promise.all(promiseArr)
      if (validate) {
        let params = {
          tableId: this.tid, // [必填]表单主键ID，由当面所在表单查询页面维护
          dataId: this.id,
          tableName: this.tableName, // [必填]表单配置的表名称
          columnValueList: data
        }

        try {
          let res = await modifyData(params)
          this.loading = false
          if (res.data.code === 200) {
            this.$notify({
              message: res.data.message,
              duration: 1000,
              background: '#07c160'
            })
            setTimeout(() => {
              this.$router.push('/wechat_form/')
            }, 600)
          } else {
            this.$notify({
              message: res.data.message,
              duration: 1000,
              background: '#f44'
            })
          }
        } catch (error) {
          this.$notify({
            message: '请求出错',
            duration: 1000,
            background: '#f44'
          })
          this.loading = false
        }
      }
      this.loading = false
    },
    showInfo (item) {
      this.activeItem = item
      this.show = true
    }
  }
}
</script>
<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.add-wrapper {
  height: 100%;
  overflow: auto;
}
</style>
