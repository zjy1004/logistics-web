<template>
  <el-dialog :before-close="closeDialog" class="change-bank" :close-on-click-modal="closeClickModal" :width="width" title="更换银行卡" :visible.sync="dialogVisibleSelf">
    <div class="tip-text">请联系客服：<span class="phone">18911250083</span>修改银行卡信息</div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FundsAccountAjax from '@/api/FundsAccount/FundsAccount'
export default {
  name: 'ChangeBank',
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
    clickSure () {
      this.$emit('click-cancel-form', 'cancel')
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
.change-bank{
  .el-icon-question{
    font-size: 16px;
  }
}
</style>
<style lang="less" scoped>
@import '../../../../style/base.less';
.change-bank{
  .mixin-sc(14px;#333);
  .tip-text{
    .mixin-sc(14px;#333);
    text-align: center;
  }
  .phone{
    .mixin-sc(14px;blue);
  }
}
</style>
