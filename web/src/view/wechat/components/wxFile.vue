<template>
    <div>
        <van-cell :title="info.chineseName">
        
        <van-uploader slot="right-icon" :after-read="onRead"  multiple>
            <van-icon  name="upgrade" />
        </van-uploader>
        </van-cell>
    
    </div>
    
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
        },
        onRead () {
            
        }
    }
    
}
</script>
<style scoped>

</style>


