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
          label="订单金额限制"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <div>
            <span>最低金额（元）</span>
            <a-input-number
              :precision="2"
              min=0
              v-decorator="[
              'content.priceMin',
              {rules: [{ required: true, message: '请输入最低额' }]}
            ]"
              name="name"
              placeholder="请输入最低金额"/>
          </div>
          <div>
            <span>最高金额（元）</span>
            <a-input-number
              :precision="2"
              :disabled="check"
              v-decorator="[
              'content.priceMax',
              {rules: [{ required: !check, message: '请输入最高金额' }]}
            ]"
              name="name"
              :placeholder="check ? '' : '请输入最高金额'"/>
          </div>
        </a-form-item>

        <a-form-item
          label="不限制"
          help="此选项只针对最高金额，勾选后最高金额将不能填写"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-checkbox
            @change="onCheckChange"
            v-model="check"
            v-decorator="[
              'content.noLimit'
            ]"
          />
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
        check: false
      }
    },
    created() {
      this.getDicInfo()
    },
    methods: {
      async getDicInfo() {
        const id = this.$route.query.id;
        const {data} = await getDicInfo(id)
        this.model = data;
        this.form.setFieldsValue(data);
        this.check = data.content.noLimit;
      },
      onCheckChange(e){
        this.check = e.target.checked;
        if(e.target.checked){
          this.form.setFieldsValue({
            content: {
              priceMax: ''
            }
          })
        }
      },
      onCancelClick() {
        this.$router.go(-1)
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
          if (!err) {
            const params = values;
            params.id = this.$route.query.id;
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
