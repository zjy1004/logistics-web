<template>
  <el-dialog :before-close="closeDialog" :show-close="false" class="withdrawd-deposit" :close-on-click-modal="closeClickModal" :width="width" title="提示" :visible.sync="dialogVisibleSelf">
    <div class="text">
      接银行紧急通知，银行相关系统正在进行升级，本系统资金相关功能暂时不可用，我们会在银行升级完成后恢复相关功能，给您带来的不便敬请谅解
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Tip',
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
    return {
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
    },
    clickSure () {
      this.$emit('click-cancel', 'cancel')
    },
    closeDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less">
@import '../../../../style/base.less';
.tip{
  .el-icon-question{
    font-size: 16px;
    position: relative;
    color: #333;
    .text{
      margin-left: 30px;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../../style/base.less';
.tip{
  .mixin-sc(14px;#333);
}
</style>
