<template>
  <el-dialog :before-close="closeFormDialog" class="receipt-confirm-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form :inline="false" class="demo-form-inline" label-width="80px">
        <el-form-item class="date-item" label="结算金额：" prop="time">
          <span>{{receiptAmount}} 元</span>
        </el-form-item>
        <el-form-item class="date-item" label="回付运费金额：" prop="time">
          <span>{{sendReceivableFreight}} 元</span>
        </el-form-item>
        <el-form-item label='应结：'>
          <span>{{shouldKnot}}元</span>
        </el-form-item>
        <el-form-item>
          <span>是否确认抵扣？</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click.once="clickSure">是</el-button>
      <el-button @click="cancel">否</el-button>
      <el-button @click="check">查看</el-button>
    </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'ReceiptConfirm',
  props: {
    width: {
      type: String,
      default: '400px'
    },
    title: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    receiptAmount: {
      type: String,
      default: '0'
    },
    sendReceivableFreight: {
      type: String,
      default: ''
    },
    sureText: {
      type: String,
      default: '确认收款'
    }
  },
  data () {
    return {
      dialogVisibleSelf: this.dialogVisible
    }
  },
  computed: {
    shouldKnot () {
      return (Number(this.receiptAmount) - Number(this.sendReceivableFreight)).toFixed(2)
    }
  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    cancel () {
      this.$emit('cancel', 'cancel')
    },
    clickSure () {
      this.$emit('click-sure', 'sure')
    },
    check () {
      let routes = this.$router.resolve({name: 'MonthlyFreight'})
      window.open(routes.href, '_blank')
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
<style lang="less">
@import '../../../../style/base.less';
.receipt-confirm-dialog{
  .el-dialog__body{
    padding: 30px 40px;
    .el-form-item__label{
      width: 110px!important;
    }
  }
}
</style>
