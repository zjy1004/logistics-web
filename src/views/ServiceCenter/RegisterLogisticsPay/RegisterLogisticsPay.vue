<template>
  <div class="register public_card">
    <h3 class="card_header">驮付宝注册</h3>
    <div class="card_main">
      <div class="card_con">
        <div class="stepBar1" v-show="step1Show">
          <span class="step1">1.企业信息</span>
          <span class="step2">2.个人信息</span>
          <span class="step3">3.开通成功</span>
        </div>
        <div class="stepBar2" v-show="step2Show">
          <span class="step1">1.企业信息</span>
          <span class="step2">2.个人信息</span>
          <span class="step3">3.开通成功</span>
        </div>

        <!-- 企业信息 -->
        <div v-if="step1Show">
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">企业信息</span>
        </div>

        <el-form :inline="true" ref="form1" :model="form1" :rules="rules" label-width="150px !important">
          <el-row>
            <el-col :xs="18" :sm="18" :md="18" :lg="10" :xl="10">
              <el-form-item label="证照类型:" prop="registerType">
                <el-radio-group v-model="form1.registerType">
                  <el-radio :label="4">个人</el-radio>
                  <el-radio :label="3">个体工商营业执照</el-radio>
                  <el-radio :label="1">统一社会信用代码证</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item>
                <span class="tipSpan" style="color: #FF0000">注：请根据实际情况选择证照类型</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="18" :sm="18" :md="18" :lg="10" :xl="10">
              <el-form-item label="企业名称:" prop="companyName">
                <el-input v-model="form1.companyName" placeholder="请输入企业名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item>
                <span class="tipSpan" style="color: #FF0000">注：请正确填写企业名称，否则有可能影响提现</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=24>
              <el-form-item label="营业执照注册号:" prop="businessLicenseNumber" v-if="show1">
                <el-input v-model="form1.businessLicenseNumber" placeholder="请输入营业执照注册号" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=24>
              <el-form-item label="统一社会信用代码:" prop="socialCreditCode" v-if="show2">
                <el-input v-model="form1.socialCreditCode" placeholder="请输入统一社会信用代码" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        <el-row>
          <el-col :span=24>
          <el-form-item label="经营地址:" required class="addressCss">
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

            <el-form-item label="" prop="city">
              <el-select v-model="form1.city" placeholder="请选择市" clearable>
                <el-option
                  v-for="(item, index) in this.areaOBj.areaCList"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              <span>（市）</span>
            </el-form-item>

            <el-form-item label="" prop="area">
              <el-select v-model="form1.area" placeholder="请选择区" clearable>
                <el-option
                  v-for="(item, index) in this.areaOBj.areaQList"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              <span>（区）</span>
            </el-form-item>

            <el-form-item label="" prop="areaInfo">
              <el-input v-model="form1.areaInfo" placeholder="经营地址（详细地址）" clearable></el-input>
            </el-form-item>
          </el-form-item>
          </el-col>
        </el-row>

        </el-form>
        </div>

        <!-- 个人信息 -->
        <div v-if="step2Show">
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">个人信息</span>
        </div>
        <el-form :inline="true" ref="form2" :model="form1" :rules="rules" label-width="150px !important">

          <el-row>
            <el-col :span=24>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=24>
              <el-form-item label="身份证号:" prop="idNumber">
                <el-input v-model="form1.idNumber" @keyup.native="inputIdNumber" :placeholder="radioIndex !== 4 ? '请输入法人身份证号码' : '请输入身份证号码'" maxlength="18" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=24>
              <el-form-item label="姓名:" prop="name">
                <el-input v-model="form1.name" @keyup.native="inputName" :placeholder="radioIndex !== 4 ? '请输入法人姓名' : '请输入姓名'" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span=24>
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="form1.phone" @keyup.native="inputPhone" :placeholder="radioIndex !== 4 ? '请输入法人手机号' : '请输入手机号'" maxlength="11" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        <el-row>
          <el-col :span=24>
            <el-form-item>
              <el-checkbox v-model="isRead" class="agreeTerms">已阅读并同意<span @click="agreeTerms">《量子金福平台服务协议》</span></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="false">
          <el-col :span=24>
            <el-form-item label="手机号验证码:" prop="remeberPass">
              <el-input v-model="form1.areaInfo" placeholder="手机号验证码" clearable></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        </div>

        <!-- 按钮组 -->
        <div class="btn">
          <el-button class="btn-main" @click="nextStep('form1')" v-show="step1Show">下一步</el-button>
          <el-button class="btn-main" @click="previousStep()" v-show="step2Show">上一步</el-button>
          <el-button class="btn-main" @click="sure('form2')" v-show="step2Show" :disabled="!disabledBtn">确认开通</el-button>
        </div>

      </div>
    </div>

    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="信息提交后不可更改，是否确认提交信息？"
      :closeClickModal="false"
      :cancelBtn="'再想想'"
      :sureBtn="'确认开通'"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
