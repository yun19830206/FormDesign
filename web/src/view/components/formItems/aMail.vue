<template>
  <FormItem :prop="info.englishName"
            :label="info.chineseName">
    <Input v-model="formItem[info.englishName]"
           :placeholder="'请输入'+ info.chineseName" />
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
  }
}
</script>
<style scoped>
</style>
