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
              <el-col :span="6" :offset="1">
                <el-form-item label="客户名称:" prop="clientName">
                  <el-input :disabled="formDisabled" v-model="form.clientName" placeholder="请输入客户名称" maxlength="10" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input :disabled="formDisabled" v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6" :offset="1">
                <el-form-item label="登录账户:" prop="account">
                  <el-input :disabled="formDisabled"  maxlength="16" v-model="form.account" placeholder="请输入账户" @keyup.native="accountInput" clearable></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系人:" prop="userName">
                  <el-input :disabled="formDisabled" v-model="form.userName" maxlength="5" @keyup.native="inputUserName" placeholder="请输入联系人" clearable></el-input>
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
                <el-col :span="6" :offset="1">
                  <el-form-item label="服务站点:" prop="pkStation">
                    <el-select v-model="form.pkStation" @change="stationChange" placeholder="请选择所服务站点" clearable>
                      <el-option
                        v-for="(item, index) in pkStationOptions"
                        :key="index"
                        :label="item.stationName"
                        :value="item.stationId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="配送线路:" prop="pkLine">
                    <el-select v-model="form.pkLine" placeholder="请选择配送线路" clearable>
                      <el-option
                        v-for="(item, index) in pkLineOptions"
                        :key="index"
                        :label="item.lineName"
                        :value="item.lineId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row>
              <el-col :span="22" :offset="1">
              <el-form-item label="经营地址:" required>
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
            <el-col :span="12" :offset="3">
              <el-form-item label="" prop="areaInfo">
                <el-input :disabled="formDisabled" class="addressDetail" v-model="form.areaInfo" placeholder="请输入详细经营地址（如街道门牌号）" clearable></el-input>
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
            <el-col :span="6" :offset="1">
              <el-form-item label="运费结算方式:" prop="freightSettlementMethod">
                <el-radio-group v-model="form.freightSettlementMethod">
                  <el-radio :key="index" :label=(item.generateKey) v-for="(item,index) in settlementMethodOption">{{item.generateVal}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">开通驮付宝</span>
          <span style="margin-left:20px;">
          <el-switch
            v-model="form.onlinePaySwitch">
          </el-switch>
          </span>
        </div> -->

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">支付信息</span>
        </div>
        <div class="creatCustomer_main">
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item label="银行卡卡号:" prop="bankCard">
                <el-input class="longInput" :disabled="formDisabled" v-model="form.bankCard" placeholder="请输入银行卡卡号" maxlength="19" @keyup.native="inputBankCard(form.bankCard)" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-form-item label="开户行名称:" prop="bankName">
                <el-input  class="longInput" v-model="form.bankName" :disabled="formDisabled" placeholder="请输入开户行名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-form-item label="户主姓名:" prop="name">
                <el-input v-model="form.name" :disabled="formDisabled" placeholder="请输入户主姓名" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="this.$route.query.type !== 'add' && this.clientType === 2">
          <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">账号信息</span>
        </div>
        <el-form :inline="true" ref="newForm" :model="newForm" :rules="rules2" label-width="130px" :disabled="formDisabled">
        <div class="creatCustomer_main">
          <el-row v-if="this.$route.query.type === 'edit'">
            <el-col :span="5" :offset="1">
              <el-form-item label="登录账号:" prop="loginAccount">
                <el-input class="longInput" :disabled="formDisabled" v-model="newForm.loginAccount" placeholder="请输入登录账号" maxlength="16" @keyup.native="loginAccountInput" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="" prop="">
                <el-button @click="addRelevance('newForm')">添加关联</el-button>&emsp;
                <el-button @click="newAndRelevance('newForm')">新建并关联</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22" :offset="1">
              <div class="costTable">
                <el-table
                  :data="accountTableData"
                  style="width: 100%"
                  stripe
                  border>
                  <el-table-column
                    min-width="10%"
                    prop="rowNum"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    min-width="20%"
                    prop="loginAccount"
                    label="登录账号">
                    <template slot-scope="scope">
                      <span>{{scope.row.loginAccount}}<i style="margin-left: 10px; color: #5677fc; font-size: 18px" v-if="!scope.row.closeDisabled" class="iconfont icon--zijinanquan"></i></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    min-width="20%"
                    prop="platformCode"
                    label="客户编码">
                  </el-table-column>
                  <el-table-column
                    v-if="this.$route.query.type === 'edit'"
                    min-width="30%"
                    label="操作">
                    <template slot-scope="scope">
                      <a href="javascript:;" type="text" size="small" @click="removeRelevance(scope.row.clientAccountId)">解除关联</a>
                      <!-- <a href="javascript:;" type="text" size="small" @click="closeOnlinePay(scope.row)">关闭驮付宝</a> -->
                      <el-button :disabled="scope.row.closeDisabled" type="text" @click="closeOnlinePay(scope.row)">关闭驮付宝</el-button>
                      <el-button :disabled="scope.row.fundsAccountDisabled" type="text" @click="setFundsAccount(scope.row)">设置为资金帐号</el-button>
                      <!-- <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.clientStatus ? '启用': '禁用'}}</a>
                      <a class="enable" href="javascript:;" type="text" size="small" @click="onlinePayChange(scope.row)">{{scope.row.onlinePaySwith ? '开通驮付宝': '关闭驮付宝'}}</a> -->
                  </template>
                  </el-table-column>
                </el-table>
            </div>
            </el-col>
          </el-row>
        </div>
        </el-form>
        </div>

      </el-form>
      </div>

      <div class="card_btn">
        <div class="search-btn-con">
        <!-- <el-button v-if="!formDisabled && disableBtn" class="btn-main" style="margin-right: 70px;" @click="clickReset()">重置密码</el-button> -->
        <el-button v-if="!formDisabled" class="btn-main" @click="save('form')">保存</el-button>
        <el-button class="btn-main" @click="goBack">返回</el-button>
        <el-button v-if="disableBtn" style="margin-left: 25px;" class="btn-main" @click="disable">{{btnType}}</el-button>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="您确定要重置密码？"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel('dialogVisible')"
      @click-sure="clickSure('dialogVisible')"
    />
    <v-dialog
      v-if="addRelevanceShow"
      title="提示"
      :width="'486px'"
      :closeShow="false"
      mainText="添加关联成功"
      :closeClickModal="false"
      :dialogVisible="addRelevanceShow"
      :showCancel="false"
      @click-sure="clickSure('addRelevanceShow')"
    />
    <v-dialog
      v-if="removeRelevanceShow"
      title="提示"
      :closeShow="false"
      :width="'486px'"
      mainText="解除关联成功"
      :closeClickModal="false"
      :dialogVisible="removeRelevanceShow"
      :showCancel="false"
      @click-sure="clickSure('removeRelevanceShow')"
    />
    <v-dialog
      v-if="newAndRelevanceShow"
      title="新建并关联成功"
      :centerVal="true"
      :closeShow="false"
      :width="'486px'"
      :mainText="'登录账号：' + dialogLoginAccount + '\xa0\xa0\xa0' + '客户编码：' + dialogAccountId + '\xa0\xa0\xa0' + '默认密码：' + dialogDefaultPwd"
      :closeClickModal="false"
      :dialogVisible="newAndRelevanceShow"
      :showCancel="false"
      @click-sure="clickSure('newAndRelevanceShow')"
    />
    <v-dialog
      v-if="closeOnlinePayShow"
      title="提示"
      :width="'486px'"
      :closeShow="false"
      mainText="你正在进行关闭驮付宝操作，关闭后该客户运单不再使用驮付宝线上清分结算，是否确定操作?"
      :closeClickModal="false"
      :dialogVisible="closeOnlinePayShow"
      @click-cancel="clickCancel('closeOnlinePayShow')"
      @click-sure="clickSure('closeOnlinePayShow')"
    />
    <v-dialog
      v-if="setFundsAccountShow"
      title="提示"
      :closeShow="false"
      :width="'486px'"
      :mainText="'资金账号将变更为：' + dialogCurrentLoginAccount + ',' + '是否确定操作?'"
      :closeClickModal="false"
      :dialogVisible="setFundsAccountShow"
      @click-cancel="clickCancel('setFundsAccountShow')"
      @click-sure="clickSure('setFundsAccountShow')"
    />
  </div>
