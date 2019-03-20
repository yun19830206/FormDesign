<template>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
    >
      <van-cell
        v-for="item in list"
        :key="item.id"
      >
      <p class="flex">
        <span>{{item.chineseName}}</span>
        <span>
          <van-button class="mr-15" size="small" @click="gotoAdd(item.id)" type="primary">新增</van-button>
          <van-button size="small" @click="gotoView(item.id)" type="info">查看</van-button>
        </span>
      </p>
      
      </van-cell>
    </van-list>
</template>
<script>
import { getListData } from '@/api/data'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  created () {
    localStorage.setItem('login','login')
    this.onLoad()
  },
  methods: {
    onLoad (name) {
        getListData().then( res => {
          if (res.data.code === 200) {
            this.list = res.data.data
          }else{
            this.error = true
          }
          this.loading = false
          this.finished = true
        }).catch(_ => this.loading = false)
    },
    gotoView (id) {
      this.$router.push('/wechat_form_display/' + id)
    },
    gotoAdd (id) {
      this.$router.push('/wechat_form_add/' + id)
    }
    // 'onLoad() {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     // 加载状态结束
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 500);
    // }
  
  }
}
</script>
<style scoped>
.flex{
  display: flex;
  align-items: center;
  justify-content: space-between
}
.mr-15{
  margin-right: 15px;
}
</style>


