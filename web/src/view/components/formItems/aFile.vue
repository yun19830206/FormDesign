<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
        <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
        </Upload>
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
        return {
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



