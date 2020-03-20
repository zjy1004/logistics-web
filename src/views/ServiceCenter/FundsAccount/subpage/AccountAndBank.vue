<template>
  <div class="top-con">
    <div class="account-info">
      <div class="account-left">
        <div class="logistics-name">{{companyName}}</div>
        <div class="account">
          <span class="little-text">账户余额（元）：</span><span class="money-span">{{totalBalance}}</span>
          <i class="el-icon-refresh" @click="queryAccount"></i>
          <!-- <i class="el-icon-question">
            <div class="tip-con">{{channelCollectionTypeName}}</div>
            <div class="tip-icon"></div>
          </i> -->
        </div>
        <!-- <div class="account">
          <span class="little-text">可提余额（元）：</span><span class="money-span">{{totalTranOutAmount}}</span>
        </div> -->
      </div>
      <div class="account-right">
        <el-button class="btn-main cash" @click="cash">提现</el-button>
      </div>
    </div>
    <div class="bank-card-info">
      <!-- 量子注册成功且绑定银行卡，需要更换的 -->
      <div v-if="!bindBankShow && !bindUnComplate" class="changeBankCard">
        <div class="bank-left">
          <div class="bank-name">银行名称：</div>
          <div class="bankName-span" :title="bankName">{{bankName}}</div>
          <div class="card-name">银行卡号：</div>
          <div class="bank-card-num">{{bankCard}}</div>
        </div>
        <div class="bank-right">
          <el-button class="change-bank-card" @click="changeBankFn">更换银行卡</el-button>
        </div>
      </div>
      <!-- 量子注册成功，但是没有绑定银行卡 -->
      <div v-if="bindBankShow || bindUnComplate" class="bindBankCard" @click="goToBindCard">
        <span class="plus"></span>
        <div class="goToBindCard">绑定银行卡</div>
      </div>
    </div>
    <withdraw-deposit
      v-if="cashShow"
      :dialogVisible="cashShow"
      @click-cancel-form="cashShow = false"
      @click-sure-form="clickSure"
    />
    <change-bank
      v-if="changeBankShow"
      :dialogVisible="changeBankShow"
      @click-cancel-form="changeBankShow = false"
      @click-sure-form="clickChangeBankSure"
    />
    <v-dialog
      v-if="dialogVisible"
      title="更换银行卡"
      :width="'486px'"
      mainText="重新绑卡之前将解绑原有银行卡，是否确定更换银行卡？"
      :closeClickModal="false"
      :cancelBtn="'取消'"
      :sureBtn="'确定'"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="cancelCard"
    />
    <v-dialog
      v-if="bindCardShow"
      title="提示"
      :width="'486px'"
      :mainText="modalText"
      :closeClickModal="false"
      :cancelBtn="'再等等'"
      :sureBtn="'去绑卡'"
      :dialogVisible="bindCardShow"
      @click-cancel="bindCardShow = false"
      @click-sure="goBankCard"
    />
    <v-dialog
      class="resetDialog"
      v-if="ContinueVerificationShow"
      title="提示"
      :width="'486px'"
      :mainText="'该账户存在银行卡正在进行身份认证，是否继续'"
      :closeClickModal="false"
      :selfClose="true"
      @self-close="ContinueVerificationShow = false"
      :cancelBtn="'继续认证'"
      :sureBtn="'重新绑卡'"
      :dialogVisible="ContinueVerificationShow"
      @click-cancel="goContinueVerification"
      @click-sure="goBindCard"
    />

    <v-dialog
      v-if="changeCardDialogShow"
      title="提示"
      :width="'486px'"
      mainText="为保证账户安全系统，账户升级前的运单未提现完成前，无法进行更换银行卡操作"
      :closeClickModal="false"
      :sureBtn="'确定'"
      :dialogVisible="changeCardDialogShow"
      :showCancel="false"
      @click-sure="nextMethods"
      :closeShow='false'
      :closeByEsc="false"
    />
  </div>
</template>

<script>
import WithdrawDeposit from './WithdrawDeposit'
import CommonAxios from '@/api/Common/CommonAxios'
import ChangeBank from './ChangeBank'
import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'
import VDialog from '@/components/Dialog/Dialog'
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'

