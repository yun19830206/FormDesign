<template>
  <div>
    <div class="table-wrapper">
      <customerDetail :originColumns="customerColumns"
                      :originData="customerData"></customerDetail>
    </div>
    <div class="table-wrapper">
      <linkManDetail :originColumns="linkManColumns"
                     :originData="linkManData"></linkManDetail>
    </div>
    <div class="table-wrapper">
      <itemDetail @sendVisitHisData="getVisitHisData"
                  :originColumns="itemColumns"
                  :originData="itemData"></itemDetail>
    </div>
    <div class="table-wrapper">
      <visitDetail :originColumns="visiteColumns"
                   :originData="visiteData"></visitDetail>
    </div>

  </div>
</template>

<script>
import customerDetail from '../components/customMade/customerDetail.vue'
import linkManDetail from '../components/customMade/linkManDetail.vue'
import itemDetail from '../components/customMade/itemDetail.vue'
import visitDetail from '../components/customMade/visitDetail.vue'
import { getCustomerData } from '@/api/data'
export default {
  name: 'crm-customer-manage-detail',
  components: { customerDetail, linkManDetail, itemDetail, visitDetail },
  data () {
    return {
      customerId: '',
      formId: '',
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
    this.customerId = this.$route.params.customerId
    this.formId = this.$route.params.formId
    this.loading = true
    this.getConfig()
  },
  methods: {
    getVisitHisData (data) {
      let visiteData = data.map(item => {
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
      this.visiteData = visiteData
    },
    /**
     * 更新页码
     */
    getConfig () {
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

          let configData = JSON.parse(localStorage.getItem('tabConfig'))

          this.customerColumns = configData['crm_customer'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName
            }
          })

          this.linkManColumns = configData['crm_project_user'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName
            }
          })

          this.itemColumns = configData['crm_project'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName
            }
          })

          this.visiteColumns = configData['crm_project_visit'].tableDisplayConfigList.map(i => {
            return {
              title: i.tableColumnConfig.chineseName,
              key: i.tableColumnConfig.englishName
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
.table-title {
  font-size: 15px;
  margin-bottom: 10px;
}
.table-wrapper + .table-wrapper {
  margin-top: 30px;
}
</style>
