<template>
    <FormItem :label="info.chineseName">
        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="'请输入'+ info.chineseName"></Input>
    </FormItem>
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
                textarea:''
            }
        }
    },
    methods: {
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.textarea
            }
        }
    }
    
}
</script>
<style scoped>

</style>



