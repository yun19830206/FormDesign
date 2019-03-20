<template>
  <div class="main">
    <Row class="body-area">
      <i-col span="6" class="leftArea">
        <Tree :data="tabsDatas" @on-select-change="onSelectChange"></Tree>
      </i-col>
      <i-col span="18" class="rightArea">
        <!--<row>-->
          <!--<Button type="primary" style="float: right;margin-left: 15px;" @click="ok" :disabled="this.treeId === ''">新增</Button>-->
        <!--</row>-->
        <!--查询条件表-->
        <p class="table-title">查询条件</p>
        <Row>
          <i-col span="2" class="line-30">
            名称:
          </i-col>
          <i-col span="6">
            <i-select :model.sync="selectValue1" style="width:200px">
              <i-option v-for="item in searchDatas" :value="item.tableColumnConfig.chineseName">{{item.tableColumnConfig.chineseName}}</i-option>
            </i-select>
          </i-col>
          <i-col span="2" class="line-30">
            查询条件:
          </i-col>
          <i-col span="6">
            <i-select :model.sync="selectValue2" style="width:200px">
              <i-option v-for="item in searchDatas" :value="conditionsObject[item.queryType]">{{conditionsObject[item.queryType]}}</i-option>
            </i-select>
          </i-col>
        </Row>
        <!--<i-table :columns="searchColumns" :data="searchDatas"></i-table>-->
        <p class="table-title">表单数据展示</p>
        <i-table :columns="columnsDetail" :data="detailDatas"></i-table>
        <Page :total="total" prev-text="上一页" next-text="下一页"  @on-change="current" style="float: right;"/>
      </i-col>
    </Row>
    <Modal
      v-model="rowModal"
      title="详细信息"
      @on-ok="sureClose"
    >
        <Row v-for="item in columnsDetail" :key="item.id" v-if="item.title !== 'action'">
          <i-col span="8">{{item.title}}</i-col>
          <i-col span="16">{{rowDetail[item.key] | isObj}}</i-col>
        </Row>
    </Modal>
    <createItem :showModal="modal1" :tableColumnConfigList="nowTreeData" @close="modal1 = false" @getVal="getVal"></createItem>
    <!--自定义增加组件-->
    <!-- <a :modal="modal1" :obj="data1"></a> -->
  </div>
