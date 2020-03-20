<template>
  <div class="route-list">
    <div class="public_card">
      <!-- <h3 class="card_header">客户线路</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="线路名称:" prop="lineName">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" clearable></el-input>
              </el-form-item>
              <!-- <el-form-item label="途径站点:" prop="departureStation">
                <el-input v-model="form.departureStation" placeholder="请输入途径站点" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="归属站点:">
                <el-select v-model="form.departureStation" filterable placeholder="请选择归属站点" clearable>
                  <el-option
                    v-for="(item, index) in pkDepartureStationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="线路种类:" prop="lineType">
                <el-select v-model="form.lineType" filterable placeholder="请选择线路种类" clearable>
                  <el-option
                    v-for="(item, index) in pklineTypeOptions"
                    :key="index"
                    :label="item.typeName"
                    :value="item.typeId">
                  </el-option>
                </el-select>
              </el-form-item> -->
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
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="logisticsName"
                label="所属物流公司">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="departureStationName"
                label="线路归属站点">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="enableFlag"
                label="线路状态">
                <template slot-scope="scope">
                  <span>{{scope.row.enableFlag === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                min-width="20%"
                prop="lineTypeName"
                label="线路种类">
              </el-table-column> -->
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="look(scope.row)">查看</a>
                   <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                   <a class="edit" href="javascript:;" type="text" size="small" v-if="false" @click="edit(scope.row)">修改信息</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="enAble(scope.row)">{{scope.row.enableFlag === 0 ? '禁用' : '启用'}}</a>
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
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
import VPagination from '@/components/Pagination/Pagination'
let logisticsId
export default {
  name: 'CustomerRouteList',
  data () {
    return {
      clickSearch: false,
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        lineName: '',
        departureStation: '',
        lineTypeList: [1],
        logisticsId: ''
      },
      // 线路种类集合
      pklineTypeOptions: [
        {
          typeName: '站点派车',
          typeId: '1'
        },
        {
          typeName: '站点自取',
          typeId: '2'
        }
      ],
      // 归属站点集合
      pkDepartureStationOptions: [
      ],
      tableData: [], // 表格数据集合
      lineId: ''
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      logisticsId = JSON.parse(userInfo).logisticsId
      this.form.logisticsId = logisticsId
    }
    this.init()
  },
  computed: {
  },
  methods: {
    init () {
      this.queryList()
      this.queryStations()
    },
    queryStations () { // 获取站点
      CustomerRouteAjax.QueryStations({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.pkDepartureStationOptions = response.data
        }
      })
    },
    queryList (type) { // 获取列表
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
    look (row) { // 查看信息
      this.$router.push({name: 'LookCustomerRoute', query: { id: row.lineId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'CustomerRouteCard', query: { id: row.lineId, from: 'edit' }})
    },
    add () { // 新建线路
      this.$router.push({name: 'CustomerRouteCard', query: { from: 'add' }})
    },
    enAble (row) { // 禁用
      CustomerRouteAjax.EnableRouter({lineId: row.lineId, lineStatus: row.enableFlag === 0 ? 1 : 0}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '保存成功！',
            type: 'success'
          })
          this.queryList()
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
