<template>
    <van-field v-model="formItem.input" :placeholder="'请输入' + info.chineseName" />
</template>
<script>
export default {
    props: {
        info: {
            type:Object
        }
    },
    data () {
       return  {
            formItem: {
                input:''
            }
        }
    },
    methods: {
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.input
            }
        }
    }
    
}
</script>
<style scoped>

</style>


