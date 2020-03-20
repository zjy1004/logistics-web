<template>
  <div class="creatLogisticsCompany public_card">
    <h3 class="card_header">物流公司管理</h3>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="100px">
    <div class="card_main">
      <div class="card_con">
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">基本信息</span>
        </div>
        <div class="basicInfo info">

              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="物流公司简称:" prop="logisticsName" >
                    <el-input v-model="form.logisticsName" placeholder="请输入物流公司" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="企业全称:" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入企业名称" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="account">
                    <el-input v-model="form.account" placeholder="请输入账号" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系人:" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入联系人" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="营业执照:" prop="attachId">
                  <el-upload
                  :disabled="true"
                  :action="uploadAction"
                  :limit="1"
                  :on-exceed="handleExceed"
                  accept="image/*"
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-preview="handlePictureCardPreview"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                </el-form-item>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18" :offset="1">
                <el-form-item label="经营地址:" prop="addressSaveData">
                  <el-select v-model="form.addressSaveData.provinceCode" placeholder="请选择省" clearable @change="changeProvince(form.addressSaveData.provinceCode, 'Management')" :disabled="true">
                    <el-option
                      v-for="(item, index) in management.areaPList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                  （省）
                  <el-select v-model="form.addressSaveData.cityCode" placeholder="请选择市" clearable @change="changeCity(form.addressSaveData.cityCode,'Management')" :disabled="true">
                    <el-option
                      v-for="(item, index) in management.areaCList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                  （市）
                  <el-select v-model="form.addressSaveData.areaCode" placeholder="请选择区" clearable @change="changeArea(form.addressSaveData.areaCode,'Management')" :disabled="true">
                    <el-option
                      v-for="(item, index) in management.areaQList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                  （区）
                  <el-select v-model="form.addressSaveData.townCode" placeholder="请选择乡镇/街道" clearable :disabled="true">
                    <el-option
                      v-for="(item, index) in management.areaTList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                  （乡镇/街道）
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <el-form-item label=" ">
                  <el-input class="addressDetail" @input="changeAddressSaveDataInfo(form.addressSaveData.areaInfo)" v-model="form.addressSaveData.areaInfo" placeholder="请输入详细经营地址（如街道门牌号）" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">服务信息</span>
        </div>
        <div class="serviceInfo info">
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item label="配送方式:" prop="deliveryMethod">
                <el-checkbox-group v-model="form.deliveryMethod">
                  <el-checkbox label=1 name="type">修理厂自提</el-checkbox>
                  <el-checkbox label=2 name="type">送货上门</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item label="揽货方式:" prop="pickupMethod">
                <el-checkbox-group v-model="form.pickupMethod">
                  <el-checkbox label=1 name="type">经销商送货</el-checkbox>
                  <el-checkbox label=2 name="type">上门取货</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item label="运费结算方式:" prop="freightSettlementMethod">
                <el-checkbox-group v-model="form.freightSettlementMethod">
                  <el-checkbox label=1 name="type">现结</el-checkbox>
                  <el-checkbox label=2 name="type">月结</el-checkbox>
                  <el-checkbox label=3 name="type">包月</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item label="三联单打印:" prop="printMethod">
                <el-checkbox-group v-model="form.printMethod">
                  <el-checkbox label=1 name="type">发货方</el-checkbox>
                  <el-checkbox label=2 name="type">收货方</el-checkbox>
                  <el-checkbox label=3 name="type">物流公司</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="userType === 2">
            <el-col :span="6" :offset="1" class="mobilePrint">
              <el-form-item label="移动三联单打印:" prop="mobilePrintMethod">
                <el-checkbox-group v-model="form.mobilePrintMethod">
                  <el-checkbox label=1 name="type">发货方</el-checkbox>
                  <el-checkbox label=2 name="type">收货方</el-checkbox>
                  <el-checkbox label=3 name="type">物流公司</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6" :offset="1">
            <el-form-item label="默认运费金额:" prop="freightDefault">
              <el-input v-model="form.freightDefault"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
            <el-form-item label="代收手续费:" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="结算周期:" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-form> -->
          <el-row>
            <el-col :span="18" :offset="1">
            <div v-for="(element,index) in this.form.addressSaveDataList" :key="index">
            <el-form-item label="服务范围:" prop="addressSaveDataList">
              <el-select v-model="element.provinceCode" placeholder="请选择省" clearable @change="changeProvince(element.provinceCode,'service', index)">
                <el-option
                  v-for="(item, index) in management.areaPList"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （省）
              <el-select v-model="element.cityCode" placeholder="请选择市" clearable @change="changeCity(element.cityCode,'service', index)">
                <el-option
                  v-for="(item, index) in element.serviceArr.CArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （市）
              <el-select v-model="element.areaCode" placeholder="请选择区" clearable @change="changeArea(element.areaCode,'service',index)">
                <el-option
                  v-for="(item, index) in element.serviceArr.QArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （区）
              <el-select v-model="element.townCode" placeholder="请选择乡镇/街道" clearable>
                <el-option
                  v-for="(item, index) in element.serviceArr.TArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （乡镇/街道）

            </el-form-item>
            <el-form-item>
              <a class="check" href="javascript:;" type="text" size="small" @click="add(element, index)">新建</a>
              <a class="check" href="javascript:;" type="text" size="small" v-if="delBtnShow" @click="del(element, index)">删除</a>
            </el-form-item>
            </div>
            </el-col>
          </el-row>
        </div>

        <div class="card_form_title" v-if="false">
          <span class="title_line"></span>
          <span class="title">角色信息</span>
        </div>
        <div class="roleInfo info" v-if="false">
        <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in form.roleMenuLogisticsList" :key="index" :label="item.roleName" :name="index.toString()">
            <el-tree
              :data="item.treeNodeList"
              :default-checked-keys="item.treeNodeCheckedList"
              show-checkbox
              default-expand-all
              node-key="id"
              :ref="'tree'+index"
              highlight-current
              @check-change="handleCheckChange"
              :props="defaultProps">
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
        <el-button class="btn-main" v-if="saveShow" @click="save('form')">保存</el-button>
        </div>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'
