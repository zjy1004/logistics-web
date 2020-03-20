<template>
  <div class="registration-clause">
    <div class="main">
      <iframe class="iframeStyle" :srcdoc="RegistrationAgreement">

      </iframe>
      <!-- <div class="iframeStyle" v-html="RegistrationAgreement"></div> -->
    </div>
    <div class="login-form">
      <el-form ref="form" :model="form">
        <el-form-item label="" prop="remeberPass">
          <el-checkbox v-model="form.remeberPass" class="agreeTerms">已阅读并同意<span>《物流云 “驮付宝”货款收取见证系统使用规则》</span></el-checkbox>
        </el-form-item>
        <el-form-item class="btnStyle">
          <!-- <el-button class="btn" :disabled=!this.btnFlag :class="{'btnChange':this.btnFlag}" @click="register">去注册</el-button> -->
          <el-button class="btn" :disabled=!this.btnFlag @click="register">{{isReadRegister === true  ? '去注册': '确定'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LoginAjax from '@/api/Login/Login'
import CommonAxios from '@/api/Common/CommonAxios'

export default {
  name: 'RegistrationClause',
  data () {
    return {
      goToRegister: false, // 是否跳转至注册
      RegistrationAgreement: '', // 协议内容
      RegistrationId: '', // 协议ID
      btnFlag: false,
      form: {
        remeberPass: false
      }
    }
  },
  props: {
    isReadRegister: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isChangeCheckbox () {
      return this.form.remeberPass
    }
  },
  watch: {
    isChangeCheckbox (newVal, oldVal) {
      if (newVal) {
        this.btnFlag = true
      } else {
        this.btnFlag = false
      }
    }
  },
  created () {
    this.QueryRegistrationAgreement()
  },
  methods: {
    register (e) {
      if (this.isReadRegister) { // isReadRegister->true 去注册 || faLse 确定
        this.$emit('go-to-tegister', 'true')
      } else {
        this.$emit('go-to-tegister', 'false')
        this.InsertCrmUserProtocol({protocolId: this.RegistrationId})
      }
      // this.goToRegister = true
    },
    QueryRegistrationAgreement () { // 查询开通驮付宝协议
      LoginAjax.QueryRegistrationAgreement({protocolType: 2}).then((response) => {
        if (response.code === 200) {
          this.RegistrationAgreement = response.data.protocolContent
          this.RegistrationId = response.data.id
        }
      })
    },
    InsertCrmUserProtocol (val) { // 已开通驮付宝但是没有阅读用户协议，调取该接口表示已经阅读
      CommonAxios.InsertCrmUserProtocol(val).then((response) => {
        if (response.code === 200) {
          console.log('已阅读协议')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.registration-clause {
  background: #fff;
  display: flex;
  flex: 1;
  padding: 25px 30px 20px 30px;
  flex-direction: column;
  overflow: hidden;
  .main {
    display: flex;
    flex: 1;
    .iframeStyle {
      display: flex;
      flex: 1;
      overflow: auto;
    }
  }
  .login-form {
    .agreeTerms {
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      span {
        color: #ff0000;
        font-size: 14px;
      }
    }
    .btn {
      width: 168px;
      height: 46px;
      line-height: 46px;
    }
    .btnChange {
      margin-top: 20px;
      width: 168px;
      height: 46px;
      line-height: 46px;
      background: #fff;
    }
  }
  .btnStyle {
    text-align: center;
  }
}
</style>
