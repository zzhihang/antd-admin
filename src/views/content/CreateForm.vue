<template>
  <a-modal
    title="内容详情"
    :width="850"
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
        <a-form-item label="文本">
          <p>{{model.title}}</p>
        </a-form-item>
        <a-form-item label="图片" v-if="type === 'pic'">
            <div class="pic-box">
              <img v-for="(item, index) in content" :key="index" :src="item.url" alt="">
            </div>
        </a-form-item>
        <a-form-item label="文档" v-if="type === 'doc'">
          <div class="pic-box">
            <a-card size="small" v-for="(item, index) in content" :key="index" style="width: 150px">
              <template #title>
                <a href="#"><a-icon :style="{fontSize: '20px'}"  :type="item.type.includes('pdf') ? 'file-pdf' : 'file-word'" /></a>
              </template>
              <template #extra><a :href="item.url" target="_blank">预览</a></template>
              <p>{{item.name}}</p>
            </a-card>
          </div>
        </a-form-item>
        <a-form-item label="语音" v-if="type === 'voice'">
          <div class="pic-box">
            <my-audio :long="content[0].timeLong" :url="content[0].url"/>
          </div>
        </a-form-item>
        <a-form-item label="审核">
          <a-radio-group v-if="!model.ifDetail" @change="onRadioChange" v-decorator="['auditType', {rules: [{required: true, message: '请选择'}]}]"  style="margin-top: 6px;">
            <a-radio :value="1">审核通过</a-radio>
            <a-radio :value="2">审核不通过</a-radio>
          </a-radio-group>
          <span v-else>{{model.status | useDictAUDIT_STATUS}}</span>
        </a-form-item>
        <a-form-item label="备注" v-if="showRemark">
          <a-textarea v-if="!model.ifDetail" placeholder="请备注审核不通过原因（可选填）" v-decorator="['audit']" />
          <p v-else>{{model.audit}}</p>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import MyAudio from '@/components/MyAudio/MyAudio'
const fields = ['appId', 'appSecret', 'appSecret']
export default {
  components: { ATextarea, MyAudio},
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
      content: {},
      type: 'text'
    }
  },
  created () {
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
      this.type = this.model.type;
      this.content = this.model.content;
      this.showRemark = String(this.model.status) === '2'
    })
  },
  methods: {
    onRadioChange(e) {
      this.showRemark = String(e.target.value) === '2'
    },
  }
}
</script>
<style lang="less" scoped>
  .pic-box{
    display: flex;
    flex-wrap: wrap;
    img{
      width: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .ant-card{
      margin-right: 10px;
      margin-bottom: 10px;

    }
  }
  /deep/.ant-form-item-label{
    width: 15%;
  }
  /deep/.ant-form-item-control-wrapper{
    width: 85%;
  }
</style>