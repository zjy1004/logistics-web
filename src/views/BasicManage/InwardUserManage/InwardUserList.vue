<template>
  <div class="inward-user-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">内部用户管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="姓名:" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入姓名" maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="角色:" prop="roleId">
                <el-select v-model.number="form.roleId" placeholder="请选择角色" clearable>
                  <el-option
                    v-for="(item, index) in roleOptions"
                    :key="index"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" prop="userStatus">
                <el-select v-model.number="form.userStatus" placeholder="请选择状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button @click="add">+ 新建用户</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="userName"
                label="姓名">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="roleName"
                label="角色">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="position"
                label="组织机构">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="account"
                label="账号">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="userStatus"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.userStatus === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="220px">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="reset" href="javascript:;" type="text" size="small" @click="resetPassword(scope.row)">重置密码</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="disable" href="javascript:;" type="text" size="small" @click="disable(scope.row)">{{scope.row.userStatus === 0 ? '禁用' : '启用'}}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import InwardUserAjax from '@/api/InwardUserManage/InwardUserManage'
import LoginAjax from '@/api/Login/Login'
export default {
  name: 'InwardUserManage',
  data () {
    return {
      clickSearch: false,
      roleOptions: [],
      status: [{id: 1, name: '禁用'}, {id: 0, name: '启用'}],
      form: {
        userName: '',
        phone: '',
        roleId: '',
        userStatus: ''
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      tableData: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
      this.queryRoleOptions()
    },
    queryList (type) {
      let postData = Object.assign({}, this.form)
      postData.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      postData.pageSize = this.paginationParams.pageSize
      InwardUserAjax.QueryList(postData).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 内部用户管理查询角色下拉框
    queryRoleOptions () {
      InwardUserAjax.QueryInternalUserRoleList().then(response => {
        if (response.code === 200) {
          this.roleOptions = response.data
        }
      })
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
    },
    search () {
      this.queryList('searchBtn')
    },
    check (row) {
      this.$router.push({name: 'InwardUserDetail', query: {isAdd: false, id: row.userId, userStatus: row.userStatus}})
    },
    // 重置密码
    resetPassword (row) {
      LoginAjax.ResetPassword({userId: row.userId}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '重置密码成功！',
            type: 'success'
          })
        }
      })
    },
    add () {
      this.$router.push({name: 'InwardUserCard', query: { isAdd: true }})
    },
    edit (row) {
      this.$router.push({name: 'InwardUserCard', query: { isAdd: false, id: row.userId, userStatus: row.userStatus }})
    },
    // 禁用启用
    disable (row) {
      InwardUserAjax.UpdateLogisticsPersonnelStatus({userIdList: [row.userId], userStatus: row.userStatus === 0 ? 1 : 0}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: row.userStatus === 0 ? '禁用成功！' : '启用成功',
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageSize = pageSize
      this.queryList()
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.inward-user-manage{
  .search-btn-con{
    margin-top: 15px!important;
  }
  .pagination{
    margin-top: 10px;
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.inward-user-manage{
  display: flex;
  flex: 1;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    .table-con{
      display: flex;
      flex: 1;
    }
  }
}
</style>
