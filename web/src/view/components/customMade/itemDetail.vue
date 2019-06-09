<template>
  <div>
    <p class="table-title">
      <span>项目</span>
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
    console.log(this.itemData, this.columns)
    if (this.originData[0]) {
      this.getVisiterHistory(this.originData[0].id)
    }
  },
  watch: {

  },
  computed: {
    columns () {
      return [...this.originColumns, {
        title: '操作',
        key: 'action',
        width: this.isWechat ? 100 : 200,
        fixed: 'right',
        align: 'center',
        render: (h, params) => {
          return h('div', !this.isWechat ? [
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
            ),
            h(
              'Button',
              {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  'margin-right': '5px'
                },
                on: {
                  click: () => {
                    this.editData(params)
                  }
                }
              },
              '修改'
            ),
            h(
              'Button',
              {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getVisiterHistory(params.row.id)
                  }
                }
              },
              '拜访记录'
            )
          ]
            : [
              h('p', [
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
                      'margin-bottom': '5px'
                    }
                  },
                  '查看/修改'
                )
              ]),
              h('p', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.getVisiterHistory(params)
                      }
                    }
                  },
                  '拜访记录'
                )
              ])
            ]
          )
        }
      }]
    }
  },
  methods: {
    getVisiterHistory (id) {
      visitData(id).then(res => {
        if (res.data.code === 200) {
          this.$emit('sendVisitHisData', res.data.data)
        } else {
          this.$Message.error(res.data.message)
        }
      })
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
