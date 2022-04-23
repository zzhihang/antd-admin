<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户ID">{{data.id}}</a-descriptions-item>
        <a-descriptions-item label="用户昵称">{{data.nickname}}</a-descriptions-item>
        <a-descriptions-item label="用户手机号">{{data.phone}}</a-descriptions-item>
        <a-descriptions-item label="微信号">{{data.wxNumber}}</a-descriptions-item>
        <a-descriptions-item label="注册时间">{{data.ctime}}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions>
        <a-descriptions-item label="禁用账户" v-allow="24">
          <a-switch :checked="String(data.status) === '1'" checked-children="启用中" un-checked-children="禁用中" @change="onDisableChange"/>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">订阅记录</div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="糖主ID、昵称">
                <a-input v-model="queryParam.queryText" placeholder="请输入糖主ID、昵称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅时间">
                <a-range-picker v-model:value="subscribeTime" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅类型">
                <a-select v-model="queryParam.subscribeType" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option  v-for="(item, index) in BUSINESS_TYPE" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅状态">
                <a-select v-model="queryParam.subscribeStatus" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option  v-for="(item, index) in SUBSCRIBE_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
              <a-button type="primary" @click="onSearchClick">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        style="margin-top: 10px"
        row-key="id"
        :pagination="false"
        :columns="goodsColumns"
        :data-source="tableData">
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { getMemberInfo, userDisable, userEnable } from '@/api/userService'
  import { STable } from '@/components'
  import { BUSINESS_TYPE, SUBSCRIBE_STATUS } from '@/utils/dict'
  import { getTextByValue } from '@/utils/dictUtils'

  export default {
    components: {
      STable
    },
    data() {
      return {
        data: {},
        SUBSCRIBE_STATUS: SUBSCRIBE_STATUS,
        BUSINESS_TYPE: BUSINESS_TYPE,
        subscribeTime: '',
        queryParam: {
          queryText: '',
          subscribeType: '',
          status: '',
          subscribeStart: '',
          subscribeEnd: '',
          subscribeStatus: '',
        },
        tableData: [],
        goodsColumns: [
          {
            title: '订阅开始时间',
            dataIndex: 'subscribeTime',
            key: 'id'
          },
          {
            title: '订阅结束时间',
            dataIndex: 'expireTime',
            key: 'name'
          },
          {
            title: '糖主用户ID',
            dataIndex: 'tzId',
            key: 'barcode'
          },
          {
            title: '糖主昵称',
            dataIndex: 'tzNickname',
            key: 'price',
          },
          {
            title: '专题名称',
            dataIndex: 'title',
            width: '300px',
            key: 'num',
          },
          {
            title: '订阅类型',
            dataIndex: 'subscribeType',
            key: 'subscribeType',
            customRender: (text) => getTextByValue(text, 'BUSINESS_TYPE')
          },
          {
            title: '订阅状态',
            dataIndex: 'subscribeStatus',
            key: 'subscribeStatus',
            customRender: (text) => getTextByValue(text, 'SUBSCRIBE_STATUS')
          }
        ],
      }
    },
    created() {
      this.getUserInfo()
    },
    watch: {
      subscribeTime(val){
        this.queryParam.subscribeStart = val[0].format('YYYY-MM-DD')
        this.queryParam.subscribeEnd = val[1].format('YYYY-MM-DD')
      }
    },
    methods: {
      onSearchClick(){
        this.getUserInfo();
      },
      async getUserInfo() {
        const params = this.queryParam;
        params.id = this.$route.query.id;
        const { data } = await getMemberInfo(params);
        this.data = data.user;
        this.tableData = data.subscribeList;
      },
      async onDisableChange(){
        const record = this.data;
        if(record.status === 1){
          this.$confirm({
            content: `禁用后用户不能登录平台，后台不删除用户数据`,
            onOk: async () => {
              const result = await userDisable(record.id);
              if(result.success){
                this.$message.info(`禁用成功`)
                await this.getUserInfo()
              }else{
                this.$message.error(result.msg)
              }
            }
          })
        }else{
          const result = await userEnable(record.id);
          if(result.success){
            this.$message.info(`启用成功`)
            await this.getUserInfo()
          }else{
            this.$message.error(result.msg)
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0, 0, 0, .85);
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .my-style{
    /deep/.ant-descriptions-item{
      display: flex;
      align-items: center;
    }
  }

</style>
