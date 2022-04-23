<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户ID">{{data.id}}</a-descriptions-item>
        <a-descriptions-item label="用户昵称">{{data.nickname}}</a-descriptions-item>
        <a-descriptions-item label="用户手机号">{{data.phone}}</a-descriptions-item>
        <a-descriptions-item label="微信号">{{data.wxNumber}}</a-descriptions-item>
        <a-descriptions-item label="余额（元）">{{data.money}}</a-descriptions-item>
        <a-descriptions-item label="注册时间">{{data.ctime}}</a-descriptions-item>
        <a-descriptions-item label="微信appId">{{data.appId}}</a-descriptions-item>
        <a-descriptions-item label="微信appSecret">{{data.appSecret}}</a-descriptions-item>
        <a-descriptions-item label="平台url">{{data.url}}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="my-style">
        <a-descriptions>
          <a-descriptions-item class="my-style" label="平台服务费">
            <div style="display: flex;">
              <a-input v-model="data.serviceRate" :disabled="true" addon-after="%"/>
              <a-button type="primary" style="margin-left: 10px;" @click="onEditClick" v-allow="19">更改</a-button>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <a-descriptions v-allow="17">
        <a-descriptions-item label="禁用账户">
          <a-switch :checked="String(data.status) === '1'" checked-children="启用中" un-checked-children="禁用中" @change="onDisableChange"/>
        </a-descriptions-item>
      </a-descriptions>
      <edit-service-rate
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import Vue from 'vue'
  import { userDisable, userEnable, userQuery, userSaveServiceRate } from '@/api/userService'
  import EditServiceRate from '@/views/user/modules/EditServiceRate'

  export default {
    components: {
      EditServiceRate
    },
    data() {
      return {
        data: {

        },
        visible: false,
        confirmLoading: false,
        mdl: null,
      }
    },
    created() {
      this.getUserInfo()
    },
    methods: {
      async getUserInfo() {
        const { data } = await userQuery(this.$route.query.id)
        this.data = data;
      },
      async onDisableChange(){
        const record = this.data;
        if(record.status === 1){
          this.$confirm({
            content: `禁用后用户不能登录平台，后台不删除用户数据`,
            onOk: async () => {
              const result = await userDisable(record.id);
              if(result.success){
                this.$message.info(`禁用成功`)
                await this.getUserInfo()
              }else{
                this.$message.error(result.msg)
              }
            }
          })
        }else{
          const result = await userEnable(record.id);
          if(result.success){
            this.$message.info(`启用成功`)
            await this.getUserInfo()
          }else{
            this.$message.error(result.msg)
          }
        }
      },
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields(async (errors, values) => {
          if (!errors) {
            values.id = this.data.id;
            const result = await userSaveServiceRate(values);
            if(result.success){
              this.$message.info('修改成功')
              this.visible = false
              this.confirmLoading = false
              form.resetFields()
              await this.getUserInfo();
            }else{
              this.$message.error(result.msg);
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      onEditClick(){
        this.mdl = null
        this.visible = true
      },
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
    }
  }
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0, 0, 0, .85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .my-style{
      /deep/.ant-descriptions-item{
        display: flex;
        align-items: center;
      }
  }

</style>