import VDialog from '@/components/Dialog/Dialog'
import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'

export default {
  data () {
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        let tipText = this.radioIndex !== 4 ? '请输入法人手机号' : '请输入手机号'
        callback(new Error(tipText))
      } else if (!this.validatePhoneNum(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    let validateIdNumber = (rule, value, callback) => {
      if (value === '') {
        let tipText = this.radioIndex !== 4 ? '请输入法人身份证号码' : '请输入身份证号码'
        callback(new Error(tipText))
      } else if (value.length < 15) {
        callback(new Error('长度在 15 或 18 个字符'))
      } else if (!(this.validateIdentityCardNum(value).result)) {
        callback(new Error(this.validateIdentityCardNum(value).message))
      } else {
        callback()
      }
    }
    return {
      bolck: false,
      isRead: false,
      dialogVisible: false,
      step1Show: true,
      step2Show: false,
      show1: false,
      show2: false,
      form1: {
        companyName: '', // 企业名称
        businessLicenseNumber: '', // 营业执照注册号
        socialCreditCode: '', // 统一社会信用代码
        name: '', // 姓名
        idNumber: '', // 身份证号
        phone: '', // 手机号
        registerType: 4,
        businessAddress: '', // 经营地址
        businessAreaCode: '', // 经营区域
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
      province: '',
      city: '',
      area: '',
      areaInfo: '',
      rules: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        businessLicenseNumber: [
          { required: true, message: '请输入营业执照注册号', trigger: 'blur' },
          { min: 1, max: 15, message: '长度最大 15 个字符', trigger: 'blur' }
        ],
        socialCreditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度最大 18 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, validator: validateIdNumber, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        area: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入经营地址（详细地址）', trigger: 'blur' }]
      }
    }
  },
  computed: {
    disabledBtn () {
      return this.form1.idNumber && this.form1.name && this.form1.phone && this.isRead
    },
    radioIndex () {
      return this.form1.registerType
    },
    provinceCode () {
      return this.form1.province
    },
    cityCode () {
      return this.form1.city
    },
    areaCode () {
      return this.form1.area
    }
  },
  watch: {
    radioIndex (newVal, oldVal) {
      if (newVal === 4) { // 个人
        this.show1 = false
        this.show2 = false
      }
      if (newVal === 3) { // 个体工商营业执照
        this.show1 = true
        this.show2 = false
      }
      if (newVal === 1) { // 统一社会信用代码证
        this.show1 = false
        this.show2 = true
      }
      this.changePlaceholder(newVal)
    },
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.addressSaveData.provinceCode = newVal
        this.areaOBj.areaPList.forEach(item => {
          if (this.form1.addressSaveData.cityCode !== item) {
            this.form1.city = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.addressSaveData.cityCode = newVal
        this.areaOBj.areaCList.forEach(item => {
          if (this.form1.addressSaveData.areaCode !== item) {
            this.form1.area = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form1.addressSaveData.areaCode = newVal
        this.areaOBj.areaQList.forEach(item => {
          if (this.form1.addressSaveData.townCode !== item) {
            this.form1.town = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'town')
      }
    }
  },
  created () {
    let obj = {}
    obj.areaParentCode = 0
    this.QueryAreaList(obj, 'province')
  },
  methods: {
    inputIdNumber () {
      this.form1.idNumber = this.replaceIdNum(this.form1.idNumber)
    },
    inputName () {
      this.form1.name = this.replaceNbsp(this.form1.name)
    },
    inputPhone () {
      this.form1.phone = this.validateNum(this.form1.phone)
    },
    changePlaceholder (typeVal) {
      Object.keys(this.rules).forEach(item => {
        if (item === 'name') {
          this.rules[item][0].message = typeVal !== 4 ? '请输入法人姓名' : '请输入姓名'
        }
        // if (item === 'idNumber') {
        //   this.rules[item][0].message = typeVal !== 4 ? '请输入法人身份证号码' : '请输入身份证号码'
        // }
        // if (item === 'phone') {
        //   this.rules[item][0].message = typeVal !== 4 ? '请输入法人手机号' : '请输入手机号'
        // }
      })
    },
    agreeTerms () {
      let routes = this.$router.resolve({ name: 'Agreement', query: {type: 3} })
      window.open(routes.href, '_blank')
    },
    previousStep () {
      this.step1Show = true
      this.step2Show = false
      this.$nextTick(() => {
        this.$refs.form1.clearValidate()
      })
    },
    nextStep (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.step1Show = false
          this.step2Show = true
        }
      })
    },
    sure (form) {
      this.dialogVisible = true
    },
    clickCancel () {
      this.dialogVisible = false
    },
    clickSure () {
      if (!this.bolck) {
        if (this.form1.area !== '') {
          this.form1.businessAreaCode = this.form1.area
        } else if (this.form1.city !== '') {
          this.form1.businessAreaCode = this.form1.city
        } else if (this.form1.province !== '') {
          this.form1.businessAreaCode = this.form1.province
        }
        this.form1.businessAddress = this.form1.areaInfo
        this.FundAccountRegister(this.form1)
      }
      this.bolck = true
    },
    QueryAreaList (val, flag) { // 省市
      RegisterLogisticsPayAndBindingCard.SelectLzByAreaParentCode(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaOBj.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaOBj.areaCList = res.data
          }
          if (flag === 'area') {
            this.areaOBj.areaQList = res.data
          }
        }
      })
    },
    FundAccountRegister (val) { // 资金账户注册
      RegisterLogisticsPayAndBindingCard.FundAccountRegister(val).then(res => {
        this.bolck = false
        if (res.code === 200) {
          this.dialogVisible = false
          // this.$router.push({name: 'DealerAccount'})
          this.$notify({
            message: '注册成功！',
            type: 'success'
          })
          setTimeout(() => {
            // this.$router.go(0)
            this.$emit('regist-success')
          }, 1000)
        } else {
          this.$notify({
            message: res.data.message,
            type: 'error'
          })
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
  .stepBar1 {
    width: 349px;
    height: 28px;
    background: url(../../../image/1.png);
    .step1, .step2, .step3 {
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .step2, .step3 {
      .mixin-sc(12px, #666);
      margin-left: 10px;
    }
  }
  .stepBar2 {
    width: 349px;
    height: 28px;
    background: url(../../../image/2.png);
    .step1, .step2, .step3 {
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .step3 {
      .mixin-sc(12px, #666);
      margin-left: 10px;
    }
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
  .btn {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<style lang="less">
.register {
  .el-form--inline .el-input__inner{
    width: 185px;
  }
  .el-form--inline .el-select {
    width: 185px;
  }
  .addressCss {
    margin: 0px !important;
  }
}
</style>
