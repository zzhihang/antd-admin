<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID、订单号、手机号">
                <a-input v-model="queryParam.queryText" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="支付状态">
                <a-select v-model="queryParam.payStatus" placeholder="请选择" default-value="0">
                  <a-select-option  v-for="(item, index) in PAY_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="支付方式">
                  <a-select v-model="queryParam.payType" placeholder="请选择" default-value="0">
                    <a-select-option  v-for="(item, index) in PAY_TYPE" :key="index" :value="item.value">{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订阅类型">
                  <a-select v-model="queryParam.businessType" placeholder="请选择" default-value="0">
                    <a-select-option  v-for="(item, index) in BUSINESS_TYPE" :key="index" :value="item.value">{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="交易金额">
                  <a-input v-model="queryParam.payPriceStart" placeholder=""/>
                  <span>到</span>
                  <a-input v-model="queryParam.payPriceEnd" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订单创建时间">
                  <a-range-picker v-model:value="queryParam.ctime" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订单交易时间">
                  <a-input v-model="queryParam.payStart" placeholder=""/>
                  <span>到</span>
                  <a-input v-model="queryParam.payTimeEnd" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="博主ID、昵称、手机号">
                  <a-input v-model="queryParam.queryText" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">导出</a-button>
                <a-button style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">全部导出</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :scroll="{x: 2500}"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <div slot="payStatus" slot-scope="text, record" style="text-align: left">
            <span v-if="text == 1">{{text | useDictPAY_STATUS}}</span>
            <a-popover class="fail-reason" v-else title="订单失败原因" trigger="click" style="color: red;text-decoration: underline">
                <template #content>
                  <p>{{record.failInfo}}</p>
                </template>
                <a-button>{{text | useDictPAY_STATUS}}</a-button>
            </a-popover>
        </div>

        <span slot="payType" slot-scope="text">
            {{text | useDictPAY_TYPE}}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDetail(record)">查看详情</a>
          </template>
        </span>
      </s-table>

      <order-detail
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { getRoleList } from '@/api/manage'

  import OrderDetail from './modules/OrderDetail'
  import { getOrderList } from '@/api/orderService'
  import { BUSINESS_TYPE, PAY_STATUS, PAY_TYPE } from '@/utils/dict'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' },
      width: 100
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 200,
      align: 'center'
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      customRender: (text) => text && (text.substr(0,3)+'****'+text.substr(7)),
      align: 'center'
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center'
    },
    {
      title: '订单创建时间',
      dataIndex: 'ctime',
      align: 'center'
    },{
      title: '订单交易时间',
      dataIndex: 'payTime',
    },{
      title: '博主ID',
      dataIndex: 'tzUserId',
    },{
      title: '博主昵称',
      dataIndex: 'tzNickname',
    },{
      title: '专题名称',
      dataIndex: 'businessTitle',
    },{
      title: '订阅类型',
      dataIndex: 'orderType',
    },{
      title: '交易类型',
      dataIndex: 'businessType',
    },{
      title: '支付方式',
      dataIndex: 'payType',
      scopedSlots: { customRender: 'payType' },
      align: 'center'
    },{
      title: '支付状态',
      dataIndex: 'payStatus',
      scopedSlots: { customRender: 'payStatus' },
    },{
      title: '交易金额（元）',
      dataIndex: 'payPrice',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'processing',
      text: '运行中'
    },
    2: {
      status: 'success',
      text: '已上线'
    },
    3: {
      status: 'error',
      text: '异常'
    }
  }

  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      OrderDetail
    },
    data () {
      this.columns = columns
      return {
        PAY_STATUS: PAY_STATUS,
        PAY_TYPE: PAY_TYPE,
        BUSINESS_TYPE: BUSINESS_TYPE,
        visible: false,
        detailModalShow: false,
        confirmLoading: false,
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {
          queryText: '',
          payStatus: '',
          payType: '',
          businessType: '',
          orderType: '',
          payPriceStart: '',
          payPriceEnd: '',
          ctimeStart: '',
          ctimeEnd: '',
          payStart: '',
          payTimeEnd: '',
          tzQuery: '',
          ctime: '',
          payTime: ''
        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          return getOrderList(requestParameters)
            .then(res => {
              return res.data
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    created () {
      getRoleList({ t: new Date() })
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      handleDetail(record){
        this.mdl = record;
        this.visible = true;
      },
      handleOk () {
        this.visible = false
      },
      handleCancel () {
        this.visible = false
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/.ant-form-item-children{
    display: flex;
  }
  .fail-reason{
    &.ant-btn{
      color: red;
      text-decoration: underline;
      border: none;
      padding: 0;
      background: unset;
      box-shadow: unset;
      /deep/&>span{
        text-decoration: underline !important;
      }
    }
  }
</style>
