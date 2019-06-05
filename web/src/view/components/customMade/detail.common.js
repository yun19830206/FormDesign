import showColumnDetailModal from '../showColumnDetailModal.vue'
export default {
  components: {
    showColumnDetailModal
  },
  props: {
    originColumns: Array,
    originData: Array
  },
  data () {
    return {
      visible: false,
      columnsDetailForModal: []
    }
  },
  methods: {
    computedData (row) {
      this.columnsDetailForModal = this.originColumns.map(i => ({
        key: i.title,
        value: row[i.key]
      }))
      this.visible = true
    }
  }
}
