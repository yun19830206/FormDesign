<template>
  <Row :gutter="10">
    
  </Row>
</template>

<script>
import PasteEditor from '_c/paste-editor'
import { getTableDataFromArray } from '@/libs/util'
export default {
  name: 'update_paste_page',
  components: {
    PasteEditor
  },
  data () {
    return {
      pasteDataArr: [],
      columns: [],
      tableData: [],
      validated: true,
      errorIndex: 0
    }
  },
  methods: {
    handleSuccess () {
      this.validated = true
    },
    handleError (index) {
      this.validated = false
      this.errorIndex = index
    },
    handleShow () {
      if (!this.validated) {
        this.$Notice.error({
          title: '您的内容不规范',
          desc: `您的第${this.errorIndex + 1}行数据不规范，请修改`
        })
      } else {
        let { columns, tableData } = getTableDataFromArray(this.pasteDataArr)
        this.columns = columns
        this.tableData = tableData
      }
    }
  }
}
</script>

<style lang="less">
.update-paste{
  &-con{
    height: 350px;
  }
  &-btn-con{
    box-sizing: content-box;
    height: 30px;
    padding: 15px 0 5px;
  }
}
.paste-tip{
  color: #19be6b;
}
</style>
