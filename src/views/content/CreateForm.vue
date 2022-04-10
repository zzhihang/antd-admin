<template>
  <a-modal
    title="内容详情"
    :width="740"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="用户ID">
          <span>{{model.userId}}</span>
        </a-form-item>
        <a-form-item label="文本" >
          <p>{{model.context}}</p>
        </a-form-item>
        <a-form-item label="图片">
            <div class="pic-box">
              <img v-for="(item, index) in 3" :key="index" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="">
            </div>
        </a-form-item>
        <a-form-item label="审核">
          <a-radio-group v-if="!model.ifDetail" @change="onRadioChange" v-decorator="['auditType', {rules: [{required: true, message: '请选择'}]}]"  style="margin-top: 6px;">
            <a-radio :value="1">审核通过</a-radio>
            <a-radio :value="2">审核不通过</a-radio>
          </a-radio-group>
          <span v-else>{{model.status | useDictAUDIT_STATUS}}</span>
        </a-form-item>
        <a-form-item label="备注" v-if="!model.ifDetail">
          <a-textarea v-if="showRemark" placeholder="请备注审核不通过原因（可选填）" v-decorator="['audit']" />
        </a-form-item>
        <a-form-item label="备注" v-else>
          <p>{{model.failInfo}}</p>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
// 表单字段
const fields = ['appId', 'appSecret', 'appSecret']

export default {
  components: { ATextarea },
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
      default: {}
    },
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
      form: this.$form.createForm(this),
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
    onRadioChange(e) {
      this.showRemark = String(e.target.value) === '2'
    }
  }
}
</script>
<style lang="less" scoped>
  .pic-box{
    img{
      width: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
</style>