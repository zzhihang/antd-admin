<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">这里写copyright 看下用户是否要标注到这里@曹宁</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
