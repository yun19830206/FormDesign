<template>
    <div>
        <van-cell @click="showSelect = !showSelect" :title="info.chineseName" :value="formItem.input" />
        <van-datetime-picker
        type="date"
        v-model="val"
        @cancel="onCancel" 
        @confirm="onConfirm" 
        v-if="showSelect" 
        style="position:fixed;bottom:0;width:100%;z-index:1000;" 
        />
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
                input:null
            },
            val:null,
            showSelect:false
        }
    },
    created () {
    },
    methods: {
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.input
            }
        },
        onCancel () {
            this.showSelect = false
        },
        onConfirm (val) {
            this.formItem.input = val.format('yyyy-MM-dd')
            this.showSelect = false
        }

    }
    
}
</script>
<style scoped>

</style>


