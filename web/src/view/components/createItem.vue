<template>
  <Modal
    v-model="show"
    title="新增数据"
    :loading="loading"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="formItem" :label-width="80">
      <div ref="item" v-for="item in tableColumnConfigList" :key="item.id + '-' + item.tableId" :is="componentName[item.colType]" :info="item"></div>
    </Form>
  </Modal>
</template>
<script>
import aInput from "./formItems/aInput.vue"
import aArea from "./formItems/aArea.vue"
import aDate from "./formItems/aDate.vue"
import aFile from "./formItems/aFile.vue"
import aKey from "./formItems/aKey.vue"
import aMail from "./formItems/aMail.vue"
import aNumber from "./formItems/aNumber.vue"
import aPhone from "./formItems/aPhone.vue"
import aRich from "./formItems/aRich.vue"
import aSelect from "./formItems/aSelect.vue"
export default {
  props: {
    showModal: {
      type: Boolean
    },
    tableColumnConfigList: {
      type: Array
    }
  },
  components: {
    aInput,
    aArea,
    aDate,
    aFile,
    aKey,
    aMail,
    aNumber,
    aPhone,
    aRich,
    aSelect
  },
  data () {
    return {
      loading:true,
      formItem: {
        input: '',
        select: ''
      },
      componentName: {
        'COLUMN_SIGN_LINE_TEXT':'a-input',
        'COLUMN_DROP_BOX':'a-select',
        'COLUMN_RICH_TEXT':'a-rich',
        'COLUMN_MANY_LINE_TEXT':'a-area',
        'COLUMN_DATE_TIME':'a-date',
        'COLUMN_NUMBER':'a-number',
        'COLUMN_PHONE_NUMBER':'a-phone',
        'COLUMN_EMAIL':'a-mail',
        'COLUMN_FILE':'a-file',
        'COLUMN_FOREIGN_KEY':'a-key'
      }
    }
  },
  computed: {
    show : {
      get () {
        return this.showModal
      },
      set (val) {
        this.$emit('close',val)
      }
    }
  },
  methods: {
    ok () {
      let data = {}
      this.$refs.item.map( i => {
        Object.assign(data,i.sendVal())
      })
      this.$emit('getVal',data)
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>

</style>


