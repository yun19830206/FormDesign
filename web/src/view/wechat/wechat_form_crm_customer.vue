<template>
  <div style="overflow: auto;height: 100%; ">
    <Spin v-if="loading"
          fix></Spin>
    <i-table :columns="columns"
             width="100%"
             :data="list"></i-table>
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
      loading: true,
      pageSize: 16,
      finished: false,
      currentPage: 1,
      activeItem: {},
      total: 0,
      defaultIndex: 0,
      id: '',
      users: [],
      name: '',
      pageNo: 1,
      list: [],
      columns: [],
      configData: [],
      userid: 0,
      canEdit: false // 能否编辑
    }
  },
  created () {
    localStorage.setItem('login', 'login')
    document.title = '云问CRM助手-CRM客户管理'
    this.id = 1
    console.log(this.$route)
    this.name = this.$route.query.name || ''
    getCurrentUser().then(res => {
      this.onLoad(this.id)
      if (res.data.code === 200) {
        this.userid = res.data.data.id
      }
    })
  },
  methods: {
    onLoad (id) {
      getFormConfigData(id)
        .then(res => {
          if (res.data.code === 200) {
            this.configData = res.data.data.tableDisplayConfigList
            this.columns = res.data.data.tableDisplayConfigList.map(i => {
              if (i.tableColumnConfig.colType === 'COLUMN_FILE') {
                return {
                  title: i.tableColumnConfig.chineseName,
                  key: i.tableColumnConfig.englishName,
                  width: 200,
                  render: (h, params) => {
                    return h(
                      'a',
                      {
                        attrs: {
                          href:
                            this.baseUrl +
                            'aiassistant/file/get/file?fileId=' +
                            (params.row.file_id ? params.row.file_id.split('-||-')[1] : '')
                        }
                      },
                      (params.row.file_id ? params.row.file_id.split('-||-')[0] : '')
                    )
                  }
                }
              } else {
                return {
                  title: i.tableColumnConfig.chineseName,
                  key: i.tableColumnConfig.englishName,
                  width: 150
                }
              }
            })

            this.canEdit = !!res.data.data.tableConfig.canEdit
            if (this.canEdit) {
              this.columns.push(
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  fixed: 'right',
                  align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h(
                        'Button',
                        {
                          props: {
                            type: 'primary',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.editDete(params)
                            }
                          },
                          style: {
                            'display': 'block',
                            'margin': '0 auto 5px auto'
                          }
                        },
                        '管理'
                      )
                      // h(
                      //   'Button',
                      //   {
                      //     props: {
                      //       type: 'info',
                      //       size: 'small'
                      //     },
                      //     on: {
                      //       click: () => {
                      //         this.changUserBegin(params.row)
                      //       }
                      //     },
                      //     style: {
                      //       'display': 'block',
                      //       'margin': 'auto'
                      //     }
                      //   },
                      //   '转让'
                      // )
                    ])
                  }
                }
              )
            }
          }
          this.loadData(1)
        })
        .catch(_ => (this.loading = false))
    },
    /**
     * 跳转编辑页面
     *
     */
    editDete (params) {
      this.$router.push(`wechat_form_crm_customer_detail/${params.row.id}`)
    },
    loadData () {
      let data = {
        pageNum: this.currentPage, // 请求页码
        pageSize: this.pageSize, // 每页数量
        dto: {
          // 业务查询条件
          queryCondition: this.name ? [{
            chineseName: '公司法定全称',
            colType: 'COLUMN_SIGN_LINE_TEXT',
            queryColumnName: 'compange_name',
            queryColumnType: 'CONDITION_ENUM_LIKE',
            queryValue: this.name
          }] : undefined,
          tableId: this.id
        }
      }
      getFormData(data).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list.map(i => {
            let keys = Object.keys(i)
            keys.map(j => {
              if (i[j].displayValue) {
                if (i === 'file_id') {
                  i[j] = i[j].displayValue + '-||-' + i[j].originValue
                } else {
                  i[j] = i[j].displayValue
                }
              }
            })
            return i
          })
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
      this.activeItem = l
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
      let data = {
        customerId: this.activeItem.id,
        toUserId: val.key
      }
      exchangeData(data).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            message: res.data.message,
            duration: 1000,
            background: '#07c160'
          })
          this.onLoad(this.id)
        } else {
          this.$notify({
            message: '请求出错',
            duration: 1000,
            background: '#f44'
          })
        }
      })
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
