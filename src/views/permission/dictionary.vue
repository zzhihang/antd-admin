<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="字典信息">
                <a-input placeholder="请输入字典名、描述" v-model="queryParam.queryText"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" v-model="queryParam.status">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">启用</a-select-option>
                  <a-select-option value="0">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="query">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="list"
      >
       <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDetail(record)">查看详情</a>
          </template>
        </span>
      </a-table>

    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '../../components'
  import { getDicList } from '../../api/permissionService'
  import { getTextByValue } from '../../utils/dictUtils'

  export default {
    components: {
      STable
    },
    data() {
      return {
        advanced: false,
        queryParam: {
          queryText: '',
          status: ''
        },
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' },
            width: 70
          },
          {
            title: '字典名',
            dataIndex: 'name',
            align: 'center'
          },
          {
            title: '描述',
            dataIndex: 'descr',
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'status',
            customRender: (text) => getTextByValue(text, 'ENABLE_STATUS')
          }, {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        list: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      query(){
        this.getList();
      },
      reset(){
        this.queryParam = {};
        this.query()
      },
      async getList() {
        const requestParameters = Object.assign({}, this.queryParam)
        const { data } = await getDicList(requestParameters)
        this.list = data
      },
      handleDetail({ id }) {
        if ([1, 2, 3, 6].includes(id)) {
          this.$router.push({
            path: '/permission/detail_1236', query: {
              id
            }
          })
        } else if ([4].includes(id)) {
          this.$router.push({
            path: '/permission/detail_4', query: {
              id
            }
          })
        } else if ([5].includes(id)) {
          this.$router.push({
            path: '/permission/detail_5', query: {
              id
            }
          })
        }

      }
    }
  }
</script>
