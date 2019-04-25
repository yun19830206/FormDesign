<template>
  <FormItem :prop="info.englishName"
            :label="info.chineseName">
    <Select v-model="formItem[info.englishName]">
      <Option v-for="i in selectVal"
              :key="i.id"
              :value="i.id + ''">{{i.displayValue}}</Option>
    </Select>
  </FormItem>
</template>
<script>
export default {
  props: {
    info: {
      type: Object
    },
    foreignKeyValues: {
      type: Object
    },
    formItem: {
      type: Object
    }
  },
  computed: {
    selectVal () {
      return this.foreignKeyValues[this.info.englishName]
    }
  },
  created () {
    if (this.formItem[this.info.englishName]) {
      let activeVal = this.selectVal.find(item => item.displayValue === this.formItem[this.info.englishName])
      this.formItem[this.info.englishName] = activeVal ? (activeVal.id + '') : undefined
    }
  },
  methods: {}
}
</script>
<style scoped>
</style>
