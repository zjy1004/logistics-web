<template>
  <div class="ReceiptMoneyConfig">
    <div class="public_card">
      <h3 class="card_header">代收款费用配置</h3>
      <div class="card_main">
        <div class="btns">
          <span class="title">代收款费用</span>
        </div>
        <!-- 按比例收费 -->
        <div class="receiptMoney-top">
          <el-form :inline="true" ref="form" label-position="left" :model="form" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="3">
                <el-form-item>
                  <el-radio v-model="radio1" :disabled="switchVal || allDisabled" label="1">按比例收费</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="代收手续费率:" prop="logisticsCloud">
                  <el-input v-model="form.goodsCommissionRate" @keyup.native="inputLogistics()" :disabled="radio1 !== '1' || switchVal || allDisabled" placeholder="请输入代收手续费率">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 阶梯收费 -->
        <div class="receiptMoney">
          <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="rules" label-width="100px">
            <el-row  v-for="(item, index) in configList" :key="index">
              <el-col :span="3">
                <el-form-item >
                  <span style="margin-left: 5px;"></span>
                  <el-radio v-if="index === 0" :disabled="switchVal || allDisabled" v-model="radio1" label="2">阶梯价格收费</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <div class="configRow">
                  <span class="leftText">当货款为:</span>
                  <span class="leftPrice">{{item.goodsStart}}元</span>
                  <span style="margin-right: 10px;">至</span>
                  <el-form-item label="" prop="goodsEnd">
                    <el-input v-model="item.goodsEnd" maxlength="6" @input.native="validNum('goodsEnd', item.goodsEnd, index, $event)" :disabled="(radio1 === '1'|| switchVal) || (index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1) || allDisabled"></el-input>
                  </el-form-item>
                  <span>元</span>
                  <span style="margin-left: 5px; display: inline-block; width: 100px;">(不含{{item.goodsEnd}}元)</span>
                  <el-form-item label="代收手续费用:" prop="poundageFee">
                    <el-input v-model="item.poundageFee" :maxlength="poundageFeeMax" @input.native="validNum('poundageFee', item.poundageFee, index, $event)" :disabled="radio1 === '1'|| switchVal || allDisabled"></el-input>
                  </el-form-item>
                  <span style="margin-right: 20px;">元</span>
                  <el-button v-if="index === configList.length - 1" @click="addRow('add', item, index)" :disabled="radio1 === '1'|| switchVal || AddButtonDisabled || allDisabled">添加</el-button>
                  <el-button v-if="index !== 0 && index === configList.length - 1" @click="reduceRow(index)" :disabled="radio1 === '1'|| switchVal || allDisabled">删除</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">
                <el-form-item>
                  <el-radio v-if="false" v-model="radio1" label="2">阶梯价格收费</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <div class="configRow">
                  <span class="leftText" style="visibility:hidden">当货款为:</span>
                  <span class="leftPrice">{{endPrice}}元</span>
                  <span>及以上</span>
                  <el-input style="visibility:hidden; margin-right: 2px;"></el-input>
                  <span style="margin-left: 5px; display: inline-block; width: 100px;"></span>
                  <el-form-item label="代收手续费用:" prop="poundageFee">
                    <el-input v-model="endserviceCharge" :maxlength="poundageFeeMax" @input.native="validNum('endserviceCharge', endserviceCharge, null, $event)" :disabled="radio1 === '1'|| switchVal ||allDisabled"></el-input>
                  </el-form-item>
                  <span style="margin-right: 20px;">元</span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 开通驮付宝 -->
        <div class="btns">
          <span class="title">开通驮付宝</span>
         <span style="margin-left:10px;">
          <el-switch
            disabled
            @change="switchChange(switchVal)"
            v-model="switchVal">
          </el-switch>
          </span>
        </div>
        <div class="payOnline">
          <el-form :inline="true" ref="form" label-position="right" :model="form" label-width="100px">
            <el-row>
              <el-col :span="8" :offset="0">
                <el-form-item label="物流公司分成:" prop="logisticsProportion">
                  <el-input v-model="form.logisticsProportion" placeholder="请输入物流公司分成" @keyup.native="inputLogistics()" disabled>
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流云分成:" prop="logistics">
                  <el-input v-model="form.logistics" placeholder="请输入物流云分成" disabled>
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="bottom-btns">
          <el-button class="btn-main" v-if="editShow && !switchDisabled" @click="edit()">编辑</el-button>
          <el-button class="btn-main" v-if="!editShow" @click="save()">保存</el-button>
          <el-button class="btn-main" v-if="!editShow" @click="goback()">返回</el-button>
        </div>
      </div>
    </div>
    <!-- <v-dialog
      v-if="showErrorDialog"
      title="提示"
      :width="'486px'"
      mainText="下游终点和路由配置线路终点不一致，无法保存，请重新配置线路!"
      :closeClickModal="false"
      :showCancel="false"
      :dialogVisible="showErrorDialog"
      @click-cancel="showErrorDialog = false"
      @click-sure="showErrorDialog = false"
    /> -->
  </div>
</template>

