<template>
  <div class="role-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">角色管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="角色:" prop="roleName">
                <el-input v-model="form.roleName" placeholder="请输入角色" clearable></el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="roleStatus">
                <el-select v-model.number="form.roleStatus" placeholder="请选择状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色类型:" prop="roleType">
                <el-select v-model.number="form.roleType" placeholder="请选择角色类型" clearable>
                  <el-option
                    v-for="(item, index) in roleTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.roleType === 2" label="物流公司名称:" prop="logisticsId">
                <el-select v-model="form.logisticsId" filterable placeholder="请选择物流公司" clearable>
                  <el-option
                    v-for="(item, index) in logisticsList"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.logisticsId !== ''" label="角色职务:" prop="rolePosition">
                <el-select v-model="form.rolePosition" placeholder="请选择角色职务" clearable>
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
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button @click="add">+ 新建角色</el-button>
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
                min-width="12%"
                prop="roleName"
                label="角色名称">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="roleTypeName"
                label="角色类型">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="logisticsName"
                label="物流公司名称">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="rolePositionName"
                label="角色职务名称">
              </el-table-column>
              <el-table-column
                min-width="7%"
                prop="userCounts"
                label="人数">
              </el-table-column>
              <el-table-column
                min-width="7%"
                prop="statusName"
                label="状态">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip=true
                min-width="23%"
                prop="permission"
                label="已开通权限">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="createPerson"
                label="创建者">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="disable" href="javascript:;" type="text" size="small" @click="disable(scope.row)">{{scope.row.status ? '启用': '禁用'}}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
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
import RoleManageAjax from '@/api/RoleManage/RoleManage'
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'

export default {
  name: 'RoleManage',
  data () {
    return {
      clickSearch: false,
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      roleTypeList: [],
      logisticsList: [],
      rolePositionList: [],
      form: {
        logisticsId: '',
        roleName: '',
        roleStatus: '',
        roleType: '',
        rolePosition: '',
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      tableData: []
    }
  },
  created () {
    this.QueryList(this.form)
    this.QueryRoleTypeList()
    this.queryRolePositionList()
    this.QueryLogisticsList()
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
    search () {
      this.clickSearch = true
      this.form.currentPage = 1
      this.QueryList(this.form)
    },
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
    queryRolePositionList () { // 获取角色职务下拉
      RoleManageAjax.QueryRolePosition().then(res => {
        if (res.code === 200) {
          this.rolePositionList = res.data
        }
      })
    },
    changePage (pageSize, pageNumber) {
      this.form.currentPage = pageNumber
      this.form.pageSize = pageSize
      this.QueryList(this.form)
    },
    changePageSize (pageSize) {
      this.form.pageSize = pageSize
      this.QueryList(this.form)
    },
    add () {
      this.$router.push({path: '/basic-manage/role-card'})
    },
    edit (val) {
      this.$router.push({path: '/basic-manage/role-card', query: {id: val.id}})
    },
    disable (row) {
      let obj = {}
      obj.roleId = row.id
      if (row.status === 1) {
        obj.status = 0
      } else {
        obj.status = 1
      }
      this.updateRoleStatus(obj)
    },
    QueryLogisticsList (val) { // 物流公司列表
      LogisticsCompanyManage.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    QueryList (val) { // 获取角色管理列表
      RoleManageAjax.queryRoleList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            switch (item.roleType) {
              case 1:
                item.roleTypeName = '物流公司默认角色'
                break
              case 2:
                item.roleTypeName = '物流公司角色'
                break
              case 3:
                item.roleTypeName = '中驰车福角色'
                break
              case 4:
                item.roleTypeName = '客户角色'
                break
            }
            item.rowNum = index + 1
            if (item.status === 0) {
              item.statusName = '启用'
            }
            if (item.status === 1) {
              item.statusName = '禁用'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    updateRoleStatus (val) { // 禁用/启用角色
      RoleManageAjax.updateRoleStatus(val).then(res => {
        if (res.code === 200) {
          this.QueryList(this.form)
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
      })
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.role-manage{
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
.role-manage{
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
