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
              <a-form-item label="角色">
                <a-select v-model="queryParam.role" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作时间">
                <a-range-picker v-model:value="ctime" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" style="text-align: right">
              <a-button type="primary" @click="$refs.table.refresh(true)" v-allow="34">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        style="margin-top: 10px;"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { CONTENT_STATUS } from '@/utils/dict'
  import { getSysLogList } from '@/api/sysService'
  import { sysRoleList } from '@/api/permissionService'

  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' },
      width: '100px'
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: '100px'
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: '100px'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      customRender: (text) => text && (text.substr(0,3)+'****'+text.substr(7)),
      width: '150px'
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      width: '100px'
    },{
      title: '日志时间',
      dataIndex: 'ctime',
      width: '200px'
    },{
      title: '操作记录',
      dataIndex: 'logText',
    }
  ]

  export default {
    name: 'TableList',
    components: {
      STable,
    },
    created(){
      sysRoleList().then(({data}) => {
        this.roleList = data;
      })
    },
    data () {
      this.columns = columns
      return {
        roleList: [],
        CONTENT_STATUS: CONTENT_STATUS,
        visible: false,
        confirmLoading: false,
        mdl: null,
        advanced: false,
        ctime: '',
        queryParam: {
          queryText: '',
          role: '',
          ctimeStart: '',
          ctimeEnd: '',
        },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getSysLogList(requestParameters)
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
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            if (values.id > 0) {
              // 修改 e.g.
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('修改成功')
              })
            } else {
              // 新增
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('新增成功')
              })
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
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
    }
  }
</script>
<style lang="less" scoped>
  /deep/.ant-form-item-children{
    display: flex;
  }
</style>
