<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户信息">
                <a-input v-model="queryParam.queryText" placeholder="请输入用户ID、昵称、手机号、微信号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="禁用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="">
                  <a-select-option  v-for="(item, index) in ENABLE_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅类型">
                <a-select v-model="queryParam.subscribeType" placeholder="请选择" default-value="">
                  <a-select-option  v-for="(item, index) in BUSINESS_TYPE" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅状态">
                <a-select v-model="queryParam.subscribeStatus" placeholder="请选择" default-value="">
                  <a-select-option  v-for="(item, index) in SUBSCRIBE_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="注册时间">
                <a-range-picker v-model:value="ctime" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订阅时间">
                <a-range-picker v-model:value="subscribeTime" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
              <a-button type="primary" v-allow="20" @click="$refs.table.refresh(true)">查询</a-button>
              <button-export
                style="margin-left: 8px"
                v-allow="21"
                :ids="selectedIds"
                type="part"
                bill-type="member"
                url="/admin/user/pt/export"
              >导出</button-export>
              <button-export
                style="margin-left: 8px"
                v-allow="22"
                url="/admin/user/pt/export"
                bill-type="member"
              >全部导出</button-export>
              <a-button style="margin-left: 8px" @click="() => {this.queryParam = {};this.ctime='';this.subscribeTime='';$refs.table.refresh(true)}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        style="margin-top: 10px;"
        ref="table"
        size="default"
        rowKey="key"
        :scroll="{x: 2500}"
        :columns="columns"
        :rowSelection="rowSelection"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="disable" slot-scope="text, record, index" v-allow="24">
          <a-switch :checked="String(text) === '1'" checked-children="启用中" un-checked-children="禁用中" @change="onDisableChange(record)"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDetail(record)" v-allow="25">查看详情</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :create-user-id="createUserId"
        :create-user-url="createUserUrl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { BUSINESS_TYPE, SUBSCRIBE_STATUS, ENABLE_STATUS } from '@/utils/dict'
  import { getMemberList, userDisable, userEnable, userSave } from '@/api/userService'
  import CreateForm from './modules/CreateForm'
  import { getTextByValue } from '@/utils/dictUtils'
  import ButtonExport from '@/views/user/modules/ButtonExport'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      customRender: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };

        if (index === 2) {
          obj.props.rowSpan = 2;
        } // These two are merged into above cell

        if (index === 3) {
          obj.props.rowSpan = 0;
        }

        if (index === 4) {
          obj.props.colSpan = 0;
        }

        return obj;
      },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      customRender: (text) => text && (text.substr(0,3)+'****'+text.substr(7))
    },{
      title: '微信号',
      dataIndex: 'wxNumber',
    },
    {
      title: '注册时间',
      dataIndex: 'ctime',
    },{
      title: '订阅记录',
      children: [{
        title: '订阅开始时间',
        dataIndex: 'subscribeTime',
      }, {
        title: '订阅结束时间',
        dataIndex: 'subscribeEndTime',
      }, {
        title: '糖主用户ID',
        dataIndex: 'tzId',
      }, {
        title: '糖主昵称',
        dataIndex: 'tzNickname',
      }, {
        title: '专题名称',
        dataIndex: 'title',
      }, {
        title: '订阅类型',
        dataIndex: 'subscribeType',
        customRender: (text) => getTextByValue(text, 'BUSINESS_TYPE')
      }, {
        title: '订阅状态',
        dataIndex: 'subscribeStatus',
        customRender: (text) => getTextByValue(text, 'SUBSCRIBE_STATUS')
      }],
    },{
      title: '禁用账户',
      dataIndex: 'status',
      width: 150,
      fixed: 'right',
      scopedSlots: { customRender: 'disable' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'TableList',
    components: {
      STable,
      CreateForm,
      ButtonExport
    },
    data () {
      this.columns = columns
      return {
        ENABLE_STATUS: [{text: '全部', value: ''}].concat(ENABLE_STATUS),
        BUSINESS_TYPE: [{text: '全部', value: ''}].concat(BUSINESS_TYPE),
        SUBSCRIBE_STATUS: [{text: '全部', value: ''}].concat(SUBSCRIBE_STATUS),
        visible: false,
        confirmLoading: false,
        mdl: null,
        createUserId: '',
        createUserUrl: '',
        subscribeTime: '',
        ctime: '',
        queryParam: {
          queryText: '',
          status: '',
          startTime: '',
          subscribeStatus: '',
          subscribeType: '',
          endTime: '',
          subscribeStart: '',
          subscribeEnd: '',
        },
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getMemberList(requestParameters)
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
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      selectedIds(){
        return this.selectedRows.map(item => item.id);
      }
    },
    methods: {
      handleAdd () {
        this.mdl = null
        this.visible = true
      },
      handleEdit (record) {
        this.visible = true
        this.mdl = { ...record }
      },
      handleOk () {
        if(this.createUserId){
          this.visible = false;
          this.createUserId = '';
          this.createUserUrl = '';
        }else{
          const form = this.$refs.createModal.form
          this.confirmLoading = true
          form.validateFields(async (errors, values) => {
            if (!errors) {
              const {data} = await userSave(values);
              this.createUserId = data.id;
              this.createUserUrl = data.url
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            } else {
              this.confirmLoading = false
            }
          })
        }
      },
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleDetail ({id}) {
        this.$router.push({name: 'MemberDetail', query: {
            id
          }})
      },
      async onDisableChange(record){
        if(record.status === 1){
          this.$confirm({
            content: `禁用后用户不能登录平台，后台不删除用户数据`,
            onOk: async () => {
              const result = await userDisable(record.id);
              if(result.success){
                this.$message.info(`禁用成功`)
                await this.$refs.table.refresh()
              }else{
                this.$message.error(result.msg)
              }
            }
          })
        }else{
          const result = await userEnable(record.id);
          if(result.success){
            this.$message.info(`启用成功`)
            await this.$refs.table.refresh()
          }else{
            this.$message.error(result.msg)
          }
        }
      },
      exportSelect() {
        if(!this.selectedRows.length){
          return this.$message.warn('请先选择要导出的数据')
        }
        const ids = this.selectedRows.map(item => item.id);
        this.exportAll(ids);
      },
      exportAll(id) {
        let url = 'http://admin.shouzimu.xyz/api/admin/user/pt/export';
        if(id.push){
          url = 'http://admin.shouzimu.xyz/api/admin/user/pt/export?ids=' + id.join(',');
        }
        window.open(url, '_blank')
      },
      createUser(){

      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
    },
    watch: {
      ctime(val){
        if(val){
          this.queryParam.startTime = val[0].format('YYYY-MM-DD')
          this.queryParam.endTime = val[1].format('YYYY-MM-DD')
        }
      },
      subscribeTime(val){
        if(val){
          this.queryParam.subscribeStart = val[0].format('YYYY-MM-DD')
          this.queryParam.subscribeEnd = val[1].format('YYYY-MM-DD')
        }
      }
    },
  }
</script>
<style lang="less" scoped>
  /deep/.ant-form-item-children{
    display: flex;
  }
</style>
