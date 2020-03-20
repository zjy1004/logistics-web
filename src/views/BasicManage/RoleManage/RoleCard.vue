<template>
  <div class="role-card">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :rules="rules" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="角色名称:" prop="roleName">
                <el-input v-model="form.roleName" :disabled="logisticsDisabled" placeholder="请输入角色名称"></el-input>
              </el-form-item>
              <el-form-item label="角色类型:" prop="roleType">
                <el-select v-model.number="form.roleType" :disabled="logisticsDisabled" placeholder="请选择角色类型" clearable>
                  <el-option
                    v-for="(item, index) in roleTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.roleType === 2" label="物流公司简称:" prop="logisticsId">
                <el-select v-model="form.logisticsId" :disabled="logisticsDisabled" placeholder="请选择物流公司" clearable>
                  <el-option
                    v-for="(item, index) in logisticsList"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.logisticsId !== ''" label="角色职务:" prop="rolePosition">
                <el-select v-model="form.rolePosition" :disabled="logisticsDisabled" placeholder="请选择角色职务" clearable>
                  <el-option
                    v-for="(item, index) in rolePositionList"
                    :key="index"
                    :label="item.generateVal"
                    :value="item.generateKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in form.roleMenuPartParamList" :key="index" :label="item.roleName" :name="index.toString()">
            <el-tree
              :data="item.treeNodeList"
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
        <div class="btns">
          <el-button class="btn-main" @click="save('form')">保存</el-button>
          <el-button class="btn-main" @click="goback">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoleManageAjax from '@/api/RoleManage/RoleManage'
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'

export default {
  name: 'RoleCard',
  data () {
    return {
      logisticsDisabled: false,
      activeName: '0',
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      },
      roleTypeList: [],
      logisticsList: [],
      rolePositionList: [],
      form: {
        logisticsIdOld: '',
        logisticsId: '',
        roleName: '',
        roleId: '',
        roleType: '',
        rolePosition: '',
        roleMenuPartParamList: [
          {
            'menuIdList': [],
            rolePosition: ''
          }
        ]
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择角色类型', trigger: 'change' }]
      }
    }
  },
  created () {
    this.queryRolePositionList()
    let id = this.$route.query.id
    this.QueryRoleTypeList()
    this.QueryLogisticsList()
    if (id) {
      this.updataInit(id)
      this.logisticsDisabled = true
    } else {
      this.queryBusinessMenuList()
    }
  },
  watch: {
    roleType (newVal, oldVal) {
      if (newVal !== 2) {
        this.form.logisticsId = ''
      }
    }
  },
  computed: {
    roleType () {
      return this.form.roleType
    }
  },
  methods: {
    QueryRoleTypeList () {
      RoleManageAjax.QueryRoleTypeSelect().then(res => {
        if (res.code === 200) {
          this.roleTypeList = res.data.map((item) => {
            let obj = {
              id: item,
              name: ''
            }
            switch (item) {
              case 1:
                obj.name = '物流公司默认角色'
                break
              case 2:
                obj.name = '物流公司角色'
                break
              case 3:
                obj.name = '中驰车福角色'
                break
              case 4:
                obj.name = '客户角色'
                break
            }
            return obj
          })
        }
      })
    },
    QueryLogisticsList (val) { // 物流公司列表
      LogisticsCompanyManage.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    queryRolePositionList () { // 获取角色职务下拉
      RoleManageAjax.QueryRolePosition().then(res => {
        if (res.code === 200) {
          this.rolePositionList = res.data
        }
      })
    },
    updataInit (id) {
      init.bind(this)()
      async function init () {
        await this.queryBusinessMenuList()
        await this.updateCrmRoleEcho({roleId: id})
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      this.form.roleMenuPartParamList.forEach((item, index) => {
        if (item.rolePosition === data.rolePosition) {
          console.log(this.$refs['tree' + index][0].getHalfCheckedKeys())
          let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
          console.log(this.$refs['tree' + index][0].getCheckedKeys())
          let checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          this.form.roleMenuPartParamList[index].menuIdList = halfCheckedArr.concat(checkedArr)

          // if (checked || indeterminate) {
          //   this.form.roleMenuPartParamList[index].menuIdList.push(data.id)
          // } else {
          //   this.form.roleMenuPartParamList[index].menuIdList = this.form.roleMenuPartParamList[index].menuIdList.filter(item => {
          //     return item !== data.id
          //   })
          // }
        }
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    save (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // RoleManageAjax.validRoleName(this.form).then(res => {
          //   if (res.code === 200) {
          //     if (res.data) {
          //       this.$notify({
          //         type: 'error',
          //         message: '该角色名称已存在！'
          //       })
          //     } else {
          //       let id = this.$route.query.id
          //       if (id) {
          //         this.form.roleId = id
          //         this.updateCrmRole(this.form)
          //       } else {
          //         this.insertCrmRole(this.form)
          //       }
          //     }
          //   }
          // })
          let id = this.$route.query.id
          if (id) {
            this.form.roleId = id
            this.updateCrmRole(this.form)
          } else {
            RoleManageAjax.validRoleName(this.form).then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.$notify({
                    type: 'error',
                    message: '该角色名称已存在!'
                  })
                } else {
                  this.insertCrmRole(this.form)
                }
              }
            })
          }
        }
      })
    },
    goback () {
      this.$router.push({path: '/basic-manage/role-manage'})
    },
    async queryBusinessMenuList (val) { // 根据业务菜单类型查询菜单列表（角色管理）
      return new Promise((resolve, reject) => {
        RoleManageAjax.queryBusinessMenuList(val).then(res => {
          if (res.code === 200) {
            this.form.roleMenuPartParamList = res.data.map(item => {
              item.menuIdList = []
              return item
            })
          }
          resolve(res.data)
        })
      })
    },
    insertCrmRole (val) { // 新增物流公司
      RoleManageAjax.insertCrmRole(val).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.$notify({
              type: 'error',
              message: '该角色名称已存在！'
            })
          } else {
            this.$router.push({path: '/basic-manage/role-manage'})
            this.$notify({
              type: 'success',
              message: '新增成功！'
            })
          }
        }
      })
    },
    updateCrmRole (val) { // 修改物流公司
      RoleManageAjax.updateCrmRole(val).then(res => {
        if (res.code === 200) {
          this.$router.push({path: '/basic-manage/role-manage'})
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    },
    setCheckedKeys (value) {
      value.forEach(item => {
        this.form.roleMenuPartParamList.forEach((innerItem, index) => {
          let treeIndex = `tree${index}`
          if (innerItem.id === item.rolePosition) {
            this.$refs[treeIndex][0].setCheckedKeys(item.menuIdList)
          }
        })
      })
    },
    async updateCrmRoleEcho (val) { // 修改回显角色
      return new Promise((resolve, reject) => {
        RoleManageAjax.updateCrmRoleEcho(val).then(res => {
          if (res.code === 200) {
            this.form.roleName = res.data.roleName
            this.form.roleType = res.data.roleType
            this.form.roleId = res.data.roleId
            if (res.data.roleType === 2) {
              this.form.logisticsId = res.data.logisticsId
              this.form.logisticsIdOld = res.data.logisticsId
              this.form.rolePosition = res.data.rolePosition
            }
            this.setCheckedKeys(res.data.roleMenuPartParamList)
          }
          resolve(res.data)
        })
      })
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.role-card{
  .card_main{
    -padding: 30px 40px;
  }
    .default-tabs{
    .el-tabs__content {
      overflow: auto;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.role-card{
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
