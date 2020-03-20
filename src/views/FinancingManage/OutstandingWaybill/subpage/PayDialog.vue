<template>
  <el-dialog :before-close="closeDialog" class="pay-dialog" :close-on-click-modal="closeClickModal" :width="width" title="网上支付提示" :visible.sync="dialogVisibleSelf">
    <div class="con">
      <div class="load-con"><i class="el-icon-loading"></i></div>
      <div class="tip-text">
        <div>支付完成前，请不要关闭此支付验证窗口。</div>
        <div>支付完成后，请根据您支付的情况点击下面按钮。</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-warning" @click="hasProblem">支付遇到问题</el-button>
      <el-button class="btn-success" @click="payComplate">支付完成</el-button>
    </div>
  </el-dialog>
</template>

<script>
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
import FundsAccountAjax from '@/api/FundsAccount/FundsAccount'
export default {
  name: 'PayDialog',
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
    },
    merchantNo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // this.queryUrl()
    },
    queryUrl () {
      FundsAccountAjax.GetIframeUrl().then(response => {
        if (response.code === 200) {
          this.iframeSrc = response.data
        }
      })
    },
    hasProblem () {
      OutstandingWaybillAjax.QueryPayResult({merchantNo: this.merchantNo}).then(response => {
        if (response.code === 200) {
          // 1处理中 2成功 3失败
          this.$emit('click-sure-form', response.data)
        }
      })
    },
    payComplate () {
      // 18112811254170769345075
      OutstandingWaybillAjax.QueryPayResult({merchantNo: this.merchantNo}).then(response => {
        if (response.code === 200) {
          // 1处理中 2成功 3失败
          this.$emit('click-sure-form', response.data)
        }
      })
    },
    closeDialog (done) {
      this.$emit('click-cancel-form', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../style/base.less';
.pay-dialog{
  .mixin-sc(14px;#333);
  .con{
    display: flex;
    flex-direction: row;
    .load-con{
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        font-size: 30px;
      }
    }
    .tip-text{
      flex-grow: 4;
      text-indent: 10px;
      div{
        .mixin-sc(14px;#333);
      }
    }
  }
}
</style>
