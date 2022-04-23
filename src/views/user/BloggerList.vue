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
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="">
                  <a-select-option v-for="(item, index) in ENABLE_STATUS" :key="index" :value="item.value">
                    {{item.text}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="注册时间">
                <a-range-picker v-model:value="ctime"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
              <a-button type="primary" @click="$refs.table.refresh(true)" v-allow="12">查询</a-button>
              <a-button style="margin-left: 8px" type="primary" v-allow="13" @click="exportSelect">导出</a-button>
              <a-button style="margin-left: 8px" type="primary" v-allow="14"@click="exportAll">全部导出</a-button>
              <a-button style="margin-left: 8px" type="primary" v-allow="15" @click="handleAdd">创建用户</a-button>
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
        <span slot="disable" slot-scope="text, record, index" v-allow="17">
          <a-switch :checked="String(text) === '1'" checked-children="启用中" un-checked-children="禁用中"
                    @change="onDisableChange(record)"/>
        </span>

        <span slot="action" slot-scope="text, record" v-allow="18">
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
      <a-modal
        :visible="exportSmsVisible"
        :width="340"
        title="导出"
        okText="验证"
        @ok="onSmsModalOk"
        @cancel="exportSmsVisible = false"
      >
        <a-input placeholder="请输入验证码" v-model="exportSms">
          <template #suffix>
            <a-button
              type="primary"
              @click="getCaptcha"
              :disabled="state.smsSendBtn"
              v-text="!state.smsSendBtn && '获取验证码' || (state.time+'s后可重新发送')"
            >发送验证码
            </a-button>
          </template>
        </a-input>
        <p style="font-size: 12px;color: #999999;margin-top: 10px;"><a-icon type="info-circle"/>导出表格需要输入超管提供的验证码</p>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import {  ENABLE_STATUS } from '@/utils/dict'
  import { checkCode, getBloggerList, sysSmsSend, userDisable, userEnable, userSave } from '@/api/userService'
  import CreateForm from './modules/CreateForm'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '用户ID',
      dataIndex: 'id'
    },
    {
      title: '用户昵称',
      dataIndex: 'tzNickname'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      customRender: (text) => text && (text.substr(0, 3) + '****' + text.substr(7))
    }, {
      title: '微信号',
      dataIndex: 'wxNumber'
    },
    {
      title: '注册时间',
      dataIndex: 'ctime'
    }, {
      title: '余额（元）',
      dataIndex: 'money'
    }, {
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

  export default {
    name: 'TableList',
    components: {
      STable,
      CreateForm,
    },
    data() {
      return {
        ENABLE_STATUS: [{text: '全部', value: ''}].concat(ENABLE_STATUS),
        visible: false,
        exportSmsVisible: false,
        popVisible: false,
        confirmLoading: false,
        mdl: null,
        createUserId: '',
        createUserUrl: '',
        columns,
        columnsOrigin: JSON.parse(JSON.stringify(columns)),
        columnsChecked: columns.map(item => item.title),
        ctime: '',
        exportSms: '',
        queryParam: {
          queryText: '',
          status: '',
          ctimeStart: '',
          ctimeEnd: '',
        },
        state: {
          time: 60,
          smsSendBtn: false
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
    watch: {
      ctime(val){
        this.queryParam.ctimeStart = val[0].format('YYYY-MM-DD')
        this.queryParam.ctimeEnd = val[1].format('YYYY-MM-DD')
      }
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      getCaptcha (e) {
        const {state} = this;
        e.preventDefault()
        state.smsSendBtn = true
        sysSmsSend().then(result => {
          if(result.success){
            this.$message.success('发送成功')
          }else{
            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
          }
        })

      },
      handleAdd() {
        this.mdl = null
        this.visible = true
      },
      handleEdit(record) {
        this.visible = true
        this.mdl = { ...record }
      },
      handleOk() {
        if (this.createUserId) {
          this.visible = false
          this.createUserId = ''
          this.createUserUrl = ''
        } else {
          const form = this.$refs.createModal.form
          this.confirmLoading = true
          form.validateFields(async (errors, values) => {
            if (!errors) {
              const { data } = await userSave(values)
              this.createUserId = data.id
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
      async onSmsModalOk(){
          const result = await checkCode(this.exportSms);
          if(result.success){
            this.exportData();
          }else{
            this.$message.error(result.msg);
          }
      },
      handleCancel() {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleDetail({ id }) {
        this.$router.push({
          name: 'BloggerListDetail', query: {
            id
          }
        })
      },
      async onDisableChange(record) {
        if (record.status === 1) {
          this.$confirm({
            content: `禁用后用户不能登录平台，后台不删除用户数据`,
            onOk: async () => {
              const result = await userDisable(record.id)
              if (result.success) {
                this.$message.info(`禁用成功`)
                await this.$refs.table.refresh()
              } else {
                this.$message.error(result.msg)
              }
            }
          })
        } else {
          const result = await userEnable(record.id)
          if (result.success) {
            this.$message.info(`启用成功`)
            await this.$refs.table.refresh()
          } else {
            this.$message.error(result.msg)
          }
        }
      },
      exportSelect() {
        if(!this.selectedRows.length){
          return this.$message.warn('请先选择要导出的数据')
        }
        this.currentAction = 'exportSelect';
        this.exportSmsVisible = true;
      },
      exportData(){
        const ids = this.selectedRows.map(item => item.id);
        let url = 'http://admin.shouzimu.xyz/api/admin/user/tz/export?code=' + this.exportSms;
        if(this.currentAction === 'exportSelect'){
          url = 'http://admin.shouzimu.xyz/api/admin/user/tz/export?' + 'code=' + this.exportSms + '&ids=' + ids.join(',');
        }
        this.exportSms = '';
        window.open(url, '_blank')
      },
      exportAll() {
        this.currentAction = 'exportAll';
        this.exportSmsVisible = true;
      },
      createUser() {

      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-form-item-children {
    display: flex;
  }

  /deep/ .ant-checkbox-group-item {
    display: block;
  }
  /deep/.ant-input-affix-wrapper .ant-input-suffix{
    right: 0;
  }
</style>