</template>

<script>
import CustomerManageAjax from '@/api/CustomerManage/CustomerManage'
import VDialog from '@/components/Dialog/Dialog'
import SiteManageAjax from '@/api/SiteManage/SiteManage'
import LoginAjax from '@/api/Login/Login'

export default {
  data () {
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录账号！'))
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
      dialogLoginAccount: '',
      dialogAccountId: '',
      dialogDefaultPwd: '',
      dialogCurrentLoginAccount: '',
      setFundsAccountShow: false,
      closeOnlinePayShow: false,
      newAndRelevanceShow: false,
      addRelevanceShow: false,
      removeRelevanceShow: false,
      closeParam: {},
      setParam: {},
      dialogVisible: false,
      saveUserId: '',
      id: '',
      clientType: '',
      formDisabled: false,
      disableBtn: false,
      hasUserName: false,
      btnType: '',
      form: {
        accountId: '', // 账户id
        clientName: '', // 客户名称
        phone: '', // 联系电话
        // account: '', // 账户
        // loginAccount: '',
        userName: '', // 联系人
        clientType: 1, // 客户类型(角色)
        pkLogistics: '', // 物流公司id
        pkStation: '', // 所属站点id
        pkLine: '', // 配送线路id
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
        // onlinePaySwitch: false, // 在线支付方式
        bankCard: '', // 银行卡卡号
        bankName: '', // 开户行名称
        name: '', // 户主姓名
        bankCardId: '' // 银行卡ID
      },
      newForm: {
        loginAccount: ''
      },
      settlementMethodOption: [], // 结算方式
      hasPhone: false,
      companyOptions: [],
      areaPList: [],
      areaCList: [],
      areaQList: [],
      pkStationOptions: [], // 服务站点
      pkLineOptions: [], // 配送线路
      pkLogisticsOptions: [], // 服务物流公司
      updateObj: {},
      updateShowArea: {
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      accountTableData: [],
      rules: {
        clientName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        userName: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        pkStation: [{ required: true, message: '请输入服务站点', trigger: 'change' }],
        pkLine: [{ required: true, message: '请选择配送线路', trigger: 'change' }],
        // addressSaveData: [{ required: true, validator: validateAddress, trigger: 'change' || 'blur' }],
        // account: [
        //   { required: true, validator: validateAccount, trigger: 'blur' }
        // ],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        area: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址（如街道门牌号）', trigger: 'blur' }]
      },
      rules2: {
        loginAccount: [
          { validator: validateAccount, trigger: 'blur' }
        ]
      }
    }
  },
  components: { VDialog },
  created () {
    this.getLogisticsList()
    this.getPkLogistics()
    // 查看详情或修改
    let type = this.$route.query.type
    if (type === 'check') {
      this.formDisabled = true
      this.disableBtn = false
    } else if (type === 'add') {
      this.formDisabled = false
      this.disableBtn = false
    } else if (type === 'edit') {
      this.formDisabled = false
      this.disableBtn = true
    } else {
      this.formDisabled = false
      this.disableBtn = false
    }
    let id = this.$route.query.id
    this.clientType = this.$route.query.clientType
    if (id !== undefined && id !== '') {
      this.id = id
      this.updateInit(id)
      if (this.clientType === 2) {
        this.getRelevanceList(id)
      }
    } else {
      this.updateInit()
    }
    let freightSettlementMethod = JSON.parse(sessionStorage.getItem('userInfo')).settlementMethod
    if (freightSettlementMethod.length > 0) {
      this.form.freightSettlementMethod = freightSettlementMethod[0].generateKey
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
    clickSure (flag) { // 弹框确定
      if (flag === 'dialogVisible') {
        this.resetPassword(this.saveUserId)
        this.dialogVisible = false
      }
      if (flag === 'addRelevanceShow') {
        this.addRelevanceShow = false
        this.getRelevanceList(this.id)
      }
      if (flag === 'newAndRelevanceShow') {
        this.newAndRelevanceShow = false
        this.getRelevanceList(this.id)
      }
      if (flag === 'removeRelevanceShow') {
        this.removeRelevanceShow = false
        this.getRelevanceList(this.id)
      }
      if (flag === 'closeOnlinePayShow') {
        this.closeOnlinePayAjax(this.closeParam)
      }
      if (flag === 'setFundsAccountShow') {
        this.setFundsAccountAjax(this.setParam)
      }
    },
    clickCancel (flag) { // 弹框取消
      if (flag === 'dialogVisible') {
        this.dialogVisible = false
      }
      if (flag === 'closeOnlinePayShow') {
        this.closeOnlinePayShow = false
      }
      if (flag === 'setFundsAccountShow') {
        this.setFundsAccountShow = false
      }
    },
    clickReset () {
      this.dialogVisible = true
    },
    addRelevance (newForm) { // 添加关联
      this.$refs[newForm].validate((valid) => {
        if (valid) {
          let param = {
            clientId: this.id,
            loginAccount: this.newForm.loginAccount
          }
          CustomerManageAjax.addRelevance(param).then(res => {
            if (res.code === 200) {
              this.addRelevanceShow = true
            }
          })
        }
      })
    },
    newAndRelevance (newForm) { // 新建并关联
      this.$refs[newForm].validate((valid) => {
        if (valid) {
          let param = {
            clientId: this.id,
            loginAccount: this.newForm.loginAccount
          }
          CustomerManageAjax.newAndRelevance(param).then(res => {
            if (res.code === 200) {
              this.dialogLoginAccount = res.data.account
              this.dialogAccountId = res.data.platformCode
              this.dialogDefaultPwd = res.data.pwd
              setTimeout(() => {
                this.newAndRelevanceShow = true
              }, 100)
            }
          })
        }
      })
    },
    removeRelevance (val) { // 解除关联
      let param = {
        clientAccountId: val
      }
      CustomerManageAjax.removeRelevance(param).then(res => {
        if (res.code === 200) {
          this.removeRelevanceShow = true
        }
      })
    },
    closeOnlinePay (val) { // 关闭驮付宝
      this.closeParam = {
        clientId: this.id,
        currentClearingFunds: val.currentClearingFunds,
        fundsAccountFlag: 2
      }
      this.closeOnlinePayShow = true
    },
    closeOnlinePayAjax (val) { // 关闭驮付宝请求
      CustomerManageAjax.setOrCancelFundsAccount(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '关闭成功'
          })
          this.closeOnlinePayShow = false
          setTimeout(() => {
            this.getRelevanceList(this.id)
          }, 100)
        }
      })
    },
    setFundsAccount (val) { // 设置为资金帐号
      this.setParam = {
        clientId: this.id,
        fundsAccountId: val.fundsAccountId,
        fundsAccountFlag: 1
      }
      this.dialogCurrentLoginAccount = val.loginAccount
      this.setFundsAccountShow = true
    },
    setFundsAccountAjax (val) { // 设置为资金帐号请求
      CustomerManageAjax.setOrCancelFundsAccount(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '设置成功'
          })
          this.setFundsAccountShow = false
          setTimeout(() => {
            this.getRelevanceList(this.id)
          }, 100)
        }
      })
    },
    getRelevanceList (val) { // 账号信息关联列表
      CustomerManageAjax.getRelevanceList({clientId: val}).then(res => {
        if (res.code === 200) {
          this.accountTableData = res.data.map((item, index) => {
            item.rowNum = index + 1
            if (item.fundsAccountId !== '' && item.fundsAccountId !== null) {
              if (item.currentClearingFunds !== '' && item.currentClearingFunds !== null) {
                item.fundsAccountDisabled = true
              } else {
                item.fundsAccountDisabled = false
              }
            } else {
              item.fundsAccountDisabled = true
            }
            if (item.currentClearingFunds !== '' && item.currentClearingFunds !== null) {
              item.closeDisabled = false
            } else {
              item.closeDisabled = true
            }
            return item
          })
        }
      })
    },
    resetPassword (id) { // 重置密码
      LoginAjax.ResetPassword({userId: id}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '重置密码成功！',
            type: 'success'
          })
        }
      })
    },
    // 站点变化查线路
    stationChange (val, detailVal) {
      CustomerManageAjax.queryClientLineListByStationId({stationId: val}).then(res => {
        if (res.code === 200) {
          this.pkLineOptions = res.data
          if (detailVal) {
            this.form.pkLine = detailVal
          } else {
            this.form.pkLine = ''
          }
        }
      })
    },
    inputBankCard (val) {
      this.form.bankCard = this.validateOnlyNum(val)
    },
    // accountInput () {
    //   this.form.account = this.validateAccount(this.form.account)
    //   this.hasUserName = false
    // },
    loginAccountInput () {
      this.newForm.loginAccount = this.validateAccount(this.newForm.loginAccount)
      this.hasUserName = false
    },
    inputPhone (evnet, value) {
      this.hasPhone = false
      this.form.phone = this.validateNum(this.form.phone)
    },
    inputUserName () {
      this.form.userName = this.validatePersonName(this.form.userName)
    },
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        if (id) {
          await this.updateClientDetailsShow({id: id})
        }
        let obj = {}
        obj.areaParentCode = 0
        this.QueryAreaList(obj, 'province')
        this.QueryAreaList({areaParentCode: this.updateShowArea.provinceCode}, 'city')
        this.QueryAreaList({areaParentCode: this.updateShowArea.cityCode}, 'area')
      }
    },
    save (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.validatePhoneEnable({userId: this.saveUserId, phone: this.form.phone, referenceType: 3, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        // LoginAjax.ValidateUserName({account: this.form.account, accountId: this.form.accountId}).then(response => {
        // LoginAjax.ValidateUserName({accountId: this.form.accountId}).then(response => {
        //   if (response.code === 200 && !response.data) {
        //     console.log(this.form, '123')
        //     if (this.form.onlinePaySwitch) {
        //       this.form.onlinePaySwitch = 0
        //     } else {
        //       this.form.onlinePaySwitch = 1
        //     }
        //     let id = this.$route.query.id
        //     if (id !== '' && id !== undefined) { // 修改
        //       this.form.clientId = id
        //       let obj = {}
        //       obj = Object.assign(this.updateObj, this.form)
        //       this.updateClientManage(obj)
        //     } else { // 新增
        //       this.insertClientManage(this.form)
        //     }
        //   } else {
        //     this.hasUserName = true
        //     this.$refs.form.validate()
        //   }
        // })
        let id = this.$route.query.id
        if (id !== '' && id !== undefined) { // 修改
          this.form.clientId = id
          let obj = {}
          obj = Object.assign(this.updateObj, this.form)
          this.updateClientManage(obj)
        } else { // 新增
          this.insertClientManage(this.form)
        }
      } else {
        this.hasPhone = true
        this.$refs.form.validate()
      }
    },
    goBack () {
      this.$router.push({name: 'CustomerManage'})
    },
    disable () {
      let id = this.$route.query.id
      let obj = {}
      obj.clientIdList = id
      if (this.form.clientStatus === 1) {
        obj.clientStatus = 0
      } else {
        obj.clientStatus = 1
      }
      this.updateClientManageStatus(obj)
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
    async updateClientDetailsShow (val) { // 修改客户回显
      return new Promise((resolve, reject) => {
        CustomerManageAjax.updateClientDetailsShow(val).then(res => {
          if (res.code === 200) {
            if (res.data.pkStation) {
              this.stationChange(res.data.pkStation, res.data.pkLine)
            }
            if (res.data.clientStatus === 1) {
              this.btnType = '启用'
            }
            if (res.data.clientStatus === 0) {
              this.btnType = '禁用'
            }
            this.form.accountId = res.data.accountId
            this.saveUserId = res.data.userId
            this.updateObj = res.data
            this.form.clientName = res.data.clientName
            this.form.phone = res.data.phone
            // this.form.account = res.data.account || ''
            this.form.userName = res.data.userName
            this.form.clientType = res.data.clientType
            this.form.pkLogistics = res.data.pkLogistics
            this.form.pkStation = res.data.pkStation
            this.form.clientStatus = res.data.clientStatus
            if (Number(res.data.freightSettlementMethod) === 4) {
              this.form.freightSettlementMethod = 1
            } else {
              this.form.freightSettlementMethod = Number(res.data.freightSettlementMethod)
            }
            if (res.data.addressSaveData) {
              this.form.areaInfo = res.data.addressSaveData.areaInfo
              this.form.province = res.data.addressSaveData.provinceCode
              this.form.city = res.data.addressSaveData.cityCode
              this.form.area = res.data.addressSaveData.areaCode
              this.updateShowArea.provinceCode = res.data.addressSaveData.provinceCode
              this.updateShowArea.cityCode = res.data.addressSaveData.cityCode
              this.updateShowArea.areaCode = res.data.addressSaveData.areaCode
            }
            this.form.name = res.data.name || ''
            this.form.bankCard = res.data.bankCard || ''
            this.form.bankName = res.data.bankName || ''
            this.form.bankCardId = res.data.bankCardId
            // if (res.data.onlinePaySwitch === 0) {
            //   this.form.onlinePaySwitch = true
            // }
            // if (res.data.onlinePaySwitch === 1) {
            //   this.form.onlinePaySwitch = false
            // }
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
    },
    updateClientManageStatus (val) { // 禁用/启用站点
      CustomerManageAjax.updateClientManageStatus(val).then(res => {
        if (res.code === 200) {
          let id = this.$route.query.id
          this.updateClientDetailsShow({id: id})
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.creatCustomer_main {
  margin-bottom: 10px;
  .costTable {
    margin-top: 20px;
  }
  .addressDetail .el-input__inner {
    width: 625px !important;
  }
    .longInput {
    input{
      width: 200px !important;
    }
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
  button.el-button.is-disabled, button.el-button.is-disabled:hover, button.el-button.is-disabled:focus{
    color: #bbb!important;
  }
}
</style>
