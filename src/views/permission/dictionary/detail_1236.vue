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
        memberLoading: false,
        columns: [
          {
            title: '成员姓名',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: '工号',
            dataIndex: 'workId',
            key: 'workId',
            width: '20%',
            scopedSlots: { customRender: 'workId' }
          },
          {
            title: '所属部门',
            dataIndex: 'department',
            key: 'department',
            width: '40%',
            scopedSlots: { customRender: 'department' }
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        data: [
          {
            key: '1',
            name: '小明',
            workId: '001',
            editable: false,
            department: '行政部'
          },
          {
            key: '2',
            name: '李莉',
            workId: '002',
            editable: false,
            department: 'IT部'
          },
          {
            key: '3',
            name: '王小帅',
            workId: '003',
            editable: false,
            department: '财务部'
          }
        ]
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
      async onSaveClick() {
        /*
        *
        * id
          name
          descr

          content:普通类容

          金额限制
          content: {
              "min":1,
              "max": 2
          }


          手机号
          content: [
              {
                  "phone":"11111"
                  "location":"订单管理,会员管理"
              }
          ]
        * */

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
      remove(key) {
        const newData = this.data.filter(item => item.key !== key)
        this.data = newData
      },
      saveRow(record) {
        this.memberLoading = true
        const { key, name, workId, department } = record
        if (!name || !workId || !department) {
          this.memberLoading = false
          this.$message.error('请填写完整成员信息。')
          return
        }
        // 模拟网络请求、卡顿 800ms
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ loop: false })
          }, 800)
        }).then(() => {
          const target = this.data.find(item => item.key === key)
          target.editable = false
          target.isNew = false
          this.memberLoading = false
        })
      },
      toggle(key) {
        const target = this.data.find(item => item.key === key)
        target._originalData = { ...target }
        target.editable = !target.editable
      },
      cancel(key) {
        const target = this.data.find(item => item.key === key)
        Object.keys(target).forEach(key => {
          target[key] = target._originalData[key]
        })
        target._originalData = undefined
      },
      handleChange(value, key, column) {
        const newData = [...this.data]
        const target = newData.find(item => key === item.key)
        if (target) {
          target[column] = value
          this.data = newData
        }
      }
    }
  }
</script>
