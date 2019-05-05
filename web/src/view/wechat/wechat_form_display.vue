<template>
  <div style="overflow: auto;height: 100%; ">
    <table class="gridtable">
      <tr>
        <th nowrap="nowrap"
            v-for="cg in configData"
            :key="cg.id">{{cg.tableColumnConfig.chineseName}}</th>
        <th v-if="canEdit"
            nowrap="nowrap">操作</th>
      </tr>
      <tr v-for="l in list"
          :key="l.id">
        <td v-for="cg in configData"
            :key="cg.id + '' + l.id">
          <span v-html="computedVal(l,cg)"></span>
        </td>
        <td nowrap="nowrap">
          <a style="margin-right:10px;"
             v-if="canEdit && l.create_user === userid"
             :href="'/#/wechat_form_edit/' + id + '/' + l.id ">编辑</a>
          <a v-if="canEdit && l.create_user === userid"
             href="javascript:;"
             @click="changUserBegin(l)">转让</a>
        </td>
      </tr>
    </table>
    <van-pagination class="pages"
                    @change="pageChange"
                    v-model="currentPage"
                    :total-items="total"
                    :items-per-page="pageSize"
                    force-ellipses />
    <van-popup position="bottom"
               v-model="showSelect">
      <van-picker :defaultIndex="defaultIndex"
                  show-toolbar
                  title="选择用户"
                  @cancel="onCancel"
                  @confirm="onConfirm"
                  :columns="users" />
    </van-popup>
  </div>
</template>
<script>
import { getFormConfigData, getFormData, exchangeData } from '@/api/data'
import { getCurrentUser, getAllUsers } from '@/api/user'

export default {
  data () {
    return {
      showSelect: false,
      loading: false,
      pageSize: 16,
      finished: false,
      currentPage: 1,
      activeItem: {},
      total: 0,
      defaultIndex: 0,
      id: '',
      users: [],
      pageNo: 1,
      list: [],
      configData: [],
      userid: 0,
      canEdit: false // 能否编辑
    }
  },
  created () {
    localStorage.setItem('login', 'login')
    document.title = '云问CRM助手-表单详情'
    this.id = this.$route.params.id
    getCurrentUser().then(res => {
      this.onLoad(this.id)
      if (res.data.code === 200) {
        this.userid = res.data.data.id
      }
    })
  },
  methods: {
    computedVal (l, cg) {
      if (
        cg.tableColumnConfig.colType === 'COLUMN_DATE_TIME' &&
        l[cg.tableColumnConfig.englishName]
      ) {
        return new Date(
          l[cg.tableColumnConfig.englishName]
            .replace(/-/g, '/')
            .replace('T', ' ')
            .replace('.000+0000', '')
        ).format('yyyy-MM-dd hh:mm:ss')
      } else if (cg.tableColumnConfig.colType === 'COLUMN_FILE') {
        return (
          '<a href="' +
          this.baseUrl +
          'aiassistant/file/get/file?fileId=' +
          (l[cg.tableColumnConfig.englishName]
            ? l[cg.tableColumnConfig.englishName].originValue
            : '') +
          '">' +
          (l[cg.tableColumnConfig.englishName]
            ? l[cg.tableColumnConfig.englishName].displayValue === undefined
              ? l[cg.tableColumnConfig.englishName]
              : l[cg.tableColumnConfig.englishName].displayValue
            : '') +
          '</a>'
        )
      } else {
        return l[cg.tableColumnConfig.englishName]
          ? l[cg.tableColumnConfig.englishName].displayValue === undefined
            ? l[cg.tableColumnConfig.englishName]
            : l[cg.tableColumnConfig.englishName].displayValue
          : ''
      }
    },
    onLoad (id) {
      getFormConfigData(id)
        .then(res => {
          if (res.data.code === 200) {
            this.configData = res.data.data.tableDisplayConfigList
            this.canEdit = !!res.data.data.tableConfig.canEdit
            this.loadData(1)
          } else {
          }
          this.loading = false
        })
        .catch(_ => (this.loading = false))
    },
    loadData () {
      let data = {
        pageNum: this.currentPage, // 请求页码
        pageSize: this.pageSize, // 每页数量
        dto: {
          // 业务查询条件
          tableId: this.id
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
    pageChange (page) {
      this.currentPage = page
      this.loadData()
    },
    changUserBegin (l) {
      this.showSelect = true
      if (this.users.length === 0) {
        getAllUsers().then(res => {
          if (res.data.code === 200) {
            this.users = res.data.data.reduce((res, item) => {
              if (item.id !== this.userid) {
                return [...res, { text: item.userName, key: item.id }]
              } else {
                return res
              }
            }, [])
          } else {
            this.$notify({
              message: '请求出错',
              duration: 1000,
              background: '#f44'
            })
          }
        })
      }
    },
    onCancel () {
      this.showSelect = false
    },
    onConfirm (val, v2) {
      // let data = {
      //   customerId: this.cdata.id,
      //   toUserId: this.formItem.user
      // }
      exchangeData()
      console.log(val, v2)
      this.showSelect = false
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
