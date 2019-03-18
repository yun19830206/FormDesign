<template>
  <div>
    <!--<Radio-group :model.sync="buttonId" type="button" size="large" @on-change="getTableDatas(buttonId)">-->
      <!--<Radio v-for="item in tabsDatas" :value="item.id">{{item.chineseName}}</Radio>-->
    <!--</Radio-group>-->
    <!--<div>-->
      <!--<i-table :columns="columns1" :data="data1"></i-table>-->
    <!--</div>-->
    <Row>
      <i-col span="4">
        <Tree :data="tabsDatas" @on-select-change="onSelectChange"></Tree>
      </i-col>
      <i-col span="20">
        <row>
          <Button type="primary" style="float: right;margin-left: 15px;" :disabled="this.treeId === ''">新增</Button>
          <Button type="success" style="float: right;" @click="showDetail" :disabled="this.treeId === ''">查看</Button>
        </row>
        <p class="table-title">表单配置展示</p>
        <i-table :columns="columnsSetting" :data="dataSetting"></i-table>
        <p class="table-title">表单数据展示</p>
        <i-table :columns="columns1" :data="data1"></i-table>
      </i-col>
    </Row>
    <!--查看-->
    <Modal
      v-model="modal1"
      title="表数据"
      :fullscreen="true"
      @on-ok="ok"
      >
      <i-table :columns="columnsDetail" :data="detailDatas"></i-table>
    </Modal>
    <Modal
      v-model="rowModal"
      title="详细信息"
      @on-ok="sureClose"
    >
        <Row v-for="item in columnsDetail" v-if="item.title !== 'action'">
          <i-col span="8">{{item.title}}</i-col>
          <i-col span="16">{{rowDetail[item.key] | isObj}}</i-col>
        </Row>
    </Modal>
  </div>
</template>
<script>
  import { getListData } from '@/api/data'
  import { getTableData } from '@/api/data'
  import  { getFormData } from '@/api/data'
  import  { showDetail } from '@/api/data'
    export default {
        name: "data_form_child",
        data () {
          return {
            rowModal: false,
            // 查看莫泰框
            modal1: false,
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
                  return h ('span', this.typesObject[params.row.colType])
                }
              },
              {
                title: '字段长度',
                key: 'colLength'
              },
              {
                title: "下拉框值域",
                key: 'dropValue'
              },
              {
                title: "引用表值域",
                key: 'fkValue'
              },
              {
                title: "默认值",
                key: 'defaultValue'
              },
              {
                title: "是否引用展示字段",
                key: 'displayColumn',
                render: (h, params) => {
                  return h ('span', params.row.displayColumn === 1 ? '是' : '否')
                }
              },
              {
                title: "是否唯一",
                key: 'uniqued',
                render: (h, params) => {
                  return h ('span', function () {
                      if (params.row.uniqued === 1) {
                        return '必须唯一'
                      } else {
                        return '不做判断'
                      }
                  }())
                }
              },
              {
                title: "能否为空",
                key: 'empty',
                render: (h, params) => {
                  return h ('span', function () {
                    if (params.row.empty === 1) {
                      return '能为空'
                    } else {
                      return '不能为空'
                    }
                  }())
                }
              }
            ],
            // 表单配置表格
            dataSetting: [],
            // 表单数据表格
            data1: [],
          //  查看的表头配置信息
            columnsDetail: [],
          //  查看 模态框表格数据
            detailDatas: [],
          //  当前行数据详情
            rowDetail: {}
          }
        },
      mounted () {
          this.getTabsData()
      },
      methods: {
          sureClose () {
            this.rowModal = false
          },
          // 查看
          showDetail () {
            this.modal1 = true
            let obj = {
              "pageNum" : 1,      //请求页码
              "pageSize" : 30,    //每页数量
              "dto":{             //业务查询条件
                "tableId" : this.treeId,   //表单主键ID，由菜单点击事件获得
                "queryCondition":{}
              }
            }
            getFormData(obj).then((res) => {
              console.log(res.data.data, 'uuuuuuuuuuu')
              this.detailDatas = res.data.data.list
            })
          },
          ok () {
            this.modal1 = false
          },
          getTabsData () {
            getListData().then((res) => {
              console.log(res.data.data);
              this.tabsDatas = res.data.data;
              this.tabsDatas.forEach((value, index) => {
                value.title = value.chineseName
                // if (index === 0) {
                //   value.selected = true
                // }
              })
            })
          },
          onSelectChange (row) {
            console.log(row, 'ppppp')
            if (row.length === 0) {
              return
            }
            this.getTableDatas (row[0].id)
          },
          showIndex (id) {
            console.log(id)
            let obj = {
              "tableId" : this.treeId,              //[必填]表单主键ID，由当面所在表单查询页面维护
              "dataIdList":[id]
            }
            showDetail(obj).then((res) => {
              // console.log(res.data.data)data
              if (res.data.data.length > 0) {
                this.rowModal = true
                this.rowDetail = res.data.data[0]
              } else {
                this.$Message.info(res.data.message)
              }
            })
          },
          getTableDatas (id) {
            console.log(id, 'ppppppwww');
            this.treeId = id;
            getTableData(id).then((res) => {
              console.log(res.data.data.tableConfig, 'ppppppptable');
              this.data1 = res.data.data.tableColumnConfigList;
              this.dataSetting = [res.data.data.tableConfig]
              this.columnsDetail = []
              res.data.data.tableColumnConfigList.forEach((value, index) => {
                // let obj = {title: '', key: ''}
                // if (value.title === 'action') {
                //   return
                // }
                this.columnsDetail.push(
                  {
                    title: value.chineseName,
                    key: value.englishName
                  }
                    )
              })
              this.columnsDetail.push({
                title: 'action',
                key: 'action',
                width: 100,
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
            console.log(typeof value, 'sssssssssssssss')
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

</style>
