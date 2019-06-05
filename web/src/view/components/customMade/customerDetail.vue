<template>
  <div>
    <p class="table-title">客户信息</p>
    <i-table :columns="columns"
             :data="customerData"></i-table>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    customerColumns: Array,
    customerData: Array
  },
  computed: {
    columns () {
      return [...this.customerColumns, {
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