<script>
// import JoinRouterConfigAjax from '@/api/RouterConfig/JoinRouteConfig'
import ReceiptMoneyConfig from '@/api/PersonalManage/ReceiptMoneyConfig'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'ReceiptMoneyConfig',
  data () {
    return {
      poundageFeeMax: 5,
      switchDisabled: '',
      onlinePaySwitch: '',
      logisticsId: '',
      allDisabled: true, // 全部内容禁用
      receiptDisabled: '',
      switchVal: false, // 按钮val
      editShow: true, // 编辑按钮显示
      dialogVisible: '',
      showErrorDialog: false,
      radio1: '1', // 单选val
      endserviceCharge: '', // 末尾代收手续费用
      // endPrice: '',
      form: {
        goodsCommissionRate: '', // 代收手续费率
        logisticsProportion: '', // 物流公司分成
        logistics: '' // 物流云分成
      },
      configList: [], // 阶梯配置集合
      rules: {
        // logisticsProportion: [{ required: true, message: '请输入物流公司分成', trigger: 'blur' }],
        // goodsEnd: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        // poundageFee: [{ required: true, message: '请输入代收手续费用', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // divideInto (newVal, oldVal) {
    //   this.form.logisticsCloud = 1000 - newVal
    // },
    switchVal (newVal, oldVal) { // 监听驮付宝开关
      if (newVal) {
        this.receiptDisabled = true
        this.onlinePaySwitch = 0
      } else {
        this.receiptDisabled = false
        this.onlinePaySwitch = 1
      }
    },
    radio1 (newVal, oldVal) { // 监听单选框
      if (newVal === '1') {
        this.configList = []
        this.addRow('first', null)
        this.endserviceCharge = ''
      } else {
        this.form.goodsCommissionRate = ''
      }
    }
  },
  computed: {
    // divideInto () {
    //   return this.form.logisticsProportion
    // },
    AddButtonDisabled () { // 全部禁用
      return this.configList.some(item => {
        if (item.goodsEnd === '' || item.poundageFee === '') {
          return true
        } else {
          return false
        }
      })
    },
    endPrice () { // 末尾左侧货款价格
      if (this.configList.length > 0) {
        let index = this.configList.length - 1
        let num = Number(this.configList[index].goodsEnd)
        if (num || num > 0) {
          return num
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      this.logisticsId = JSON.parse(userInfo).logisticsId
    }
    this.init()
  },
  methods: {
    init () {
      this.addRow('first', null)
      this.queryReceiptMoneyConfig(this.logisticsId)
    },
    inputLogistics () { // 代收手续费校验
      let newValue = this.form.goodsCommissionRate.toString().replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (newValue === '') {
        this.form.goodsCommissionRate = ''
      } else {
        if (newValue <= 100) {
          this.form.goodsCommissionRate = newValue
        } else {
          this.form.goodsCommissionRate = ''
        }
      }
    },
    clear () {
    },
    switchChange (val) { // 开关切换
      if (val) {
        this.receiptDisabled = true
      } else {
        this.receiptDisabled = false
      }
    },
    addRow (type, data, index) { // 增行
      // this.endPrice = ''
      if (type === 'first') {
        this.configList = []
        let rowItemObj = {
          goodsStart: 0,
          goodsEnd: '',
          poundageFee: ''
        }
        this.configList.push(rowItemObj)
        // this.queryReceiptMoneyConfig(this.logisticsId)
      }
      if (type === 'add') {
        this.endserviceCharge = ''
        if (data.goodsEnd > data.goodsStart) {
          let rowItemObj = {
            goodsStart: Number(data.goodsEnd),
            goodsEnd: '',
            poundageFee: ''
          }
          this.configList.push(rowItemObj)
        } else {
          this.$notify({
            message: '右侧货款金额需大于左侧！',
            type: 'error'
          })
          this.configList[index].goodsEnd = ''
          this.configList[index].poundageFee = ''
        }
      }
    },
    reduceRow (rowIndex) { // 减行
      this.endserviceCharge = ''
      this.configList = this.configList.filter((item, index) => {
        return rowIndex !== index
      })
    },
    queryReceiptMoneyConfig (val) { // 获取配置信息
      ReceiptMoneyConfig.queryReceiptMoneyConfig({logisticsId: val}).then(res => {
        if (res.code === 200) {
          let goodsAllList = res.data.goodsAllList
          if (goodsAllList.length > 1) {
            this.configList = goodsAllList.filter((item, index) => {
              return index !== goodsAllList.length - 1
            })
            this.endserviceCharge = goodsAllList[goodsAllList.length - 1].poundageFee
          } else {
            this.configList = []
            this.addRow('first', null)
            // this.endPrice = ''
          }
          this.radio1 = res.data.dividedType
          this.form.goodsCommissionRate = res.data.goodsCommissionRate
          this.form.logisticsProportion = res.data.logisticsProportion
          this.form.logistics = res.data.logistics
          if (res.data.onlinePaySwitch === 0) {
            this.switchVal = true
            this.switchDisabled = true
            this.onlinePaySwitch = 0
          } else {
            this.switchVal = false
            this.switchDisabled = false
            this.onlinePaySwitch = 1
          }
          // console.log(this.configList)
        }
      })
    },
    updateReceiptMoneyConfig (val) { // 修改配置信息请求
      ReceiptMoneyConfig.updateReceiptMoneyConfig(val).then(res => {
        if (res.code === 200) {
          this.editShow = true
          this.allDisabled = true
          this.endserviceCharge = ''
          this.queryReceiptMoneyConfig(this.logisticsId)
          this.$notify({
            message: '修改成功！',
            type: 'success'
          })
        } else {
          this.configList = []
          this.endserviceCharge = ''
          this.addRow('first', null)
        }
      })
    },
    edit () { // 编辑
      this.editShow = false
      this.allDisabled = false
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        if (valid && !this.validForm()) {
          if (this.switchVal) {
            this.onlinePaySwitch = 0
          } else {
            this.onlinePaySwitch = 1
          }
          let postForm = {
            companyId: this.logisticsId,
            dividedType: this.radio1,
            goodsCommissionRate: this.form.goodsCommissionRate,
            logistics: this.form.logistics,
            logisticsProportion: this.form.logisticsProportion,
            onlinePaySwitch: this.onlinePaySwitch,
            goodsAllList: []
          }
          if (this.radio1 === '1') {
            postForm.goodsAllList = []
          } else {
            this.form.goodsCommissionRate = ''
            postForm.goodsAllList = this.configList.map(item => {
              let obj = {
                goodsStart: item.goodsStart,
                goodsEnd: item.goodsEnd,
                poundageFee: item.poundageFee
              }
              return obj
            })
            let endObj = {
              goodsStart: this.endPrice,
              goodsEnd: -1,
              poundageFee: this.endserviceCharge
            }
            postForm.goodsAllList.push(endObj)
          }
          this.updateReceiptMoneyConfig(postForm)
        } else {
          this.$notify({
            message: '配置信息不完整，请完善后再保存',
            type: 'error'
          })
        }
      })
    },
    goback () { // 返回
      this.editShow = true
      this.allDisabled = true
      this.queryReceiptMoneyConfig(this.logisticsId)
    },
    validNum (flag, val, indexVal, event) { // 输入框校验
      if (flag === 'goodsEnd') {
        val = this.validateOnlyNum(val)
        this.$nextTick(() => {
          event.target.value = val
        })
      } else {
        if (val.indexOf('.') === -1) { // 没有点
          if (val.length > 5 || val.length === 5) {
            val = val.substr(0, 4)
          }
        } else {
          this.poundageFeeMax = 7
        }
        val = this.validateNumIncludePoint(val)
        // val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        // val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        if (val.indexOf('.') < 0 && val !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          val = parseFloat(val)
        }
        this.$nextTick(() => {
          event.target.value = val
        })
      }
    },
    validForm () { // 信息完整校验
      if (this.radio1 === '1') {
        return this.form.goodsCommissionRate === ''
      } else {
        return this.configList.some(item => {
          return item.goodsStart === '' || item.goodsEnd === '' || item.poundageFee === ''
        }) || this.endserviceCharge === ''
      }
    },
    clickSure () {
    },
    clickCancel () {
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.ReceiptMoneyConfig{
  display: flex;
  flex: 1;
  .card_main{
    padding: 20px 20px 40px 20px;
    .btns{
      height: 18px;
      line-height: 18px;
      margin-bottom: 15px;
      border-left: 3px solid #409eff;
      .title {
        margin-left: 10px;
        font-size: 14px;
        color: #000;
        font-weight: 700;
      }
    }
    .receiptMoney-top {
      width: 100%;
      height: 60px;
    }
    .receiptMoney{
      width: 100%;
      height: auto;
      .el-input {
        width: 80px!important;
      }
      .configRow {
        height: 34px;
        line-height: 34px;
        margin: 5px;
        // height: 100%;
        span {
          font-size: 13px;
        }
        .leftText {
          width: 70px;
          display: inline-block;
        }
        .leftPrice {
          margin-right: 10px;
          width: 80px;
          display: inline-block;
          text-align: right
        }
        .rightName {
          margin-left: 10px;
          width: 100px;
          display: inline-block;
          text-align: right;
        }
        i {
          font-size: 20px;
        }
      }
    }
    .payOnline {
      width: 100%;
      height: 100%;
    }
    .bottom-btns{
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.ReceiptMoneyConfig{
  .public_card {
    width: 100%;
  }
  .el-row{
    margin-bottom: 10px;
  }
  .el-form {
    width: 100%;
    height: auto;
  }
  .receiptMoney .el-form-item {
    margin: 0!important;
    .el-form-item__label {
      margin-top: -3px!important;
    }
  }
  // .receiptMoney .el-form-item__label {
  //   margin-top: 0!important;
  // }
  .receiptMoney .el-form--inline .el-input__inner {
    width: 80px!important;
  }
  .timeWrap {
    .el-input {
      width: 70%;
    }
  }
  .visible-icon{
    visibility:hidden;
  }
  .el-switch.is-checked .el-switch__core{
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
