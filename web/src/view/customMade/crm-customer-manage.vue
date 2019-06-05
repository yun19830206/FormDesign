<template>
  <div style="height: 100%;">
    <dataDisplayTableWithPagination :queryCondition="queryCondition"
                                    :foreignKeyValues="foreignKeyValues"
                                    :columnsDetail="columnsDetail"
                                    :detailDatas="detailDatas"
                                    :total="total"
                                    :isDetail="true"
                                    @showDetail="() => {pageNumber = 1, showDetail()}"
                                    @export="exportData"
                                    @addNew="addNew"
                                    @pageChange="currentPageChange"></dataDisplayTableWithPagination>
    <transferUserModal :cdata="rowDetail"
                       :visible="showTransferUserModal" />
    <createItem :visible="createItemModalVisible"
                :isEdit="isEdit"
                :tableColumnConfigList="nowTreeData"
                @close="createItemModalVisible = false"
                @getVal="getVal"></createItem>
  </div>
</template>

<script>
// import formModel from '../components/defineForm/formModel.vue'
// import createItem from '../components/createItem.vue'
import createItem from '../components/createItem.vue'
import { getListData, getFormData, getTableData, addData, exportCustomerData } from '@/api/data'
import transferUserModal from '../components/transferUserModal.vue'
import dataDisplayTableWithPagination from '../components/dataDisplayTableWithPagination.vue'
export default {
  name: 'crm-customer-manage',
  components: { dataDisplayTableWithPagination, transferUserModal, createItem },
  data () {
    return {
      pageNumber: 1,
      userId: localStorage.getItem('id') - 0,
      treeId: '',
      queryCondition: [],
      cusomtable: {},
      detailDatas: [],
      foreignKeyValues: {},
      columnsDetail: [],
      total: 0,
      dataSetting: [],
      searchDatas: [],
      rowDetail: {},
      showTransferUserModal: false,
      nowTreeData: {},
      isEdit: false,
      createItemModalVisible: false
    }
  },
  computed: {

  },
  created () {
    this.getTabsData()
  },
  methods: {
    getVal (data) {
      // //console.log(data)
      let keys = Object.keys(data)
      let list = []
      keys.forEach(value => {
        if (!['create_user_name', 'create_time', 'update_time'].includes(value)) {
          list.push({
            columnName: value,
            columnValue: data[value]
          })
        }
      })
      let obj = {
        tableId: this.treeId, // [必填]表单主键ID，由当面所在表单查询页面维护
        tableName: this.nowTreeData.tableConfig.englishName, // [必填]表单配置的表名称
        columnValueList: list
      }
      addData(obj).then(res => {
        // 判断返回结果 res是否正确。
        // 错误谈错误提示 this.$Message 和以前一样 全局提示
        // 成功关闭model  this.createItemModalVisible = false,
        //   成功后更新列表。 this.getTabsData();
        // console.log('yun', res)
        if (res.data.code === 500) {
          this.$Message.error({
            content: res.data.message,
            duration: 3,
            closable: true
          })
        } else {
          this.createItemModalVisible = false
          this.getTabsData()
          this.$Message.success({
            content: res.data.message,
            duration: 3,
            closable: true
          })
        }
      })
    },
    /**
     * 新增数据
     */
    addNew () {
      getTableData(this.cusomtable.id).then(res => {
        this.nowTreeData = res.data.data
        this.createItemModalVisible = true
      })
    },
    /**
     * 导出数据
     */
    exportData () {
      exportCustomerData()
    },
    /**
     * 更新页码
     */
    currentPageChange (val) {
      this.pageNumber = val
      this.showDetail()
    },
    /**
     * 查询所有表
     */
    getTabsData () {
      getListData().then(res => {
        if (res.data.code === 200) {
          let tabsDatas = res.data.data
          this.cusomtable = (tabsDatas || []).find(i => i.englishName === 'crm_customer')
          if (this.cusomtable) {
            this.getTableDatas(this.cusomtable.id)
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    getTableDatas (id) {
      this.treeId = id
      this.showDetail()
      getTableData(id).then(res => {
        // console.log(res.data.data.tableConfig, 'ppppppptable')
        this.dataSetting = [res.data.data.tableConfig]
        // 获取所有搜索条件列表
        this.searchDatas = res.data.data.tableQueryConfigList
        this.queryCondition = []
        // 获取当前表格数据筛选条件的外键下拉选项列表
        this.foreignKeyValues = res.data.data.foreignKeyValues || {}
        if (this.foreignKeyValues === null) {
          this.foreignKeyValues = {}
        }
        // 设置查询条件
        // console.log(this.searchDatas, 'dddddddd')
        this.searchDatas.forEach(value => {
          if (value.tableColumnConfig.dropValue !== null) {
            let arr = []
            value.tableColumnConfig.dropValue.split(',').forEach(v => {
              arr.push({ displayValue: v })
            })
            let key = value.tableColumnConfig.englishName
            this.foreignKeyValues[key] = arr
          }
          // console.log(this.foreignKeyValues, 'yyyyyyyyyyyyyyyyyyyy')
          this.queryCondition.push({
            queryColumnName: value.tableColumnConfig.englishName,
            queryColumnType: value.queryType,
            queryValue: '',
            chineseName: value.tableColumnConfig.chineseName,
            colType: value.tableColumnConfig.colType
          })
        })
        // console.log(this.queryCondition, 'uuuuuuuu')
        this.columnsDetail = []
        res.data.data.tableColumnConfigList.forEach((value, index) => {
          if (value.colType === 'COLUMN_FILE') {
            this.columnsDetail.push({
              title: value.chineseName,
              key: value.englishName,
              width: 200,
              render: (h, params) => {
                return h(
                  'a',
                  {
                    attrs: {
                      href:
                        this.baseUrl +
                        'aiassistant/file/get/file?fileId=' +
                        (params.row.file_id ? params.row.file_id.split('-||-')[1] : '')
                    }
                  },
                  (params.row.file_id ? params.row.file_id.split('-||-')[0] : '')
                )
              }
            })
          } else {
            this.columnsDetail.push({
              title: value.chineseName,
              key: value.englishName,
              width: 200
            })
          }
        })
        this.columnsDetail.push({
          title: '操作',
          key: 'action',
          width: 180,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push('CRMCustomerManageDetail/' + params.row.id + `/${this.cusomtable.id}`)
                    }
                  },
                  style: {
                    'margin-right': '5px'
                  }
                },
                '管理'
              ),
              (this.dataSetting[0].canEdit && this.userId === params.row.create_user)
                ? h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.rowDetail = params.row
                        this.showTransferUserModal = true
                      }
                    }
                  },
                  '转让'
                )
                : null
            ])
          }
        })
      })
    },
    showDetail () {
      // console.log(this.selectValue1, this.selectValue2, 'kkkkkkkkkk')
      let obj = {
        pageNum: this.pageNumber, // 请求页码
        pageSize: 10, // 每页数量
        dto: {
          // 业务查询条件
          tableId: this.treeId, // 表单主键ID，由菜单点击事件获得
          queryCondition: this.queryCondition.filter(i => i.queryValue)
        }
      }
      getFormData(obj).then(res => {
        if (res.data.code === 200) {
          // console.log(res.data.data, 'uuuuuuuuuuu')
          this.detailDatas = res.data.data.list
          this.total = res.data.data.total
          this.detailDatas.forEach(value => {
            let objKeys = Object.keys(value)
            objKeys.forEach(val => {
              if (typeof value[val] === 'object') {
                if (val === 'file_id' && value[val].originValue) {
                  value[val] = value[val].displayValue + '-||-' + value[val].originValue
                } else {
                  value[val] = value[val].displayValue
                }
              }
            })
          })
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }

  }
}
</script>

<style scoped>
.table-title {
  font-size: 15px;
  margin-bottom: 10px;
}
</style>
