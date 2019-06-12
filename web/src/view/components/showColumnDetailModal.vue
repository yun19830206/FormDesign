<template>
  <Modal v-model="show"
         title="详细信息"
         :mask-closable="false"
         @on-ok="sureClose">
    <Table :columns="modalColum"
           :data="columnsDetailForModal"></Table>
  </Modal>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    columnsDetailForModal: Array
  },
  computed: {
    show: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('close')
      }
    }
  },
  created () {
    console.log(this.columnsDetailForModal)
  },
  data () {
    return {
      modalColum: [
        { title: '字段名', key: 'key' },
        {
          title: '详情',
          key: 'value',
          render: (h, params) => {
            if (params.row.englishName === 'file_id') {
              return h('a', {
                attrs: {
                  href:
                    this.baseUrl +
                    'aiassistant/file/get/file?fileId=' +
                    (params.row.value ? params.row.value.split('-||-')[1] : '')
                }
              },
                (params.row.value ? params.row.value.split('-||-')[0] : ''))
            } else {
              return h('span', params.row.value)
            }
          }
        }
      ]
    }
  },
  methods: {
    sureClose () {
      this.$emit('close')
    }
  }
}
</script>
