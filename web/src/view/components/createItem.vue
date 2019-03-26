<template>
  <Modal
    v-model="show"
    title="新增数据"
    :loading="loading"
    @on-ok="ok"
    @on-visible-change="statusChange"
    @on-cancel="cancel">
    <Form ref="formInline" :rules="ruleInline" :model="formItem" :label-width="80">
      <div 
      ref="item" 
      :form_validate="ruleInline"
      v-for="item in tableColumnConfigList.tableColumnConfigList"
      :foreignKeyValues="tableColumnConfigList.foreignKeyValues"
      :key="item.id + '-' + item.tableId" 
      :formItem="formItem"
      :is="componentName[item.colType]" 
      :info="item"
      ></div>
    </Form>
  </Modal>
</template>
<script>
import aInput from "./formItems/aInput.vue"
import aArea from "./formItems/aArea.vue"
import aDate from "./formItems/aDate.vue"
import aFile from "./formItems/aFile.vue"
import aKey from "./formItems/aKey.vue"
import aMail from "./formItems/aMail.vue"
import aNumber from "./formItems/aNumber.vue"
import aPhone from "./formItems/aPhone.vue"
import aRich from "./formItems/aRich.vue"
import aSelect from "./formItems/aSelect.vue"
import  { uniquedData } from '@/api/data'

export default {
  props: {
    showModal: {
      type: Boolean
    },
    tableColumnConfigList: {
      type: Object
    }
  },
  components: {
    aInput,
    aArea,
    aDate,
    aFile,
    aKey,
    aMail,
    aNumber,
    aPhone,
    aRich,
    aSelect
  },
  data () {
    return {
      loading:true,
      formItem: {},
      form:{},
      componentName: {
        'COLUMN_SIGN_LINE_TEXT':'a-input',
        'COLUMN_DROP_BOX':'a-select',
        'COLUMN_RICH_TEXT':'a-rich',
        'COLUMN_MANY_LINE_TEXT':'a-area',
        'COLUMN_DATE_TIME':'a-date',
        'COLUMN_NUMBER':'a-number',
        'COLUMN_PHONE_NUMBER':'a-phone',
        'COLUMN_EMAIL':'a-mail',
        'COLUMN_FILE':'a-file',
        'COLUMN_FOREIGN_KEY':'a-key'
      }
    }
  },
  created() {
    this.resetForm()
    console.log(this.tableColumnConfigList)
  },
  computed: {
    show : {
      get () {
        return this.showModal
      },
      set (val) {
        this.$emit('close',val)
      }
    },
    ruleInline () {
      return this.tableColumnConfigList.tableColumnConfigList ? this.tableColumnConfigList.tableColumnConfigList.reduce((res, item) => {
        if (item.empty === 0 ){
          res[item.englishName] = [{ required: true, message: '请输入' + item.chineseName, trigger:'blur' }]
        }
        if (item.uniqued === 1 ){
          res[item.englishName].push({
            validator: this.validateuniqued,
            trigger: 'blur'
          })
        }
        return res
      },{}) : {}
    }
  },
  methods: {
    /**
     * 表单唯一性异步校验
     */
    async validateuniqued (rule, value, callback) {
      let data = {
        "tableId" : this.tableColumnConfigList.tableConfig.id,                //[必填]表单主键ID，由当面所在表单查询页面维护
        "tableName": this.tableColumnConfigList.tableConfig.englishName,   //[必填]表单配置的表名称
        "columnName": rule.field,       //[必填]判断重复的字段名
        "columnValue": value
      }
      let res = await uniquedData(data)
      if (res.data.code === 500){
        return callback(new Error(res.data.message))
      }
      return callback()
    },
    /**
     * 手动重置表单
     */
    resetForm () {
      this.tableColumnConfigList.tableColumnConfigList ? this.tableColumnConfigList.tableColumnConfigList.map(item => {
        this.$set(this.formItem,item.englishName,item.defaultValue || '')
      }) : []
    },
    /**
     * 模态框显示时重置表单
     */
    statusChange (val) {
      if(val){
        this.$nextTick(_ => {
          this.$refs.formInline.resetFields()
          this.formItem = {}
          this.resetForm()
        }) 
      }
    },
    /**
     * 数据提交
     */
    ok () {
      this.loading = true
      this.$refs.formInline.validate((valid) => {
          if (valid) {
            console.log(this.formItem)
              this.$emit('getVal',this.formItem)
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


