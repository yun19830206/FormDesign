<template>
    <FormItem :label="info.chineseName">
        <Select v-model="formItem.select">
            <Option v-for="(i, index) in selectVal" :key="index" :value="i">{{i}}</Option>
        </Select>
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
                select: ''
            }
        }
    },
    computed: {
        selectVal () {
            return this.info.dropValue.split(',')
        }
       
    },
    mounted () {
        this.formItem.select = this.info.defaultValue
    },
    methods: {
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.select
            }
        }
    }
    
}
</script>
<style scoped>

</style>



