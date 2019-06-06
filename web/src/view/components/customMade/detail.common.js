import showColumnDetailModal from '../showColumnDetailModal.vue'
import createItem from '../createItem.vue'
import {
  // getListData,
  // getTableData,
  // getFormData,
  // addData,
  modifyData
} from '@/api/data'
export default {
  components: {
    showColumnDetailModal,
    createItem
  },
  props: {
    originColumns: Array,
    originData: Array,
    tableConfig: Object
  },
  data () {
    return {
      visible: false,
      index: 0,
      createItemModalVisible: false,
      columnsDetailForModal: [],
      editDetailForrModal: [],
      currentRow: {}
    }
  },
  methods: {
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
      this.index = params.index
      this.computedData(params.row)
      this.visible = true
    },
    getVal (list) {
      let obj = {
        tableId: this.tableConfig.tableConfig.id, // [必填]表单主键ID，由当面所在表单查询页面维护
        dataId: this.currentRow.id,
        tableName: this.tableConfig.tableConfig.englishName, // [必填]表单配置的表名称
        columnValueList: list
      }
      modifyData(obj).then(res => {
        if (res.data.code === 500) {
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
    },
    editData (params) {
      this.index = params.index
      this.computedData(params.row)
      this.createItemModalVisible = true
    }
  }
}
