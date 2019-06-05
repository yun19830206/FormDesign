<template>
  <div class="main">
    <Row class="body-area">
      <Col span="5"
           class="leftArea">
      <!--<Tree :data="tabsDatas" @on-select-change="onSelectChange"></Tree>-->
      <div v-for="(item,index) in tabsDatas"
           :key="index"
           style="padding-left: 10px;padding-top: 15px;">
        <Button :type="active === index ? 'primary' : 'default'"
                style="width: 150px;"
                @click="getTableDatas(item.id,index)">{{item.chineseName}}</Button>
        <span> </span>
        <Button @click="getNowTreeData(item.id)">
          <Icon type="md-add" />
        </Button>
      </div>
      </Col>
      <Col span="19"
           class="rightArea">
      <!--查询条件表-->
      <dataDisplayTableWithPagination :queryCondition="queryCondition"
                                      :foreignKeyValues="foreignKeyValues"
                                      :columnsDetail="columnsDetail"
                                      :detailDatas="detailDatas"
                                      :total="total"
                                      @showDetail="showDetail"
                                      @pageChange="currentPageChange"></dataDisplayTableWithPagination>
      </Col>
    </Row>
    <Modal v-model="rowModal"
           title="详细信息"
           @on-ok="sureClose">
      <Table :columns="modalColum"
             :data="columnsDetailForModal"></Table>
    </Modal>
    <createItem :visible="createItemModalVisible"
                :isEdit="isEdit"
                :editData="columnsDetailForModal"
                :tableColumnConfigList="nowTreeData"
                @close="createItemModalVisible = false"
                @getVal="getVal"></createItem>
    <transferUserModal :cdata="rowDetail"
                       :visible="showTransferUserModal" />
  </div>
