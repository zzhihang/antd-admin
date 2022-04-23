<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="字典名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入字典名' }]}
            ]"
            :disabled="true"
            name="name"
            placeholder="请输入字典名"/>
        </a-form-item>
        <a-form-item
          label="描述内容"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'descr',
              {rules: [{ required: true, message: '请输入描述内容' }]}
            ]"
            name="name"
            placeholder="请输入描述内容"/>
        </a-form-item>
        <a-form-item
          label="状态"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-radio-group v-decorator="['status']">
            <a-radio v-for="(item, index) in DICT_STATUS" :key="index" :value="item.value">{{item.text}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="内容"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="请输入内容"
            v-decorator="[
              'content',
              {rules: [{ required: true, message: '请输入内容' }]}
            ]"/>
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary" @click="handleSubmit">保存</a-button>
          <a-button style="margin-left: 8px" @click="onCancelClick">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { ENABLE_STATUS } from '@/utils/dict'
  import { getDicInfo, saveDicInfo } from '@/api/permissionService'

  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        DICT_STATUS: ENABLE_STATUS,
      }
    },
    created() {
      this.getDicInfo()
    },
    methods: {
      async getDicInfo() {
        const id = this.$route.query.id
        const { data } = await getDicInfo(id)
        this.model = data
        this.form.setFieldsValue(data)
      },
      onCancelClick() {
        this.$router.go(-1)
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
          if (!err) {
            const params = values
            params.id = this.$route.query.id
            const result = await saveDicInfo(params)
            if (result.success) {
              this.$message.success('操作成功')
              this.onCancelClick();
            }
          }
        })
      },
    }
  }
</script>
