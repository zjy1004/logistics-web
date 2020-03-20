<template>
  <div class="site-list">
    <div class="public_card">
      <!-- <h3 class="card_header">站点管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="站点名称:" prop="stationName">
                <el-input v-model="form.stationName" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="站点种类:" prop="stationType">
                <el-select v-model="form.stationType" filterable placeholder="请选择站点种类" clearable>
                  <el-option
                    v-for="(item, index) in stationTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="物流公司:" prop="pkLogistics">
                <el-select v-model="form.pkLogistics" placeholder="请选择物流公司" clearable>
                  <el-option
                    v-for="(item, index) in logisticsList"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="状态:" prop="stationStatus">
                <el-select v-model="form.stationStatus" placeholder="请选择状态" clearable>
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
            <el-button @click="add">+ 新建站点</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <!-- <el-table-column
                type="selection"
                width="40">
              </el-table-column> -->
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="stationName"
                label="站点名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="logisticsName"
                label="所属物流公司">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="stationTypeName"
                label="站点种类">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="stationArea"
                label="站点所在区域">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="stationStatusName"
                label="状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="queryDetail(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.stationStatus==='1' ? '启用': '禁用'}}</a>
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
import SiteManageAjax from '@/api/SiteManage/SiteManage'
// import CarManageAjax from '@/api/CarManage/CarManage'

export default {
  name: 'SiteManage',
  data () {
    return {
      clickSearch: false,
      logisticsList: [], // 物流公司
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        stationName: '', // 站点名称
        stationType: '', // 站点种类
        // pkLogistics: '', // 物流公司
        stationStatus: '' // 站点状态
      },
      querySchema: {
        stationName: '', // 站点名称
        stationType: '', // 站点种类
        // pkLogistics: '', // 物流公司
        stationStatus: '', // 站点状态
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      tableData: [],
      multipleSelection: [],
      stationTypeOptions: [ // 站点种类
        {
          id: 1,
          name: '服务站'
        },
        {
          id: 2,
          name: '分拨点'
        },
        {
          id: 3,
          name: '驿站'
        }
      ]
    }
  },
  created () {
    // this.QueryLogisticsList()
    this.QueryCrmSiteList(this.querySchema)
  },
  methods: {
    changePage (pageSize, pageNumber) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = pageNumber
      this.QueryCrmSiteList(this.querySchema)
    },
    changePageSize (pageSize) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = '1'
      this.QueryCrmSiteList(this.querySchema)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.clickSearch = true
      this.querySchema.stationName = this.form.stationName
      this.querySchema.stationType = this.form.stationType
      // this.querySchema.pkLogistics = this.form.pkLogistics
      this.querySchema.stationStatus = this.form.stationStatus
      this.querySchema.currentPage = 1
      this.QueryCrmSiteList(this.querySchema)
    },
    queryDetail (row) { // 查看
      this.$router.push({path: '/basic-manage/creat-site', query: {id: row.id, type: 'check'}})
    },
    edit (row) { // 修改信息
      this.$router.push({path: '/basic-manage/creat-site', query: {id: row.id, type: 'edit'}})
    },
    enable (row) { //  启用禁用
      let obj = {}
      obj.id = row.id
      if (row.stationStatus === '1') {
        obj.status = 0
      } else {
        obj.status = 1
      }
      this.updateStationStatus(obj)
    },
    add () { // 新建站点
      this.$router.push({path: '/basic-manage/creat-site'})
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
    updateStationStatus (val) { // 禁用/启用站点
      SiteManageAjax.updateStationStatus(val).then(res => {
        if (res.code === 200) {
          this.QueryCrmSiteList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
        if (res.code === 10014) {
          this.QueryCrmSiteList(this.querySchema)
          this.$notify({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    QueryCrmSiteList (val) { // 获取站点管理列表
      SiteManageAjax.QueryCrmSiteList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.stationStatus === '0') {
              item.stationStatusName = '启用'
            }
            if (item.stationStatus === '1') {
              item.stationStatusName = '禁用'
            }
            if (item.stationType === '1') {
              item.stationTypeName = '服务站'
            }
            if (item.stationType === '2') {
              item.stationTypeName = '分拨点'
            }
            if (item.stationType === '3') {
              item.stationTypeName = '驿站'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    }
    // QueryLogisticsList (val) { // 物流公司列表
    //   CarManageAjax.getLogisticsList(val).then(res => {
    //     if (res.code === 200) {
    //       this.logisticsList = res.data
    //     }
    //   })
    // }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.site-list{
  display: flex;
  flex: 1;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    .table-con{
      display: flex;
      flex: 1;
      height: auto;
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
