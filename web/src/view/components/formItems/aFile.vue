<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
        <Upload ref="upload" :on-success="success" :action="baseUrl + '/aiassistant/file/add/file'">
            <Button icon="ios-cloud-upload-outline">附件上传</Button>
        </Upload>
    </FormItem>
</template>
<script>
export default {
    props: {
        info: {
            type:Object
        },
        formItem: {
            type:Object
        }
    },
    methods: {
        success (response, file, fileList) {
            if (response.code === 200) {
                if (fileList.length === 2) {
                    fileList.splice(0,1)
                }
                this.formItem[this.info.englishName] = response.data.id
            }
            
            // //console.log(response,fileList)
            // this.$refs.upload.clearFiles()
        },
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.input
            }
        },
        resetFields() {
            this.$emit('valing',{prop:this.info.englishName,val:''})
        }
    }
    
}
</script>
<style scoped>

</style>



