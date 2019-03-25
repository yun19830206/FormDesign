<template>
    <FormItem :prop="info.englishName" :label="info.chineseName">
        <Row>
            <Col span="24">
                <DatePicker type="date" placeholder="请选择日期" v-model="formItem[info.englishName]"></DatePicker>
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
    }
    
}
</script>
<style scoped>

</style>



