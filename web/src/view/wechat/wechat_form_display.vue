<template>
  <div style="overflow: auto;">
    <!-- <van-list
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
      
    </van-list> -->
    <table class="gridtable">
      <tr><th nowrap="nowrap" v-for="cg in configData" :key="cg.id">{{cg.tableColumnConfig.chineseName}}</th></tr>
      <tr v-for="l in list" :key="l.id">
        <td nowrap="nowrap" v-for="cg in configData" :key="cg.id + '' + l.id">
          {{computedVal(l,cg)}}
        </td>
      </tr>
    </table>
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
      list:[],
      configData:[]
    }
  },
  created () {
    localStorage.setItem('login','login')
    this.id = this.$route.params.id
    this.onLoad(this.id)
  },
  methods: {
    computedVal(l,cg) {
      if (cg.tableColumnConfig.colType === 'COLUMN_DATE_TIME') {
        return new Date(l[cg.tableColumnConfig.englishName]).format('yyyy-MM-dd hh:mm:ss')
      }else {
        return l[cg.tableColumnConfig.englishName] ? (l[cg.tableColumnConfig.englishName].displayValue || l[cg.tableColumnConfig.englishName]) : ''
      }
    },
    onLoad (id) {
        getFormConfigData(id).then( res => {
          if (res.data.code === 200) {
            this.configData = res.data.data.tableDisplayConfigList
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
table.gridtable {
font-family: verdana,arial,sans-serif;
font-size:11px;
color:#333333;
border-width: 1px;
border-color: #eee;
border-collapse: collapse;
}
table.gridtable th {
border-width: 1px;
padding: 8px;
border-style: solid;
border-color: #eee;
background-color: #dedede;
}
table.gridtable td {
border-width: 1px;
padding: 8px;
border-style: solid;
border-color: #eee;
background-color: #ffffff;
}
</style>


