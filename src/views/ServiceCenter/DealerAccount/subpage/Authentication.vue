<template>
<el-dialog class="common_remove_dialog"  :close-on-press-escape=false :before-close="closeDialog" :show-close=false :close-on-click-modal="closeClickModal" :width="'450px'"  :title="'为保证账号安全，需要验证身份'" :visible.sync="dialogShow">
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="银行卡卡号:" :label-width="formLabelWidth">
      <span>{{formInfo.bankCard}}</span>
    </el-form-item>
    <el-form-item label="开户行:" :label-width="formLabelWidth">
      <span>{{formInfo.bankName}}</span>
    </el-form-item>
    <el-form-item label="开户人:" :label-width="formLabelWidth">
      <span>{{formInfo.name}}</span>
    </el-form-item>
    <el-form-item label="手机号:" :label-width="formLabelWidth">
      <span>{{formInfo.phone}}</span>
    </el-form-item>
    <el-form-item label="验证方式:" :label-width="formLabelWidth" prop="authenticationMethod">
      <el-select v-model="form.authenticationMethod" placeholder="请选择验证方式" :disabled="disabledChange">
        <el-option label="短信验证" value="1"></el-option>
        <el-option label="小额转账认证" value="0"></el-option>
      </el-select>
    </el-form-item>
  </el-form>

  <el-form :inline="true" :rules="rules" label-width="120px" ref="form2" :model="form2">
    <el-row>
      <el-form-item label="验证码:" :label-width="formLabelWidth" prop="messageCode" v-if="messageShow">
        <el-input class="messageCode" v-model="form2.messageCode" placeholder="请输入验证码" clearable></el-input>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth" v-if="!countDownShow && messageShow">
        <span @click="getCode('form2')" class="getcode">获取验证码</span>
      </el-form-item>
      <el-form-item label=""  v-show="countDownShow" >
        <span class="getcode">发送成功（{{dateVal}}s）</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="到账金额:" prop="checkAmount" v-if="amountShow">
        <el-input class="amountCss" @blur="inputCheckAmount" v-model="form2.checkAmount" placeholder="请输入到账金额" @keyup.native="inputCheckAmount" clearable><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="" v-if="amountShow && !sentMonyShow">
        <span @click="getMony('form2')" class="getcode">获取验证金</span>
      </el-form-item>
      <el-form-item label=""  v-show="sentMonyShow">
        <span class="getcode">验证金已发送</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="注:" v-show="amountShow" class="tip">
        <span class="tipSpan" style="color: #FF0000">银行通过向您的账户支付小于1元的验证金额，验证银行卡信息</span>
      </el-form-item>
    </el-row>
  </el-form>
    <!-- 按钮组 -->
  <div class="btn">
    <el-button class="btn-main" @click="submit('form2')" :disabled="submitDisabled">提交</el-button>
  </div>
</el-dialog>
</template>

<script>
import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'

