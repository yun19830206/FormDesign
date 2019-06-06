<template>
  <div>
    <p class="table-title">项目</p>
    <i-table :columns="columns"
             :data="originData"></i-table>
    <showColumnDetailModal :visible="visible"
                           @close="visible = false"
                           :columnsDetailForModal="columnsDetailForModal"></showColumnDetailModal>
    <createItem :visible="createItemModalVisible"
                :isEdit="true"
                :editData="editDetailForrModal"
                :tableColumnConfigList="tableConfig"
                @close="createItemModalVisible = false"
                @getVal="getVal"></createItem>
  </div>
</template>
<script>
import { visitData } from '@/api/data'
import common from './detail.common.js'
export default {
  mixins: [common],
  data () {
    return {

    }
  },
  created () {
    console.log(this.itemData, this.columns)
    if (this.originData[0]) {
      this.getVisiterHistory(this.originData[0].id)
    }
  },
  watch: {

  },
  computed: {
    columns () {
      return [...this.originColumns, {
        title: '操作',
        key: 'action',
        width: 200,
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
                    this.checkDetail(params)
                  }
                },
                style: {
                  'margin-right': '5px'
                }
              },
              '查看'
            ),
            h(
              'Button',
              {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  'margin-right': '5px'
                },
                on: {
                  click: () => {
                    this.editData(params)
                  }
                }
              },
              '修改'
            ),
            h(
              'Button',
              {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getVisiterHistory(params.row.id)
                  }
                }
              },
              '拜访记录'
            )
          ])
        }
      }]
    }
  },
  methods: {
    getVisiterHistory (id) {
      visitData(id).then(res => {
        if (res.data.code === 200) {
          this.$emit('sendVisitHisData', res.data.data)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>
