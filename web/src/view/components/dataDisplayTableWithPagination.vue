<template>
  <div style="height:100%;">
    <p class="table-title">查询条件</p>
    <Row>
      <Col span="6"
           v-for="(item, index) in queryCondition"
           :key="index"
           style="padding: 0 10px;">
      <span>{{item.chineseName}}</span>

      <Input v-if="foreignKeyValues === null || typeof foreignKeyValues[item.queryColumnName] === 'undefined'"
             v-model="item.queryValue" />
      <Select clearable
              v-if="foreignKeyValues !== null && typeof foreignKeyValues[item.queryColumnName] !== 'undefined'"
              v-model="item.queryValue">
        <Option v-for="list in foreignKeyValues[item.queryColumnName]"
                :key="list.displayValue"
                :label="list.displayValue"
                :value="list.displayValue"></Option>
      </Select>
      </Col>
      <div style="position: absolute; right: 10px; top: 20px;">
        <Button type="primary"
                @click="$emit('showDetail')">查询</Button>
        <Button v-if="isDetail"
                style="margin-left:5px;"
                type="info"
                @click="$emit('export')">导出</Button>
        <Button v-if="isDetail"
                style="margin-left:5px;"
                type="success"
                @click="$emit('addNew')">新增</Button>
      </div>
    </Row>
    <!--<i-table :columns="searchColumns" :data="searchDatas"></i-table>-->
    <p class="table-title">表单数据展示</p>
    <i-table :columns="columnsDetail"
             :data="detailDatas"></i-table>
    <Page :total="total"
          prev-text="上一页"
          next-text="下一页"
          @on-change="$emit('pageChange')"
          class="page-style" />
  </div>
</template>
<script>
// console.log(exchangeData)

export default {
  props: {
    queryCondition: Array,
    foreignKeyValues: Object,
    columnsDetail: Array,
    detailDatas: Array,
    total: Number,
    isDetail: Boolean
  },
  // 当前页面的全局变量区
  data () {
    return {

    }
  },
  watch: {

  },
  created () {

  },

  computed: {
    show: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('close', val)
      }
    }
  },

  // methods代表本页面公共方法区
  methods: {

    /** 数据提交 */
    showDetail () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.table-title {
  font-size: 16px;
  font-weight: bold;
  padding: 16px 0;
}
.test {
  cursor: pointer;
}
.page-style {
  padding: 10px;
  text-align: right;
  background: #fff;
}
.ivu-table-wrapper {
  height: calc(100% - 220px);
}
</style>
