<template>
  <div style="display: inline-block">
    <a-button style="margin-left: 8px" type="primary" v-allow="13" @click="exportClick">
      <slot></slot>
    </a-button>
    <sms-modal @onOk="exportData" :to-phone="toPhone" :bill-type="billType" :show.sync="exportSmsVisible"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import smsModal from '@/views/user/modules/smsModal'
  import { exportStatus } from '@/api/permissionService'

  const billType = {
     blog: '糖主管理',
     member: '会员管理',
     order: '订单管理',
  }

  export default {
    components: {
      smsModal,
    },
    props: {
      url: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: '全部导出'
      },
      type: {
        type: String,
        default: 'all' //part 全部
      },
      ids: {
        type: Array,
        default: []
      },
      billType:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        exportSmsVisible: false,
        ifNeedSms: false,
        toPhone: ''
      }
    },
    methods: {
      async exportClick(){
        if(this.type !== 'all'){
          if(!this.ids.length){
            return this.$message.warn('请先选择要导出的数据')
          }
        }
        const result = await exportStatus(billType[this.billType]);
        if(result.success){
          this.ifNeedSms = String(result.data.ifValidate) === '1';
          this.toPhone = result.data.phone
        }else{
          this.$message.error(result.msg);
        }
        if(this.ifNeedSms){
          this.exportSmsVisible = true;
        }else{
          this.exportData()
        }
      },
      async exportData(sms) {
        if(this.type === 'all'){
          if(this.ifNeedSms){
            window.open(`http://admin.shouzimu.xyz/api${this.url}?code=${sms}`, '_blank')
          }else{
            window.open(`http://admin.shouzimu.xyz/api${this.url}`, '_blank')
          }
        }else{
          if(this.ifNeedSms){
            window.open(`http://admin.shouzimu.xyz/api${this.url}?code=${sms}&ids=${this.ids.join(',')}`, '_blank')
          }else{
            window.open(`http://admin.shouzimu.xyz/api${this.url}?ids=${this.ids.join(',')}`, '_blank')
          }
        }
      }
    }

  }
</script>

<style lang="less" scoped>
  /deep/.ant-input-affix-wrapper .ant-input-suffix{
    right: 0;
  }
</style>