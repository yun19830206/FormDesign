<template>
    <van-cell :title="info.chineseName" :value="formItem.input">
        <van-uploader slot="right-icon" style="margin-left:5px;" @click.native="err = false" :after-read="onRead"  multiple>
            <span v-if="err" slot="right-icon" class="err-tip">请选择{{info.chineseName}}<van-icon name="upgrade" /></span>
            <van-icon v-else  name="upgrade" />
        </van-uploader>
    </van-cell>
</template>
<script>
import { uploadFile } from '@/api/data'
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
            },
            fileId:'',
            err:false
        }
    },
    methods: {
        async sendVal () {
            if (this.info.empty === 0 && this.formItem.input.trim() === '') {
                this.err = true
                return false
            }
            return {
                [this.info.englishName]:this.fileId
            }
        },
        onRead (data) {
            const formData = new FormData()
            formData.append('file', data.file);
            uploadFile(formData).then( res => {
                if(res.data.code === 200){
                    this.formItem.input = res.data.data.fileNameOriginal
                    this.fileId = res.data.data.id
                    this.$notify({
                        message:res.data.message,
                        duration: 1000,
                        background: '#07c160'
                    })
                }
                else{
                    this.$notify({
                        message:res.data.message,
                        duration: 1000,
                        background: '#f44'
                    })
                }
            }).catch(_ => {
                this.$notify({
                    message:res.data.message,
                    duration: 1000,
                    background: '#f44'
                })
            })
        }
    }
    
}
</script>
<style scoped>
.err-tip{
    height: 24px;
    font-size: 14px;
    color: #f44;
    line-height: 24px;
}
.van-icon{
    font-size: 16px;
    vertical-align: middle;
}
</style>


