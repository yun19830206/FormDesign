<template>
  <div>
    <van-list
      :finished="finished"
      finished-text="没有更多了"
    >
      <van-cell
        v-for="item in list"
        @click="showInfo(item)"
        :key="item.id"
      >
      <span>
        <span>{{item.compange_name.displayValue || item.compange_name}}</span>
      </span>
      </van-cell>
      
    </van-list>
    <van-dialog
      v-model="show"
    >
      <van-list
        :finished="finished"
      >
        <van-cell
          v-for="(k,v) in activeItem"
          :key="k"
        >
        <span class="">
          <p>{{v}}:</p>
          <p style="text-align:right;">{{k.displayValue || k}}</p>
        </span>
        </van-cell>
        
      </van-list>
    </van-dialog>
  </div>
</template>
<script>
import { getFormConfigData,getFormData } from '@/api/data'
export default {
  data () {
    return {
      loading:false,
      show:false,
      finished:false,
      activeItem:{},
      id:'',
      pageNo:1,
      list:[]
    }
  },
  created () {
    localStorage.setItem('login','login')
    this.id = this.$route.params.id
    this.onLoad(this.id)
  },
  methods: {
    onLoad (id) {
        getFormConfigData(id).then( res => {
          if (res.data.code === 200) {
            this.configData = res.data.data.tableColumnConfigList
            this.loadData(1)
          }else{
            
          }
          this.loading = false
        }).catch(_ => this.loading = false)
    },
    loadData (pg) {
      let data = {
        "pageNum" : pg,      //请求页码
        "pageSize" : 30,    //每页数量
        "dto":{             //业务查询条件
            "tableId" : this.id
        }
      }
      getFormData(data).then ( res => {
        if (res.data.code === 200) {
            this.list = res.data.data.list
          }else{
            
          }
          this.loading = false
      })
    },
    showInfo (item) {
      this.activeItem = item
      this.show = true
    }
  
  }
}
</script>
<style scoped>
.flex{
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
</style>