import PersonalManageAjax from '@/api/PersonalManage/PersonalManage'

export default {
  data () {
    let validateAddress = (rule, value, callback) => {
      if (value.provinceCode === '' || value.provinceCode === null) {
        callback(new Error('请选择省！'))
      } else if (value.cityCode === '' || value.cityCode === null) {
        callback(new Error('请选择市！'))
      } else if (value.areaCode === '' || value.areaCode === null) {
        callback(new Error('请选择区/县！'))
      } else if (value.townCode === '' || value.townCode === null) {
        callback(new Error('请选择乡镇/街道！'))
      } else if (value.areaInfo === '') {
        callback(new Error('请输入详细经营地址（如街道门牌号）！'))
      } else {
        callback()
      }
    }
    // let validateAddressList = (rule, value, callback) => {
    //   value.forEach(item => {
    //     if (item.provinceCode === '' || item.provinceCode === null) {
    //       callback(new Error('请选择省！'))
    //     } else if (item.cityCode === '' || item.cityCode === null) {
    //       callback(new Error('请选择市！'))
    //     } else if (item.areaCode === '' || item.areaCode === null) {
    //       callback(new Error('请选择区/县！'))
    //     } else if (item.townCode === '' || item.townCode === null) {
    //       callback(new Error('请选择乡镇/街道！'))
    //     } else {
    //       callback()
    //     }
    //   })
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
    return {
      treeDate: [],
      userType: '',
      saveUserId: '', // 校验手机号同模块是否存在
      form: {
        logisticsId: '', // 物流公司Id
        freightDefault: '', // 默认运费
        logisticsName: '', // 物流公司名称
        companyName: '', // 企业名称
        account: '', // 账号
        userName: '', // 联系人
        phone: '', // 联系电话
        addressSaveData: { // 经营地址实体
          addressId: '',
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          townCode: '',
          areaInfo: ''
        },
        deliveryMethod: [], // 配送方式
        pickupMethod: [], // 取货方式
        freightSettlementMethod: [], // 运费结算方式
        printMethod: [], // 三联单打印
        mobilePrintMethod: [], // 移动三联单打印
        addressSaveDataList: [{
          addressId: '',
          provinceCode: '',
          provinceName: '',
          cityCode: '',
          cityName: '',
          areaCode: '',
          areaName: '',
          townCode: '',
          townName: '',
          serviceArr:
            {
              PArray: [],
              CArray: [],
              QArray: [],
              TArray: []
            }
        }],
        roleMenuLogisticsList: [{
          'isChange': '',
          'roleId': ''
        }],
        attachId: '', // 营业执照id
        attachName: '' // 营业执照名称
      },
      management: { // 经营地址
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [], // 区
        areaTList: [] // 乡
      },
      service: { // 经营地址
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [], // 区
        areaTList: [] // 乡
      },
      companyOptions: [],
      dialogImageUrl: '',
      dialogVisible: false,
      activeName: '0',
      uploadAction: `${process.env.API_BASE_URL}/crm/attach/fileUpload`,
      roleArr: [], // 角色
      defaultProps: {
        children: 'childrenList',
        label: 'menuName',
        disabled: 'id'
      },
      allDate: [], // 编辑全部数据
      fileList: [],
      saveShow: true,
      delBtnShow: true, // 服务范围地址删除按钮
      hasPhone: false,
      rules: {
        logisticsName: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
        freightDefault: [{ required: true, message: '请输入默认运费', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        attachId: [{ required: true, message: '请输入营业执照', trigger: 'change' }],
        addressSaveData: [{ required: true, validator: validateAddress, trigger: 'change' || 'blur' }],
        deliveryMethod: [{ required: true, message: '请输入配送方式', trigger: 'change' }],
        pickupMethod: [{ required: true, message: '请输入取货方式', trigger: 'change' }],
        freightSettlementMethod: [{ required: true, message: '请输入运费结算方式', trigger: 'change' }],
        printMethod: [{ required: true, message: '请输入三联单打印', trigger: 'change' }],
        mobilePrintMethod: [{ required: true, message: '请输入移动三联单打印', trigger: 'change' }]
        // addressSaveDataList: [{ required: true, validator: validateAddressList, trigger: 'change' }]
      }
    }
  },
  created () {
    console.log(this.$route.query.type)
    let pageType = this.$route.query.type
    if (pageType === 'check') {
      this.saveShow = false
    } else {
      this.saveShow = true
    }
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.userType = userInfo.userType
    this.updateInit(userInfo.logisticsId)
  },
  computed: {
    provinceCode () {
      return this.form.addressSaveData.provinceCode
    },
    cityCode () {
      return this.form.addressSaveData.cityCode
    },
    areaCode () {
      return this.form.addressSaveData.areaCode
    },
    provinceCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].provinceCode
    },
    cityCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode
    },
    areaCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaPList.forEach(item => {
          if (this.form.addressSaveData.cityCode !== item) {
            this.form.addressSaveData.cityCode = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaCList.forEach(item => {
          if (this.form.addressSaveData.areaCode !== item) {
            this.form.addressSaveData.areaCode = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaQList.forEach(item => {
          if (this.form.addressSaveData.townCode !== item) {
            this.form.addressSaveData.townCode = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'town')
      }
    },
    provinceCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaPList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'city', this.form.addressSaveDataList.length - 1)
      }
    },
    cityCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaCList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'area', this.form.addressSaveDataList.length - 1)
      }
    },
    areaCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaQList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].townCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].townCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'town', this.form.addressSaveDataList.length - 1)
      }
    }
  },
  methods: {
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        await this.queryRoleMenuList({logisticsId: id})
        // this.form.roleMenuLogisticsList.forEach((item, index) => {
        //   let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
        //   item.treeNodeCheckedList = halfCheckedArr.concat(item.treeNodeCheckedList)
        // })
        await this.queryDetail()
        this.QueryManagementAreaList({areaParentCode: 0}, 'province')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.provinceCode}, 'city')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.cityCode}, 'area')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.areaCode}, 'town')
      }
    },
    handleRemove (file, fileList) {
      this.deleteFile({attachId: this.form.attachId})
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    handleAvatarSuccess (res, file) {
      this.form.attachId = res.data.attachId
      this.form.attachName = res.data.attachName
    },
    add (val, index) {
      this.delBtnShow = true
      this.form.addressSaveDataList.push({
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        areaCode: '',
        areaName: '',
        townCode: '',
        townName: '',
        serviceArr:
            {
              PArray: [],
              CArray: [],
              QArray: [],
              TArray: []
            }
      })
    },
    del (val, index) {
      if (this.form.addressSaveDataList.length === 2) {
        this.delBtnShow = false
      } else {
        this.delBtnShow = true
      }
      this.form.addressSaveDataList = this.form.addressSaveDataList.filter((item, itemIndex) => {
        return itemIndex !== index
      })
    },
    inputPhone (evnet, value) {
      this.hasPhone = false
      this.form.phone = this.validateNum(this.form.phone)
    },
    changeAddressSaveDataInfo (val) {

    },
    save (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.validatePhoneEnable({userId: this.saveUserId, phone: this.form.phone, referenceType: 1, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        LogisticsCompanyManage.ValidateFreightMethod({freightSettlementMethodList: this.form.freightSettlementMethod, logisticsId: this.form.logisticsId}).then(res => {
          if (res.data.list.length > 0) {
            this.$notify({
              type: 'error',
              message: `您名下总共有${res.data.list.length}个客户正在用此结算方式，请勿修改!`
            })
          } else {
            let obj = {}
            obj = Object.assign(this.allDate, this.form)
            this.updateCrmLogistics(obj)
          }
        })
      } else {
        this.hasPhone = true
        this.$refs.form.validate()
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.form.roleMenuLogisticsList.forEach((item, index) => {
        if (item.rolePosition === data.rolePosition) {
          console.log(this.$refs['tree' + index][0].getHalfCheckedKeys())
          let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
          console.log(this.$refs['tree' + index][0].getCheckedKeys())
          let checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          this.form.roleMenuLogisticsList[index].treeNodeCheckedList = halfCheckedArr.concat(checkedArr)
        }
      })
    },
    changeProvince (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'city')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].cityCode = ''
        this.form.addressSaveDataList[index].cityName = '全部'
        this.form.addressSaveDataList[index].areaCode = ''
        this.form.addressSaveDataList[index].areaName = '全部'
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'city', index)
      }
    },
    changeCity (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'area')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].areaCode = ''
        this.form.addressSaveDataList[index].areaName = '全部'
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'area', index)
      }
    },
    changeArea (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'town')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'town', index)
      }
    },
    handleClick (tab, event) {

    },
    QueryManagementAreaList (val, flag) { // 省市
      LogisticsCompanyManage.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.management.areaPList = res.data
          }
          if (flag === 'city') {
            this.management.areaCList = res.data
          }
          if (flag === 'area') {
            this.management.areaQList = res.data
          }
          if (flag === 'town') {
            this.management.areaTList = res.data
          }
        }
      })
    },
    QueryServiceAreaList (val, flag, index) { // 省市
      LogisticsCompanyManage.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.form.addressSaveDataList[index].serviceArr.PArray = res.data
          }
          if (flag === 'city') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.CArray = res.data
          }
          if (flag === 'area') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.QArray = res.data
          }
          if (flag === 'town') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.TArray = res.data
          }
        }
      })
    },
    updateCrmLogistics (val) { // 修改物流公司
      LogisticsCompanyManage.updateCrmLogistics(val).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    },
    deleteFile (val) { // 附件管理删除
      LogisticsCompanyManage.deleteFile(val).then(res => {
        if (res.code === 200) {
          this.form.attachId = ''
          this.form.attachName = ''
          this.$notify({
            type: 'success',
            message: '删除成功！'
          })
        }
      })
    },
    async queryRoleMenuList (val) { // 角色
      return new Promise((resolve, reject) => {
        LogisticsCompanyManage.queryRoleMenuList(val).then(res => {
          if (res.code === 200) {
            this.form.roleMenuLogisticsList = res.data.map(item => {
              item.roleId = item.id
              return item
            })
          }
          resolve(res.data)
        })
      })
    },
    async queryDetail (val) { // 修改详情
      return new Promise((resolve, reject) => {
        PersonalManageAjax.queryLogistics(val).then(res => {
          if (res.code === 200) {
            if (res.data.addressSaveDataList.length === 1) {
              this.delBtnShow = false
            } else {
              this.delBtnShow = true
            }
            this.form.logisticsId = res.data.logisticsId
            this.saveUserId = res.data.userId
            this.allDate = res.data
            this.form.logisticsName = res.data.logisticsName
            this.form.companyName = res.data.companyName
            this.form.account = res.data.account
            this.form.userName = res.data.userName
            this.form.phone = res.data.phone
            this.form.freightDefault = res.data.freightDefault
            this.form.addressSaveData.addressId = res.data.addressSaveData.addressId
            this.form.addressSaveData.provinceCode = res.data.addressSaveData.provinceCode
            this.form.addressSaveData.cityCode = res.data.addressSaveData.cityCode
            this.form.addressSaveData.areaCode = res.data.addressSaveData.areaCode
            this.form.addressSaveData.townCode = res.data.addressSaveData.townCode
            this.form.addressSaveData.areaInfo = res.data.addressSaveData.areaInfo
            this.form.deliveryMethod = res.data.deliveryMethod
            this.form.pickupMethod = res.data.pickupMethod
            this.form.freightSettlementMethod = res.data.freightSettlementMethod
            this.form.printMethod = res.data.printMethod
            this.form.mobilePrintMethod = res.data.mobilePrintMethod
            this.form.addressSaveDataList = []
            res.data.addressSaveDataList.map((innerItem, index) => {
              if (innerItem.cityCode === null) {
                innerItem.cityCode = ''
              }
              if (innerItem.areaCode === null) {
                innerItem.areaCode = ''
              }
              if (innerItem.townCode === null) {
                innerItem.townCode = ''
              }
              this.form.addressSaveDataList.push({
                addressId: innerItem.addressId,
                provinceCode: innerItem.provinceCode,
                provinceName: innerItem.provinceName,
                cityCode: innerItem.cityCode,
                cityName: innerItem.cityName,
                areaCode: innerItem.areaCode,
                areaName: innerItem.areaName,
                townCode: innerItem.townCode,
                townName: innerItem.townName,
                serviceArr: {
                  PArray: [],
                  CArray: [{
                    areaCode: innerItem.cityCode,
                    areaName: innerItem.cityName
                  }],
                  QArray: [{
                    areaCode: innerItem.areaCode,
                    areaName: innerItem.areaName
                  }],
                  TArray: [{
                    areaCode: innerItem.townCode,
                    areaName: innerItem.townName
                  }]
                }
              })
            })
            if (res.data.attachId) {
              this.fileList.push({name: res.data.attachName, url: `${process.env.API_BASE_URL}/crm/attach/seeFile?attachId=${res.data.attachId}`})
            }
            this.form.attachId = res.data.attachId
            this.form.attachName = res.data.attachName
          }
          resolve(res.data)
        })
      })
    }
  }
}
</script>

<style lang="less">
.creatLogisticsCompany {
  overflow: auto;
  .el-form-item__label {
    width: 120px!important;
  }
  .addressDetail .el-input__inner {
     width: 605px !important;
  }
}
</style>

<style lang="less" scoped>
.creatLogisticsCompany {
  .info {
    margin-bottom: 30px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
