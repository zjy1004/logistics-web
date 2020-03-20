<template>
  <el-dialog :before-close="closeDialog" class="receipt-adjust-dialog" :close-on-click-modal="closeClickModal" :width="width" title="修改运单信息" :visible.sync="dialogVisibleSelf">
    <el-form :inline="false" ref="form" :model="financeWaybillFeeUpdateParam" :rules="rules" label-width="100px">
      <el-form-item label="运单号:" prop="amount">
        <span>{{this.propsObj.waybillNumber}}</span>
      </el-form-item>
      <el-form-item label="运费付费方:" prop="freightPayer">
        <el-radio-group @change="freightPayerChange" v-model="freightPayerLabel" :disabled="disabledRadio" size="mini" fill="#5677fc">
          <el-radio-button label="收货方"></el-radio-button>
          <el-radio-button label="发货方"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="money-item" label="代收货款:">
        <span class="money-con"><span class="noney">{{propsObj.actualGoods}}元
          </span>&nbsp;&nbsp;变更为</span>
        <el-input :disabled="compGoods" v-model="financeWaybillFeeUpdateParam.newGoods" @input.native="moneyChange($event, 'a', financeWaybillFeeUpdateParam.newGoods)" maxlength="6" placeholder="请输入代收货款" clearable></el-input>&nbsp;&nbsp;元
        <i class="tipText el-icon-warning">
          <div class="tip-con">填写金额为实际收取金额</div>
          <div class="tip-icon"></div>
        </i>
      </el-form-item>
      <el-form-item label="运费(发货方):">
        <span class="money-con"><span class="noney">{{propsObj.sendActualFreight}}元</span>&nbsp;&nbsp;变更为</span>
        <el-input :disabled="compSend" v-model="financeWaybillFeeUpdateParam.sendNewFreight" @input.native="moneyChange($event, 'b', financeWaybillFeeUpdateParam.sendNewFreight)" maxlength="6" placeholder="请输入运费" clearable></el-input>&nbsp;&nbsp;元
      </el-form-item>
      <el-form-item label="运费(收货方):">
        <span class="money-con"><span class="noney">{{propsObj.receiveActualFreight}}元</span>&nbsp;&nbsp;变更为</span>
        <el-input :disabled="compRec" v-model="financeWaybillFeeUpdateParam.receiveNewFreight" @input.native="moneyChange($event, 'c', financeWaybillFeeUpdateParam.receiveNewFreight)" maxlength="6" placeholder="请输入运费" clearable></el-input>&nbsp;&nbsp;元
      </el-form-item>
      <el-form-item class="remark-con" label="备注说明:" prop="remark">
        <el-input type="textarea" :rows="2" placeholder="备注说明" v-model="financeWaybillFeeUpdateParam.remark" maxlength="200">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">确定</el-button>
      <el-button @click="clickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'
