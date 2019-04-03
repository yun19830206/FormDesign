<template>
  <FormItem :prop="info.englishName"
            :label="info.chineseName">
    <Select v-model="formItem[info.englishName]">
      <Option v-for="(i, index) in selectVal"
              :key="index"
              :value="i">{{i}}</Option>
    </Select>
  </FormItem>
</template>
<script>
export default {
  props: {
    info: {
      type: Object
    },
    formItem: {
      type: Object
    }
  },
  created () {
    this.formItem[this.info.englishName] = this.info.defaultValue || ''
  },
  computed: {
    selectVal () {
      return this.info.dropValue.split(',')
    }
  },
  methods: {

  }

}
</script>
<style scoped>
</style>
