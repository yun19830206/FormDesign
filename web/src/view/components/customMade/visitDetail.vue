<template>
  <div>
    <p class="table-title">拜访记录</p>
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
  },
  computed: {
    columns () {
      return [...this.originColumns, {
        title: '操作',
        key: 'action',
        width: 120,
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
            )
          ])
        }
      }]
    }
  },
  methods: {
    getVisiterHistory (id) {
      visitData(id)
    }
  }
}
</script>
