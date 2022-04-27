<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
      <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">

        <a-form layout="vertical">
          <a-form-item
            label="账号名称"
            :required="true"
          >
            <a-input v-model="name" placeholder="请输入" />
          </a-form-item>

          <a-form-item
            label="后台管理账号密码"
            :required="true"
            help="密码已通过MD5加密"
          >
            <a-input-password v-model="passwd" placeholder="请输入"/>
          </a-form-item>

          <a-form-item style="text-align: center">
            <a-button type="primary" @click="onSaveClick">保存</a-button>
            <a-button style="margin-left: 10px;" @click="$router.go(-1)">取消</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setavatar"/>

  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import { baseMixin } from '@/store/app-mixin'
  import md5 from 'md5'
  import { saveLognUserInfo } from '@/api/permissionService'

  export default {
  mixins: [baseMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: this.$store.getters.userInfo.avatar,
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      passwd: '',
      name: '',
      lastPasswd: ''
    }
  },
  created(){
    this.name = this.$store.getters.userInfo.name;
    this.passwd = this.$store.getters.userInfo.passwd;
    this.lastPasswd = this.$store.getters.userInfo.passwd;
  },
  methods: {
    setavatar (url) {
      this.option.img = url
    },
    async onSaveClick(){
      const params = {
        name: this.name,
        avatar: this.option.img,
        id: this.$store.getters.userInfo.id,
        passwd: this.passwd
      }
      debugger
      if(this.passwd !== this.lastPasswd){ //如果修改过密码的话 需要重新加密
        params.passwd = md5(this.passwd);
      }
      const result = await saveLognUserInfo(params);
      if(result.success){
        this.$message.success('保存成功')
      }else{
        this.$message.error(result.msg);
      }
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
