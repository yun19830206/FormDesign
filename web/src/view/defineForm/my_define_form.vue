<template>
  <div>
    <Row>
        <p class="table-title">表单配置展示</p>
        <Table :columns="columns" :data="tableData"></Table>
    </Row>
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
import formModel from "../components/defineForm/formModel.vue";
import { getFormConfigData, getMyFormData } from "@/api/data";
console.log(getFormConfigData);
export default {
  name: "directive_page",
  components: {
    formModel
  },
  data() {
    return {
      modelShow: false,
      tableData: [],
      columns: [
        {
          title: "表单名称",
          key: "chineseName"
        },
        {
          title: "表单表名",
          key: "englishName"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "Action",
          key: "action",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params);
                    }
                  }
                },
                "查看详情"
              )
            ]);
          }
        }
      ],
      tableConfig: {},
      tableColumnConfigList: [],
      tableQueryConfigList: [],
      tableDisplayConfigList: [],
      tableConfigColumns: [
        {
          title: "表单名称",
          key: "chineseName"
        },
        {
          title: "表单表名",
          key: "englishName"
        },
        {
          title: "创建时间",
          key: "createTime"
        }
      ],
      tableColumnConfigListColumns: [
        {
          title: "字段中文名",
          key: "chineseName"
        },
        {
          title: "字段英文名",
          key: "englishName"
        },
        {
          title: "字段类型下拉框枚举",
          key: "colType"
        },
        {
          title: "字段长度",
          key: "colLength"
        },
        {
          title: "下拉框值域",
          key: "dropValue"
        },
        {
          title: "引用表值域",
          key: "fkValue"
        },
        {
          title: "默认值",
          key: "defaultValue"
        },
        {
          title: "是否引用展示字段",
          key: "displayColumn"
        },
        {
          title: "是否唯一",
          key: "uniqued"
        },
        {
          title: "能否为空",
          key: "empty"
        }
      ],
      tableQueryConfigListColumns: [
        {
          title: "引用表单表字段ID",
          key: "tableColumn",
          width: 100
        },
        {
          title: "引用表单表字段ID详细内容",
          key: "tableColumnConfig"
        },
        {
          title: "查询条件枚举",
          key: "queryType",
          width: 200
        }
      ],
      tableDisplayConfigListColumns: [
        {
          title: "引用表单表字段ID",
          key: "tableColumn",
          width: 100
        },
        {
          title: "引用表单表字段ID详细内容",
          key: "tableColumnConfig"
        }
      ]
    };
  },
  computed: {},
  created() {
    getMyFormData().then(res => {
      if (res.data.message === "请求成功") {
        this.tableData = res.data.data;
      }
    });
  },
  methods: {
    showModal() {
      this.modalVisible = true;
    },
    getFormConfigData(id) {
      getFormConfigData(id)
        .then(res => {
          this.tableConfig = res.data.data.tableConfig;
          this.tableColumnConfigList = res.data.data.tableColumnConfigList;
          this.tableQueryConfigList = res.data.data.tableQueryConfigList;
          this.tableDisplayConfigList = res.data.data.tableDisplayConfigList;
        })
        .catch(_ => this.$Message.error("请求出错"));
    },
    show (data) {
        this.modelShow = true
        this.getFormConfigData(data.row.id)
    }
  }
};
</script>

<style scoped>
.table-title {
  font-size: 15px;
  margin-bottom: 10px;
}
</style>