</template>
<script>
import {
  getListData,
  getTableData,
  getFormData,
  addData,
  modifyData
} from '@/api/data'
import createItem from '../components/createItem.vue'
import transferUserModal from '../components/transferUserModal.vue'
import dataDisplayTableWithPagination from '../components/dataDisplayTableWithPagination.vue'
export default {
  name: 'data_form_child',
  components: { createItem, transferUserModal, dataDisplayTableWithPagination },
  data () {
    return {
      active: null,
      modalColum: [
        { title: '字段名', key: 'key' },
        {
          title: '详情',
          key: 'value',
          render: (h, params) => {
            if (params.row.englishName === 'file_id') {
              return h('a', {
                attrs: {
                  href:
                    this.baseUrl +
                    'aiassistant/file/get/file?fileId=' +
                    (params.row.value ? params.row.value.split('-||-')[1] : '')
                }
              },
                (params.row.value ? params.row.value.split('-||-')[0] : ''))
            } else {
              return h('span', params.row.value)
            }
          }
        }
      ],
      // 当前用户id
      userId: localStorage.getItem('id') - 0,
      // 转让数据模态框显示
      showTransferUserModal: false,
      // 是否正在编辑表单
      isEdit: false,
      // 当前新增的表名
      tableName: '',
      // 数据总数
      total: 0,
      // 新增传递的值
      nowTreeData: {},
      createItemModalVisible: false,
      // 名称下拉
      selectValue1: '',
      // 查询条件
      selectValue2: '',
      rowModal: false,
      // 当前选中的列表id
      treeId: '',
      typesObject: {
        COLUMN_SIGN_LINE_TEXT: '单行文本框',
        COLUMN_DROP_BOX: '下拉框',
        COLUMN_RICH_TEXT: '富文本',
        COLUMN_MANY_LINE_TEXT: '多行文本框',
        COLUMN_DATE_TIME: '日期',
        COLUMN_NUMBER: '数字',
        COLUMN_PHONE_NUMBER: '手机号',
        COLUMN_EMAIL: '邮箱号',
        COLUMN_FILE: '附件',
        COLUMN_FOREIGN_KEY: '外键引用框'
      },
      conditionsObject: {
        CONDITION_ENUM_LIKE: '包含关系',
        CONDITION_ENUM_EQUAL: '等于',
        CONDITION_ENUM_MORE: '大于',
        CONDITION_ENUM_LESS: '小于',
        CONDITION_ENUM_BETWEEN: '介于之间'
      },
      baseData: [
        {
          title: 'parent 1'
        },
        {
          title: 'parent 1-1',
          selected: true
        }
      ],
      tabsDatas: [],
      buttonId: 1,
      // 表单配置columnsSetting
      columnsSetting: [
        {
          title: '表单名称',
          key: 'chineseName'
        },
        {
          title: '表单表名',
          key: 'englishName'
        }
      ],
      columns1: [
        {
          title: '字段中文名',
          key: 'chineseName'
        },
        {
          title: '字段英文名',
          key: 'englishName'
        },
        {
          title: '字段类型下拉框枚举',
          key: 'colType',
          render: (h, params) => {
            return h('span', this.typesObject[params.row.colType])
          }
        },
        {
          title: '字段长度',
          key: 'colLength'
        },
        {
          title: '下拉框值域',
          key: 'dropValue'
        },
        {
          title: '引用表值域',
          key: 'fkValue'
        },
        {
          title: '默认值',
          key: 'defaultValue'
        },
        {
          title: '是否引用展示字段',
          key: 'displayColumn',
          render: (h, params) => {
            return h('span', params.row.displayColumn === 1 ? '是' : '否')
          }
        },
        {
          title: '是否唯一',
          key: 'uniqued',
          render: (h, params) => {
            return h(
              'span',
              (function () {
                if (params.row.uniqued === 1) {
                  return '必须唯一'
                } else {
                  return '不做判断'
                }
              })()
            )
          }
        },
        {
          title: '能否为空',
          key: 'empty',
          render: (h, params) => {
            return h(
              'span',
              (function () {
                if (params.row.empty === 1) {
                  return '能为空'
                } else {
                  return '不能为空'
                }
              })()
            )
          }
        }
      ],
      // 查询条件表规则
      searchColumns: [
        {
          title: '名称',
          key: 'tableColumnConfig',
          render: (h, params) => {
            return h('span', params.row.tableColumnConfig.chineseName)
          }
        },
        {
          title: '查询条件',
          key: 'queryType',
          render: (h, params) => {
            return h('span', this.conditionsObject[params.row.queryType])
          }
        }
      ],
      // 查询条件表数据
      searchDatas: [],
      // 表单配置表格
      dataSetting: [],
      //  查看的表头配置信息
      columnsDetail: [],
      //  查看 模态框表格数据
      detailDatas: [],
      //  当前行数据详情
      rowDetail: {},
      //  当前页面页码
      pageNumber: 1,
      //  查询条件集合
      queryCondition: [],
      //  外键下拉列表
      foreignKeyValues: {}
    }
  },
  computed: {
    columnsDetailForModal () {
      let d = this.columnsDetail.reduce((res, item) => {
        if (item.key === 'action') return res
        return [
          ...res,
          {
            key: item.title,
            value: this.rowDetail[item.key],
            englishName: item.key
          }
        ]
      }, [])
      return d
    }
  },
  created () {
    this.getTabsData()
  },
  methods: {
    //  下载
    downFile (id) { },
    currentPageChange (val) {
      this.pageNumber = val
      this.showDetail()
    },
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
      if (this.isEdit) {
        // 编辑表单
        console.log(this.rowDetail)
        obj.dataId = this.rowDetail.id
        modifyData(obj).then(res => {
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
      } else {
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
      }
    },
    sureClose () {
      this.rowModal = false
    },
    // 分页
    showDetail () {
      let obj = {
        pageNum: this.pageNumber, // 请求页码
        pageSize: 10, // 每页数量
        dto: {
          // 业务查询条件
          tableId: this.treeId, // 表单主键ID，由菜单点击事件获得
          queryCondition: this.queryCondition
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
        }
      })
    },
    getTabsData () {
      getListData().then(res => {
        this.tabsDatas = res.data.data
        if (this.tabsDatas.length > 0) {
          this.getTableDatas(this.tabsDatas[0].id)
          this.tableName = this.tabsDatas[0].chineseName
          this.active = 0
        }
      })
    },
    showIndex (data) {
      this.rowModal = true
      this.rowDetail = data
    },
    getNowTreeData (id) {
      getTableData(id).then(res => {
        this.nowTreeData = res.data.data
        this.isEdit = false
        this.createItemModalVisible = true
      })
    },

    getTableDatas (id, index) {
      this.pageNumber = 1
      this.active = index
      this.treeId = id
      this.showDetail()
      getTableData(id).then(res => {
        // //console.log(res.data.data.tableConfig, 'ppppppptable')
        this.dataSetting = [res.data.data.tableConfig]
        // 获取所有搜索条件列表
        this.searchDatas = res.data.data.tableQueryConfigList
        this.queryCondition = []
        // 获取当前表格数据筛选条件的外键下拉选项列表
        this.foreignKeyValues = res.data.data.foreignKeyValues || {}
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
                      this.showIndex(params.row)
                    }
                  },
                  style: {
                    'margin-right': '5px'
                  }
                },
                '查看'
              ),
              (this.dataSetting[0].canEdit && this.userId === params.row.create_user)
                ? [h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        getTableData(this.treeId).then(res => {
                          this.rowDetail = params.row
                          this.nowTreeData = res.data.data
                          this.createItemModalVisible = true
                          this.isEdit = true
                        })
                      }
                    },
                    style: {
                      'margin-right': '5px'
                    }
                  },
                  '编辑'
                ),
                h(
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
                )]
                : null
            ])
          }
        })
      })
    }

  },
  filters: {
    isObj: function (value) {
      // //console.log(typeof value, 'sssssssssssssss')
      if (typeof value === 'undefined') {
        return
      }
      if (typeof value === 'object') {
        return value.displayValue
      } else {
        return value
      }
    }
  }
}
</script>

<style scoped>
.page-style {
  padding: 10px;
  text-align: right;
  background: #fff;
}
.leftArea {
  border: 1px solid #ddd;
  height: 100%;
  padding-right: 5px;
}
.rightArea {
  border: 1px solid #ddd;
  height: 100%;
  padding: 0 10px;
}
.main {
  height: 100%;
}
.body-area {
  height: 100%;
}
.line-30 {
  height: 30px;
  line-height: 30px;
}
.table-title {
  font-size: 16px;
  font-weight: bold;
  padding: 16px 0;
}
.test {
  cursor: pointer;
}
</style>
