<template>
  <div class="inward-user-card">
    <div class="public_card">
      <h3 class="card_header">内部用户管理</h3>
      <div class="card_main">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="75px">
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="姓名:" prop="userName">
                  <el-input v-model="form.userName" placeholder="请输入姓名" maxlength="128"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="联系电话:" prop="phone">
                  <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="登录账号:" prop="account">
                  <el-input v-model="form.account" placeholder="请输入登陆账号" maxlength="16" @keyup.native="accountInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="直属上级:" prop="superior">
                  <el-select v-model.number="form.superior" placeholder="请选择直属上级" clearable value-key="generateKey" filterable>
                    <el-option
                      v-for="item in internalUserListOptions"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="部门:" prop="orgName">
                  <el-input v-model="form.orgName" placeholder="" disabled maxlength="128"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="职位:" prop="position">
                  <el-input v-model="form.position" placeholder="请输入职位" maxlength="128"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="部门选择:">
                  <a v-if="isAddPage" href="javascript:;" @click="chosseDepart">{{this.form.orgName || '点击选择'}}</a>
                  <a v-if="!isAddPage" href="javascript:;" @click="chosseDepart">{{form.orgName}}</a>
                </el-form-item>
              </el-col>
              <el-col v-show="false" :span="6" :offset="1">
                <el-form-item label="部门id:" prop="orgId">
                  <el-input v-model="form.orgId" placeholder="" maxlength="128"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="角色:">
                  <el-checkbox-group v-model="form.roleIdList">
                    <el-checkbox :key="item.id" :label="item.id" v-for="item in roleCheckList">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in roleList" :key="index" :label="item.roleName" :name="index.toString()">
            <el-tree
              v-for="(treeItem, treeIndex) in item.treeNodeList"
              :key="treeIndex"
              :data="[treeItem]"
              show-checkbox
              default-expand-all
              node-key="id"
              :ref="'tree'+index"
              highlight-current
              @check-change="handleCheckChange"
              :props="defaultProps">
            </el-tree>
          </el-tab-pane>
        </el-tabs> -->
        <div class="btns">
          <el-button v-if="!isAddPage" class="btn-main" @click="disable">{{this.userStatus === 0 ? '禁用' : '启用'}}</el-button>
          <el-button v-if="!isAddPage" class="btn-main" @click="resetPassword">重置密码</el-button>
          <el-button class="btn-main" @click="save">保存</el-button>
          <el-button @click="goback">返回</el-button>
        </div>
        <choose-depart
          v-if="chooseDepartShow"
          :dialogVisible="chooseDepartShow"
          :rowData="chooseData"
          @click-cancel-form="chooseDepartShow = false"
          @click-sure-form="addSure"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ChooseDepart from './subpage/ChooseDepart'
import InwardUserAjax from '@/api/InwardUserManage/InwardUserManage'
import LoginAjax from '@/api/Login/Login'
export default {
  name: 'InwardUserCard',
  data () {
    let validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登陆账户！'))
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
      // activeName: '0',
      id: '',
      userStatus: '',
      form: {
        userName: '',
        phone: '',
        account: '', // 登录账户
        accountId: '', // 登录账户id
        superior: '', // 直属上级
        orgId: '', // 部门id
        orgName: '', // 部门名称
        position: '', // 职位
        roleIdList: []
      },
      hasPhone: false,
      hasUserName: false,
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
        orgName: [
          { required: true, message: '请选择部门！', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职位！', trigger: 'blur' }
        ]
      },
      roleCheckList: [],
      // roleList: [],
      isAddPage: true,
      internalUserListOptions: [], // 直属上级
      chooseDepartShow: false,
      chooseData: {orgId: '', orgName: ''},
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      }
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
    if (((this.$route.query && this.$route.query.isAdd === true) || this.$route.query.isAdd === 'true') || this.$route.query.isAdd === undefined) {
      this.isAddPage = true
      this.init()
    } else {
      this.isAddPage = false
      this.init('queryDetail')
    }
  },
  methods: {
    init (type) {
      this.queryRoleCheckList()
      this.queryUserListOptions(type)
    },
    // 内部用户管理直属上级下拉数据
    queryUserListOptions (type) {
      InwardUserAjax.QuerySuperior().then(response => {
        if (response.code === 200) {
          if (this.id !== '') {
            if (type === 'queryDetail') { // 编辑
              this.qyeryDetail(response)
            }
          } else {
            this.internalUserListOptions = response.data
          }
        }
      })
    },
    // 查询详情
    qyeryDetail (res) {
      InwardUserAjax.queryDetail({userId: this.id}).then(response => {
        if (response.code === 200) {
          this.form = Object.assign({}, response.data)
          this.internalUserListOptions = res.data.filter(item => {
            return item.userName !== this.form.userName
          })
        }
      })
    },
    // 查询角色复选框数据
    queryRoleCheckList () {
      InwardUserAjax.QueryInternalUserRoleList().then(response => {
        if (response.code === 200) {
          this.roleCheckList = response.data
        }
      })
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
      this.hasPhone = false
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
      this.hasUserName = false
    },
    addSure (currentDepart) {
      this.form.orgId = currentDepart.id
      this.form.orgName = currentDepart.name
      this.chooseDepartShow = false
    },
    disable () {
      InwardUserAjax.UpdateLogisticsPersonnelStatus({userIdList: [this.id], userStatus: this.userStatus === 0 ? 1 : 0}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: this.userStatus === 0 ? '禁用成功！' : '启用成功',
            type: 'success'
          })
          this.userStatus = this.userStatus === 0 ? 1 : 0
          // this.$router.push({name: 'InwardUserManage'})
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
          this.validatePhoneEnable({userId: this.id, phone: this.form.phone, referenceType: 4, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        LoginAjax.ValidateUserName({account: this.form.account, accountId: this.form.accountId}).then(response => {
          if (response.code === 200 && !response.data) {
            if (this.id !== '') {
              this.form.userId = this.id
              InwardUserAjax.Update(this.form).then((response) => {
                if (response.code === 200) {
                  this.$notify({
                    message: '保存成功！',
                    type: 'success'
                  })
                  this.$router.push({name: 'InwardUserManage'})
                }
              })
            } else {
              InwardUserAjax.Insert(this.form).then((response) => {
                if (response.code === 200) {
                  this.$notify({
                    message: '保存成功！',
                    type: 'success'
                  })
                  this.$router.push({name: 'InwardUserManage'})
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
    chosseDepart () {
      if (this.id !== '') { // 编辑
        this.chooseData.orgId = this.form.orgId
        this.chooseData.orgName = this.form.orgName
      }
      this.chooseDepartShow = true
    },
    goback () {
      this.$router.push({name: 'InwardUserManage'})
    }
  },
  components: {
    ChooseDepart
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.inward-user-card{
  .card_main{
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
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.inward-user-card{
  display: flex;
  flex: 1;
  .default-tabs{
    margin: 0px 40px 10px 40px;
  }
  .btns{
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
    margin-right: 40px;
  }
}
</style>
