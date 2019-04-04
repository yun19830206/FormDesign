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
          <Icon type="md-add" /></Button>
      </div>
      </Col>
      <Col span="19"
           class="rightArea">
      <!--<row>-->
      <!--<Button type="primary" style="float: right;margin-left: 15px;" @click="ok" :disabled="this.treeId === ''">新增</Button>-->
      <!--</row>-->
      <!--查询条件表-->
      <p class="table-title">查询条件</p>
      <Row>
        <!--                    queryColumnName: value.tableColumnConfig.englishName,
                    queryColumnType: value.queryType,
                    queryValue: '',
                    chineseName: value.tableColumnConfig.chineseName-->
        <Col span="6"
             v-for="(item, index) in queryCondition"
             :key="index"
             style="padding: 0 10px;">
        <span>{{item.chineseName}}</span>

        <Input v-if="foreignKeyValues ===null || typeof foreignKeyValues[item.queryColumnName] === 'undefined'"
               v-model="item.queryValue" />
        <Select v-if="foreignKeyValues !==null && typeof foreignKeyValues[item.queryColumnName] !== 'undefined'"
                v-model="item.queryValue">
          <Option v-for="list in foreignKeyValues[item.queryColumnName]"
                  :key="list.displayValue"
                  :label="list.displayValue"
                  :value="list.displayValue"></Option>
        </Select>
        </Col>
        <Button type="primary"
                style="position: absolute; right: 10px; top: 20px;"
                @click="showDetail">查询</Button>
      </Row>
      <!--<i-table :columns="searchColumns" :data="searchDatas"></i-table>-->
      <p class="table-title">表单数据展示</p>
      <i-table :columns="columnsDetail"
               :data="detailDatas"></i-table>
      <Page :total="total"
            prev-text="上一页"
            next-text="下一页"
            @on-change="current"
            style="float: right;" />
      </Col>
    </Row>
    <Modal v-model="rowModal"
           title="详细信息"
           @on-ok="sureClose">
      <!--<Row v-for="item in columnsDetail" :key="item.id" v-if="item.title !== 'action'">-->
      <!--<i-col span="8">{{item.title}}</i-col>-->
      <!--<i-col span="16">{{rowDetail[item.key] | isObj}}</i-col>-->
      <!--</Row>-->
      <table class="ivu-table table"
             style="width: 400px;text-align: center;">
        <tr class="ivu-table-row"
            v-for="item in columnsDetail"
            :key="item.id">
          <td style="width: 150px;">{{item.key === 'action' ? '' : item.title}}</td>
          <td><a :href="baseUrl + 'aiassistant/file/get/file?fileId=' + rowDetail.id"
               v-if="item.key === 'file_id'">{{rowDetail[item.key] | isObj}}</a><span v-else>{{rowDetail[item.key] | isObj}}</span></td>
        </tr>
      </table>
    </Modal>
    <createItem :showModal="modal1"
                :tableColumnConfigList="nowTreeData"
                @close="modal1 = false"
                @getVal="getVal"></createItem>
    <!--自定义增加组件-->
    <!-- <a :modal="modal1" :obj="data1"></a> -->
  </div>
