<template>
  <Modal v-model="show"
         :title="isEdit ? '编辑数据' : '新增数据'"
         :loading="loading"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form v-if="show"
          ref="formInline"
          :rules="ruleInline"
          :model="formItem"
          :label-width="80">
      <div ref="item"
           :form_validate="ruleInline"
           default
           v-for="item in needSubmitItems"
           :foreignKeyValues="tableColumnConfigList.foreignKeyValues"
           :key="item.id + '-' + item.tableId"
           :formItem="formItem"
           :is="componentName[item.colType]"
           :info="item"></div>
    </Form>
  </Modal>
</template>

<script>
import aInput from './formItems/aInput.vue'
import aArea from './formItems/aArea.vue'
import aDate from './formItems/aDate.vue'
import aFile from './formItems/aFile.vue'
import aKey from './formItems/aKey.vue'
import aMail from './formItems/aMail.vue'
import aNumber from './formItems/aNumber.vue'
import aPhone from './formItems/aPhone.vue'
import aRich from './formItems/aRich.vue'
import aSelect from './formItems/aSelect.vue'
import { uniquedData } from '@/api/data'

export default {
  // 外部引用本组件传入对象接受区域。 外部使用 :visible=''接收
  props: {
    visible: {
      type: Boolean
    },
    tableColumnConfigList: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    editData: {
      type: Array
    }
  },
  // 引用外部组件注册。只需要调用组件的方法即可，组件内部是独立的。组件引用多以此方式进行
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
  // 当前页面的全局变量区
  data () {
    // vue必须要求这样操作，所有定义的变量通过return对本页面生效。 在页面的template区域可以直接变量使用生效，在default区域可以用this.变量生效
    return {
      loading: true,
      formItem: {},
      form: {},
      componentName: {
        COLUMN_SIGN_LINE_TEXT: 'a-input',
        COLUMN_DROP_BOX: 'a-select',
        COLUMN_RICH_TEXT: 'a-rich',
        COLUMN_MANY_LINE_TEXT: 'a-area',
        COLUMN_DATE_TIME: 'a-date',
        COLUMN_NUMBER: 'a-number',
        COLUMN_PHONE_NUMBER: 'a-phone',
        COLUMN_EMAIL: 'a-mail',
        COLUMN_FILE: 'a-file',
        COLUMN_FOREIGN_KEY: 'a-key'
      }
    }
  },
  watch: {
    show (v) {
      if (v && this.isEdit) {
        this.editData.map(item => {
          this.formItem[item.englishName] = item.value ? (item.value + '') : ''
        })
        // console.log(this.formItem, 'this.formItem')
      } else if (!v) {
        this.$nextTick(_ => {
          this.formItem = {}
        })
      }
    }
  },

  // created运行时，还未挂载到DOM，不能访问到$el属性，可用于初始化一些数据，但和DOM操作相关的不能在created中执行
  created () {

    // console.log('created ()', this.tableColumnConfigList)
  },

  // mounted()代表此页面创建完成之后要做的动作。
  mounted () {
    // console.log('createItem.vue mouted executed.')
  },

  // data中的数据发生变化是，下面方法会被执行
  computed: {
    show: {
      get () {
        // console.log('computed: get ()', this.visible)
        return this.visible
      },
      set (val) {
        // console.log('computed: set (val) 被执行', val)
        // $emit('父组件事件',值)说明：父组件可以使用 props 把数据传给子组件。子组件可以使用 $emit 触发父组件的自定义事件。
        this.$emit('close', val)
      }
    },
    needSubmitItems () {
      return (this.tableColumnConfigList.tableColumnConfigList || []).filter(
        item =>
          !['create_user_name', 'create_time', 'update_time'].includes(
            item.englishName
          )
      )
    },
    ruleInline () {
      return this.needSubmitItems.reduce((res, item) => {
        // console.log('ruleInline in return', res, item)
        res[item.englishName] = []
        // 增加唯一性校验
        if (item.uniqued === 1 && !this.isEdit) {
          res[item.englishName].push({
            validator: this.validateuniqued,
            trigger: 'blur'
          })
        }

        // 增加非空判断，  //暂时注销，实现 非空与数字共同作用功能
        if (item.empty === 0) {
          res[item.englishName].push({
            required: true,
            message: '请输入' + item.chineseName,
            trigger: 'blur'
          })
        }

        // // 增加必填与数字校验：先都有，后单个有
        // if (item.empty === 0 && item.colType === 'COLUMN_NUMBER') {
        //   res[item.englishName].push({ required: true, validator: this.validateRequiredAndNumber, trigger: 'blur' })
        // } else {
        //   if (item.empty === 0) {
        //     res[item.englishName].push({ required: true, message: '请输入' + item.chineseName, trigger: 'blur' })
        //   }

        //   if (item.colType === 'COLUMN_NUMBER') {
        //     res[item.englishName].push({ type: 'number', message: '请输入数字', trigger: 'blur' })
        //   }
        // }
        return res
      }, {})
    }
  },

  // methods代表本页面公共方法区
  methods: {
    /** 表单唯一性异步校验  */
    async validateuniqued (rule, value, callback) {
      let data = {
        tableId: this.tableColumnConfigList.tableConfig.id, // [必填]表单主键ID，由当面所在表单查询页面维护
        tableName: this.tableColumnConfigList.tableConfig.englishName, // [必填]表单配置的表名称
        columnName: rule.field, // [必填]判断重复的字段名
        columnValue: value
      }
      let res = await uniquedData(data)
      if (res.data.code === 500) {
        return callback(new Error(res.data.message))
      }
      return callback()
    },

    /** 表单数字与必填校验 */
    validateRequiredAndNumber (rule, value, callback) {
      let regNum = /^.{1,5}$/
      if (value === '') {
        callback(new Error('输入排序(升序)'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('输入数字'))
      } else if (!regNum.test(value)) {
        callback(new Error('长度过长'))
      } else {
        callback()
      }
    },

    /** 数据提交 */
    ok () {
      this.loading = true
      this.$refs.formInline.validate(valid => {
        if (valid) {
          this.$emit('getVal', this.formItem)
          this.loading = false
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
