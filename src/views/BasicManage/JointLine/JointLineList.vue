<template>
  <div class="joint-line-list">
    <div class="public_card">
      <!-- <h3 class="card_header">联营线路</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="线路归属:">
                <el-select v-model="form.logisticsId" filterable placeholder="请选择线路归属" clearable @change="changeInitiateLogistics(form.logisticsId)">
                  <el-option
                    v-for="(item, index) in logisticsOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="线路名称:">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="上游站点:">
                <el-select v-model="form.departureStation" filterable placeholder="请选择归属站点" clearable>
                  <el-option
                    v-for="(item, index) in UpStationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下游站点:">
                <el-select v-model="queryDownstreamByLogistics" filterable placeholder="请选择站点" clearable @change="changeDownstreamLogistics(queryDownstreamByLogistics)">
                  <el-option
                    v-for="(item, index) in downstreamLogisticsOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="form.destinationStation" filterable placeholder="请选择站点" clearable>
                <el-option
                  v-for="(item, index) in DownStationOptions"
                  :key="index"
                  :label="item.stationName"
                  :value="item.stationId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="配送范围:">
              <el-select v-model="form.lineType" placeholder="请选择配送范围" clearable>
                <el-option
                  v-for="(item, index) in DistributionScopeOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路状态:">
              <el-select v-model="form.enableFlag" placeholder="请选择线路状态" clearable>
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
            <el-button @click="add">+ 新建线路</el-button>
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
                prop="logisticsName"
                label="线路归属">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="departureStationName"
                label="上游站点">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="destinationStationName"
                label="下游站点">
                <template slot-scope="scope">
                  <span>{{scope.row.destinationStationLogisticsName}} - {{scope.row.destinationStationName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="lineTypeName"
                label="配送范围">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="enableFlagName"
                label="线路状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                   <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.enableFlag === 0 ? true : false" @click="edit(scope.row)">修改信息</a>
                  <a class="disable" href="javascript:;" type="text" size="small" @click="disable(scope.row)">{{scope.row.enableFlagName === '禁用' ? '启用': '禁用'}}</a>
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
// import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
import VPagination from '@/components/Pagination/Pagination'
import LinesManageAjax from '@/api/LinesManage/LinesManage'

let logisticsId
export default {
  name: 'JointLineList',
  data () {
    return {
      queryDownstreamByLogistics: '', // 关联物流公司（下游站点前）
      clickSearch: false,
      logisticsOptions: [], // 线路归属下拉框
      UpStationOptions: [], // 上游站点
      DownStationOptions: [], // 下游站点
      downstreamLogisticsOptions: [], // 下游站点物流公司
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      DistributionScopeOptions: [
        {name: '联营同城调度', id: 5},
        {name: '联营城际调度', id: 6}
      ],
      form: {
        logisticsId: '', // 归属
        lineName: '', // 线路名称
        departureStation: '', // 上游站点
        destinationStation: '', // 下游站点
        lineType: '',
        lineTypeList: [5, 6],
        enableFlag: ''
      },
      tableData: []
    }
  },
  created () {
    this.QueryLogisticsSelectInitiate()

    this.init()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      logisticsId = JSON.parse(userInfo).logisticsId
      this.form.logisticsId = logisticsId
    }
  },
  methods: {
    init () {
      this.queryList()
    },
    changeInitiateLogistics (val) { // 选择发起物流
      this.form.departureStation = ''
      this.queryDownstreamByLogistics = ''
      this.form.destinationStation = ''
      this.queryUpStations({logisticsId: val})
      this.QueryLogisticsSelectRelation({logisticsIdInitiate: val})
    },
    changeDownstreamLogistics (val) { // 选择关联结束物流查询下游站点
      this.form.destinationStation = ''
      this.queryDownStations({logisticsId: val})
    },
    // 查询所有联营物流公司下拉框选择(归属)
    QueryLogisticsSelectInitiate () {
      LinesManageAjax.QueryLogisticsSelectInitiate().then(response => {
        if (response.code === 200) {
          this.logisticsOptions = response.data
        }
      })
    },
    // 查询发起方联营物流公司的所有关联物流公司下拉框选择(下游站点物流公司)
    QueryLogisticsSelectRelation (val) {
      LinesManageAjax.QueryLogisticsSelectRelation(val).then(response => {
        if (response.code === 200) {
          this.downstreamLogisticsOptions = response.data
        }
      })
    },
    // 查询上游站点
    queryUpStations (val) {
      CustomerRouteAjax.QueryStations(val).then(response => {
        if (response.code === 200) {
          this.UpStationOptions = response.data
        }
      })
    },
    // 查询下游站点
    queryDownStations (val) {
      CustomerRouteAjax.QueryStations(val).then(response => {
        if (response.code === 200) {
          this.DownStationOptions = response.data
        }
      })
    },
    // 禁用/启用客户自营联营线路状态
    UpdateLineStatus (val) {
      LinesManageAjax.UpdateLineStatus(val).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '更新成功！',
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    queryList (type) {
      if (this.form.lineType === 5) {
        this.form.lineTypeList = [5]
      } else
      if (this.form.lineType === 6) {
        this.form.lineTypeList = [6]
      } else {
        this.form.lineTypeList = [5, 6]
      }
      let lineQueryParam = Object.assign({}, this.form)
      lineQueryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      lineQueryParam.pageSize = this.paginationParams.pageSize
      CustomerRouteAjax.QueryList(lineQueryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.enableFlag === 0) {
              item.enableFlagName = '启用'
            }
            if (item.enableFlag === 1) {
              item.enableFlagName = '禁用'
            }
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    search () {
      this.queryList('searchBtn')
    },
    check (row) { // 查看信息
      this.$router.push({name: 'CheckJointLine', query: { id: row.lineId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'JointLineCard', query: { id: row.lineId, from: 'edit' }})
    },
    disable (row) {
      let obj = {}
      obj.lineId = row.lineId
      if (row.enableFlag === 1) {
        obj.lineStatus = 0
      } else {
        obj.lineStatus = 1
      }
      this.UpdateLineStatus(obj)
    },
    add () { // 新建线路
      this.$router.push({name: 'JointLineCard', query: { from: 'add' }})
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.joint-line-list{
  .edit,.upload{
    display: inline-block;
  }
  .upload{
    .el-button{
      span{
        font-size: 14px;
        color: #5677fc;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.joint-line-list{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .searchBar{
    min-height: 130px!important;
  }
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
  .edit,.upload-btn{
    display: inline-block;
  }
}
</style>
