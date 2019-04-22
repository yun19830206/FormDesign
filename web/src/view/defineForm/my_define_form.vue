<template>
  <div>
    <Row>
      <p class="table-title">表单配置展示</p>
      <Table :columns="columns"
             :data="tableData"></Table>
    </Row>
    <form-model :tableColumnConfigList="tableColumnConfigList"
                :modelShow="modelShow"
                :tableConfig="tableConfig"
                :tableDisplayConfigList="tableDisplayConfigList"
                :tableQueryConfigList="tableQueryConfigList"
                :tableConfigColumns="tableConfigColumns"
                :tableColumnConfigListColumns="tableColumnConfigListColumns"
                :tableQueryConfigListColumns="tableQueryConfigListColumns"
                :tableDisplayConfigListColumns="tableDisplayConfigListColumns"
                @close="modelShow = false" />

    <!-- <createItem :showModal="mo" :tableColumnConfigList="data"  @close="mo = false"  /> -->

  </div>
</template>

<script>
import formModel from '../components/defineForm/formModel.vue'
import createItem from '../components/createItem.vue'
import { getFormConfigData, getMyFormData } from '@/api/data'
// console.log(getFormConfigData);
export default {
  name: 'directive_page',
  components: {
    formModel,
    createItem
  },
  data () {
    return {
      mo: false,
      data: [],
      modelShow: false,
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

      tableData: [],
      columns: [
        {
          title: '表单名称',
          key: 'chineseName'
        },
        {
          title: '表单表名',
          key: 'englishName'
        },
        {
          title: '创建时间',
          key: 'createTime',
          render: (h, params) => {
            return h(
              'span',
              new Date(params.row.createTime).format('yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params)
                    }
                  }
                },
                '查看详情'
              )
            ])
          }
        }
      ],
      tableConfig: {},
      tableColumnConfigList: [],
      tableQueryConfigList: [],
      tableDisplayConfigList: [],
      tableConfigColumns: [
        {
          title: '表单名称',
          key: 'chineseName'
        },
        {
          title: '表单表名',
          key: 'englishName'
        },
        {
          title: '创建时间',
          key: 'createTime',
          render: (h, params) => {
            return h(
              'span',
              new Date(params.row.createTime).format('yyyy-MM-dd hh:mm:ss')
            )
          }
        }
      ],
      tableColumnConfigListColumns: [
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
          render: this.renderTF('displayColumn')
        },
        {
          title: '是否唯一',
          key: 'uniqued',
          render: this.renderTF('uniqued')
        },
        {
          title: '能否为空',
          key: 'empty',
          render: this.renderTF('empty')
        }
      ],
      tableQueryConfigListColumns: [
        {
          title: '引用表单表字段ID',
          key: 'tableColumn',
          render: (h, params) => {
            return h('span', params.row.tableColumnConfig.chineseName)
          }
        },
        {
          title: '查询条件枚举',
          key: 'queryType',
          render: (h, params) => {
            return h('span', this.conditionsObject[params.row.queryType])
          }
        }
      ],
      tableDisplayConfigListColumns: [
        {
          title: '引用表单表字段ID',
          key: 'tableColumn',
          render: (h, params) => {
            return h('span', params.row.tableColumnConfig.chineseName)
          }
        }
      ]
    }
  },
  computed: {},
  created () {
    getMyFormData().then(res => {
      if (res.data.message === '请求成功') {
        this.tableData = res.data.data
      }
    })
  },
  methods: {
    /**
     * 渲染表格是否项
     */
    renderTF (param) {
      return (h, params) => {
        return h('span', params.row[param] ? '是' : '否')
      }
    },
    showModal () {
      this.modalVisible = true
    },
    getFormConfigData (id) {
      getFormConfigData(id)
        .then(res => {
          this.tableConfig = res.data.data.tableConfig
          this.tableColumnConfigList = res.data.data.tableColumnConfigList
          this.tableQueryConfigList = res.data.data.tableQueryConfigList
          this.tableDisplayConfigList = res.data.data.tableDisplayConfigList
        })
        .catch(_ => this.$Message.error('请求出错'))
    },
    show (data) {
      this.modelShow = true
      this.getFormConfigData(data.row.id)
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
