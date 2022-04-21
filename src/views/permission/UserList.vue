<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户信息">
                <a-input placeholder="请输入用户ID、昵称、手机号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="角色">
                <a-select placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="(item, index) in roleList" :value="item.id" :key="index">{{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="onCreateClick" v-allow="37">创建账号</a-button>
              <a-button type="primary" style="margin-left: 16px" v-allow="38">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        row-key="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
      >
      <span>
        <a-switch slot="status"
                  v-allow="39"
                  slot-scope="text, record, index"
                  :checked="String(text) === '1'"
                  checked-children="启用中"
                  un-checked-children="禁用中"
                  @change="onDisableChange(record)"/>
      </span>
        <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
        <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-allow="39">编辑</a>
      </span>
      </s-table>

      <a-modal
        title="添加人员"
        style="top: 20px;"
        :width="800"
        v-model="visible"
        cancelText="取消"
        okText="保存"
        @ok="handleOk"
      >
        <a-form class="permission-form" :form="form">
          <a-form-item
            style="display: none;"
            label="id"
          >
            <a-input
              v-decorator="['id']"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="用户ID"
          >
            <a-input
              placeholder="唯一识别码"
              :disabled="currentAction === 'edit'"
              v-decorator="['uid', {rules: [{required: true, message: '请输入'}]}]"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="后台管理账号密码"
          >
            <a-input
              placeholder="请输入登录密码"
              v-decorator="['passwd', {rules: [{required: true, message: '请输入'}]}]"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="手机号"
          >
            <a-input
              placeholder="请输入手机号"
              v-decorator="['phone', {rules: [{required: true, message: '请输入'}]}]"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            placeholder="请选择角色"
            label="角色"
          >
            <a-select v-decorator="['role', {rules: [{required: true, message: '请选择'}]}]">
              <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
  import pick from 'lodash.pick'
  import { STable } from '@/components'
  import md5 from 'md5'
  import { sysRoleList, sysUserDisable, sysUserEnable, sysUserList, sysUserSave } from '@/api/permissionService'

  const columns = [
    {
      title: '序号',
      dataIndex: 'id'
    },
    {
      title: '用户ID',
      dataIndex: 'uid'
    },
    {
      title: '用户昵称',
      dataIndex: 'name'
    },
    {
      title: '手机号',
      dataIndex: 'phone'
    },
    {
      title: '角色',
      dataIndex: 'roleName'
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' }
    },
    {
      title: '操作',
      width: '150px',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'TableList',
    components: {
      STable
    },
    data() {
      return {
        currentAction: 'add',
        roleList: [],
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        permissions: [],

        queryParam: {},
        columns,
        loadData: parameter => {
          return sysUserList(parameter)
            .then(res => {
              return res.data
            })
        }

      }
    },
    created() {
      this.queryRoleList()
    },
    methods: {
      async queryRoleList() {
        const { data } = await sysRoleList()
        this.roleList = data
      },
      async onDisableChange(record) {
        if (record.status === 1) {
          this.$confirm({
            content: `你确定要禁用${record.phone}吗？`,
            onOk: async () => {
              const result = await sysUserDisable(record.id)
              if (result.success) {
                this.$message.info(`禁用成功`)
                await this.$refs.table.refresh()
              } else {
                this.$message.error(result.msg)
              }
            }
          })
        } else {
          const result = await sysUserEnable(record.id)
          if (result.success) {
            this.$message.info(`启用成功`)
            await this.$refs.table.refresh()
          } else {
            this.$message.error(result.msg)
          }
        }
      },
      handleEdit(record) {
        this.currentAction = 'edit'
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(record, ['id', 'uid', 'passwd', 'role', 'name', 'phone']))
        })
      },
      onCreateClick() {
        this.currentAction = 'add'
        this.visible = true
        this.form.resetFields()
      },
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
          values.passwd = md5(values.passwd)
          const result = await sysUserSave(values)
          this.visible = false
          if (result.success) {
            this.$message.success('操作成功')
            await this.$refs.table.refresh()
          } else {
            this.$message.error(result.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .permission-form {
    /deep/ .permission-group {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

</style>