export default {
  name: 'AccountAndBank',
  props: {
    parentPage: {
      type: String,
      default: 'none'
    }
  },
  data () {
    return {
      changeCardDialogShow: false, // 查询用户是否可切换银行卡
      ContinueVerificationShow: false, // 继续认证
      ContinueVerificationFlag: 0,
      bindCardShow: false,
      pbId: '', // 解绑时所需
      dialogVisible: false, // 解绑银行卡
      bindBankShow: false, // 是否绑定银行卡
      cashShow: false,
      changeBankShow: false,
      // channelCollectionTypeName: '根据产品部的综合要求：差额的货款是今日完成支付的，暂未到账，请于明日提现。', // tip提示
      companyName: '', // 公司名称
      totalBalance: '', // 可用余额
      // totalTranOutAmount: '', // '可提现余额'
      bankCard: '', // 银行卡号
      bankName: '', // 银行开户行
      modalText: '注册成功，是否添加提现银行卡？',
      bindUnComplate: false // 是否已绑卡且未鉴权
    }
  },
  components: {
    WithdrawDeposit,
    ChangeBank,
    VDialog
  },
  created () {
    this.init()
  },
  methods: {
    // 查询用户是否可切换银行卡
    QueryCardStatus () {
      DealerAccountAjax.QueryCardStatus().then(response => {
        if (response.code === 200) {
          if (response.data) {
            this.dialogVisible = true
          } else {
            this.changeCardDialogShow = true
          }
        }
      })
    },
    goBindCard () {
      this.$router.push({name: 'BindingCard'})
    },
    goContinueVerification () {
      this.$router.push({name: 'ContinueVerification'})
    },
    goToBindCard () {
      if (this.ContinueVerificationFlag === 1) {
        this.ContinueVerificationShow = true
      }
      if (this.ContinueVerificationFlag === 2) {
        this.$router.push({name: 'BindingCard'})
      }
    },
    init () {
      this.queryAccount()
      this.queryBankInfo()
    },
    queryAccount () {
      CommonAxios.WalletBankAccount().then(response => {
        if (response.code === 200) {
          let {data} = response
          this.companyName = data.companyName || ''
          this.totalBalance = data.accountBalanceSum || ''
          // this.totalTranOutAmount = data.totalTranOutAmount || ''
          if (this.parentPage === 'dealer') {
            this.$emit('query-account-success', 'success')
          }
        }
      })
    },
    // 查询银行卡信息
    queryBankInfo () {
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          if (response.data === null) {
            this.bindBankShow = true
            this.ContinueVerificationFlag = 2
          } else {
            if (response.data.status === 1) { // 已经绑卡但未鉴权
              this.ContinueVerificationFlag = 1
              this.bindUnComplate = true
              // this.ContinueVerificationShow = true
            } else if (response.data.status === 0) { // 已经绑卡并鉴权
              this.ContinueVerificationFlag = 2
              this.bindUnComplate = false
              // this.ContinueVerificationShow = false
            }
            let {data} = response
            this.bankCard = this.fomatBankNum(data.bankCard)
            this.bankName = data.bankName || ''
            this.pbId = data.pbId
          }
        }
      })
    },
    // 解绑银行卡
    FundAccountUnBindBankCard (val) {
      RegisterLogisticsPayAndBindingCard.FundAccountUnBindBankCard(val).then(response => {
        if (response.code === 200) {
          this.dialogVisible = false
          this.$notify({
            message: '解绑成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({name: 'BindingCard'})
          }, 1000)
        } else {
          this.$notify({
            message: response.message,
            type: 'error'
          })
          setTimeout(() => {
            this.$router.push({name: 'BindingCard'})
          }, 1000)
        }
      })
    },
    // 点击提现
    cash () {
      let userInfo = sessionStorage.getItem('userInfo')
      let companyType = JSON.parse(userInfo).companyType
      if (companyType === 2) { // 经销商
        if (this.bindBankShow) { // 未绑卡
          this.modalText = '未绑定银行卡，是否立即绑卡？'
          this.bindCardShow = true
        } else {
          if (this.bindUnComplate) { // 已绑卡但未鉴权
            this.ContinueVerificationShow = true
          } else {
            this.$router.push({name: 'WithdrawalOperation'})
          }
        }
      } else if (companyType === 1) { // 物流公司
        if (this.bindBankShow) { // 未绑卡
          this.modalText = '未绑定银行卡，是否立即绑卡？'
          this.bindCardShow = true
        } else {
          if (this.bindUnComplate) { // 已绑卡但未鉴权
            this.ContinueVerificationShow = true
          } else {
            this.cashShow = true
          }
        }
      }
    },
    // 确定提现
    clickSure (result) {
      if (result === 'success') {
        this.cashShow = false
        this.queryAccount()
        this.$emit('withdraw-success', 'success')
      }
    },
    // 点击更换银行卡
    changeBankFn () {
      // this.changeBankShow = true
      // this.$router.push({name: 'BindingCard'})
      this.QueryCardStatus()
    },
    // 更换银行卡确定
    clickChangeBankSure () {
      this.changeBankShow = false
    },
    cancelCard () { // 解绑银行卡
      this.FundAccountUnBindBankCard({pbId: this.pbId})
    },
    clickCancel () { // 解绑银行卡取消
      this.dialogVisible = false
    },
    // 点击模态框去绑卡
    goBankCard () {
      this.$router.push({name: 'BindingCard'})
    },
    nextMethods () {
      this.changeCardDialogShow = false
    }
  }
}
</script>

