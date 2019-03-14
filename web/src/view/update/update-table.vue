<template>
  <Row :gutter="10">
   
  </Row>
</template>

<script>
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
export default {
  name: 'update_table_page',
  data () {
    return {
      columns: [],
      tableData: []
    }
  },
  methods: {
    beforeUpload (file) {
      getArrayFromFile(file).then(data => {
        let { columns, tableData } = getTableDataFromArray(data)
        this.columns = columns
        this.tableData = tableData
      }).catch(() => {
        this.$Notice.warning({
          title: '只能上传Csv文件',
          desc: '只能上传Csv文件，请重新上传'
        })
      })
      return false
    }
  }
}
</script>

<style>
.update-table-intro{
  margin-top: 10px;
}
.code-high-line{
  color: #2d8cf0;
}
</style>
