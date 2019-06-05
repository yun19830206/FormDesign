<template>
  <div>
    <p class="table-title">联系人</p>
    <i-table :columns="columns"
             :data="originData"></i-table>
    <showColumnDetailModal :visible="visible"
                           @close="visible = false"
                           :columnsDetailForModal="columnsDetailForModal"></showColumnDetailModal>
  </div>
</template>
<script>
import common from './detail.common.js'
export default {
  mixins: [common],
  data () {
    return {

    }
  },
  computed: {
    columns () {
      return [...this.originColumns, {
        title: '操作',
        key: 'action',
        width: 150,
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
                on: {
                  click: () => {

                  }
                }
              },
              '修改'
            )
          ])
        }
      }]
    }
  }
}
</script>
