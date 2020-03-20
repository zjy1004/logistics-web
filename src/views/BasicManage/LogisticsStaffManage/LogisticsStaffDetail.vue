<template>
  <div class="logistics-staff-detail">
    <div class="public_card">
      <h3 class="card_header">物流员工管理</h3>
      <div class="card_main">
        <div class="form-con">
          <div class="title-text">基本信息</div>
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="75px">
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="账户状态:">
                  <span>{{userStatus === 0 ? '启用' : '禁用'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="创建人:" prop="createUserName">
                  <span>{{form.createUserName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="创建日期:" prop="createDate">
                  <span>{{form.createDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="姓名:" prop="userName">
                  <span>{{form.userName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="联系电话:" prop="phone">
                  <span>{{form.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="登录账号:" prop="account">
                  <span>{{form.account}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="物流公司:" prop="logisticsName">
                  <span>{{form.logisticsName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="所属站点:" prop="stationName">
                  <span>{{form.stationName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="角色:" prop="role">
                  <span>{{form.role}}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="hasDriver" :span="6" :offset="1">
                <el-form-item label="驾驶车辆:" prop="car">
                  <span>{{form.car}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="开单打印:" prop="printName">
                  <span>{{printName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="title-text">操作记录</div>
          <el-row class="record-row">
            <el-col :span="22" :offset="2">
              <ul class="record-ul">
                <li :key="index" v-for="(item, index) in recordList">操作人： {{item.operatePerson}}<span class="operateSpan">{{item.operateContent}}时间： </span>{{item.operateTime}}</li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="btns">
          <el-button class="btn-main" @click="goback">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'
import CommonAxios from '@/api/Common/CommonAxios'
import { _queryPrintCheckbox } from '../../WaybillManage/NewWaybill/subpage/Actions/OperationAction'
import ENUMS from '@/enums/enums'
export default {
  name: 'LogisticsStaffDetail',
  data () {
    return {
      id: '',
      userStatus: '',
      form: {
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
      printName: '',
      hasDriver: false,
      recordList: [] // 操作记录
    }
  },
  created () {
    let query = this.$route.query
    if (query.id) {
      this.id = query.id
      this.userStatus = Number(query.userStatus)
    } else {
      this.id = ''
      this.userStatus = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.queryDetail()
      this.queryRecord()
    },
    // 查询当前用户打印联复选框信息
    queryPrintCheckbox (accountId) {
      _queryPrintCheckbox(accountId).then(res => {
        let temp = ''
        ENUMS.checkGroup.forEach(item => {
          res.forEach(inner => {
            if (item.label === inner) {
              temp += `${item.text}、`
            }
          })
        })
        this.printName = temp.substring(0, temp.length - 1)
      })
    },
    // 查询详情
    queryDetail () {
      LogisticsStaffAjax.CheckDetail({userId: this.id}).then(response => {
        if (response.code === 200) {
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
          this.queryPrintCheckbox(response.data.accountId)
        }
      })
    },
    // 查询操作记录
    queryRecord () {
      CommonAxios.QueryOperationRecord({id: this.id, relationType: 1}).then(response => {
        if (response.code === 200) {
          this.recordList = response.data
        }
      })
    },
    goback () {
      this.$router.push({name: 'LogisticsStaffList'})
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
      height: 220px;
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
