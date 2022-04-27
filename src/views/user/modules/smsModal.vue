<template>
  <a-modal
    :visible="show"
    :width="340"
    title="导出"
    okText="验证"
    @ok="onSmsModalOk"
    @cancel="onClose"
  >
    <p>验证码将通过短信发送给{{this.toPhone.substr(0,3)+'****'+this.toPhone.substr(7)}}</p>
    <a-input placeholder="请输入验证码" v-model="exportSms">
      <template #suffix>
        <a-button
          type="primary"
          @click="getCaptcha"
          :disabled="state.smsSendBtn"
          v-text="!state.smsSendBtn && '获取验证码' || (state.time+'s后可重新发送')"
        >发送验证码
        </a-button>
      </template>
    </a-input>
    <p style="font-size: 12px;color: #999999;margin-top: 10px;"><a-icon type="info-circle"/>导出表格需要输入超管提供的验证码</p>
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import { checkCode, sysSmsSend } from '@/api/userService'


  const billType = {
    blog: '糖主管理',
    member: '会员管理',
    order: '订单管理',
  }

  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      billType: {
        type: String,
        default: ''
      },
      toPhone: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        exportSms: '',
        state: {
          time: 60,
          smsSendBtn: false
        },
      }
    },
    methods: {
      onClose(){
        this.$emit('update:show', false)
      },
      async onSmsModalOk(){
        const result = await checkCode({code: this.exportSms, type: billType[this.billType]});
        if(result.success){
           this.$emit('onOk', this.exportSms);
           this.$emit('update:show', false)
        }else{
          this.$message.error(result.msg);
        }
      },
      getCaptcha (e) {
        const {state} = this;
        e.preventDefault()
        state.smsSendBtn = true
        sysSmsSend(billType[this.billType]).then(result => {
          if(result.success){
            this.$message.success('发送成功')
            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
          }else{
            this.$message.error(result.msg);
          }
        })

      },
    }
  }
</script>

<style lang="less" scoped>

</style>