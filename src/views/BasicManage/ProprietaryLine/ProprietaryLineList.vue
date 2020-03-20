<template>
  <div class="proprietary-line-list">
    <div class="public_card">
      <!-- <h3 class="card_header">自营线路</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="线路名称:" prop="lineName">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="上游站点:">
                <el-select v-model="form.departureStation" filterable placeholder="请选择上游站点" clearable>
                  <el-option
                    v-for="(item, index) in stationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下游站点:">
                <el-select v-model="form.destinationStation" filterable placeholder="请选择下游站点" clearable>
                  <el-option
                    v-for="(item, index) in stationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="配送范围:">
                <el-select v-model="form.lineType" @change="lineTypeChange(form.lineType)" filterable placeholder="请选择配送范围" clearable>
                  <el-option
                    v-for="(item, index) in lineTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="线路状态:">
                <el-select v-model="form.enableFlag" filterable placeholder="请选择线路状态" clearable>
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
            <!-- <el-button v-if="isAdmin" class="downloadTemplate"><a :href="downloadUrl">下载模板</a></el-button> -->
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="3%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="departureStationName"
                label="上游站点">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="destinationStationName"
                label="下游站点">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="lineTypeName"
                label="配送范围">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="enableFlag"
                label="线路状态">
                <template slot-scope="scope">
                  <span>{{scope.row.enableFlag === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="look(scope.row)">查看</a>
                   <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.enableFlag === 0 ? true : false" @click="edit(scope.row)">修改信息</a>
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
export default {
  name: 'ProprietaryLineList',
  data () {
    return {
      clickSearch: false,
      logisticsId: '', // 当前登录人物流公司id
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        lineName: '', // 线路名称
        departureStation: '', // 上游站点
        destinationStation: '', // 下游站点
        lineType: '', // 配送范围---提交时需转为数组
        enableFlag: '', // 线路状态
        lineTypeList: [3, 4]
      },
      stationOptions: [], // 上游、下游站点下拉集合
      lineTypeOptions: [{id: '', name: '全部'}, {id: 3, name: '自营同城调度'}, {id: 4, name: '自营城际调度'}], // 配送范围
      tableData: []
    }
  },
  created () {
    this.init()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      this.logisticsId = JSON.parse(userInfo).logisticsId
    }
  },
  methods: {
    init () {
      this.queryStations()
      this.queryList()
    },
    // 查询上游站点及下游站点下拉框数据
    queryStations () {
      CustomerRouteAjax.QueryStations({logisticsId: this.logisticsId}).then(response => {
        if (response.code === 200) {
          this.stationOptions = response.data
        }
      })
    },
    lineTypeChange (lineType) {
      if (!lineType) {
        this.form.lineTypeList = [3, 4]
      } else {
        this.form.lineTypeList = [lineType]
      }
    },
    queryList (type) {
      let lineQueryParam = Object.assign({}, this.form)
      if (lineQueryParam.lineType === 3) { // 同城调度
        lineQueryParam.lineTypeList = [3]
      } else if (lineQueryParam === 4) {
        lineQueryParam.lineTypeList = [4]
      }
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
      this.$router.push({name: 'LookProprietaryLine', query: { id: row.lineId }})
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'ProprietaryLineCard', query: { id: row.lineId, lineType: row.lineType, from: 'edit' }})
    },
    add () { // 新建线路
      this.$router.push({name: 'ProprietaryLineCard', query: { from: 'add' }})
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
.proprietary-line-list{
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
.proprietary-line-list{
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
  .edit,.upload-btn{
    display: inline-block;
  }
}
</style>
