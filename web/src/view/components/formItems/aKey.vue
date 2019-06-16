<template>
  <FormItem :prop="info.englishName"
            :label="info.chineseName">
    <Select :disabled="disabled"
            v-model="formItem[info.englishName]">
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
    },
    isEdit: {
      type: Boolean
    },
    defaultData: {
      type: Object
    }
  },
  computed: {
    selectVal () {
      if (this.defaultData && Array.isArray(this.defaultData[this.info.englishName])) {
        return this.foreignKeyValues[this.info.englishName].filter(i => this.defaultData[this.info.englishName].includes(i.id))
      } else {
        return this.foreignKeyValues[this.info.englishName]
      }
    },
    disabled () {
      return !!(!Array.isArray(this.defaultData[this.info.englishName]) && this.defaultData && this.defaultData[this.info.englishName] && !Array.isArray(this.defaultData[this.info.englishName]))
    }
  },
  created () {
    console.log(this.formItem)
    // debugger
    if (this.formItem[this.info.englishName]) {
      let activeVal = this.selectVal.find(item => item.displayValue === this.formItem[this.info.englishName])
      this.formItem[this.info.englishName] = activeVal ? (activeVal.id + '') : undefined
    } else if (this.defaultData && this.defaultData[this.info.englishName]) {
      if (!Array.isArray(this.defaultData[this.info.englishName])) {
        this.formItem[this.info.englishName] = this.foreignKeyValues[this.info.englishName].find(i => i.id === this.defaultData[this.info.englishName]).id + ''
      }
    }
  },
  methods: {}
}
</script>
<style scoped>
</style>
