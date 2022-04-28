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
              <button-export
                style="margin-left: 8px"
                v-allow="13"
                :ids="selectedIds"
                type="part"
                bill-type="blog"
                url="/admin/user/tz/export"
              >导出</button-export>
              <button-export
                style="margin-left: 8px"
                v-allow="14"
                url="/admin/user/tz/export"
                bill-type="blog"
              >全部导出</button-export>
              <a-button style="margin-left: 8px" type="primary" v-allow="15" @click="handleAdd">创建用户</a-button>
              <a-button style="margin-left: 8px" @click="() => {this.queryParam = {};this.ctime = '';this.$refs.table.refresh(true)}">重置</a-button>
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
            <a-divider type="vertical" />
            <a @click="handleTemplate(record)">模板管理</a>
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
      <wx-template
        ref="createModal2"
        :visible="editTemplateVisible"
        :loading="confirmLoading"
        :model="mdl2"
        @cancel="handleTemCancel"
        @ok="handleTemOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { STable } from '@/components'
  import { ENABLE_STATUS } from '@/utils/dict'
  import { getBloggerList, updateWxTemplate, userDisable, userEnable, userSave } from '@/api/userService'
  import CreateForm from './modules/CreateForm'
  import ButtonExport from '@/views/user/modules/ButtonExport'
  import WxTemplate from '@/views/user/modules/WxTemplate'

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
      dataIndex: 'nickname'
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
      width: '200px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'TableList',
    components: {
      STable,
      CreateForm,
      ButtonExport,
      WxTemplate
    },
    data() {
      return {
        ENABLE_STATUS: [{text: '全部', value: ''}].concat(ENABLE_STATUS),
        visible: false,
        editTemplateVisible: false,
        exportSmsVisible: false,
        popVisible: false,
        confirmLoading: false,
        mdl: null,
        mdl2: null,
        createUserId: '',
        createUserUrl: '',
        columns,
        ctime: '',
        queryParam: {
          queryText: '',
          status: '',
          ctimeStart: '',
          ctimeEnd: '',
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
        if(val){
          this.queryParam.ctimeStart = val[0].format('YYYY-MM-DD')
          this.queryParam.ctimeEnd = val[1].format('YYYY-MM-DD')
        }
      }
    },
    computed: {
      rowSelection() {
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
      onSmsModalOk(code){
        this.exportData(code);
      },
      handleAdd() {
        this.mdl = null
        this.visible = true
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
      handleCancel() {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleTemCancel(){
        this.editTemplateVisible = false;
        const form = this.$refs.createModal2.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleTemOk(){
        const form = this.$refs.createModal2.form
        this.confirmLoading = true
        form.validateFields(async (errors, values) => {
          if (!errors) {
            values.id = this.mdl2.id;
            const result = await updateWxTemplate(values);
            if(result.success){
              // 重置表单数据
              form.resetFields()
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            }else{
              this.$message.error(result.msg)
            }
            this.$refs.table.refresh()
            this.confirmLoading = false
            this.editTemplateVisible = false;
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleDetail({ id }) {
        this.$router.push({
          name: 'BloggerListDetail', query: {
            id
          }
        })
      },
      handleTemplate(record){
          this.editTemplateVisible = true;
          this.mdl2 = { ...record };
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
</style>