</template>
<script>
  import { getListData } from '@/api/data'
  import { getTableData } from '@/api/data'
  import  { getFormData } from '@/api/data'
  import  { showDetail } from '@/api/data'
  import  { addData } from '@/api/data'
  import createItem from '../components/createItem.vue'
    export default {
        name: "data_form_child",
        components: {createItem},
        data () {
          return {
            // 当前新增的表名
            tableName: '',
            // 数据总数
            total: 0,
            // 新增传递的值
            nowTreeData: [],
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
            // 查询条件表规则
            searchColumns: [
              {title: '名称',
              key: 'tableColumnConfig',
              render: (h, params) => {
                return h ('span', params.row.tableColumnConfig.chineseName)
                }
              },
              {
                title: '查询条件',
                key: 'queryType',
                render: (h, params) => {
                  return h ('span', this.conditionsObject[params.row.queryType])
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
            rowDetail: {}
          }
        },
      mounted () {
          this.getTabsData()
      },
      methods: {
        current (val) {
          console.log(val)
          this.showDetail(val)
        },
        getVal (data) {
          console.log(data)
          let keys = Object.keys(data)
          let list = []
          keys.forEach((value) => {
            list.push({
              columnName: value,
              columnValue: data[value]
            })
          })
          let obj = {
            'tableId' : this.treeId,                //[必填]表单主键ID，由当面所在表单查询页面维护
            "tableName": this.tableName,   //[必填]表单配置的表名称
            "columnValueList": list
          }
          addData(obj).then((res) => {
            console.log(res.data, 'pppppppppppp')
          })
          setTimeout(() => {
            this.modal1 = false
          },1000)
        },
          sureClose () {
            this.rowModal = false
          },
          // 查看
          showDetail (page) {
            let obj = {
              "pageNum" : page,      //请求页码
              "pageSize" : 10,    //每页数量
              "dto":{             //业务查询条件
                "tableId" : this.treeId,   //表单主键ID，由菜单点击事件获得
                "queryCondition":{}
              }
            }
            getFormData(obj).then((res) => {
              console.log(res.data.data, 'uuuuuuuuuuu')
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
              console.log(res.data.data);
              this.tabsDatas = res.data.data;
              this.getTableDatas(this.tabsDatas[0])
              this.tableName = this.tabsDatas[0].chineseName
              this.tabsDatas.forEach((value, index) => {
                value.title = value.chineseName
                value.render =  (h, { root, node, data }) => {
                  return h('span', {
                    style: {
                      display: 'inline-block',
                      width: '100%'
                    },
                  }, [
                    h('span',{
                        on: {
                          click: (e) => {
                            // console.log(document.getElementsByClassName('test'), 'sssssssss')
                            // for (let key in document.getElementsByClassName('test')) {
                            //   document.getElementsByClassName('test')[key].style.cssText="background-color: #fff;"
                            // }
                            var dom = document.getElementsByClassName('test');
                            for(var i=0,len=dom.length; i<len; i++){
                              dom[i].style.backgroundColor = '#fff';
                            }
                            // document.getElementsByClassName('test').style.background='#ffffff'
                            setTimeout(() => {
                              e.target.style.backgroundColor = "#f06"
                            }, 200)
                            // console.log(e, data, root, node, 'ppppppppppp')
                            this.getTableDatas(data)
                          }
                        },
                        style: {
                          cursor: 'point'
                        },
                      class:['test']
                    }, data.title),
                  h('button',{
                    style: {
                      cursor: 'point',
                      float: 'right',
                      marginRight: '20px'
                    }
                  }, [
                    h('span', {
                      props: {
                        icon: 'ios-add',
                        // type: 'primary'
                      },
                      style: {
                        width: '10px',
                        cursor: 'point'
                      },
                      on: {
                        click: () => { this.getNowTreeData(data.id) }
                      }
                    }, '+')
                  ])])
                }
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
            this.getTableDatas (row[0])
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
          getNowTreeData(id) {
            getTableData(id).then((res) => {
              this.nowTreeData = res.data.data.tableColumnConfigList
              this.modal1 = true
            })
          },
          getTableDatas (data) {
            let id = data.id
            console.log(id, 'ppppppwww')
            this.treeId = id
            this.tableName = data.chineseName
            this.showDetail(1)
            getTableData(id).then((res) => {
              console.log(res.data.data.tableConfig, 'ppppppptable')
              this.data1 = res.data.data.tableColumnConfigList
              this.dataSetting = [res.data.data.tableConfig]
              this.searchDatas = res.data.data.tableQueryConfigList
              this.selectValue1 = this.searchDatas[0].tableColumnConfig.chineseName
              this.selectValue2 = this.conditionsObject[this.searchDatas[0].queryType]
              console.log(this.selectValue2, 'ppppppppppp');
              //  this.conditionsObject[params.row.queryType]
              this.columnsDetail = []
              res.data.data.tableColumnConfigList.forEach((value, index) => {
                // let obj = {title: '', key: ''}
                // if (value.title === 'action') {
                //   return
                // }
                // render: (h, params) => {
                //   h ('span', function () {
                //     console.log(params.row, '00000000000000', this)
                //     // compange_name
                //     if (typeof params.row[value.englishName] === 'undefined') {
                //       return ''
                //     }
                //     if (typeof params.row[value.englishName] === 'object') {
                //       return params.row[value.englishName].displayValue
                //     } else {
                //       return params.row[value.englishName]
                //     }
                //   })
                // }
                this.columnsDetail.push(
                  {
                    title: value.chineseName,
                    key: value.englishName,
                    width: 150
                  }
                    )
              })
              this.columnsDetail.push({
                title: '操作',
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
