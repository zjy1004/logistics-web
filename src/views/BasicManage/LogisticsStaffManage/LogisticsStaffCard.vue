<template>
  <div class="logistics-staff-card">
    <div class="public_card">
      <h3 class="card_header">物流员工管理</h3>
      <div class="card_main">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="75px">
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="姓名:" prop="userName">
                  <el-input v-model="form.userName" placeholder="请输入姓名" clearable maxlength="5"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="登录账号:" prop="account">
                  <el-input v-model="form.account" maxlength="16" placeholder="请输入登录账号" @keyup.native="accountInput" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="6" :offset="2">
                <el-form-item label="物流公司:" prop="logisticsId">
                  <el-select v-model="form.logisticsId" placeholder="请选择物流公司" @change="logisticsChange" clearable>
                    <el-option
                      v-for="item in logisticsList"
                      :key="item.logisticsId"
                      :label="item.logisticsName"
                      :value="item.logisticsId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="6" :offset="2">
                <el-form-item label="所属站点:" prop="stationId">
                  <el-select v-model="form.stationId" placeholder="请选择所属站点" @change="stationChange" clearable>
                    <el-option
                      v-for="item in stationList"
                      :key="item.stationId"
                      :label="item.stationName"
                      :value="item.stationId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="hasSelectLogistics">
              <el-col :span="22" :offset="2">
                <el-form-item label="角色:">
                  <el-checkbox-group v-model="form.roleId" @change="roleChange(form.roleId)">
                    <el-checkbox :key="item.roleId" :label="item.roleId" v-for="item in roleList">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="hasSelectDriver">
              <el-row v-for="(car, index) in carList" :key="index">
                <el-col :span="6" :offset="2">
                  <el-form-item :label="index === 0 ? '驾驶车辆:' : ' '">
                    <el-select v-model="car.id" placeholder="请选择驾驶车辆" @change="carListChange(car.id, index)" clearable>
                      <el-option
                        v-for="item in carOptions"
                        :key="item.id"
                        :label="item.carNumber"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="">
                    <el-button v-if="carList.length > 1" @click="del(car, index)">删除</el-button>
                    <el-button v-if="index === 0" @click="addCar(car, index)">添加车辆</el-button>
                    <el-button v-if="index === 0" @click="insertCar(car, index)">新建车辆</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="开单打印:">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox :label="checkItem.label" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.text}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="btns">
          <div class="btn-con">
            <el-button v-if="id !== ''" class="btn-main" @click="disable()">{{this.userStatus === 0 ? '禁用' : '启用'}}</el-button>
            <el-button v-if="id !== ''" class="btn-main" @click="resetPassword()">重置密码</el-button>
            <el-button class="btn-main" @click="save()">保存</el-button>
            <el-button @click="back()">返回</el-button>
          </div>
        </div>
      </div>
    </div>
        <car-info
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :typeFlag="typeFlagStr"
    />
  </div>
</template>

