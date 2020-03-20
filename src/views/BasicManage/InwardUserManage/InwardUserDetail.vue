<template>
  <div class="inward-user-card">
    <div class="public_card">
      <h3 class="card_header">内部用户管理</h3>
      <div class="card_main">
        <div class="form-con">
          <div class="title-text">基本信息</div>
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="75px">
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="账户状态:">
                  <span>{{userStatus === '0' || userStatus === 0 ? '启用' : '禁用'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="姓名:" prop="userName">
                  <span>{{form.userName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系电话:" prop="phone">
                  <span>{{form.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="登录账号:" prop="account">
                  <span>{{form.account}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="创建人:" prop="createPersonName">
                  <span>{{form.createPersonName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="创建日期:" prop="createTime">
                  <span>{{form.createTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="角色:" prop="role">
                  <span v-for="(item, index) in form.roleNameList" :key="index">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="部门职位:">
                  <span>{{form.orgName}} - {{form.position}}</span>
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
          <el-button @click="goback">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InwardUserAjax from '@/api/InwardUserManage/InwardUserManage'
import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'InwardUserDetail',
  data () {
    return {
      // activeName: '0',
      id: '',
      userStatus: '',
      form: {
        userName: '',
        phone: '',
        account: '', // 登录账户
        accountId: '', // 登录账户id
        createPersonName: '', // 创建人
        createTime: '', // 创建日期
        role: '', // 角色
        superior: '', // 直属上级
        orgId: '', // 部门id
        orgName: '', // 部门名称
        position: '', // 职位
        roleIdList: []
      },
      recordList: [] // 操作记录
    }
  },
  created () {
    let query = this.$route.query
    if (query.id) {
      this.id = query.id
      this.userStatus = query.userStatus
    } else {
      this.id = ''
      this.userStatus = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.qyeryDetail()
      this.queryRecord()
    },
    // 查询详情
    qyeryDetail () {
      InwardUserAjax.CheckDetail({userId: this.id}).then(response => {
        if (response.code === 200) {
          this.form = Object.assign({}, response.data)
          console.log(this.form, 'this.formthis.form')
        }
      })
    },
    // 查询操作记录
    queryRecord () {
      CommonAxios.QueryOperationRecord({id: this.id, relationType: 4}).then(response => {
        if (response.code === 200) {
          this.recordList = response.data
        }
      })
    },
    goback () {
      this.$router.push({name: 'InwardUserManage'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.inward-user-card{
  display: flex;
  flex: 1;
  .form-con{
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    .el-form{
      width: 100%;
      height: 240px;
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
.inward-user-card{
  .form-con{
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
