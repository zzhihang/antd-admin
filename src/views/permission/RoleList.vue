<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <!--<a-col :md="8" :sm="24">-->
            <!--<a-form-item label="角色名称">-->
            <!--<a-input placeholder="请输入"/>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="onCreate" v-allow="35">创建角色</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div style="display: flex">
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="sysRoleAndPermission"
          style="flex: 1;margin-right: 14px;"
        >
          <!--:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"-->
          <span slot="action" slot-scope="text, record">
          <a @click="onRowEditClick(record)" v-allow="36">编辑</a>
        </span>
          <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        </s-table>

        <a-card title="权限分配" style="width: 450px" :headStyle="{fontWeight: 'bold'}">
          <template #extra>
            <a-button type="primary" @click="onRoleTreeSave" :disabled="selectedRows.length === 0">保存</a-button>
          </template>
          <a-tree
            checkable
            :defaultExpandAll="true"
            :tree-data="treeData"
            :replaceFields="{title:'name', key:'id' }"
            v-model="checkedKeys"
          >
            <template #title0010><span style="color: #1890ff">sss</span></template>
          </a-tree>
        </a-card>
      </div>

      <role-modal ref="modal" :tree-data="treeData" @saveSuccess="$refs.table.refresh()" @ok="handleOk"></role-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
  import Vue from 'vue'
  import { STable } from '@/components'
  import RoleModal from './modules/RoleModal'
  import { Tree } from 'ant-design-vue'
  import { sysAllPermission, sysRoleAndPermission, sysRoleSave } from '@/api/permissionService'
  import { arrayToTree } from '@/utils/util'

  Vue.use(Tree)

  export default {
    name: 'TableList',
    components: {
      STable,
      RoleModal
    },
    data() {
      return {
        visible: false,
        form: null,
        mdl: {},
        queryParam: {},
        permissions: [],
        treeData: [],
        sysRoleAndPermission: sysRoleAndPermission,
        arrayToTree: arrayToTree,
        checkedKeys: [],
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '角色名称',
            dataIndex: 'name'
          },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created() {
      this.getSysAllPermission()
    },
    methods: {
      onCreate() {
        this.$refs.modal.edit()
      },
      handleOk() {
        // 新增/修改 成功时，重载列表
        this.$refs.table.refresh()
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },
      async getSysAllPermission() {
        const { data } = await sysAllPermission()
        this.treeData = arrayToTree(data)
      },
      async onRoleTreeSave() {
        const currentRow = this.selectedRows
        const params = {
          id: currentRow.id,
          name: currentRow.name,
          permissionIds: this.checkedKeys
        }
        const result = await sysRoleSave(params)
        if (result.success) {
          this.$message.success('操作成功')
        } else {
          this.$message.error(result.msg)
        }
      },
      onRowEditClick(row) {
        this.selectedRows = row
        this.checkedKeys = row.permissions.map(item => item.id)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        const currentRow = selectedRows[0]
        this.checkedKeys = currentRow.permissions.map(item => item.id)
      }
    }
  }
</script>
