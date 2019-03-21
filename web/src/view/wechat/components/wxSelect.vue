<template>
    <div>
        <van-cell @click="showSelect = !showSelect" :title="info.chineseName" :value="formItem.input" />
        <van-picker :defaultIndex="defaultIndex" show-toolbar :title="info.chineseName" @cancel="onCancel" @confirm="onConfirm" v-if="showSelect" style="position:fixed;bottom:0;width:100%;z-index:1000;" :columns="columns" />
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
            },
            columns:[],
            showSelect:false
        }
    },
    created () {
        this.columns = this.info.dropValue.split(',')
        this.formItem.input = this.info.defaultValue
    },
    computed : {
        defaultIndex() {
            return this.columns.indexOf(this.formItem.input)
        }
        
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
        onConfirm (val,v2) {
            this.formItem.input = val
            this.showSelect = false
        }

    }
    
}
</script>
<style scoped>

</style>


