<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
        <Row>
            <Col span="24">
                <DatePicker
                value-format="yyyy-MM-dd HH:mm:ss" 
                type="datetime" placeholder="请选择日期" 
                v-model="datetime">
                </DatePicker>
            </Col>
        </Row>
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
    computed: {
        datetime:{
            get () {
               return this.formItem[this.info.englishName]
            },
            set (val) {
                this.formItem[this.info.englishName] = new Date(val).format('yyyy-MM-dd hh:mm:ss')
            }
        }
        
    }
    
}
</script>
<style scoped>

</style>



