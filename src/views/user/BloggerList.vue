<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID、手机号">
                <a-input v-model="queryParam.queryText" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="支付状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option  v-for="(item, index) in CONTENT_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单创建时间">
                <a-range-picker v-model:value="queryParam.ctime" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="exportSelect">导出</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="exportAll">全部导出</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="handleAdd">创建用户</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        style="margin-top: 10px;"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="disable" slot-scope="text, record, index">
          <a-switch :checked="String(text) === '1'" checked-children="启用中" un-checked-children="禁用中" @change="onDisableChange(record)"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDetail(record)">查看详情</a>
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
  import { getRoleList } from '@/api/manage'
  import { CONTENT_STATUS } from '@/utils/dict'
  import { getBloggerList, userDisable, userEnable, userSave } from '@/api/userService'
  import CreateForm from './modules/CreateForm'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '用户ID',
      dataIndex: 'id',
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
      title: '余额（元）',
      dataIndex: 'money',
    },{
      title: '禁用账户',
      dataIndex: 'status',
      scopedSlots: { customRender: 'disable' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
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
      CreateForm,
    },
    data () {
      this.columns = columns
      return {
        CONTENT_STATUS: CONTENT_STATUS,
        visible: false,
        confirmLoading: false,
        mdl: null,
        createUserId: '',
        createUserUrl: '',
        queryParam: {
          queryText: '',
          status: '',
          ctimeStart: '',
          ctimeEnd: '',
          ctime: '',
        },
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getBloggerList(requestParameters)
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
        this.$router.push({name: 'BloggerListDetail', query: {
            id
        }})
      },
      async onDisableChange(record){
          if(record.status === 1){
            this.$confirm({
              content: `你确定要禁用${record.id}吗？`,
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
      exportSelect(){

      },
      exportAll(){
          const url = '/admin/user/tz/export';

      },
      createUser(){

      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
    }
  }
</script>
<style lang="less" scoped>
  /deep/.ant-form-item-children{
    display: flex;
  }
</style>
