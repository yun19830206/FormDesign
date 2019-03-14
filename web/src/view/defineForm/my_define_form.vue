<template>
  <div>
    <form-model 
    :tableColumnConfigList="tableColumnConfigList" 
    :modelShow="modelShow" 
    :tableConfig="tableConfig"
    :tableDisplayConfigList="tableDisplayConfigList"
    :tableQueryConfigList="tableQueryConfigList"
    :tableConfigColumns="tableConfigColumns"
    :tableColumnConfigListColumns="tableColumnConfigListColumns"
    :tableQueryConfigListColumns="tableQueryConfigListColumns"
    :tableDisplayConfigListColumns="tableDisplayConfigListColumns"
    @close="modelShow = false" />
    
  </div>
</template>

<script>
import formModel from '../components/defineForm/formModel.vue'
import { getFormConfigData } from '@/api/data'
console.log(getFormConfigData)
export default {
  name: 'directive_page',
  components: {
    formModel
  },
  data () {
    return {
      modelShow: true,
      tableConfig:{},
      tableColumnConfigList:[],
      tableQueryConfigList:[],
      tableDisplayConfigList:[],
      tableConfigColumns:[
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
            key: 'createTime'
        }
      ],
      tableColumnConfigListColumns:[
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
            key: 'colType'
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
            key: 'displayColumn'
        },
        {
            title: '是否唯一',
            key: 'uniqued'
        },
        {
            title: '能否为空',
            key: 'empty'
        }
      ],
      tableQueryConfigListColumns:[
        {
            title: '引用表单表字段ID',
            key: 'tableColumn'
        },
        {
            title: '引用表单表字段ID详细内容',
            key: 'tableColumnConfig'
        },
        {
            title: '查询条件枚举',
            key: 'queryType'
        }
      ],
      tableDisplayConfigListColumns:[
        {
            title: '引用表单表字段ID',
            key: 'tableColumn'
        },
        {
            title: '引用表单表字段ID详细内容',
            key: 'tableColumnConfig'
        }
      ]
    }
  },
  computed: {
    
  },
  created () {
    this.getFormConfigData()
    console.log(12345)
  },
  methods: {
    showModal () {
      this.modalVisible = true
    },
    getFormConfigData () {
      getFormConfigData().then( res => {
          this.tableConfig = res.data.tableConfig
          this.tableColumnConfigList = res.data.tableColumnConfigList
          this.tableQueryConfigList = res.data.tableQueryConfigList
          this.tableDisplayConfigList = res.data.tableDisplayConfigList
      }).catch( _ => this.$Message.error('请求出错'))
    }
  }
}
</script>

<style scoped>
.table-title{
  font-size: 15px;
  margin-bottom: 10px;
}
</style>
