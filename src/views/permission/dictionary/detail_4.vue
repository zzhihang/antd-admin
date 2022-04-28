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

        <!-- table -->
        <a-card>
          <a-table
            :columns="columns"
            :dataSource="data"
            :pagination="false"
            :loading="memberLoading"
          >
            <template slot="phone" slot-scope="text, record">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                placeholder="请输入手机号"
                @change="e => handleChange(e.target.value, record.key, 'phone')"
              />
              <template v-else>{{ text }}</template>
            </template>
            <template slot="location" slot-scope="text, record">
              <a-checkbox-group  v-if="record.editable" v-model="record.location" :options="checkList">
              </a-checkbox-group>
              <template v-else>{{ text }}</template>
            </template>
            <template slot="serial" slot-scope="text, record, index">
               <span>
                {{ index + 1 }}
              </span>
            </template>
            <template slot="operation" slot-scope="text, record">
              <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical"/>
              <a @click="remove(record.key)">取消</a>
            </span>
                <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical"/>
              <a @click="cancel(record.key)">取消</a>
            </span>
              </template>
              <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
              </a-popconfirm>
            </span>
            </template>
          </a-table>
          <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus"
                    @click="newMember">新增手机号
          </a-button>
        </a-card>


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
  import { getDicInfo, phoneDel, phoneSave, saveDicInfo } from '@/api/permissionService'

  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        DICT_STATUS: ENABLE_STATUS,
        memberLoading: false,
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: '20%',
            scopedSlots: { customRender: 'phone' }
          },
          {
            title: '位置',
            dataIndex: 'location',
            key: 'location',
            width: '40%',
            scopedSlots: { customRender: 'location' }
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        checkList: ['糖主管理', '会员管理', '订单管理'],
        data: []
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
        data.content.forEach((item, index) => {
          item.editable = false;
          item.key = index;
        })
        this.data = data.content
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
            params.content = this.data;
            const result = await saveDicInfo(params)
            if (result.success) {
              this.$message.success('操作成功')
              this.onCancelClick()
            }
          }
        })
      },
      async remove(key) {
        const row = this.data.find(item => item.key === key);
        const result = await phoneDel({id: this.$route.query.id, phone: row.phone});
        if(result.success){
          this.$message.success('操作成功');
          this.getDicInfo()
        }else{
          this.$message.fail(result.msg)
        }
      },
      async saveRow(record) {
        const { key, phone, location } = record
        if (!phone || !location) {
          this.memberLoading = false
          this.$message.error('请填写完整信息')
          return
        }

        if(phone.length !== 11 || !Number(phone)){
          return this.$message.error('请填写正确的手机号')
        }

        this.memberLoading = true

        const params = {id: this.$route.query.id, phone, location}
        if(record.uid){
          params.uid = record.uid;
        }

        const result = await phoneSave(params);
        if(result.success){
          this.$message.success('操作成功');
          this.getDicInfo()
        }else{
          this.$message.error(result.msg);
        }
        this.memberLoading = false;
      },
      toggle(key) {
        const target = this.data.find(item => item.key === key)
        target._originalData = { ...target }
        target.editable = !target.editable
      },
      cancel(key) {
        const target = this.data.find(item => item.key === key)
        if(target._originalData){
          Object.keys(target).forEach(key => {
            target[key] = target._originalData[key]
          })
        }
        target.editable = !target.editable
        target._originalData = undefined
      },
      newMember () {
        const length = this.data.length
        this.data.push({
          key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
          phone: '',
          location: '',
          editable: true,
          isNew: true
        })
      },
      handleChange(value, key, column) {
        const newData = [...this.data]
        const target = newData.find(item => key === item.key)
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
    }
  }
</script>
