<template>
  <div>
    <van-cell-group>
      <div ref="item" v-for="item in tableColumnConfigList" :key="item.id + '-' + item.tableId" :is="componentName[item.colType]" :info="item"></div>
    </van-cell-group>
    <!-- <van-cell-group> -->
      <p style="padding:0 20px;margin-top:20px;">
        <van-button size="large" @click="submitInfo" type="info">提交</van-button>
      </p>
      
    <!-- </van-cell-group> -->
  </div>


</template>
<script>
import { getFormConfigData,addData } from '@/api/data'
import wxInput from "./components/wxInput.vue"
import wxArea from "./components/wxArea.vue"
import wxDate from "./components/wxDate.vue"
import wxFile from "./components/wxFile.vue"
import wxKey from "./components/wxKey.vue"
import wxMail from "./components/wxMail.vue"
import wxNumber from "./components/wxNumber.vue"
import wxPhone from "./components/wxPhone.vue"
import wxRich from "./components/wxRich.vue"
import wxSelect from "./components/wxSelect.vue"
export default {
  data () {
    return {
      id:'',
      tableColumnConfigList:[],
      componentName: {
        'COLUMN_SIGN_LINE_TEXT':'wx-input',
        'COLUMN_DROP_BOX':'wx-select',
        'COLUMN_RICH_TEXT':'wx-rich',
        'COLUMN_MANY_LINE_TEXT':'wx-area',
        'COLUMN_DATE_TIME':'wx-date',
        'COLUMN_NUMBER':'wx-number',
        'COLUMN_PHONE_NUMBER':'wx-phone',
        'COLUMN_EMAIL':'wx-mail',
        'COLUMN_FILE':'wx-file',
        'COLUMN_FOREIGN_KEY':'wx-key'
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
    localStorage.setItem('login','login')
    this.id = this.$route.params.id
    this.onLoad(this.id)
  },
  methods: {
    onLoad (id) {
        getFormConfigData(id).then( res => {
          if (res.data.code === 200) {
            this.tableColumnConfigList = res.data.data.tableColumnConfigList
            this.tableName = res.data.data.tableConfig.englishName
          }else{
            
          }
        }).catch(_ => this.loading = false)
    },
    submitInfo (pg) {
      let data = []
      this.$refs.item.map( i => {
        let d = i.sendVal()
        data.push({
          "columnName": Object.keys(d)[0],  
          "columnValue":Object.values(d)[0]
        })
      })

      let params = {
        "tableId" : this.id,                //[必填]表单主键ID，由当面所在表单查询页面维护
        "tableName": this.tableName,   //[必填]表单配置的表名称
        "columnValueList": data
      }

      addData (params).then(res => {
        if(res.data.code === 200){
          this.$router.push('/wechat_form/')
        }
      })
      
    },
    showInfo (item) {
      this.activeItem = item
      this.show = true
    }
  
  }
}
</script>
<style scoped>
.flex{
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
</style>


