<template>
  <div class="logistics-staff-list">
    <div class="public_card">
      <!-- <h3 class="card_header">物流员工管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="姓名:" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入姓名" clearable  maxlength="5"></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="所属站点:" prop="stationId">
                <el-select v-model="form.stationId" filterable placeholder="请选择所属站点" clearable>
                  <el-option
                    v-for="(item, index) in stationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色:" prop="roleId">
                <el-select v-model="form.roleId" filterable placeholder="请选择角色" clearable>
                  <el-option
                    v-for="(item, index) in roleOptions"
                    :key="index"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="所属物流公司:" prop="logisticsId">
                <el-select v-model="form.logisticsId" placeholder="请选择物流公司" @change="logisticsCompanyChange" clearable>
                  <el-option
                    v-for="(item, index) in companyOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item> -->
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
            <el-button @click="add">+ 新建员工</el-button>
            <el-button @click="disableRow">禁用</el-button>
          </div>
          <div class="table-con">
            <el-table
              class="main-table"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="userName"
                label="员工姓名">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="roleName"
                label="角色">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="logisticsName"
                label="所属物流公司">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="stationName"
                label="所属站点">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="userStatus"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.userStatus === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="queryDetail(scope.row)">查看</a>
                  <a class="reset" href="javascript:;" type="text" size="small" @click="resetPassword(scope.row)">重置密码</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.userStatus === 1 ? '启用' : '禁用'}}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
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
import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'
import LoginAjax from '@/api/Login/Login'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'LogisticsStaffList',
  data () {
    return {
      clickSearch: false,
      companyOptions: [],
      stationOptions: [],
      roleOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        userName: '',
        phone: '',
        stationId: '',
        roleId: '',
        // logisticsId: '',
        userStatus: ''
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let searchBarHeight = document.getElementsByClassName('searchBar')[0].offsetHeight
    if (searchBarHeight > 86) {
      this.$nextTick(() => {
        let btn = document.getElementsByClassName('search-btn-con')[0]
        btn.style.marginTop = '5px'
      })
    } else {
      this.$nextTick(() => {
        let btn = document.getElementsByClassName('search-btn-con')[0]
        btn.style.marginTop = '15px'
      })
    }
  },
  methods: {
    init () {
      // this.queryLogisticsList()
      this.queryList()
      this.logisticsCompanyChange('')
    },
    logisticsCompanyChange (val) {
      LogisticsStaffAjax.QueryStationAndRoleSelect({logisticsId: val}).then(response => {
        if (response.code === 200) {
          this.stationOptions = response.data.logisticsStationParamList
          // this.form.stationId = this.stationOptions[0] ? this.stationOptions[0].stationId : ''
          this.roleOptions = response.data.logisticsPersonnelRoleParamList
          // this.form.roleId = this.roleOptions[0] ? this.roleOptions[0].roleId : ''
        }
      })
    },
    queryLogisticsList () {
      LogisticsStaffAjax.GetLogisticsAndAccount().then(response => {
        if (response.code === 200) {
          this.companyOptions = response.data
        }
      })
    },
    inputPhone () {
      this.form.phone = this.validateNum(this.form.phone)
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.queryList('searchBtn')
    },
    queryList (type) {
      let postData = {}
      postData = this.form
      postData.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      postData.pageSize = this.paginationParams.pageSize
      LogisticsStaffAjax.QueryList(postData).then(response => {
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
    queryDetail (row) { // 查看
      this.$router.push({name: 'LogisticsStaffDetail', query: {isAdd: false, id: row.userId, userStatus: row.userStatus}})
    },
    resetPassword (row) { // 重置密码
      LoginAjax.ResetPassword({userId: row.userId}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '重置密码成功！',
            type: 'success'
          })
        }
      })
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'LogisticsStaffCard', query: { isAdd: false, id: row.userId, userStatus: row.userStatus }})
    },
    enable (data) { // 启用禁用
      let postData = null
      let editType = ''
      if (Array.isArray(data)) { // 批量禁用
        postData = {
          userIdList: data,
          userStatus: 1
        }
        editType = '批量禁用'
      } else { // 行禁用
        postData = {
          userIdList: [data.userId],
          userStatus: data.userStatus === 1 ? 0 : 1
        }
        editType = data.userStatus === 1 ? '启用' : '禁用'
      }
      LogisticsStaffAjax.UpdateLogisticsPersonStatus(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: `${editType}成功！`,
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    add () { // 新增员工
      this.$router.push({name: 'LogisticsStaffCard', params: { isAdd: true }})
    },
    disableRow () { // 禁用
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要禁用的行!'
        })
      } else {
        let ids = this.multipleSelection.map(item => {
          return item.userId
        })
        this.enable(ids)
      }
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.logistics-staff-list{
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
  .pagination{
    margin: 10px 0;
    height: 28px;
  }
  .search-btn-con{
    margin-top: 15px;
  }
}
</style>
