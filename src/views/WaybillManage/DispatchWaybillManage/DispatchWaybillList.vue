<template>
  <div class="dispatch-waybill-list">
    <div class="public_card">
      <!-- <h3 class="card_header">调度运单查询</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="开单日期:" prop="createTime">
                <el-date-picker
                  style="width: 445px;"
                  v-model="form.createTime"
                  type="daterange"
                  @change="dateChange"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label="发货方:" prop="sendClientName">
                <search-by-name
                  ref="searchSendName"
                  :searchType="'send'"
                  :placeholderText="'请输入发货方名称'"
                />
              </el-form-item>
              <el-form-item label="收货方:" prop="receiveClientName">
                <search-by-name
                  ref="searchReceiveName"
                  :searchType="'receive'"
                  :placeholderText="'请输入收货方名称'"
                />
              </el-form-item>
              <el-form-item label="线路:" prop="pkLine">
                <el-select v-model="form.pkLine" filterable placeholder="请选择线路" clearable>
                  <el-option
                    v-for="(item, index) in lineOptions"
                    :key="index"
                    :label="item.generateVal"
                    :value="item.generateKey">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="配送类型:" prop="waybillDeliveryType">
                <el-select v-model="form.waybillDeliveryType" filterable placeholder="请选择配送类型" clearable>
                  <el-option
                    v-for="(item, index) in waybillDeliveryTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运输状态:" prop="waybillStatus">
                <el-select v-model.number="form.waybillStatus" placeholder="请选择运输状态" clearable>
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
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
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
                min-width="4%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="lineName"
                label="线路">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="waybillDeliveryTypeName"
                label="配送类型">
              </el-table-column>
              <el-table-column
                min-width="7%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="70">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="queryDetail(scope.row)">查看</a>
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
import DispatchWaybillManageAjax from '@/api/DispatchWaybillManage/DispatchWaybillManage'
import RouteAjax from '@/api/RouteManage/RouteManage'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
export default {
  name: 'DispatchWaybillList',
  data () {
    return {
      clickSearch: false,
      lineOptions: [],
      waybillDeliveryTypeOptions: [{id: '', name: '全部'}, {id: 2, name: '自营调度运单'}, {id: 3, name: '联营调度运单'}],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 11, name: '待装车'}, {id: 1, name: '已装车'}, {id: 2, name: '运输中'}, {id: 3, name: '已签收'}, {id: 4, name: '已拒签'}, {id: 6, name: '已取消'}],
      form: {
        createTime: '',
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
        waybillNumber: '', // 运单号
        sendClientName: '', // 发货方
        receiveClientName: '', // 收货方
        pkLine: '', // 线路id
        waybillDeliveryType: '', // 配送类型
        waybillStatus: '' // 运单状态
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryLineOptions()
      this.queryList()
    },
    queryLineOptions () {
      RouteAjax.QueryLines({lineType: 6}).then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
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
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.form.sendClientName = this.$refs.searchSendName.form.searchName
      this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
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
      DispatchWaybillManageAjax.QueryList(postData).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            this.waybillDeliveryTypeOptions.forEach(typeItem => {
              if (item.waybillDeliveryType === typeItem.id) {
                item.waybillDeliveryTypeName = typeItem.name
              }
            })
            this.status.forEach(statusItem => {
              if (item.waybillStatus === statusItem.id) {
                item.waybillStatusName = statusItem.name
              }
            })
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/dispatch/query/queryDispatchWaybillExports'
      // exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.createTime = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    queryDetail (row) { // 查看
      this.$router.push({name: 'WaybillDetail', query: {waybillTitle: '调度运单查询', waybillId: row.waybillId}})
    }
  },
  components: {
    VPagination,
    SearchByName
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.dispatch-waybill-list{
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
