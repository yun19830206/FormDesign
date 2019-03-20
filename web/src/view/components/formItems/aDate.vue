<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
        <Row>
            <Col span="24">
                <DatePicker type="date" placeholder="请选择日期" v-model="formItem.date"></DatePicker>
            </Col>
        </Row>
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
                date:''
            }
        }
    },
    methods: {
        sendVal () {
            return {
                [this.info.englishName]:this.formItem.date
            }
        }
    }
    
}
</script>
<style scoped>

</style>



