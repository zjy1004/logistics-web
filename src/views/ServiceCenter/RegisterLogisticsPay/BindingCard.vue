<template>
  <div class="register public_card">
    <div class="card_main">
      <div class="card_con">

        <!-- 企业信息 -->
        <div>
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">绑定银行卡</span>
        </div>

        <el-form :inline="true" ref="form1" :model="form1" :rules="rules" label-width="150px !important" :disabled="disabledForm">
          <el-row>
            <el-col>
              <el-form-item label="重要提醒:" class="tip">
                <span class="tipSpan" style="color: #FF0000">提现银行开卡人信息必须和虚拟账户注册信息相同，否则无法提款！</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
              <el-form-item label="账户类型:" prop="certificationType">
                <el-radio-group v-model="form1.certificationType" :disabled='certificationTypeDisabled'>
                  <el-radio :label="1">对私</el-radio>
                  <el-radio :label="0">对公</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
              <el-form-item>
                <span class="tipSpan" style="color: #FF0000">注：选择并绑定账户类型后不可再修改，请慎重选择！</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
              <el-form-item label="认证方式" prop="authenticationMethod" v-show="show1">
                <el-select v-model="form1.authenticationMethod" placeholder="请选择认证方式" @change="changeAuthenticationMethod(form1.authenticationMethod)">
                  <el-option label="短信认证" value="1"></el-option>
                  <el-option label="小额转账认证" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
              <el-form-item v-show="show1">
                <span class="tipSpan" style="color: #FF0000">注：{{checkInfo}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="姓名:" prop="name" v-show="show1">
                <el-input v-model="form1.name" placeholder="请输入姓名" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="账户名称:" prop="account" v-show="show2">
                <el-input v-model="form1.account" placeholder="请输入账户名称" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="身份证号:" prop="idNumber" v-show="show1">
                <el-input v-model="form1.idNumber" placeholder="请输入身份证号" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="form1.phone" placeholder="请输入手机号" clearable :disabled="disabledForm" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
              <el-form-item>
                <span class="tipSpan" style="color: #FF0000">注：此手机号为银行卡预留手机号</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
              <el-form-item label="银行卡号:" prop="bankCardNumbers">
                <el-input v-model="form1.bankCardNumbers" placeholder="请输入银行卡号" clearable :disabled="disabledForm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
              <el-form-item>
                <span class="tipSpan" style="color: #FF0000">注：此账户将绑定为提款账户，请填写正确</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="银行名称:" prop="bankName">
                <!-- <el-input v-model="form1.bankName" placeholder="请输入银行名称" clearable @input="selectBankName(form1.bankName)"></el-input> -->
                <el-select v-model="form1.bankName" filterable placeholder="请输入银行名称" clearable @change="selectBankName(form1.bankName)">
                  <el-option
                    v-for="item in bankNameArr"
                    :key="item.bankName"
                    :label="item.bankName"
                    :value="item.bankName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="开户行区域:" required class="addressCss">
                <el-form-item label="" prop="province">
                  <el-select v-model="form1.province" placeholder="请选择省" clearable>
                    <el-option
                      v-for="(item, index) in this.areaOBj.areaPList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                <span>（省）</span>
                </el-form-item>

                <el-form-item label="" prop="city" v-if="cityShow">
                  <el-select v-model="form1.city" placeholder="请选择市" clearable>
                    <el-option
                      v-for="(item, index) in this.areaOBj.areaCList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                <span v-if="cityShow">（市）</span>
                </el-form-item>

                <el-form-item label="" prop="area" v-if="areaShow">
                  <el-select v-model="form1.area" placeholder="请选择区" clearable>
                    <el-option
                      v-for="(item, index) in this.areaOBj.areaQList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                <span v-if="areaShow">（区）</span>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="开户行:" prop="openAccountBank">
                <!-- <el-input v-model="form1.openAccountBank" placeholder="请输入开户行" clearable></el-input> -->
                <el-select v-model="form1.openAccountBank" filterable placeholder="请输入银行名称" clearable @change="changOpenAccountBank(form1.openAccountBank)">
                  <el-option
                    v-for="item in openAccountBankArr"
                    :key="item.openAccountBank"
                    :label="item.openAccountBank"
                    :value="item.openAccountBank">

                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=22>
              <el-form-item label="银联号:" prop="unionPayNumber">
                <el-input v-model="form1.unionPayNumber" placeholder="请输入银联号" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

        <el-form :inline="true" ref="form2" :model="form2" :rules="rules" label-width="150px !important">
          <el-row>
            <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
              <el-form-item label="验证码:" prop="messageCode" v-show="codeShow">
                <el-input v-model="form2.messageCode" placeholder="请输入验证码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
              <el-form-item label="" v-show="codeShow && !countDownShow">
                <span @click="getCode('form1')" class="getcode">免费获取验证码</span>
              </el-form-item>
              <el-form-item label="" v-show="countDownShow">
                <span class="getcode">发送成功（{{dateVal}}s）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="18" :sm="18" :md="18" :lg="8" :xl="8">
              <el-form-item label="到账金额:" prop="checkAmount" v-show="monyShow">
                <el-input @blur="inputCheckAmount" v-model="form2.checkAmount" placeholder="请输入到账金额" @keyup.native="inputCheckAmount" clearable><template slot="append">元</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="10" :lg="10" :xl="10">
              <el-form-item label="" v-if="monyShow && !sentMonyShow">
                <span @click="getMony('form1')" class="getcode">免费获取验证金</span>
              </el-form-item>
              <el-form-item label="" v-if="sentMonyShow">
                <span class="getcode">验证金已发送</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="重要提醒:" v-show="monyShow" class="tip">
                <span class="tipSpan" style="color: #FF0000">银行正在向您的账户支付小于1元的验证金额，请输入银行账户实际到账金额，为了保证账户安全，最多只能尝试3次</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </div>

        <!-- 按钮组 -->
        <div class="btn">
          <el-button class="btn-main" @click="submit('form2')" :disabled="submitDisabled">提交</el-button>
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
import VDialog from '@/components/Dialog/Dialog'
import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'

export default {
  data () {
    return {
      bankRefCode: '', // 银行关联码(开户行所用参数)
      sentMonyShow: false,
      checkInfo: '通过短信验证码验证身份',
      dateVal: 120, // 倒计时
      countDownShow: false, // 倒计时隐藏
      clickGetCodeFlag: false,
      certificationTypeDisabled: false,
      submitDisabled: true,
      cityShow: false,
      areaShow: false,
      disabledForm: false,
      dialogVisible: false,
      show1: true,
      show2: false,
      codeShow: true,
      monyShow: false,
      form1: {
        authenticationMethod: '1', // 认证方式
        superNetSilverNumber: '', // 超级网银号隐藏字段
        name: '', // 名字
        idNumber: '', // 身份证号
        phone: '', // 手机号
        certificationType: 1,
        bankCardNumbers: '', // 银行卡号
        bankName: '', // 银行名称
        openAccountBank: '', // 开户行
        unionPayNumber: '', // 银联号
        account: '', // 账户名称
        openAccountArea: '', // 开户行区域
        province: '',
        city: '',
        area: '',
        areaInfo: '',
        addressSaveData: {
          areaCode: '',
          areaInfo: '',
          cityCode: '',
          provinceCode: ''
        }
      },
      areaOBj: {
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [] // 区
      },
      form2: {
        checkAmount: '', // 验证金额
        messageCode: '', // 验证验证码
        pbId: '', // 验证银行卡的id
        pbCode: '' // 验证银行卡的卡号
      },
      bankNameArr: [], // 银行名称总和
      openAccountBankArr: [], // 开户行和银联号
      rules: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        bankCardNumbers: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          { min: 12, max: 23, message: '长度在 12至23位', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入银行名称', trigger: 'change' }
        ],
        openAccountArea: [
          { required: true, message: '请输入开户行区域', trigger: 'blur' }
        ],
        openAccountBank: [
          { required: true, message: '请输入开户行', trigger: 'change' }
        ],
        messageCode: [
          { min: 6, max: 6, message: '验证码长度为6位数', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        area: [{ required: true, message: '请选择区/县', trigger: 'change' }]
      }
    }
  },
  computed: {
    radioIndex () {
      return this.form1.certificationType
    },
    provinceCode () {
      return this.form1.province
    },
    cityCode () {
      return this.form1.city
    },
    areaCode () {
      return this.form1.area
    },
    openAccountArea () {
      return this.form1.openAccountArea
    },
    openAccountBank () {
      return this.form1.openAccountBank
    },
    bankName () {
      return this.form1.bankName
    }
  },
  watch: {
    bankName (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.openAccountBank = ''
        this.form1.province = ''
        this.form1.city = ''
      }
    },
    dateVal (newVal, oldVal) {
      if (newVal === 0) {
        this.countDownShow = false
      }
    },
    radioIndex (newVal, oldVal) {
      if (newVal === 1) {
        this.show1 = true
        this.codeShow = true
        this.show2 = false
        this.monyShow = false
        this.sentMonyShow = false
        console.log(this.dateVal)
        if (Number(this.dateVal) > 0 && Number(this.dateVal) < 120) {
          this.countDownShow = true
        } else if (Number(this.dateVal) === 0) {
          this.countDownShow = false
        }
      }
      if (newVal === 0) {
        this.show1 = false
        this.codeShow = false
        this.show2 = true
        this.monyShow = true
        this.sentMonyShow = false
        this.countDownShow = false
      }
    },
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.addressSaveData.provinceCode = newVal
        this.form1.openAccountArea = newVal

        this.areaOBj.areaPList.forEach(item => {
          if (this.form1.addressSaveData.cityCode !== item) {
            this.form1.city = ''
          } else {

          }
        })
        this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 1, bankRefCode: this.bankRefCode}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      // if (newVal === '') return
      if (newVal !== oldVal) {
        this.form1.addressSaveData.cityCode = newVal
        this.form1.openAccountArea = newVal

        this.areaOBj.areaCList.forEach(item => {
          if (this.form1.addressSaveData.areaCode !== item) {
            this.form1.area = ''
          }
        })
        this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 2, bankRefCode: this.bankRefCode}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.addressSaveData.areaCode = newVal
        this.form1.openAccountArea = newVal

        this.areaOBj.areaQList.forEach(item => {
          if (this.form1.addressSaveData.townCode !== item) {
            this.form1.town = ''
          }
        })
        this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 3, bankRefCode: this.bankRefCode}, 'town')
      }
    },
    openAccountArea (newVal, oldVal) {
      // this.QueryCardInfo({cityCode: newVal})
    },
    openAccountBank (newVal, oldVal) {
      if (newVal === '') {
        this.form1.unionPayNumber = ''
      }
    }
  },
  created () {
    this.QueryLzBandBankCardProvince()
    this.QueryBankInfo({bankName: ''})
    this.QueryFinaFundsAccountVo()
  },
  methods: {
    inputCheckAmount () {
      this.form2.checkAmount = this.form2.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || null
      // let value = newVal.substring(0, newVal.indexOf('.') + 3)
      // console.log(value)
      // this.$nextTick(() => {
      //   event.target.value = value
      // })
    },
    getCountdown () {
      var surplusTimes = 120
      // 进入倒计时
      window.countdowns = setInterval(() => {
        surplusTimes--
        this.dateVal = surplusTimes
        if (surplusTimes <= 0) {
          clearInterval(window.countdowns)
          window.countdowns = null
        }
      }, 1000)
    },
    changeAuthenticationMethod (val) {
      if (val === '1') {
        this.codeShow = true
        this.monyShow = false
        this.countDownShow = false
        this.sentMonyShow = false
        this.checkInfo = '通过短信验证码验证身份'
      }
      if (val === '0') {
        this.codeShow = false
        this.monyShow = true
        this.countDownShow = false
        this.checkInfo = '银行通过向您的账户支付小于1元的验证金额，验证银行卡信息'
      }
    },
    selectBankName (val) { // 选择银行名称带出超级网银号
      this.bankNameArr.forEach(item => {
        if (item.bankName === val) {
          this.form1.superNetSilverNumber = item.superNetSilverNumber
          this.bankRefCode = item.bankRefCode
        }
      })
    },
    changOpenAccountBank (val) {
      this.openAccountBankArr.forEach(item => {
        if (item.openAccountBank === val) {
          this.form1.unionPayNumber = item.unionPayNumber
        }
      })
    },
    getCode (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.codeShow = true
          if (this.clickGetCodeFlag) {
            this.FundAccountResendMessageCode({pbId: this.form2.pbId}) // 第二次获取
          } else {
            this.FundAccountBindBankCard(this.form1, 'code') // 第一次获取验证码
          }
        }
      })
    },
    getMony (form) {
      let validateProps = ['phone', 'bankCardNumbers', 'bankName', 'province', 'openAccountBank']
      let refForm = this.$refs[form]
      let flag = true
      Promise.all(validateProps.map(item => {
        return refForm.validateField(item, (valid) => {
          if (!valid) {
            // console.log('验证成功')
          } else {
            flag = false
            // console.log('验证失败')
          }
        })
      })).then(res => {
        if (flag) {
          this.FundAccountBindBankCard(this.form1, 'money')
        }
      })
    },
    agreeTerms () {
      let routes = this.$router.resolve({ name: 'Agreement', query: {type: 1} })
      window.open(routes.href, '_blank')
    },
    submit (form) {
      this.form2.certificationType = this.form1.certificationType
      this.form2.openAccountBank = this.form1.openAccountBank
      this.form2.phone = this.form1.phone
      this.form2.pbCode = this.form1.bankCardNumbers
      this.FundAccountAccountAuth(this.form2)
    },
    clickCancel () {
      this.dialogVisible = false
    },
    clickSure () {
      this.$router.go(0)
    },
    QueryLzBandBankCardProvince (val) { // 省
      RegisterLogisticsPayAndBindingCard.QueryLzBandBankCardProvince(val).then(res => {
        if (res.code === 200) {
          this.areaOBj.areaPList = res.data
        }
      })
    },
    QueryLzBandBankCardArea (val, flag) { // 市
      RegisterLogisticsPayAndBindingCard.QueryLzBandBankCardArea(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaOBj.areaPList = res.data
          }
          if (flag === 'city') {
            if (res.data === null || res.data.length === 0) {
              this.cityShow = false
            } else {
              this.cityShow = true
            }
            this.areaOBj.areaCList = res.data
          }
          if (flag === 'area') {
            if (res.data === null || res.data.length === 0) {
              this.areaShow = false
            } else {
              this.areaShow = true
            }
            this.areaOBj.areaQList = res.data
          }
        }
      })
    },
    QueryCardInfo (val) { // 获取量子绑卡根据省份或区域编码获取开户行和银联号
      RegisterLogisticsPayAndBindingCard.QueryCardInfo(val).then(res => {
        if (res.code === 200) {
          this.openAccountBankArr = res.data
        }
      })
    },
    QueryBankInfo (val) { // 获取量子绑卡查询银行名称和超级网银号隐藏字段
      RegisterLogisticsPayAndBindingCard.QueryBankInfo(val).then(res => {
        if (res.code === 200) {
          this.bankNameArr = res.data
        }
      })
    },
    QueryLzBandBankCardAreaAndUnionPay (val, flag) { // 获取量子绑卡省份以下列表和银联号
      RegisterLogisticsPayAndBindingCard.QueryLzBandBankCardAreaAndUnionPay(val).then(res => {
        if (res.code === 200) {
          if (res.data.dataType === '1') {
            if (flag === 'city') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.cityShow = false
                this.areaShow = false
              } else {
                this.cityShow = true
              }
              this.areaOBj.areaCList = res.data.areaCodeVoList
              this.openAccountBankArr = [] // 选择省份清空开户行
              this.form1.openAccountBank = '' // 选择省份清空开户行
            }
            if (flag === 'area') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.areaShow = false
              } else {
                this.areaShow = true
              }
              this.areaOBj.areaQList = res.data.areaCodeVoList
              this.openAccountBankArr = []// 选择市清空开户行
              this.form1.openAccountBank = '' // 选择省份清空开户行
            }
          }
          if (res.data.dataType === '2') {
            if (flag === 'city') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.cityShow = false
              } else {
                this.cityShow = true
              }
              this.cityShow = false
              this.areaShow = false
              this.openAccountBankArr = res.data.unionPayVoList
              this.form1.openAccountBank = '' // 选择省份清空开户行
            }
            if (flag === 'area') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.areaShow = false
              } else {
                this.areaShow = true
              }
              this.openAccountBankArr = res.data.unionPayVoList
            }
            if (flag === 'town') {
              this.openAccountBankArr = res.data.unionPayVoList
              this.form1.openAccountBank = ''// 选择县区清空开户行
            }
          }
          if (res.data.dataType === '') {
            // this.cityShow = false
            // this.areaShow = false
          }
        }
      })
    },
    FundAccountBindBankCard (val, flag) { // 资金账户绑卡zbw
      RegisterLogisticsPayAndBindingCard.FundAccountBindBankCard(val).then(res => {
        if (res.code === 444) {
          this.submitDisabled = false
        }
        if (res.code === 200) {
          this.disabledForm = true
          this.submitDisabled = false
          this.form2.pbId = res.data.pb_id
          this.clickGetCodeFlag = true // 点击获取验证码
          if (flag === 'code') {
            this.getCountdown()
            this.countDownShow = true

            this.$notify({
              message: '验证码获取成功',
              type: 'success'
            })
          }
          if (flag === 'money') {
            this.sentMonyShow = true
            this.$notify({
              message: '验证金获取成功',
              type: 'success'
            })
          }
        }
      })
    },
    FundAccountResendMessageCode (val) { // 量子绑卡四要素鉴权重发接口
      RegisterLogisticsPayAndBindingCard.FundAccountResendMessageCode(val).then(res => {
        if (res.code === 200) {
          this.getCountdown()
          this.countDownShow = true
          this.$notify({
            message: '验证码获取成功',
            type: 'success'
          })
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
          }, 1000)
        } else {
          if (Number(res.data.counts) > 3) {
            this.dialogVisible = true
          }
        }
      })
    },
    QueryFinaFundsAccountVo (val) { // 资金账户绑卡查询账户信息
      RegisterLogisticsPayAndBindingCard.QueryFinaFundsAccountVo(val).then(res => {
        if (res.code === 200) {
          if (res.data.certificationType === 0) {
            this.form1.certificationType = 0
            this.certificationTypeDisabled = true
          } else if (res.data.certificationType === 1) {
            this.form1.certificationType = 1
            this.certificationTypeDisabled = true
          } else if (res.data.certificationType === null) {

          }
          this.form1.name = res.data.name
          this.form1.idNumber = res.data.idNumber
          this.form1.phone = res.data.phone
          this.form1.account = res.data.companyName
        }
      })
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';

.register {
  display: flex;
  flex: 1;
  .tipSpan{
    font-size: 13px;
  }
  .card_form_title {
    margin-top: 20px;
  }
  .agreeTerms {
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    span {
      color: #ff0000;
      font-size: 14px;
    }
  }
  .getcode {
    font-size: 14px;
    color: #5677fc;
    cursor: pointer;
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
.register {
  .el-form--inline .el-input__inner{
    width: 220px;
  }
  .el-form--inline .el-select {
    width: 220px;
  }
  .addressCss {
    margin: 0px !important;
  }
  .tip {
    .el-form-item__label {
      color: #f00;
    }
  }
}
</style>
