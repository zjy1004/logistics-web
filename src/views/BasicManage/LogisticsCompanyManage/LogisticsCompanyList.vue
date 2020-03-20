<template>
  <div class="logistics-company-list">
    <div class="public_card">
      <!-- <h3 class="card_header">物流公司管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="物流公司简称:" prop="logisticsName">
                <el-select v-model="form.logisticsName" filterable placeholder="请选择物流公司" clearable>
                  <el-option
                    v-for="(item, index) in logisticsList"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="区域:">
                <el-select v-model="form.provinceName" filterable placeholder="请选择省" @change="changeP(form.provinceName)" clearable>
                  <el-option
                    v-for="(item, index) in areaPList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
                -
                <el-select v-model="form.cityName" filterable placeholder="请选择市" clearable>
                  <el-option
                    v-for="(item, index) in areaCList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" prop="logisticsStatus">
                <el-select v-model.number="form.logisticsStatus" placeholder="请选择状态" clearable>
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
            <el-button @click="add">+ 新建物流公司</el-button>
          </div>
          <div class="table-con">
            <el-table
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
                prop="logisticsName"
                label="物流公司名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="operateAddress"
                label="所在区域（市）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="roleName"
                label="已开通角色">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="logisticsStatusName"
                label="状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="queryDetail(scope.row)">查看</a>
                  <a class="reset" href="javascript:;" type="text" size="small" @click="resetPassword(scope.row)">重置密码</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.logisticsStatus===1 ? '启用': '禁用'}}</a>
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
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'
import SiteManageAjax from '@/api/SiteManage/SiteManage'
export default {
  name: 'LogisticsStaffList',
  data () {
    return {
      clickSearch: false,
      logisticsList: [],
      companyOptions: [],
      areaPList: [],
      areaCList: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        'cityName': '',
        'logisticsName': '',
        'logisticsStatus': '',
        'phone': '',
        'provinceName': ''
      },
      tableData: [],
      multipleSelection: [],
      querySchema: {
        'cityName': '',
        'logisticsName': '',
        'logisticsStatus': '',
        'phone': '',
        'provinceName': '',
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      }
    }
  },
  created () {
    this.QueryLogisticsList()
    this.QueryList(this.querySchema)
    let obj = {}
    obj.areaParentCode = 0
    this.QueryAreaList(obj, 'province')
  },
  computed: {
    provinceCode () {
      return this.form.provinceName
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.areaPList.forEach(item => {
          if (this.form.cityName !== item) {
            this.form.cityName = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    }
  },
  methods: {
    changePage (pageSize, pageNumber) {
      this.querySchema.currentPage = pageNumber
      this.querySchema.pageSize = pageSize
      this.QueryList(this.querySchema)
    },
    changePageSize (pageSize) {
      this.querySchema.currentPage = 1
      this.querySchema.pageSize = pageSize
      this.QueryList(this.querySchema)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.clickSearch = true
      this.querySchema.logisticsName = this.form.logisticsName
      this.querySchema.cityName = this.form.cityName
      this.querySchema.provinceName = this.form.provinceName
      this.querySchema.logisticsStatus = this.form.logisticsStatus
      this.querySchema.phone = this.form.phone
      this.querySchema.currentPage = 1
      this.QueryList(this.querySchema)
    },
    queryDetail (row) { // 查看
      this.$router.push({path: '/basic-manage/creat-logistics-company', query: {id: row.id, type: 'check'}})
    },
    resetPassword (row) {
      this.resetPasswordFn({userId: row.userId})
    },
    edit (row) { // 修改信息
      this.$router.push({path: '/basic-manage/creat-logistics-company', query: {id: row.id, type: 'edit'}})
    },
    enable (row) { //  启用禁用
      let obj = {}
      obj.logisticsId = row.id
      if (row.logisticsStatus === 1) {
        obj.logisticsStatus = 0
      } else {
        obj.logisticsStatus = 1
      }
      this.updateLogisticsStatus(obj)
    },
    add () { // 新建物流公司
      this.$router.push({path: '/basic-manage/creat-logistics-company', query: {type: 'add'}})
    },
    changeP (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'city')
    },
    disableRow () { // 禁用
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要禁用的行!'
        })
      } else {

      }
    },
    QueryList (val) { // 获取物流公司管理列表
      LogisticsCompanyManage.QueryLogisticsCompanyList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.logisticsStatus === 0) {
              item.logisticsStatusName = '启用'
            }
            if (item.logisticsStatus === 1) {
              item.logisticsStatusName = '禁用'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    QueryAreaList (val, flag) { // 省市
      SiteManageAjax.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaCList = res.data
          }
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
    updateLogisticsStatus (val) { // 禁用/启用物流公司状态
      LogisticsCompanyManage.updateLogisticsStatus(val).then(res => {
        if (res.code === 200) {
          this.QueryList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
        // else if (res.code === 10013) {
        //   this.$notify({
        //     type: 'error',
        //     message: res.message
        //   })
        // }
      })
    },
    resetPasswordFn (val) { // 重置密码
      LogisticsCompanyManage.resetPassword(val).then(res => {
        if (res.code === 200) {
          this.QueryList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '重置成功！'
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

<style lang="less" scoped>
@import '../../../style/base.less';
.logistics-company-list{
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
    margin-top: 15px!important;
  }
}
</style>
