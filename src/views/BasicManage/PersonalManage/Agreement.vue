<template>
    <iframe class="pageStyle" :srcdoc="RegistrationAgreement">
    </iframe>
</template>

<script>
import LoginAjax from '@/api/Login/Login'

export default {
  data () {
    return {
      RegistrationAgreement: ''
    }
  },
  created () {
    this.QueryRegistrationAgreement()
  },
  methods: {
    QueryRegistrationAgreement () { // 查询登录协议
      let type = this.$route.query
      LoginAjax.QueryRegistrationAgreement({protocolType: type.type}).then((response) => {
        if (response.code === 200) {
          this.RegistrationAgreement = response.data.protocolContent
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pageStyle {
  background: #fff;
  display: flex;
  flex: 1;
  padding: 25px 20%;
  flex-direction: column;
  overflow: auto;
}
</style>
