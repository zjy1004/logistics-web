<template>
  <el-dialog :before-close="closeDialog" class="withdrawd-deposit" :close-on-click-modal="closeClickModal" :width="width" title="提现" :visible.sync="dialogVisibleSelf">
    <el-form :inline="false" ref="form" :model="form" :rules="rules" label-width="75px">
      <el-form-item label="提现金额:" prop="amount">
        <el-input @keyup.native="inputWithDraw" v-model="form.amount" placeholder="请输入提现金额" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <div class="text-con">
          <span class="text">最大可提现金额：{{sourceAmountVal}} </span>
          <i class="el-icon-question">
            <div class="tip-con">{{form.channelCollectionTypeName}}</div>
            <div class="tip-icon"></div>
          </i>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">确定提现</el-button>
      <el-button @click="clickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'WithdrawDeposit',
  props: {
    width: {
      type: String,
      default: '425px'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入提现金额！'))
      } else if (Number(value) > Number(this.sourceAmountVal)) {
        callback(new Error('提现金额不能大于可提金额！'))
      } else if (Number(value) === 0) {
        callback(new Error('提现金额需大于0！'))
      } else {
        callback()
      }
    }
    return {
      dialogVisibleSelf: this.dialogVisible,
      sourceAmountVal: '', // 源可提现金额
      form: {
        amount: '',
        channelCollectionTypeName: '根据银行相关规定：对公账户内余额，从资金到账日起开始计算，最快T+1个工作日可提现', // tip提示
        totalTranOutAmount: '' // '可提现余额'
      },
      rules: {
        amount: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryAccount()
    },
    queryAccount () {
      CommonAxios.WalletBankAccount().then(response => {
        if (response.code === 200) {
          let {data} = response
          // this.form.channelCollectionTypeName = data.channelCollectionTypeName || ''
          this.form.amount = data.accountCashSum || ''
          this.sourceAmountVal = data.accountCashSum || ''
        }
      })
    },
    inputWithDraw () {
      this.form.amount = this.validateNumIncludePoint(this.form.amount.toString())
    },
    clickSure () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          CommonAxios.Withdraw({amount: this.form.amount}).then(response => {
            if (response.code === 200) {
              this.$notify({
                type: 'success',
                message: '提现成功!'
              })
              this.$emit('click-sure-form', 'success')
            }
          })
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel-form', 'cancel')
    },
    closeDialog (done) {
      this.$emit('click-cancel-form', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less">
@import '../../../../style/base.less';
.withdrawd-deposit{
  .el-icon-question{
    font-size: 16px;
    position: relative;
    color: #333;
    .tip-con{
      display: none;
      position: absolute;
      top: -65px;
      left: -90px;
      width: 180px;
      height: 50px;
      line-height: 15px;
      overflow: hidden;
      padding: 5px 5px;
      background: #333;
      border-radius: 5px;
      color: #fff;
    }
    .tip-icon{
      display: none;
      position: absolute;
      top: -15px;
      left: 4px;
      .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
    }
  }
  .el-icon-question:hover{
    color: #4689f2;
    .tip-con,.tip-icon{
      display: block;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../../style/base.less';
.withdrawd-deposit{
  .mixin-sc(14px;#333);
  .text{
    margin-left: 30px;
    font-size: 14px;
  }
}
</style>
