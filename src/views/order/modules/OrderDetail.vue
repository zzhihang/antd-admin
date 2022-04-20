<template>
  <a-modal
    class="my-modal"
    title="订单信息"
    cancelText="关闭"
    okText="我知道了"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-card :bordered="false">
      <a-descriptions>
        <a-descriptions-item label="订单号">{{model.orderNo}}</a-descriptions-item>
        <a-descriptions-item label="用户ID">{{model.userId}}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{model.userPhone}}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{model.nickname}}</a-descriptions-item>
        <a-descriptions-item label="订单创建时间">{{model.ctime}}</a-descriptions-item>
        <a-descriptions-item label="订单交易时间">{{model.payTime}}</a-descriptions-item>
        <a-descriptions-item label="糖主ID">{{model.tzUserId}}</a-descriptions-item>
        <a-descriptions-item label="糖主昵称">{{model.tzNickname}}</a-descriptions-item>
        <a-descriptions-item label="专题名称">{{model.businessTitle}}</a-descriptions-item>
        <a-descriptions-item label="订阅类型">{{model.businessType | useDictBUSINESS_TYPE}}</a-descriptions-item>
        <a-descriptions-item label="交易类型">{{model.orderType | useDictORDER_TYPE}}</a-descriptions-item>
        <a-descriptions-item label="支付方式">{{model.payType | useDictPAY_TYPE}}</a-descriptions-item>
        <a-descriptions-item label="支付状态">{{model.payStatus | useDictPAY_STATUS}}</a-descriptions-item>
        <a-descriptions-item label="交易金额（元）">{{model.payPrice}}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id']

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
      default: {}
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
      form: this.$form.createForm(this),
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
<style lang="less" scoped>
  .my-modal{
    /deep/.ant-card-body{
      padding: 0;
    }
  }
</style>