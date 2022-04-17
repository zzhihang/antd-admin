<template>
  <a-modal
    title="操作"
    :width="800"
    :height="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    cancelText="取消"
    okText="保存"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" v-bind="formLayout">
      <a-form-item label="角色名称" v-show="!createUserId">
        <a-input v-decorator="['name', {rules: [{required: true, message: '请输入'}]}]" />
      </a-form-item>
      <div class="my-card">
        <a-card title="权限分配：" style="width: 450px" :headStyle="{fontWeight: 'bold'}">
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
    </a-form>
  </a-modal>
</template>

<script>
import { sysRoleSave } from '@/api/permissionService'

export default {
  name: 'RoleModal',
  props: {
    treeData: {
      type: Array,
      default: []
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      visible: false,
      checkedKeys: [],
      form: this.$form.createForm(this)
    }
  },
  created () {

  },
  methods: {
    edit () {
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      this.form.validateFields(async (err, values) => {
        values.permissionIds = this.checkedKeys;
        console.log(values)
        if (!err) {
          const result = await sysRoleSave(values)
          if(result.success){
            this.$message.success('保存成功');
            this.$emit('saveSuccess')
            this.close();
          }else{
            this.$message.error(result.msg);
          }
        }
      })
    },
    handleCancel () {
      this.close()
    },

  }
}
</script>

<style lang="less" scoped>
  .my-card{
    overflow-y: scroll;
    max-height: 550px;
    /deep/.ant-card{
      margin: 0 auto;
    }
  }
</style>
