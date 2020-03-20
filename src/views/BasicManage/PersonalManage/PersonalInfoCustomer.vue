<template>
  <div class="creatCustomer public_card">
  <h3 class="card_header">客户管理</h3>
    <div class="card_main">
      <div class="card_con">
        <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="130px" :disabled="formDisabled">
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">基础信息</span>
        </div>
        <div class="creatCustomer_main">
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="客户名称:" prop="clientName">
                  <el-input v-model="form.clientName" placeholder="请输入客户名称" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="账户:" prop="account">
                  <el-input  maxlength="16" v-model="form.account" placeholder="请输入账户" @keyup.native="accountInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="联系人:" prop="userName">
                  <el-input v-model="form.userName" maxlength="5" @keyup.native="inputUserName" placeholder="请输入联系人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
              <el-form-item label="客户角色:">
                <el-radio-group v-model="form.clientType">
                  <el-radio :label="1">修理厂</el-radio>
                  <el-radio :label="2">经销商</el-radio>
                </el-radio-group>
              </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item v-if="false" label="服务物流公司:" prop="pkLogistics">
                  <el-select v-model="form.pkLogistics" placeholder="请选择服务物流公司" @change="ChangePkLogistics(form.pkLogistics)" clearable>
                    <el-option
                      v-for="(item, index) in pkLogisticsOptions"
                      :key="index"
                      :label="item.logisticsName"
                      :value="item.logisticsId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="2">
                <el-form-item label="服务站点:" prop="pkStation">
                  <el-select v-model="form.pkStation" placeholder="请选择所服务站点" clearable>
                    <el-option
                      v-for="(item, index) in pkStationOptions"
                      :key="index"
                      :label="item.stationName"
                      :value="item.stationId">
                    </el-option>
                  </el-select>
                </el-form-item>
                </el-col>
              </el-row>
            <el-row>
              <el-col :span="22" :offset="2">
              <el-form-item label="详细地址:" required>
                <el-form-item prop="province">
                  <el-select v-model="form.province" placeholder="请选择省" clearable>
                    <el-option
                      v-for="(item, index) in areaPList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                （省）
                <el-form-item prop="city">
                  <el-select v-model="form.city" placeholder="请选择市" clearable>
                    <el-option
                      v-for="(item, index) in areaCList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                （市）
                <el-form-item prop="area">
                  <el-select v-model="form.area" placeholder="请选择区" clearable>
                    <el-option
                      v-for="(item, index) in areaQList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                （区）
              </el-form-item>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="12" :offset="4">
              <el-form-item label="" prop="areaInfo">
                <el-input class="addressDetail" v-model="form.areaInfo" placeholder="请输入详细经营地址" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">业务信息</span>
        </div>
        <div class="creatCustomer_main">
          <el-row>
            <el-col :span="6" :offset="2">
              <el-form-item label="运费结算方式:" prop="freightSettlementMethod">
                <el-radio-group v-model="form.freightSettlementMethod">
                  <el-radio :key="index" :label=(item.generateKey) v-for="(item,index) in settlementMethodOption">{{item.generateVal}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
      </div>

    </div>
  </div>
</template>

<script>
import CustomerManageAjax from '@/api/CustomerManage/CustomerManage'
import SiteManageAjax from '@/api/SiteManage/SiteManage'

export default {
  data () {
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录账户！'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('账户名称6-16位！'))
      } else if (this.hasUserName) {
        callback(new Error('账户名称已存在！'))
      } else {
        callback()
      }
    }
    // let validateAddress = (rule, value, callback) => {
    //   if (value.provinceCode === '') {
    //     callback(new Error('请选择省！'))
    //   } else if (value.cityCode === '') {
    //     callback(new Error('请选择市！'))
    //   } else if (value.areaCode === '') {
    //     callback(new Error('请选择区/县！'))
    //   } else if (value.areaInfo === '') {
    //     callback(new Error('请输入详细经营地址！'))
    //   } else {
    //     callback()
    //   }
    // }
    let validatePhoneNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话！'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的联系电话！'))
      } else if (this.hasPhone) {
        callback(new Error('联系电话已存在！'))
      } else {
        callback()
      }
    }
    let validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系人！'))
      } else {
        callback()
      }
    }
    return {
      saveUserId: '',
      id: '',
      formDisabled: false,
      hasUserName: false,
      form: {
        accountId: '', // 账户id
        clientName: '', // 客户名称
        phone: '', // 联系电话
        account: '', // 账户
        userName: '', // 联系人
        clientType: 1, // 客户类型(角色)
        pkLogistics: '', // 物流公司id
        pkStation: '', // 所属站点id
        clientStatus: '', // 状态
        addressSaveData: {
          provinceCode: '', // 省
          cityCode: '', // 市
          areaCode: '', // 区        },
          areaInfo: ''
        },
        province: '',
        city: '',
        area: '',
        areaInfo: '',
        freightSettlementMethod: 1, // 运费结算方式
        onlinePaySwitch: false // 在线支付方式
      },
      settlementMethodOption: [], // 结算方式
      hasPhone: false,
      companyOptions: [],
      areaPList: [],
      areaCList: [],
      areaQList: [],
      pkStationOptions: [], // 服务站点
      pkLogisticsOptions: [], // 服务物流公司
      updateObj: {},
      updateShowArea: {
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      rules: {
        clientName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        userName: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        pkStation: [{ required: true, message: '请输入服务站点', trigger: 'change' }],
        // addressSaveData: [{ required: true, validator: validateAddress, trigger: 'change' || 'blur' }],
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        area: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getLogisticsList()
    this.getPkLogistics()
    // 查看详情或修改
    this.formDisabled = true
    this.updateInit()
    let freightSettlementMethod = JSON.parse(sessionStorage.getItem('userInfo')).settlementMethod
    if (freightSettlementMethod.length > 0) {
      freightSettlementMethod.forEach(item => {
        if (freightSettlementMethod.length === 3) {
          this.form.freightSettlementMethod = 1
        } else if (freightSettlementMethod.length === 2) {
          if (item.generateKey === 1) {
            this.form.freightSettlementMethod = 1
          } else {
            if (item.generateKey === 3) {
              this.form.freightSettlementMethod = 3
            }
          }
        } else if (freightSettlementMethod.length === 1) {
          this.form.freightSettlementMethod = item.generateKey
        } else {
          this.form.freightSettlementMethod = ''
        }
      })
    }
    this.settlementMethodOption = freightSettlementMethod
  },
  computed: {
    provinceCode () {
      return this.form.province
    },
    cityCode () {
      return this.form.city
    },
    areaCode () {
      return this.form.area
    },
    areaInfo () {
      return this.form.areaInfo
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.provinceCode = newVal
        this.areaPList.forEach(item => {
          if (this.form.addressSaveData.cityCode !== item) {
            this.form.city = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.cityCode = newVal
        this.areaCList.forEach(item => {
          if (this.form.addressSaveData.areaCode !== item) {
            this.form.area = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaCode = newVal
      }
    },
    areaInfo (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaInfo = newVal
      }
    }
  },
  methods: {
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
      this.hasUserName = false
    },
    inputPhone (evnet, value) {
      this.hasPhone = false
      this.form.phone = this.validateNum(this.form.phone)
    },
    inputUserName () {
      this.form.userName = this.validatePersonName(this.form.userName)
    },
    updateInit () {
      init.bind(this)()
      async function init () {
        await this.updateClientDetailsShow()
        let obj = {}
        obj.areaParentCode = 0
        this.QueryAreaList(obj, 'province')
        this.QueryAreaList({areaParentCode: this.updateShowArea.provinceCode}, 'city')
        this.QueryAreaList({areaParentCode: this.updateShowArea.cityCode}, 'area')
      }
    },
    ChangePkLogistics (val) {
      this.getPkLogistics({logisticsId: val})
    },
    changeProvince (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'city')
    },
    changeCity (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'area')
    },
    insertClientManage (val) { // 新增客户
      CustomerManageAjax.insertClientManage(val).then(res => {
        if (res.code === 200) {
          this.$router.push({name: 'CustomerManage'})
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
        }
      })
    },
    updateClientManage (val) { // 修改客户
      CustomerManageAjax.updateClientManage(val).then(res => {
        if (res.code === 200) {
          this.$router.push({name: 'CustomerManage'})
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    },
    async updateClientDetailsShow () { // 修改客户回显
      return new Promise((resolve, reject) => {
        CustomerManageAjax.updateClientDetailsShow().then(res => {
          if (res.code === 200) {
            this.form.accountId = res.data.accountId
            this.saveUserId = res.data.userId
            this.updateObj = res.data
            this.form.clientName = res.data.clientName
            this.form.phone = res.data.phone
            this.form.account = res.data.account || ''
            this.form.userName = res.data.userName
            this.form.clientType = res.data.clientType
            this.form.pkLogistics = res.data.pkLogistics
            this.form.pkStation = res.data.pkStation
            this.form.clientStatus = res.data.clientStatus
            this.form.freightSettlementMethod = Number(res.data.freightSettlementMethod)
            this.form.areaInfo = res.data.addressSaveData.areaInfo
            this.form.province = res.data.addressSaveData.provinceCode
            this.form.city = res.data.addressSaveData.cityCode
            this.form.area = res.data.addressSaveData.areaCode
            this.updateShowArea.provinceCode = res.data.addressSaveData.provinceCode
            this.updateShowArea.cityCode = res.data.addressSaveData.cityCode
            this.updateShowArea.areaCode = res.data.addressSaveData.areaCode
            if (res.data.onlinePaySwitch === 0) {
              this.form.onlinePaySwitch = true
            }
            if (res.data.onlinePaySwitch === 1) {
              this.form.onlinePaySwitch = false
            }
            resolve(res.data)
          }
        })
      })
    },
    getLogisticsList (val) { // 查询物流公司
      CustomerManageAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.pkLogisticsOptions = res.data
        }
      })
    },
    getPkLogistics (val) { // 查询物流公司、站点下拉框信息
      CustomerManageAjax.getPkLogistics(val).then(res => {
        if (res.code === 200) {
          this.pkStationOptions = res.data
        }
      })
    },
    QueryAreaList (val, flag) { // 省市
      SiteManageAjax.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaCList = res.data
          }
          if (flag === 'area') {
            this.areaQList = res.data
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.creatCustomer_main {
  .addressDetail .el-input__inner {
    width: 625px !important;
  }
}
</style>

<style lang="less" scoped>
.creatCustomer {
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
