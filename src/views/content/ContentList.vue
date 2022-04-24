<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户信息">
                <a-input v-model="queryParam.queryText" placeholder="请输入用户ID、手机号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker v-model:value="ctime" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="审核状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="(item, index) in AUDIT_STATUS" :key="index" :value="item.value">{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
                <a-button type="primary" @click="$refs.table.refresh(true)" v-allow="31">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => {this.queryParam = {};this.ctime = '';$refs.table.refresh(true)}">重置</a-button>
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
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <div slot="type" slot-scope="text">
          <span>{{text | useDictDYNAMIC_TYPE}}</span>
        </div>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" v-allow="33" v-if="record.status == 0">审核</a>
            <a @click="handleEdit(record, 'detail')" v-allow="32" v-else>查看详情</a>
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
        :rowSelection="rowSelection"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'

  import { AUDIT_STATUS, CONTENT_STATUS } from '@/utils/dict'
  import { auditContent, getContentInfo, getContentList } from '@/api/contentService'
  import { getTextByValue } from '@/utils/dictUtils'
  import CreateForm from '@/views/content/CreateForm'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      customRender: (text) => text && (text.substr(0,3)+'****'+text.substr(7))
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '发送时间',
      dataIndex: 'ctime',
    },
    // {
    //   title: '文本',
    //   dataIndex: 'text',
    // },{
    //   title: '图片',
    //   dataIndex: 'pic',
    // },{
    //   title: '文档',
    //   dataIndex: 'file',
    // },{
    //   title: '语音',
    //   dataIndex: 'voice',
    // },
    {
      title: '动态类型',
      dataIndex: 'type',
      scopedSlots: { customRender: 'type' },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      customRender: (text) => getTextByValue(text, 'AUDIT_STATUS')
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150px',
      align: 'center',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'TableList',
    components: {
      STable,
      CreateForm
    },
    data () {
      this.columns = columns
      return {
        AUDIT_STATUS: AUDIT_STATUS,
        visible: false,
        confirmLoading: false,
        mdl: {},
        advanced: false,
        ctime: '',
        queryParam: {
          queryText: '',
          status: '',
          ctimeStart: '',
          ctimeEnd: '',
        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getContentList(requestParameters)
            .then(res => {
              return res.data
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    methods: {
      async handleEdit (record, ifDetail) {
        this.visible = true;
        const {data} = await getContentInfo(record.id);
        this.mdl = Object.assign({}, {ifDetail}, record, data);
        if(ifDetail){
          this.mdl.ifDetail = true;
        }
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields(async (errors, values) => {
          if (!errors) {
            values.id = this.mdl.id;
            const result = await auditContent(values);
            this.confirmLoading = false
            if(result.success){
              this.visible = false
              form.resetFields()
              this.$refs.table.refresh()
              this.$message.info('操作成功')
            }else{
              this.$message.error(result.msg)
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
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
    },
    watch: {
      ctime(val){
        if(val){
          this.queryParam.ctimeStart = val[0].format('YYYY-MM-DD')
          this.queryParam.ctimeEnd = val[1].format('YYYY-MM-DD')
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
