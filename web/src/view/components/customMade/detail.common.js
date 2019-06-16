import showColumnDetailModal from '../showColumnDetailModal.vue'
import createItem from '../createItem.vue'
import {
  // getListData,
  // getTableData,
  // getFormData,
  addData,
  modifyData
} from '@/api/data'
export default {
  components: {
    showColumnDetailModal,
    createItem
  },
  created () {

  },
  props: {
    originColumns: Array,
    originData: Array,
    tableConfig: Object,
    isWechat: Boolean
  },
  data () {
    return {
      visible: false,
      index: 0,
      isEdit: true,
      createItemModalVisible: false,
      columnsDetailForModal: [],
      editDetailForrModal: [],
      currentRow: {}
    }
  },
  methods: {
    addData () {
      if (this.isWechat) {
        if (this.defaultData) {
          this.$router.push(`/wechat_form_add/${this.tableConfig.tableConfig.id}/${encodeURIComponent(JSON.stringify(this.defaultData))}`)
        } else {
          this.$router.push(`/wechat_form_add/${this.tableConfig.tableConfig.id}`)
        }
      } else {
        this.isEdit = false
        this.createItemModalVisible = true
      }
    },
    computedData (row) {
      this.currentRow = row
      console.log(row, this.originColumns)
      this.columnsDetailForModal = this.originColumns.map(i => ({
        key: i.title,
        value: row[i.key],
        englishName: i.key
      }))
      this.editDetailForrModal = this.tableConfig.tableColumnConfigList.map(i => ({
        key: i.chineseName,
        value: this.originData[this.index][i.englishName],
        englishName: i.englishName
      }))
      // console.log(this.editDetailForrModal, this.columnsDetailForModal)
    },
    checkDetail (params) {
      if (this.isWechat) {
        if (this.defaultData) {
          this.$router.push(`/wechat_form_edit/${this.tableConfig.tableConfig.id}/${params.row.id}/${encodeURIComponent(JSON.stringify(this.defaultData))}`)
        } else {
          this.$router.push(`/wechat_form_edit/${this.tableConfig.tableConfig.id}/${params.row.id}`)
        }
      } else {
        this.index = params.index
        this.computedData(params.row)
        this.visible = true
      }
    },
    getVal (list) {
      let obj = {
        tableId: this.tableConfig.tableConfig.id, // [必填]表单主键ID，由当面所在表单查询页面维护
        tableName: this.tableConfig.tableConfig.englishName, // [必填]表单配置的表名称
        columnValueList: list
      }
      if (this.isEdit) {
        obj.dataId = this.currentRow.id
        modifyData(obj).then(res => {
          if (res.data.code !== 200) {
            this.$Message.error({
              content: res.data.message,
              duration: 3,
              closable: true
            })
          } else {
            this.createItemModalVisible = false
            this.$emit('refresh')
            this.$Message.success({
              content: res.data.message,
              duration: 3,
              closable: true
            })
          }
        })
      } else {
        addData(obj).then(res => {
          // 判断返回结果 res是否正确。
          // 错误谈错误提示 this.$Message 和以前一样 全局提示
          // 成功关闭model  this.createItemModalVisible = false,
          //   成功后更新列表。 this.getTabsData();
          // console.log('yun', res)
          if (res.data.code !== 200) {
            this.$Message.error({
              content: res.data.message,
              duration: 3,
              closable: true
            })
          } else {
            this.createItemModalVisible = false
            this.$emit('refresh')
            this.$Message.success({
              content: res.data.message,
              duration: 3,
              closable: true
            })
          }
        })
      }
    },
    editData (params) {
      this.isEdit = true
      this.index = params.index
      this.computedData(params.row)
      this.createItemModalVisible = true
    }
  }
}