export default {
  name: 'ReceiptAdjustDialog',
  props: {
    propsObjParent: {
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
  computed: {
    compGoods () {
      if (this.propsObj.financeStatus === 10 || this.propsObj.financeStatus === 1 || this.propsObj.financeStatus === 2 || this.propsObj.financeStatus === 3) { // 线下待收款 || 线下已收款
        return false
      } else {
        return true
      }
    },
    compSend () {
      if (this.propsObj.financeStatus !== 7) { // 非拒签
        if (this.propsObj.freightPayer === 2) { // 收货方付的
          return true
        } else {
          // if (this.propsObj.sendFreightFinanceStatus === 3 || this.propsObj.sendFreightFinanceStatus === 2) { // 已完成 || 财务已收款
          if (this.propsObj.sendFreightFinanceStatus === 3) { // 已完成
            return true
          } else {
            return false
          }
        }
      } else { // 拒签
        // if (this.propsObj.sendFreightFinanceStatus === 3 || this.propsObj.sendFreightFinanceStatus === 2) { // 已完成 || 财务已收款
        if (this.propsObj.sendFreightFinanceStatus === 3) { // 已完成
          return true
        } else {
          return false
        }
      }
    },
    compRec () {
      if (this.propsObj.financeStatus !== 7) { // 非拒签
        if (this.propsObj.freightPayer === 1) { // 发货方付的
          return true
        } else {
          // if (this.propsObj.receiveFreightFinanceStatus === 3 || this.propsObj.sendFreightFinanceStatus === 2) { // 已完成 || 财务已收款
          if (this.propsObj.receiveFreightFinanceStatus === 3) { // 已完成
            return true
          } else {
            return false
          }
        }
      } else { // 拒签
        // if (this.propsObj.receiveFreightFinanceStatus === 3 || this.propsObj.sendFreightFinanceStatus === 2) { // 已完成 || 财务已收款
        if (this.propsObj.receiveFreightFinanceStatus === 3) { // 已完成
          return true
        } else {
          return false
        }
      }
    }
  },
  data () {
    return {
      disabledRadio: false,
      propsObj: {},
      dialogVisibleSelf: this.dialogVisible,
      freightPayerLabel: this.propsObjParent.freightPayer === 1 ? '发货方' : '收货方',
      financeWaybillFeeUpdateParam: {
        freightPayerOld: this.propsObjParent.freightPayer, // 付费方
        freightPayerNew: this.propsObjParent.freightPayer,
        newGoods: this.propsObjParent.actualGoods, // 修改后货款
        oldGoods: this.propsObjParent.actualGoods, // 修改前货款页面实收
        receiveNewFreight: this.propsObjParent.receiveActualFreight, // 修改后运费(收货方)
        receiveOldFreight: this.propsObjParent.receiveActualFreight, // 修改前运费(收货方页面实收)
        remark: '', // 备注
        sendNewFreight: this.propsObjParent.sendActualFreight, // 修改后运费(发货方)
        sendOldFreight: this.propsObjParent.sendActualFreight, // 修改前运费(发货方页面实收)
        waybillId: this.propsObjParent.waybillId // 运单id
      },
      rules: {
        remark: [
          { required: true, message: '请输入备注!', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.propsObj = {...this.propsObjParent}
      this.disabledRadio = this.propsObj.freightPayer === 1
      // console.log(this.propsObj)
    },
    freightPayerChange (val) {
      if (val === '发货方') {
        this.financeWaybillFeeUpdateParam.freightPayerNew = 1
        this.propsObj.freightPayer = 1
        if (this.propsObjParent.freightPayer === 1) { // 原来就是发货方
          this.financeWaybillFeeUpdateParam.sendNewFreight = this.propsObjParent.sendActualFreight
          this.financeWaybillFeeUpdateParam.receiveNewFreight = this.propsObjParent.receiveActualFreight
        } else if (this.propsObjParent.freightPayer === 2) {
          this.financeWaybillFeeUpdateParam.sendNewFreight = this.propsObjParent.receiveActualFreight
          this.financeWaybillFeeUpdateParam.receiveNewFreight = this.propsObjParent.sendActualFreight
        }
      } else { // 收货方
        this.financeWaybillFeeUpdateParam.freightPayerNew = 2
        this.propsObj.freightPayer = 2
        if (this.propsObjParent.freightPayer === 1) {
          this.financeWaybillFeeUpdateParam.sendNewFreight = this.propsObjParent.receiveActualFreight
          this.financeWaybillFeeUpdateParam.receiveNewFreight = this.propsObjParent.sendActualFreight
        } else if (this.propsObjParent.freightPayer === 2) { // 原来就是收货方
          this.financeWaybillFeeUpdateParam.sendNewFreight = this.propsObjParent.sendActualFreight
          this.financeWaybillFeeUpdateParam.receiveNewFreight = this.propsObjParent.receiveActualFreight
        }
      }
    },
    moneyChange (event, inputType, value) {
      let val = value.match(/^\d*(\.?\d{0,1})/g)[0] || null
      this.$nextTick(() => {
        event.target.value = val
        if (inputType === 'a') {
          this.financeWaybillFeeUpdateParam.newGoods = val
        } else if (inputType === 'b') {
          this.financeWaybillFeeUpdateParam.sendNewFreight = val
        } else if (inputType === 'c') {
          this.financeWaybillFeeUpdateParam.receiveNewFreight = val
        }
      })
    },
    clickSure () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (Number(this.financeWaybillFeeUpdateParam.oldGoods) === Number(this.financeWaybillFeeUpdateParam.newGoods) && Number(this.financeWaybillFeeUpdateParam.receiveNewFreight) === Number(this.financeWaybillFeeUpdateParam.receiveOldFreight) && Number(this.financeWaybillFeeUpdateParam.sendNewFreight) === Number(this.financeWaybillFeeUpdateParam.sendOldFreight)) {
            this.$emit('confirm-sure', '')
          } else {
            this.saveFn()
          }
        }
      })
    },
    saveFn () {
      DealerAccountAjax.updateWaybillFee(this.financeWaybillFeeUpdateParam).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '修改成功!'
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
.receipt-adjust-dialog{
  .money-item{
    position: relative;
    .tipText{
      position: absolute;
    }
    .el-icon-warning{
      position: relative;
      font-size: 16px;
      text-indent: 0px;
      cursor: pointer;
      color: #747484;
      margin-left: 3px;
      margin-left: 10px;
      .tip-con{
        display: none;
        position: absolute;
        z-index: 1;
        padding: 3px 5px;
        top: -50px;
        left: -45px;
        width: 95px;
        height: 40px;
        line-height: 15px;
        text-align: left;
        // overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 4px;
        padding: 0px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-warning:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .el-dialog__body{
    padding: 15px 20px;
  }
  .el-form-item{
    margin-bottom: 10px;
    .el-form-item__label {
    width: 100px;
  }
  }
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
  .remark-con{
    .el-form-item__content{
      display: block;
      align-items: center;
    }
  }
  .el-input{
    width: 140px;
  }
  .el-textarea .el-textarea__inner{
    width: 270px;
  }
  .money-con{
    display: flex;
    align-items: center;
    width: 100px;
    height: 20px;
    line-height: 20px;
    .noney{
      display: inline-block;
      width: 50px;
      height: 20px;
      line-height: 20px;
    }
  }
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
  .el-radio-button:focus:not(.is-focus):not(:active){
    box-shadow: none!important;
  }
}
</style>
<style lang="less" scoped>
@import '../../../../style/base.less';
.receipt-adjust-dialog{
  .mixin-sc(14px;#333);
  .text{
    margin-left: 30px;
    font-size: 14px;
  }
}
</style>
