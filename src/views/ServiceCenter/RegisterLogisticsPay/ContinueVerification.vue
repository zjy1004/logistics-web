<template>
  <div class="ContinueVerification public_card">
    <div class="card_main">
      <div class="card_con">
        <div>
          <div class="card_form_title">
            <span class="title_line"></span>
            <span class="title">绑定银行卡</span>
          </div>

          <el-form :inline="true" ref="form" :model="form" label-width="150px !important">
            <el-row>
              <el-col :xs="18" :sm="18" :md="18" :lg="8" :xl="8">
                <el-form-item label="银行卡:" >
                  <span class="wordCss">{{this.form.pbCode}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="18" :sm="18" :md="18" :lg="8" :xl="8">
                <el-form-item label="开户行:">
                  <span class="wordCss">{{this.form.openAccountBank}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="18" :sm="18" :md="18" :lg="8" :xl="8">
                <el-form-item label="到账金额:" prop="checkAmount">
                  <el-input @blur="inputCheckAmount" v-model="form.checkAmount" placeholder="请输入到账金额" @keyup.native="inputCheckAmount" clearable><template slot="append">元</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="重要提醒:" class="tip">
                  <span class="tipSpan" style="color: #FF0000">银行正在向您的账户支付小于1元的验证金额，请输入银行账户实际到账金额，为了保证账户安全，最多只能尝试3次</span>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form>

          <!-- 按钮组 -->
          <div class="btn">
            <el-button class="btn-main" @click="submit('form')" :disabled="!submitDisabled">提交</el-button>
          </div>

        </div>

      </div>
    </div>

    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="输入错误次数太多，请点击重新绑卡"
      :closeClickModal="false"
      :sureBtn="'重新绑卡'"
      :showCancel="false"
      @click-cancel="clickCancel"
      :dialogVisible="dialogVisible"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
import CommonAxios from '@/api/Common/CommonAxios'
import VDialog from '@/components/Dialog/Dialog'

import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        certificationType: '', // 绑定银行卡类型0对公1对私
        messageCode: '', // 验证验证码
        phone: '', // 手机号
        checkAmount: '', // 验证金额
        pbId: '', // 验证银行卡的id
        pbCode: '', // 验证银行卡的卡号
        openAccountBank: '' // 开户行
      }
    }
  },
  created () {
    this.queryBankInfo()
  },
  computed: {
    submitDisabled () {
      return this.form.checkAmount
    }
  },
  components: {
    VDialog
  },
  methods: {
    clickCancel () {
      this.dialogVisible = false
    },
    clickSure () {
      this.$router.push({name: 'BindingCard'})
    },
    submit () {
      this.FundAccountAccountAuth(this.form)
    },
    inputCheckAmount () {
      this.form.checkAmount = this.form.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || null
      // this.form.checkAmount = this.form.checkAmount.substring(0, this.form.checkAmount.indexOf('.') + 3)
      // console.log(value)
      // this.$nextTick(() => {
      //   event.target.value = value
      // })
    },
    // 查询银行卡信息
    queryBankInfo () {
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          if (response.data === null) {
          } else {
            let {data} = response
            this.form.pbCode = data.bankCard || ''
            this.form.openAccountBank = data.bankName || ''
            this.form.pbId = data.pbId
          }
        }
      })
    },
    FundAccountAccountAuth (val) { // 资金账户绑卡账户鉴权接口
      RegisterLogisticsPayAndBindingCard.FundAccountAccountAuth(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            message: '绑卡成功',
            type: 'success'
          })
          setTimeout(() => {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if (userInfo && userInfo.companyType === 1) { // 物流公司
              this.$router.push({name: 'FundsAccount', query: {bindBankSuccess: 1}})
            } else if (userInfo.companyType === 2) { // 经销商
              this.$router.push({name: 'DealerAccount', query: {bindBankSuccess: 1}})
            }
            // this.$router.go(-1)
          }, 1000)
        } else {
          if (Number(res.data.counts) > 3) {
            this.dialogVisible = true
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.ContinueVerification {
  display: flex;
  flex: 1;
  .tipSpan{
    font-size: 13px;
  }
  .btn {
    text-align: center;
    margin-top: 20px;
    .btn-main {
      width: 90px;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>

<style lang="less">
.ContinueVerification {
  .tip {
    .el-form-item__label {
      color: #f00;
    }
  }
  .wordCss {
    color: #606266;
  }
}
</style>
