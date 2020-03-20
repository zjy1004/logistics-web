<template>
  <div class="logistics-staff-detail">
    <div class="public_card">
      <h3 class="card_header">物流员工管理</h3>
      <div class="card_main">
        <div class="form-con">
          <div class="title-text">基本信息</div>
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="75px">
            <!-- <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="账户状态:">
                  <span>{{userStatus === 0 ? '启用' : '禁用'}}</span>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <!-- <el-col :span="6" :offset="2">
                <el-form-item label="创建人:" prop="createUserName">
                  <span>{{form.createUserName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="创建日期:" prop="createDate">
                  <span>{{form.createDate}}</span>
                </el-form-item>
              </el-col> -->
              <el-col :span="6" :offset="1">
                <el-form-item label="姓名:" prop="userName">
                  <span>{{form.userName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="2">
                <el-form-item label="联系电话:" prop="phone">
                  <!-- <span>{{form.phone}}</span> -->
                  <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="登录账号:" prop="account">
                  <span>{{form.account}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="物流公司:" prop="logisticsName">
                  <span>{{form.logisticsName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="2">
                <el-form-item label="所属站点:" prop="stationName">
                  <span>{{form.stationName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="角色:" prop="role">
                  <span>{{form.role}}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="hasDriver" :span="6" :offset="2">
                <el-form-item label="驾驶车辆:" prop="car">
                  <span>{{form.car}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="btns">
          <el-button class="btn-main" @click="saveBtn">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalManageAjax from '@/api/PersonalManage/PersonalManage'
import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'

export default {
  name: 'LogisticsStaffDetail',
  data () {
    let validatePhoneNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话！'))
      } else if (this.hasPhone) {
        callback(new Error('联系电话已存在！'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userId: '', // 当前用户id
        createUserName: '', // 创建人
        createDate: '', // 创建日期
        userName: '', // 姓名
        phone: '', // 联系电话
        account: '', // 登录账号
        logisticsName: '', // 物流公司
        stationName: '', // 所属站点
        role: '', // 角色
        car: '' // 驾驶车辆
      },
      hasDriver: false,
      rules: {
        phone: [
          { required: true, validator: validatePhoneNum, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryDetail()
    },
    // 查询详情
    queryDetail () {
      PersonalManageAjax.queryLogisticsStaff().then(response => {
        if (response.code === 200) {
          this.form.userId = response.data.userId
          this.hasDriver = response.data.logisticsPersonnelRoleParamList.some(item => { // 是否含有司机角色
            return item.rolePosition === 3
          })
          response.data.role = response.data.logisticsPersonnelRoleParamList.reduce((preItem, curItem) => {
            if (preItem !== '') {
              return `${preItem}、${curItem.roleName}`
            } else {
              return `${curItem.roleName}` || ''
            }
          }, '')
          response.data.car = response.data.logisticsPersonnelCarParamList.reduce((preItem, curItem) => {
            if (preItem !== '') {
              return `${preItem}、${curItem.carNumber}`
            } else {
              if (curItem && curItem.carNumber) {
                return `${curItem.carNumber}`
              } else {
                return ''
              }
            }
          }, '')
          this.form = Object.assign({}, response.data)
        }
      })
    },
    saveBtn () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.validatePhoneEnable({userId: this.form.userId, phone: this.form.phone, referenceType: 2, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        LogisticsStaffAjax.Update(this.form).then((response) => {
          if (response.code === 200) {
            this.$notify({
              message: '保存成功！',
              type: 'success'
            })
          }
        })
      } else {
        this.hasPhone = true
        this.$refs.form.validate()
      }
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
      this.hasPhone = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.logistics-staff-detail{
  display: flex;
  flex: 1;
  .form-con{
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    .el-form{
      width: 100%;
      height: 180px;
      .el-row{
        margin-bottom: 0px;
      }
    }
  }
  .title-text{
    margin-left: 20px;
    font-size: 16px;
    height: 16px;
    margin-bottom: 10px;
  }
  .btns{
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
    margin-right: 40px;
  }
  .record-row{
    display: flex;
    flex: 1;
    overflow-y: auto;
    .record-ul{
      li{
        height: 20px;
        line-height: 20px;
        font-size: 13px;
        color: #333;
        .operateSpan{
          margin-left: 60px;
        }
      }
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.logistics-staff-detail{
  .form-con{
    flex-direction: column;
    .el-form{
      .el-form-item__content{
        span{
          font-size: 13px;
          color: #333;
        }
      }
    }
  }
}
</style>