<style lang="less">
@import '../../../../style/base.less';
.resetDialog {
  .dialog-footer {
    .el-button--default {
      background: #5677fc;
      .mixin-sc(16px;#fff);
    }
    .el-button--default:hover {
      background: #5677fc;
      .mixin-sc(16px;#fff);
    }
    .btn-main {
      background: #fff;
      .mixin-sc(16px;#5677fc);
    }
    .btn-main:hover {
      background: #fff;
      .mixin-sc(16px;#5677fc);
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../../style/base.less';
.top-con{
  .mixin-sc(14px;#333);
  height: 145px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  .account-info{
    display: flex;
    flex: 1;
    margin-right: 8px;
    flex-direction: row;
    justify-content: space-around;
    background: #fff;
    .account-left{
      display: flex;
      flex: 1;
      flex-direction: column;
      .logistics-name{
        width: 100%;
        height: 17px;
        line-height: 17px;
        .mixin-sc(16px;#292d33);
        text-indent: 30px;
        margin-top: 40px;
        margin-bottom: 27px;
        font-weight: bold;
      }
      .account{
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-indent: 30px;
        margin-bottom: 17px;
        .little-text{
          .mixin-sc(14px;#333);
        }
        .money-span{
          .mixin-sc(24px;#2b2f33);
          font-weight: bold;
        }
        .el-icon-refresh,.el-icon-question{
          font-size: 18px;
          text-indent: 0px;
          cursor: pointer;
          color: #747484;
          margin-left: 8px;
        }
        .el-icon-refresh{
          color: #5677fc;
        }
        .el-icon-question{
          position: relative;
          .tip-con{
            display: none;
            position: absolute;
            padding: 3px 5px;
            top: -60px;
            left: -70px;
            width: 170px;
            height: 50px;
            line-height: 15px;
            overflow: hidden;
            background: #333;
            border-radius: 5px;
            color: #fff;
          }
          .tip-icon{
            display: none;
            position: absolute;
            top: -10px;
            left: 5px;
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
    }
    .account-right{
      width: 110px;
      height: 145px;
      .cash{
        margin-top: 82px;
        margin-left: 10px;
        width: 72px;
        height: 32px;
        border-radius: 2px;
      }
    }
  }
  .bank-card-info{
    display: flex;
    // flex-grow: 1;
    flex: 1;
    border: 1px solid #eee;
    margin-left: 8px;
    flex-direction: row;
    justify-content: space-around;
    background: #fff;
    .bank-left{
      display: flex;
      flex: 1;
      flex-direction: column;
      .bank-name,.card-name{
        width: 100%;
        height: 20px;
        line-height: 20px;
        .mixin-sc(14px;#333);
        text-indent: 30px;
      }
      .bank-name{
        margin-top: 30px;
        margin-bottom: 2px;
      }
      .bankName-span{
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-indent: 30px;
        .mixin-sc(16px;#333);
        margin-bottom: 15px;
      }
      .bank-card-num{
        width: 100%;
        height: 20px;
        line-height: 20px;
        .mixin-sc(18px;#292d33);
        text-indent: 30px;
      }
    }
    .bank-right{
      width: 120px;
      height: 145px;
      .change-bank-con{
        text-indent: 80px;
      }
      .change-bank-card{
        .mixin-sc(14px;#5677fc);
        cursor: pointer;
        margin-top: 82px;
        border-radius: 2px;
      }
    }
    .changeBankCard {
      display: flex;
      flex: 1;
    }
    .bindBankCard {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #5677fc;
      cursor: pointer;
      .plus {
        width: 30px;
        height: 30px;
        background: url('../../../../image/plus.png') no-repeat center;
      }
      .goToBindCard {
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
}
</style>
