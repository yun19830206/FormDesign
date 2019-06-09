<template>
  <div :style="isWechat ? 'margin-top: 10px;overflow: auto;' : ''"
       class="wrapper">
    <Spin v-if="loading"
          fix></Spin>
    <div v-else>
      <div class="table-wrapper">
        <customerDetail :originColumns="customerColumns"
                        :tableConfig="configData['crm_customer']"
                        :isWechat="isWechat"
                        @refresh="getConfig"
                        :originData="customerData"></customerDetail>
      </div>
      <div class="table-wrapper">
        <linkManDetail :originColumns="linkManColumns"
                       @refresh="getConfig"
                       :isWechat="isWechat"
                       :tableConfig="configData['crm_project_user']"
                       :originData="linkManData"></linkManDetail>
      </div>
      <div class="table-wrapper">
        <itemDetail @sendVisitHisData="getVisitHisData"
                    :originColumns="itemColumns"
                    @refresh="getConfig"
                    :isWechat="isWechat"
                    :tableConfig="configData['crm_project']"
                    :originData="itemData"></itemDetail>
      </div>
      <div class="table-wrapper">
        <visitDetail :originColumns="visiteColumns"
                     :tableConfig="configData['crm_project_visit']"
                     :isWechat="isWechat"
                     @refresh="getConfig"
                     :originData="visiteData"></visitDetail>
      </div>
    </div>

  </div>
</template>

<script>
import customerDetail from '../components/customMade/customerDetail.vue'
import linkManDetail from '../components/customMade/linkManDetail.vue'
import itemDetail from '../components/customMade/itemDetail.vue'
import visitDetail from '../components/customMade/visitDetail.vue'
import { getCustomerData, getListData, getTableData } from '@/api/data'
export default {
  name: 'crm-customer-manage-detail',
  components: { customerDetail, linkManDetail, itemDetail, visitDetail },
  data () {
    return {
      isWechat: false,
      customerId: '',
      configData: {},
      formId: '',
      loading: true,
      customerColumns: [],
      customerData: [],
      displayConfig: [],
      linkManColumns: [],
      linkManData: [],
      itemData: [],
      itemColumns: [],
      visiteColumns: [],
      visiteData: [],
      visible: false
    }
  },
  computed: {},
  created () {
    this.isWechat = this.$route.fullPath.includes('wechat')
    this.customerId = this.$route.params.customerId
    this.formId = this.$route.params.formId
    this.getTableConfig()
  },
  methods: {
    getTableConfig () {
      getListData().then(res => {
        let tabsDatas = res.data.data
        let promiseArr = tabsDatas.map(i => {
          return new Promise((resolve, reject) => {
            getTableData(i.id).then(d => {
              if (d.data.code === 200) {
                this.configData[i.englishName] = d.data.data
                resolve()
              } else {
                reject(new Error())
              }
            })
          })
        })
        Promise.all(promiseArr).then(_ => {
          this.getConfig()
        })
      })
    },
    getVisitHisData (data) {
      let visiteData = data.map(item => {
        return item.reduce((r, i) => {
          let key = Object.keys(i)[0]
          if (typeof i[key] === 'object' && i[key] !== null) {
            // debugger
            if (key === 'file_id') {
              r[key] = i[key].displayValue + '-||-' + i[key].originValue
            } else {
              r[key] = i[key].displayValue || ''
            }
            return r
          } else {
            return Object.assign(r, i)
          }
        }, {})
      })
      this.visiteData = visiteData
    },
    /**
     * 获取详情
     */
    getConfig () {
      this.loading = true
      getCustomerData(this.customerId).then(res => {
        if (res.data.code === 200) {
          let customerData = res.data.data.customer.reduce((res, i) => {
            return Object.assign(res, i)
          }, {})
          this.customerData = [customerData]

          let linkManData = res.data.data.contactPeopleList.map(item => {
            return item.reduce((r, i) => {
              let key = Object.keys(i)[0]
              if (typeof i[key] === 'object' && i[key] !== null) {
                r[key] = i[key].displayValue || ''
                return r
              } else {
                return Object.assign(r, i)
              }
            }, {})
          })
          this.linkManData = linkManData

          let itemData = res.data.data.projectList.map(item => {
            return item.reduce((r, i) => {
              let key = Object.keys(i)[0]
              if (typeof i[key] === 'object' && i[key] !== null) {
                r[key] = i[key].displayValue || ''
                return r
              } else {
                return Object.assign(r, i)
              }
            }, {})
          })
          this.itemData = itemData

          if (res.data.data.projectList[0]) {

          }

          this.customerColumns = this.configData['crm_customer'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName,
              width: 150
            }
          })

          this.linkManColumns = this.configData['crm_project_user'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName,
              width: 150
            }
          })

          this.itemColumns = this.configData['crm_project'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName,
              width: 150
            }
          })

          this.visiteColumns = this.configData['crm_project_visit'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName,
              width: 150
            }
          })
        } else {
          this.$Message.error(res.data.message)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.table-title {
  font-size: 15px;
  margin-bottom: 10px;
}
.table-wrapper + .table-wrapper {
  margin-top: 30px;
}
</style>
