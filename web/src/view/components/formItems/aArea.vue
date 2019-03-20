<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
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
            // if(this.info.empty){
                return {
                    [this.info.englishName]:this.formItem.textarea
                }
            // }else{
            //     if(this.formItem.textarea){
            //         return {
            //             [this.info.englishName]:this.formItem.textarea
            //         }
            //     }else{

            //        return false 
            //     }
            // }
            
        }
    }
    
}
</script>
<style scoped>

</style>



