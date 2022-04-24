<template>
  <a-modal
    title="创建用户"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="appId" v-show="!createUserId">
          <a-input v-decorator="['appId', {rules: [{required: true, message: '请输入'}]}]" />
        </a-form-item>
        <a-form-item label="微信号" v-show="!createUserId">
          <a-input v-decorator="['wxNumber']" />
        </a-form-item>
        <a-form-item label="手机号" v-show="!createUserId">
          <a-input v-decorator="['phone', {rules: [{required: true, message: '请输入'}]}]" />
        </a-form-item>
        <a-form-item label="appSecret" v-show="!createUserId">
          <a-input v-decorator="['appSecret', {rules: [{required: true, message: '请输入'}]}]" />
        </a-form-item>
        <a-form-item label="用户ID" v-show="createUserId">
          <span>{{createUserId}}</span>
        </a-form-item>
        <a-form-item label="平台url" v-show="createUserUrl">
          <div style="display: flex;align-items: center;">
            <span style="word-break: break-all" id="foo">{{createUserUrl}}</span>
            <a-button type="primary" style="margin-left: 10px;" v-clipboard:copy="createUserUrl" v-clipboard:success="onCopy">复制</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['appId', 'appSecret', 'appSecret', 'phone']

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
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    onCopy(e) {
      this.$message.info('复制成功')
    }
  }
}
</script>
