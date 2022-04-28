<template>
  <a-modal
    title="管理模板id"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="用户消息服务模板id" v-show="!createUserId">
          <a-input v-decorator="['upgradeId']" />
        </a-form-item>
        <a-form-item label="用户订阅消息模板id" v-show="!createUserId">
          <a-input v-decorator="['notifyUserId']" />
        </a-form-item>
        <a-form-item label="博主被订阅模板id" v-show="!createUserId">
          <a-input v-decorator="['notifyTzId']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['upgradeId', 'notifyUserId', 'notifyTzId']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    createUserId: {},
    createUserUrl: {}
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
      form: this.$form.createForm(this)
    }
  },
  created () {
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {debugger
      this.model && this.form.setFieldsValue(this.model)
    })
  },
}
</script>