export default {
  name: 'Authentication',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: false
    },
    formInfo: {
      type: Object,
      default: () => {

      }
    }
  },
  computed: {
    methodType () {
      return this.form.authenticationMethod
    }
  },
  watch: {
    dateVal (newVal, oldVal) {
      if (newVal === 0) {
        this.countDownShow = false
      }
    },
    methodType (newValue, oldValue) {
      if (newValue === '1') {
        this.form2.authenticationMethod = '1'
        this.amountShow = false
        this.messageShow = true
        this.sentMonyShow = false
        this.form2.checkAmount = ''
      }
      if (newValue === '0') {
        this.form2.authenticationMethod = '0'
        this.countDownShow = false
        this.messageShow = false
        this.amountShow = true
        this.form2.messageCode = ''
      }
    }
  },
  data () {
    return {
      disabledChange: false,
      clickGetCodeFlag: false,
      submitDisabled: false,
      messageShow: true,
      amountShow: false,
      countDownShow: false,
      sentMonyShow: false,
      monyShow: true,
      dialogShow: this.dialogFormVisible,
      form: {
        authenticationMethod: '1'
      },
      form2: {
        messageCode: '',
        authenticationMethod: '',
        checkAmount: '',
        certificationType: '',
        oldBank: '1',
        bankCard: '',
        pbCode: '',
        openAccountBank: '',
        pbId: ''
      },
      dateVal: 120,
      formLabelWidth: '120px',
      rules: {
        messageCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        checkAmount: [
          { required: true, message: '请输入验证金', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.form2.bankCard = this.formInfo.bankCard
    this.form2.pbCode = this.formInfo.bankCard
    this.form2.bankName = this.formInfo.bankName
    this.form2.openAccountBank = this.formInfo.bankName
    this.form2.certificationType = this.formInfo.certificationType
    if (this.formInfo.certificationType === 0) {
      this.form.authenticationMethod = '0'
      this.disabledChange = true
    } else {
      this.disabledChange = false
    }
  },
  methods: {
    inputCheckAmount () {
      this.form2.checkAmount = this.form2.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    FundAccountBindBankCard (val, flag) { // 资金账户绑卡zbw
      RegisterLogisticsPayAndBindingCard.FundAccountBindBankCard(val).then(res => {
        if (res.code === 200) {
          // this.submitDisabled = false
          this.form2.pbId = res.data.pb_id
          if (flag === 'code') {
            this.getCountdown()
            this.countDownShow = true
            this.clickGetCodeFlag = true // 点击获取验证码
            this.$notify({
              message: '验证码获取成功',
              type: 'success'
            })
          }
          if (flag === 'money') {
            this.sentMonyShow = true
            this.$notify({
              message: '验证金获取成功',
              type: 'success'
            })
          }
        }
      })
    },
    FundAccountResendMessageCode (val) { // 量子绑卡四要素鉴权重发接口
      RegisterLogisticsPayAndBindingCard.FundAccountResendMessageCode(val).then(res => {
        if (res.code === 200) {
          this.getCountdown()
          this.countDownShow = true
          this.$notify({
            message: '验证码获取成功',
            type: 'success'
          })
        }
      })
    },
    closeDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    },
    getCode (form) {
      this.form2.authenticationMethod = this.form.authenticationMethod

      if (this.clickGetCodeFlag) {
        this.FundAccountResendMessageCode({pbId: this.form2.pbId, bankCard: this.form2.bankCard}) // 第二次获取
      } else {
        this.FundAccountBindBankCard(this.form2, 'code')
      }
    },
    getMony (form) {
      this.FundAccountBindBankCard(this.form2, 'money')
    },
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form2.authenticationMethod = this.form.authenticationMethod
          this.FundAccountAccountAuth(this.form2)
        }
      })
    },
    FundAccountAccountAuth (val) { // 资金账户绑卡账户鉴权接口
      RegisterLogisticsPayAndBindingCard.FundAccountAccountAuth(val).then(res => {
        if (res.code === 200) {
          this.$emit('shouldCloseDIalog', 'true')
          this.$notify({
            message: '账户升级成功',
            type: 'success'
          })
        } else {
          // if (Number(res.data.counts) > 3) {
          //   this.dialogVisible = true
          // }
        }
      })
    },
    getCountdown () {
      var surplusTimes = 120
      // 进入倒计时
      window.countdowns = setInterval(() => {
        surplusTimes--
        this.dateVal = surplusTimes
        if (surplusTimes <= 0) {
          clearInterval(window.countdowns)
          window.countdowns = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.common_remove_dialog{
  .el-dialog__header{
    span{
      font-weight: bold;
    }
  }
  .el-dialog__body{
    padding: 20px 0px 20px;
  }
  .el-dialog__footer{
    padding: 0;
    padding-bottom: 30px;
  }
  .el-input__inner {
    width: 150px !important;
  }
  .amountCss {
    .el-input__inner {
      width: 117px !important;
      margin-left: 20px;
      padding-right: 10px;
    }
    .el-input__suffix {
      right: 5px;
    }
    .el-input-group__append {
      padding: 0 10px;
    }
  }
  .messageCode {
    margin-left: 20px;
    .el-input__suffix {
      right: 20px;
    }
  }
  .getcode {
    font-size: 14px;
    color: #5677fc;
    cursor: pointer;
  }
  .btn {
    text-align: center;
    margin-top: 5px;
    .btn-main {
      width: 90px;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../../../style/base.less';

</style>
