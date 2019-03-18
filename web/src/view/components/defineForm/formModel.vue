<template>
    <Modal
        width="1200px"
        v-model="show"
        title="详情"
        @on-cancel="cancel">
        <Row>
            <p class="table-title">表单配置展示</p>
            <Table :columns="tableConfigColumns" :data="[tableConfig]"></Table>
        </Row>
        <Divider></Divider>
        <Row>
            <p class="table-title">表单配置字段展示</p>
            <Table :columns="tableColumnConfigListColumns" :data="tableColumnConfigList"></Table>
        </Row>
        <Divider></Divider>
        <Row>
            <p class="table-title">表单查询条件配置展示</p>
            <Table :columns="tableQueryConfigListColumns" :data="tableQueryConfigList"></Table>
        </Row>
        <Divider></Divider>
        <Row>
            <p class="table-title">表单查询结果字段展示</p>
            <Table :columns="tableDisplayConfigListColumns" :data="tableDisplayConfigList"></Table>
        </Row>
        <Divider></Divider>
    </Modal>
</template>
<script>
export default {
  props: {
    modelShow: {
      type: Boolean
    },
    tableColumnConfigList: {
      type:Array
    },
    tableConfig: {
      type:Object
    },
    tableDisplayConfigList: {
      type:Array
    },
    tableQueryConfigList: {
      type:Array
    },
    tableConfigColumns: {
      type:Array
    },
    tableColumnConfigListColumns: {
      type:Array
    },
    tableQueryConfigListColumns: {
      type:Array
    },
    tableDisplayConfigListColumns: {
      type:Array
    }
  },
  data() {
    return {};
  },
  computed: {
    show: {
      get() {
        return this.modelShow;
      },
      set() {
        this.$emit("close");
      }
    }
  },
  methods: {
      cancel() {
        this.$emit("close");
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


