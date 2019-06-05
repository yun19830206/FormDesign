<template>
  <div>
    <p class="table-title">项目</p>
    <i-table :columns="columns"
             :data="originData"></i-table>
    <showColumnDetailModal :visible="visible"
                           @close="visible = false"
                           :columnsDetailForModal="columnsDetailForModal"></showColumnDetailModal>
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
  },
  watch: {
    originData (v) {
      if (v[0]) {
        this.getVisiterHistory(v[0].id)
      }
    }
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
                    this.computedData(params.row)
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
