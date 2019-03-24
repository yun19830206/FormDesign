<template>
    <FormItem :label="info.chineseName">
        <Select @on-change="valChange" :value="info.defaultValue">
            <Option v-for="i in selectVal" :key="i.id" :value="i.id">{{i.displayValue}}</Option>
        </Select>
    </FormItem>
</template>
<script>
export default {
    props: {
        info: {
            type:Object
        },
        foreignKeyValues: {
            type:Object 
        }
    },
    computed: {
        selectVal () {
            return this.foreignKeyValues[this.info.englishName]
        }
    },
    methods: {
        valChange(val){
            this.$emit('valing',{prop:this.info.englishName,val})
        },
        resetFields() {
            this.$emit('valing',{prop:this.info.englishName,val:''})
        }
    }
    
}
</script>
<style scoped>

</style>