<script>
import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'
import CarInfo from '../CarManage/subpage/CarInfo'
import LoginAjax from '@/api/Login/Login'
import CarManageAjax from '@/api/CarManage/CarManage'
import ENUMS from '@/enums/enums'
import { _queryPrintCheckbox, _updatePrintCheckbox } from '../../WaybillManage/NewWaybill/subpage/Actions/OperationAction'
export default {
  name: 'LogisticsStaffCard',
  data () {
    let validateUserName = (rule, value, callback) => {
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
    let validatePhoneNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话！'))
      } else if (this.hasPhone) {
        callback(new Error('联系电话已存在！'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的联系电话！'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      id: '',
      userStatus: '',
      hasPhone: false,
      hasUserName: false,
      form: {
        userName: '',
        phone: '',
        account: '',
        accountId: '',
        roleId: [],
        // logisticsId: '',
        stationId: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入姓名！', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhoneNum, trigger: 'blur' }
        ],
        account: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        // logisticsId: [
        //   { required: true, message: '请选择物流公司!', trigger: 'change' }
        // ],
        stationId: [
          { required: true, message: '请选择所属站点!', trigger: 'change' }
        ]
      },
      logisticsList: [],
      stationList: [],
      hasSelectLogistics: false,
      hasSelectDriver: false,
      roleList: [],
      carList: [{}],
      carOptions: [],
      checkList: [],
      checkGroup: []
    }
  },
  created () {
    this.logisticsChange()
    this.checkGroup = [...ENUMS.checkGroup]
    let query = this.$route.query
    if (query.id) {
      this.id = query.id
      this.userStatus = query.userStatus
      this.init('queryDetail')
    } else {
      this.userStatus = query.userStatus
      this.init()
    }
  },
  methods: {
    init (type) {
      LogisticsStaffAjax.GetLogisticsAndAccount().then((response) => {
        if (response.code === 200) {
          this.logisticsList = response.data
          if (type === 'queryDetail') {
            this.queryDetail()
          }
        }
      })
    },
    // 查询当前用户打印联复选框信息
    queryPrintCheckbox (accountId) {
      _queryPrintCheckbox(accountId).then(res => {
        this.checkList = res
      })
    },
    queryDetail () {
      LogisticsStaffAjax.QueryDetail({userId: this.id}).then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.form = {
            userName: data.userName,
            phone: data.phone,
            account: data.account,
            accountId: data.accountId,
            roleId: [],
            // logisticsId: data.logisticsId,
            stationId: data.stationId
          }
          this.logisticsChange()
          data.logisticsPersonnelRoleParamList.forEach(ele => {
            if (ele.rolePosition === 3 || ele.rolePosition === 5) {
              this.carList = [...data.logisticsPersonnelCarParamList]
              this.carList = data.logisticsPersonnelCarParamList.map(item => {
                return {id: item.carId, carNumber: item.carNumber}
              })
            }
          })
          this.form.roleId = response.data.logisticsPersonnelRoleParamList.map(item => {
            return item.roleId
          })
          this.queryPrintCheckbox(this.form.accountId)
        }
      })
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
      this.hasUserName = false
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
      this.hasPhone = false
    },
    logisticsChange (val) {
      LogisticsStaffAjax.QueryStationAndRoleSelect({logisticsId: val}).then(response => {
        if (response.code === 200) {
          this.stationList = response.data.logisticsStationParamList
          this.roleList = response.data.logisticsPersonnelRoleParamList
          this.carOptions = []
          this.hasSelectDriver = false
          this.hasSelectLogistics = true
          this.roleChange()
        }
      })
    },
    stationChange (val) {
      this.form.stationId = val
    },
    roleChange (val) {
      let hasDriver = false
      this.form.roleId.forEach(item => {
        this.roleList.forEach(roleItem => {
          if (Number(item) === roleItem.roleId) {
            if (roleItem.rolePosition === 3 || roleItem.rolePosition === 5) {
              hasDriver = true
            }
          }
        })
      })
      this.hasSelectDriver = hasDriver
      if (this.hasSelectDriver) {
        this.queryCarListByLogisticsId()
      }
    },
    queryCarListByLogisticsId () {
      LogisticsStaffAjax.QueryCarListByLogisticsId({logisticsId: this.form.logisticsId}).then((response) => {
        if (response.code === 200) {
          this.carOptions = response.data
        }
      })
    },
    del (car, index) {
      this.carList = this.carList.filter((item, itemIndex) => {
        return itemIndex !== index
      })
    },
    addCar (car, index) {
      if (this.carList.length >= 5) {
        this.$notify({
          message: '最多添加5辆车！',
          type: 'error'
        })
        return false
      }
      this.carList.push({})
    },
    insertCar (car, index) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '车辆信息'
      this.dialogWidth = '486px'
      this.typeFlagStr = 'add'
    },
    carListChange (val, editIndex) {
      this.carOptions.forEach((item, index) => {
        if (val === item.id) {
          this.carList[editIndex].carNumber = item.carNumber
        }
      })
    },
    disable () {
      let postData = {
        userIdList: [this.id],
        userStatus: this.userStatus === 0 ? 1 : 0
      }
      LogisticsStaffAjax.UpdateLogisticsPersonStatus(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: this.userStatus === 0 ? '禁用成功！' : '启用成功',
            type: 'success'
          })
          this.userStatus = this.userStatus === 0 ? 1 : 0
        }
      })
    },
    resetPassword () {
      LoginAjax.ResetPassword({userId: this.id}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '重置密码成功！',
            type: 'success'
          })
        }
      })
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.validatePhoneEnable({userId: this.id, phone: this.form.phone, referenceType: 2, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        let postData = {
          account: this.form.account,
          accountId: this.form.accountId,
          // logisticsId: this.form.logisticsId,
          stationId: this.form.stationId,
          logisticsPersonnelRoleParamList: [],
          phone: this.form.phone,
          userName: this.form.userName
        }
        if (this.id !== '') {
          postData.accountId = this.form.accountId
          postData.userId = this.id
        }
        // 校验驾驶车辆填写是否完整
        let isFullCarInfo = this.carList.every(item => {
          return item.id && item.id !== ''
        })
        if (!isFullCarInfo && this.hasSelectDriver) {
          this.$notify({
            message: '请您完善驾驶车辆信息！',
            type: 'error'
          })
          return false
        }
        // 若驾驶车辆不为空
        if (this.carList.length > 0 && this.carList[0].id) {
          postData.logisticsPersonnelCarParamList = this.carList.map(item => {
            return {carId: item.id, carNumber: item.carNumber}
          })
        } else {
          postData.logisticsPersonnelCarParamList = []
        }
        this.form.roleId.forEach(item => {
          let obj = {
            roleId: '',
            roleName: '',
            rolePosition: ''
          }
          this.roleList.forEach(roleItem => {
            if (item === roleItem.roleId) {
              obj.roleId = roleItem.roleId
              obj.roleName = roleItem.roleName
              obj.rolePosition = roleItem.rolePosition
            }
          })
          postData.logisticsPersonnelRoleParamList.push(obj)
        })
        LoginAjax.ValidateUserName({account: this.form.account, accountId: this.form.accountId}).then(response => {
          if (response.code === 200 && !response.data) {
            if (this.id !== '') {
              LogisticsStaffAjax.Update(postData).then((response) => {
                if (response.code === 200) {
                  this.$router.push({name: 'LogisticsStaffList'})
                  this.$notify({
                    message: '保存成功！',
                    type: 'success'
                  })
                  let postData = this.checkList.join(',')
                  _updatePrintCheckbox(postData, this.form.accountId, this)
                }
              })
            } else {
              LogisticsStaffAjax.Insert(postData).then((response) => {
                if (response.code === 200) {
                  this.$router.push({name: 'LogisticsStaffList'})
                  this.$notify({
                    message: '保存成功！',
                    type: 'success'
                  })
                  let postData = this.checkList.join(',')
                  _updatePrintCheckbox(postData, this.form.accountId, this)
                }
              })
            }
          } else {
            this.hasUserName = true
            this.$refs.form.validate()
          }
        })
      } else {
        this.hasPhone = true
        this.$refs.form.validate()
      }
    },
    clickDialogSure (val, flag) {
      if (flag === 'add') {
        this.InsertCrmCar(val)
      }
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    InsertCrmCar (val) { // 新增车辆
      CarManageAjax.InsertCrmCar(val).then(res => {
        if (res.code === 200) {
          this.queryCarListByLogisticsId()
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
        }
      })
    },
    back () {
      this.$router.push({name: 'LogisticsStaffList'})
    }
  },
  components: {CarInfo}
}
</script>

<style lang="less">
@import '../../../style/base.less';
.logistics-staff-card{
  .el-form-item{
    .el-input{
      width: 265px;
      input{
        width: 100%;
      }
    }
    .el-select{
      width: 265px;
      input{
        width: 100%;
      }
    }
  }
  .form-con{
    margin-top: 40px;
    display: flex;
    flex: 1;
    .el-form{
      width: 100%;
      .el-row{
        margin-bottom: 10px;
      }
    }
  }
  .btns{
    height: 72px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .btn-con{
      margin-right: 40px;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.logistics-staff-card{
  display: flex;
  flex: 1;
}
</style>
