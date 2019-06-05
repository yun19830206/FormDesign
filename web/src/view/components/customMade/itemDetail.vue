<template>
  <div>
    <p class="table-title">项目</p>
    <i-table :columns="columns"
             :data="itemData"></i-table>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  created () {
    console.log(this.itemData, this.columns)
  },
  props: {
    itemColumns: Array,
    itemData: Array
  },
  computed: {
    columns () {
      return [...this.itemColumns, {
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
