<template>
  <div class="recorder" @click="play" style="cursor: pointer">
    <img :src="require('./icon_shengbo.png')" width="20"/>
    <span>{{long}}S</span>
    <audio style="display:none;" :src="url" ref="player" controls="controls"></audio>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    props: {
      long: {},
      url: {},
      allowClose: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      play() {
        this.$refs.player.play();
      },
    },
  }
</script>

<style lang="less" scoped>
  .recorder{
    width: 185px;
    height: 40px;
    margin-bottom: 15px;
    background: #FFFAF7;
    border-radius: 6px;
    background: url("./bg_yuyin.png");
    background-size: 100% 100%;
    padding-left: 18px;
    line-height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    .van-image{
      width: 20px;
      height: 15px;
    }
    span{
      color: #FE7B35;
      font-weight: bold;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .delete-icon{
    position: absolute;
    right: -2px;
    top: 0;
  }
</style>
