<template>
  <div>
    <p class="table-title">联系人</p>
    <i-table :columns="columns"
             :data="linkManData"></i-table>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    linkManColumns: Array,
    linkManData: Array
  },
  computed: {
    columns () {
      return [...this.linkManColumns, {
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
