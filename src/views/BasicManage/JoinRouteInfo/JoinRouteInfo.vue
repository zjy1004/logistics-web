<template>
  <div class="route-list">
    <div class="public_card">
      <!-- <h3 class="card_header">联营路由信息</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="上游起点:" prop="pkStationStart">
                <el-select v-model="form.pkStationStart" placeholder="请选择起点" clearable>
                  <el-option
                    v-for="(item, index) in departureStationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下游终点:" prop="endRouteAttribution">
                <el-select v-model="form.endRouteAttribution"  @change="logisticsChange('logisticsRelative')" placeholder="请选择物流公司" clearable>
                  <el-option
                    v-for="(item, index) in logisticsOption"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="pkStationEnd">
                <el-select v-model="form.pkStationEnd" placeholder="请选择终点" clearable>
                  <el-option
                    v-for="(item, index) in destinationStationOption"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="路由状态:">
                <el-select v-model="form.enableFlag" placeholder="请选择路由状态" clearable>
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
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="2%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="routeName"
                label="联营路由名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="pkStationStartSpliceLogisticName"
                label="上游起点">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="pkStationEndSpliceLogisticName"
                label="下游终点">
              </el-table-column>
              <el-table-column
                min-width="4%"
                prop="enableFlag"
                label="路由状态">
                <template slot-scope="scope">
                  <span>{{scope.row.enableFlag === 0 ? '启用' : '禁用'}}</span>
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
import JoinRouterConfigAjax from '@/api/RouterConfig/JoinRouteConfig'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'CustomerRouteList',
  data () {
    return {
      clickSearch: false, // 判断查询
      tableData: [], // 表格数据
      joinLogisticsOption: [], // 联营物流公司集合
      departureStationOptions: [], // 上游站点集合
      logisticsOption: [], // 下游物流公司集合
      destinationStationOption: [], // 下游站点集合
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        routeAttribution: '', // 路线归属物流公司
        pkStationStart: '', // 上游起点
        endRouteAttribution: '', // 下游归属物流公司
        pkStationEnd: '', // 下游终点
        enableFlag: '' // 路由禁用状态
      }
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      let logisticsId = JSON.parse(userInfo).logisticsId
      this.queryStationByLogisticsId(logisticsId, 'allLogistics')
      this.queryLogisticsSelectRelation(logisticsId)
    }
    this.init()
  },
  computed: {
  },
  methods: {
    init () {
      this.queryList()
    },
    queryLogisticsSelectRelation (id) { // 查询发起方联营物流公司的所有关联物流公司下拉框选择
      JoinRouterConfigAjax.QueryLogisticsSelectRelation({logisticsIdInitiate: id}).then(res => {
        if (res.code === 200) {
          this.logisticsOption = res.data
        }
      })
    },
    queryStationByLogisticsId (id, flag) { // 通过物流公司查站点
      JoinRouterConfigAjax.SelectStationListByPkLogistics({logisticsId: id}).then(response => {
        if (response.code === 200) {
          if (flag === 'allLogistics') {
            this.departureStationOptions = response.data
          }
          if (flag === 'logisticsRelative') {
            this.destinationStationOption = response.data
          }
        }
      })
    },
    logisticsChange (flag) { // 物流公司变化
      if (flag === 'logisticsRelative') {
        let logisticsId = this.form.endRouteAttribution
        this.queryStationByLogisticsId(logisticsId, flag)
      }
    },
    queryList (type) { // 获取列表
      let lineQueryParam = Object.assign({}, this.form)
      lineQueryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      lineQueryParam.pageSize = this.paginationParams.pageSize
      JoinRouterConfigAjax.QueryList(lineQueryParam).then(response => {
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
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    search () { // 查询
      this.queryList('searchBtn')
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.route-list{
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
  .downloadTemplate{
    a{
      font-size: 12px;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.route-list{
  display: flex;
  flex: 1;
  .searchBar{
    -min-height: 130px!important;
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
