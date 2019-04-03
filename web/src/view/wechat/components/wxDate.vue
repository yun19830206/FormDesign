<template>
  <div>
    <van-cell is-link
              @click="showSelect = !showSelect,err = false"
              :title="info.chineseName"
              :value="formItem.input">
      <span v-if="err"
            slot="right-icon"
            class="err-tip">请选择{{info.chineseName}}
        <van-icon name="arrow" /></span>
    </van-cell>
    <van-popup position="bottom"
               v-model="showSelect">
      <van-datetime-picker type="date"
                           :minDate="new Date(1900,1,1)"
                           v-model="val"
                           @cancel="onCancel"
                           @confirm="onConfirm" />
    </van-popup>

  </div>

</template>
<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data () {
    return {
      formItem: {
        input: null
      },
      err: false,
      val: new Date(),
      showSelect: false
    }
  },
  created () {
  },
  methods: {
    async sendVal () {
      if (this.info.empty === 0 && this.formItem.input.trim() === '') {
        this.err = true
        return false
      }
      return {
        [this.info.englishName]: this.formItem.input
      }
    },
    onCancel () {
      this.showSelect = false
    },
    onConfirm (val) {
      this.formItem.input = val.format('yyyy-MM-dd')
      this.showSelect = false
    }

  }

}
</script>
<style scoped>
.err-tip {
  height: 24px;
  font-size: 14px;
  color: #f44;
  line-height: 24px;
}
.err-tip .van-icon {
  font-size: 16px;
  vertical-align: middle;
}
</style>
