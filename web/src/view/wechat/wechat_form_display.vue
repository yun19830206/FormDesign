<template>
  <div style="overflow: auto;height: 100%; ">
    <table class="gridtable">
      <tr>
        <th nowrap="nowrap"
            v-for="cg in configData"
            :key="cg.id">{{cg.tableColumnConfig.chineseName}}</th>
      </tr>
      <tr v-for="l in list"
          :key="l.id">
        <td v-for="cg in configData"
            :key="cg.id + '' + l.id">
          <span v-html="computedVal(l,cg)"></span>
        </td>
      </tr>
    </table>
    <van-pagination class="pages"
                    @change="pageChange"
                    v-model="currentPage"
                    :total-items="total"
                    :items-per-page="pageSize"
                    force-ellipses />
    <van-dialog v-model="show">
      <van-list :finished="finished">
        <van-cell v-for="(k,v) in activeItem"
                  :key="k">
          <span class="">
            <p>{{v}}:</p>
            <p style="text-align:right;">{{k.displayValue || k}}</p>
          </span>
        </van-cell>

      </van-list>
    </van-dialog>
  </div>
</template>
<script>
import { getFormConfigData, getFormData } from '@/api/data'
export default {
  data () {
    return {
      loading: false,
      show: false,
      pageSize: 16,
      finished: false,
      currentPage: 1,
      activeItem: {},
      total: 0,
      id: '',
      pageNo: 1,
      list: [],
      configData: []
    }
  },
  created () {
    localStorage.setItem('login', 'login')
    document.title = '云问CRM助手-表单详情'
    this.id = this.$route.params.id
    this.onLoad(this.id)
  },
  methods: {
    computedVal (l, cg) {
      if (cg.tableColumnConfig.colType === 'COLUMN_DATE_TIME' && l[cg.tableColumnConfig.englishName]) {
        return new Date(l[cg.tableColumnConfig.englishName].replace(/-/g, '/').replace('T', ' ').replace('.000+0000', '')).format('yyyy-MM-dd hh:mm:ss')
      } else if (cg.tableColumnConfig.colType === 'COLUMN_FILE') {
        return ('<a href="' +
          this.baseUrl +
          'aiassistant/file/get/file?fileId=' +
          (l[cg.tableColumnConfig.englishName] ? l[cg.tableColumnConfig.englishName].originValue : '') +
          '">' +
          (l[cg.tableColumnConfig.englishName] ? (l[cg.tableColumnConfig.englishName].displayValue === undefined ? l[cg.tableColumnConfig.englishName] : l[cg.tableColumnConfig.englishName].displayValue) : '') +
          '</a>')
      } else {
        return l[cg.tableColumnConfig.englishName] ? (l[cg.tableColumnConfig.englishName].displayValue === undefined ? l[cg.tableColumnConfig.englishName] : l[cg.tableColumnConfig.englishName].displayValue) : ''
      }
    },
    onLoad (id) {
      getFormConfigData(id).then(res => {
        if (res.data.code === 200) {
          this.configData = res.data.data.tableDisplayConfigList
          this.loadData(1)
        } else {

        }
        this.loading = false
      }).catch(_ => this.loading = false)
    },
    loadData () {
      let data = {
        'pageNum': this.currentPage, // 请求页码
        'pageSize': this.pageSize, // 每页数量
        'dto': { // 业务查询条件
          'tableId': this.id
        }
      }
      getFormData(data).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {

        }
        this.loading = false
      })
    },
    showInfo (item) {
      this.activeItem = item
      this.show = true
    },
    pageChange (page) {
      this.currentPage = page
      this.loadData()
    }

  }
}
</script>
<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
table.gridtable {
  margin-bottom: 50px;
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #eee;
  border-collapse: collapse;
}
table.gridtable th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #eee;
  background-color: #dedede;
  font-size: 14px;
}
table.gridtable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #eee;
  background-color: #ffffff;
  font-size: 14px;
}
.pages {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
