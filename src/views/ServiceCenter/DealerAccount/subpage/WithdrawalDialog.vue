<template>
  <el-dialog :before-close="closeDialog" class="withdrawd-deposit" :close-on-click-modal="closeClickModal" :width="width" title="提现" :visible.sync="dialogVisibleSelf">
    <el-form :inline="false" ref="form" :model="form" label-width="110px">
      <el-form-item label="当前提现金额:" prop="amount">
        <span>￥{{this.propsObj.amount||0}}</span>
      </el-form-item>
      <el-form-item label="银行卡:">
        <span>{{this.propsObj.cardNum}}</span>
      </el-form-item>
      <el-form-item label="本次提现手续费:">
        <span>本次提现手续费以具体银行扣款为准</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clickCancel">取消</el-button>
      <el-button class="btn-main" :disabled = 'btnDisabled' @click="clickSure">确认提现</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'
export default {
  name: 'WithdrawalDialog',
  props: {
    propsObj: {
      type: Object,
      default: () => {}
    },
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
      btnDisabled: false, // 防止重复提交
      dialogVisibleSelf: this.dialogVisible,
      sourceAmountVal: '', // 源可提现金额
      form: {
        amount: ''
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
    },
    clickSure () {
      this.btnDisabled = true
      DealerAccountAjax.withdrawMoney(this.propsObj).then(response => {
        if (response.code === 40001) {
          this.$notify({
            type: 'error',
            message: response.message
          })
        }
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '提现成功!'
          })
          this.$emit('click-sure-form', 'success')
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
      left: -60px;
      width: 130px;
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
  .el-form-item__label {
    width: 110px!important;
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