</template>
<script>
import { getListData } from '@/api/data'
import { getTableData } from '@/api/data'
import { getFormData } from '@/api/data'
import { showDetail } from '@/api/data'
import { addData } from '@/api/data'
import createItem from '../components/createItem.vue'
export default {
  name: 'data_form_child',
  components: { createItem },
  data () {
    return {
      active: null,
      modalColum: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '值',
          key: 'value'
        }
      ],
      modalDetails: [],
      // 当前新增的表名
      tableName: '',
      // 数据总数
      total: 0,
      // 新增传递的值
      nowTreeData: {},
      modal1: false,
      // 名称下拉
      selectValue1: '',
      // 查询条件
      selectValue2: '',
      rowModal: false,
      data1: [],
      // 当前选中的列表id
      treeId: '',
      typesObject: {
        'COLUMN_SIGN_LINE_TEXT': '单行文本框',
        'COLUMN_DROP_BOX': '下拉框',
        'COLUMN_RICH_TEXT': '富文本',
        'COLUMN_MANY_LINE_TEXT': '多行文本框',
        'COLUMN_DATE_TIME': '日期',
        'COLUMN_NUMBER': '数字',
        'COLUMN_PHONE_NUMBER': '手机号',
        'COLUMN_EMAIL': '邮箱号',
        'COLUMN_FILE': '附件',
        'COLUMN_FOREIGN_KEY': '外键引用框'
      },
      conditionsObject: {
        'CONDITION_ENUM_LIKE': '包含关系',
        'CONDITION_ENUM_EQUAL': '等于',
        'CONDITION_ENUM_MORE': '大于',
        'CONDITION_ENUM_LESS': '小于',
        'CONDITION_ENUM_BETWEEN': '介于之间'
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
            return h('span', (function () {
              if (params.row.uniqued === 1) {
                return '必须唯一'
              } else {
                return '不做判断'
              }
            }()))
          }
        },
        {
          title: '能否为空',
          key: 'empty',
          render: (h, params) => {
            return h('span', (function () {
              if (params.row.empty === 1) {
                return '能为空'
              } else {
                return '不能为空'
              }
            }()))
          }
        }
      ],
      // 查询条件表规则
      searchColumns: [
        { title: '名称',
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
  mounted () {
    this.getTabsData()
  },
  methods: {
    //  下载
    downFile (id) {

    },
    current (val) {
      // //console.log(val)
      this.pageNumber = val
      this.showDetail()
    },
    getVal (data) {
      // //console.log(data)
      let keys = Object.keys(data)
      let list = []
      keys.forEach((value) => {
        list.push({
          columnName: value,
          columnValue: data[value]
        })
      })
      let obj = {
        'tableId': this.treeId, // [必填]表单主键ID，由当面所在表单查询页面维护
        'tableName': this.nowTreeData.tableConfig.englishName, // [必填]表单配置的表名称
        'columnValueList': list
      }
      addData(obj).then((res) => {
        // //console.log(res.data, 'pppppppppppp')
      })
      setTimeout(() => {
        this.modal1 = false
      }, 100)
    },
    sureClose () {
      this.rowModal = false
    },
    // 分页
    showDetail () {
      // console.log(this.selectValue1, this.selectValue2, 'kkkkkkkkkk')
      let sendObj = { englishName: '', chineseName: '' }
      if (this.selectValue1 !== '') {
        sendObj.englishName = JSON.parse(this.selectValue1).englishName
        sendObj.chineseName = JSON.parse(this.selectValue1).chineseName
      }
      let obj = {
        'pageNum': this.pageNumber, // 请求页码
        'pageSize': 10, // 每页数量
        'dto': { // 业务查询条件
          'tableId': this.treeId, // 表单主键ID，由菜单点击事件获得
          'queryCondition': this.queryCondition
        }
      }
      getFormData(obj).then((res) => {
        // console.log(res.data.data, 'uuuuuuuuuuu')
        this.detailDatas = res.data.data.list
        this.total = res.data.data.total
        this.detailDatas.forEach((value) => {
          let objKeys = Object.keys(value)
          objKeys.forEach((val) => {
            if (typeof value[val] === 'object') {
              value[val] = value[val].displayValue
            }
          })
        })
      })
    },
    ok () {
      this.modal1 = true
    },
    getTabsData () {
      getListData().then((res) => {
        // //console.log(res.data.data);
        this.tabsDatas = res.data.data.sort((a, b) => a.id - b.id)
        this.getTableDatas(this.tabsDatas[0].id)
        this.tableName = this.tabsDatas[0].chineseName
        this.active = 0
      })
    },
    showIndex (id) {
      // //console.log(id)
      let obj = {
        'tableId': this.treeId, // [必填]表单主键ID，由当面所在表单查询页面维护
        'dataIdList': [id]
      }
      showDetail(obj).then((res) => {
        // //console.log(res.data.data)data
        if (res.data.data.length > 0) {
          this.rowModal = true
          this.rowDetail = res.data.data[0]
        } else {
          this.$Message.info(res.data.message)
        }
      })
    },
    getNowTreeData (id) {
      getTableData(id).then((res) => {
        this.nowTreeData = res.data.data
        // console.log(this.nowTreeData, 'uuuuuuu')
        this.modal1 = true
      })
    },
    getTableDatas (id, index) {
      this.active = index
      this.treeId = id
      this.showDetail(this.pageNumber)
      getTableData(id).then((res) => {
        // //console.log(res.data.data.tableConfig, 'ppppppptable')
        this.data1 = res.data.data.tableColumnConfigList
        this.dataSetting = [res.data.data.tableConfig]
        // 获取所有搜索条件列表
        this.searchDatas = res.data.data.tableQueryConfigList
        this.queryCondition = []
        // 获取当前表格数据筛选条件的外键下拉选项列表
        this.foreignKeyValues = res.data.data.foreignKeyValues
        if (this.foreignKeyValues === null) {
          this.foreignKeyValues = {}
        }
        // 设置查询条件
        // console.log(this.searchDatas, 'dddddddd')
        this.searchDatas.forEach((value) => {
          if (value.tableColumnConfig.dropValue !== null) {
            let arr = []
            value.tableColumnConfig.dropValue.split(',').forEach((v) => {
              arr.push({ displayValue: v })
            })
            let key = value.tableColumnConfig.englishName
            this.foreignKeyValues[value.tableColumnConfig.englishName] = arr
          }
          // console.log(this.foreignKeyValues, 'yyyyyyyyyyyyyyyyyyyy')
          this.queryCondition.push(
            {
              queryColumnName: value.tableColumnConfig.englishName,
              queryColumnType: value.queryType,
              queryValue: '',
              chineseName: value.tableColumnConfig.chineseName,
              colType: value.tableColumnConfig.colType
            }
          )
        })
        // console.log(this.queryCondition, 'uuuuuuuu')
        this.columnsDetail = []
        res.data.data.tableColumnConfigList.forEach((value, index) => {
          if (value.colType === 'COLUMN_FILE') {
            this.columnsDetail.push(
              {
                title: value.chineseName,
                key: value.englishName,
                width: 200,
                render: (h, params) => {
                  return h('a', {
                    attrs: {
                      href: this.baseUrl + 'aiassistant/file/get/file?fileId=' + params.row.id
                    }
                  }, params.row.file_id)
                }
              }
            )
          } else {
            this.columnsDetail.push(
              {
                title: value.chineseName,
                key: value.englishName,
                width: 200
              }
            )
          }
        })
        this.modalDetails = [...this.columnsDetail]
        this.columnsDetail.push({
          title: '操作',
          key: 'action',
          width: 100,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              on: {
                click: () => {
                  this.showIndex(params.row.id)
                }
              }
            }, '查看')
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
