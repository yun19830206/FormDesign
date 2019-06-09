<template>
  <div>
    <p class="table-title">
      <span>拜访记录</span>
      <Button size="small"
              type="primary"
              @click="addData">新增</Button>
    </p>
    <i-table :columns="columns"
             :data="originData"
             width="100%"></i-table>
    <showColumnDetailModal :visible="visible"
                           @close="visible = false"
                           :columnsDetailForModal="columnsDetailForModal"></showColumnDetailModal>
    <createItem :visible="createItemModalVisible"
                :isEdit="isEdit"
                :editData="editDetailForrModal"
                :tableColumnConfigList="tableConfig"
                @close="createItemModalVisible = false"
                @getVal="getVal"></createItem>
  </div>
</template>
<script>
import { visitData } from '@/api/data'
import common from './detail.common.js'
export default {
  mixins: [common],
  data () {
    return {

    }
  },
  created () {
  },
  computed: {
    columns () {
      return [...this.activeColumn, {
        title: '操作',
        key: 'action',
        width: this.isWechat ? 80 : 120,
        fixed: 'right',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h(
              'Button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.checkDetail(params)
                  }
                },
                style: {
                  'margin-right': '5px'
                }
              },
              '查看'
            )
          ])
        }
      }]
    },
    activeColumn () {
      return this.originColumns.map(i => {
        if (i.key === 'file_id') {
          return {
            title: i.title,
            key: i.key,
            width: 150,
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href:
                    this.baseUrl +
                    'aiassistant/file/get/file?fileId=' +
                    (params.row.file_id ? params.row.file_id.split('-||-')[1] : '')
                }
              },
                (params.row.file_id ? params.row.file_id.split('-||-')[0] : ''))
            }
          }
        } else {
          return i
        }
      })
    }
  },
  methods: {
    getVisiterHistory (id) {
      visitData(id)
    }
  }
}
</script>
<style scoped>
.table-title {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin: 0 10px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
