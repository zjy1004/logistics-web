<template>
  <div class="business-data-statistics">
    <div class="main-con">
      <div class="search-con">
        <el-radio-group style="margin-right:20px" size="small" v-model="form.categoryType" @change="dateClassicChange">
          <el-radio-button :label="1">日</el-radio-button>
          <el-radio-button :label="2">周</el-radio-button>
          <el-radio-button :label="3">月</el-radio-button>
          <el-radio-button :label="4">季度</el-radio-button>
          <el-radio-button :label="5">年</el-radio-button>
        </el-radio-group>
        <el-date-picker
          style="width: 400px;"
          v-model="createTime"
          type="daterange"
          @change="dateChange"
          clearable
          :picker-options="pickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="day" @change="selectDay" placeholder="选择天数" clearable>
          <el-option
            v-for="(item, index) in dayOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select class="logistics" v-model="form.logisticsId" placeholder="请选择物流公司" clearable filterable>
          <el-option
            v-for="(item, index) in logisticsOptions"
            :key="index"
            :label="item.logisticsName"
            :value="item.logisticsId">
          </el-option>
        </el-select>
        <el-button class="btn-main search-btn" @click="search">搜索</el-button>
      </div>
      <div class="common-title">
        <div class="blue-icon"></div>客户运营数据
      </div>
      <div class="total-con">覆盖经销商总数（家）：{{coverObj.agencyTotal}} ，覆盖修理厂总数（家）：{{coverObj.repairFactoryTotal}}</div>
      <div class="table-con">
        <el-table
          class="main-table"
          :data="clientTableData"
          style="width: 100%"
          height="375"
          stripe
          border>
          <el-table-column
            min-width="10%"
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            min-width="10%"
            prop="freight"
            label="运费（元）">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="receivableGoods"
            label="代收货款（元）">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="sendClientTotal"
            label="上游发货方数（家）">
          </el-table-column>
          <el-table-column
            min-width="20%"
            prop="receiveClientTotal"
            label="下游收货方数（家）">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-con">
        <div class="pagination-total-con">共{{clientPaginationParams.total}}条记录</div>
        <v-pagination
          :pageSize=clientPaginationParams.pageSize
          :total=clientPaginationParams.total
          :currentPage=clientPaginationParams.pageNum
          :dom="this.$refs.form"
          :clickSearch="clickSearch"
          @change-page-size="clientChangePageSize"
          @change-page="clientChangePage"
          class="pagination"
        />
      </div>
      <!-- <div class="common-title">
        <div class="blue-icon"></div>驮付宝业务数据
      </div>
      <div class="table-con online">
        <el-table
          class="main-table"
          :data="onlineTableData"
          style="width: 100%"
          height="375"
          stripe
          border>
          <el-table-column
            min-width="15%"
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="a"
            label="整体运单数">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="b"
            label="驮付宝运单数">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="c"
            label="代收货款">
          </el-table-column>
          <el-table-column
            min-width="15%"
            prop="d"
            label="中驰服务费收入">
          </el-table-column>
          <el-table-column
            min-width="20%"
            prop="e"
            label="支付物流商服务费分成">
          </el-table-column>
          <el-table-column
            min-width="20%"
            prop="f"
            label="支付量子通道费">
          </el-table-column>
          <el-table-column
            min-width="20%"
            prop="g"
            label="支付量子服务费分成">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-con">
        <div class="pagination-total-con">共{{onlinePaginationParams.total}}条记录</div>
        <v-pagination
          :pageSize=onlinePaginationParams.pageSize
          :total=onlinePaginationParams.total
          :currentPage=onlinePaginationParams.pageNum
          :dom="this.$refs.form"
          :clickSearch="clickSearch"
          @change-page-size="onlineChangePageSize"
          @change-page="onlineChangePage"
          class="pagination"
        />
      </div> -->
      <div class="common-title">
        <div class="blue-icon"></div>驮付宝运单占比
      </div>
      <div class="bar-con">
        <bar-echarts
          :id="'waybill-bar'"
          :legendArr="clientLegendArr"
          :dataArr="waybillBarData"
          :onLineName="'waybillByOnlineTotal'"
          :totalName="'waybillByAllTotal'"
          :width="'100%'"
          :height="'100%'"
        />
      </div>
      <div class="common-title">
        <div class="blue-icon"></div>驮付宝代收货款占比
      </div>
      <div class="bar-con">
        <bar-echarts
          :id="'amount-bar'"
          :legendArr="amountLegendArr"
          :dataArr="amountBarData"
          :onLineName="'receivableGoodsByOlineSum'"
          :totalName="'receivableGoodsByAllSum'"
          :width="'100%'"
          :height="'100%'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getDay } from '@/tools/tools'
import Enums from '@/components/BaseFn/Enums'
import VPagination from '@/components/Pagination/Pagination'
import BarEcharts from '@/components/Echarts/BarEcharts'
import BusinessDataStatisticsAjax from '@/api/BusinessDataStatistics/BusinessDataStatistics'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
export default {
  name: 'BusinessDataStatistics',
  data () {
    return {
      dayOptions: [{id: 0, name: '全部'}, {id: -7, name: '近7天'}, {id: -30, name: '近30天'}],
      day: -7,
      createTime: '',
      pickerOptions: {
        disabledDate: this.disabledDate,
        onPick: this.onPick
      },
      minCreateTime: '',
      maxCreateTime: '',
      logisticsOptions: [],
      form: {
        minCreateTime: '', // 开始时间
        maxCreateTime: '', // 截止时间
        logisticsId: '',
        categoryType: 1 // 日，周，月
      },
      clientPaginationParams: {pageSize: 10, total: 0, pageNum: 1},
      onlinePaginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      clientTableData: [],
      coverObj: {
        agencyTotal: '', // 经销商
        repairFactoryTotal: '' // 修理厂
      },
      onlineTableData: [],
      clientLegendArr: ['整体运单数', '驮付宝运单数', '驮付宝占比'],
      waybillBarData: [{}],
      amountLegendArr: ['整体代收货款（元）', '驮付宝代收货款（元）', '驮付宝占比'],
      amountBarData: [{}]
    }
  },
  components: {
    VPagination,
    BarEcharts
  },
  created () {
    this.selectDay(this.day)
    this.init()
  },
  methods: {
    init () {
      this.queryLogisticsList()
      this.queryWaybillPart()
      this.queryClientTableList()
      // this.queryAmountTableList()
      this.queryWaybillByOnlinePart()
      this.queryReceivableGoodsByOline()
    },
    dateClassicChange (val) {
      this.minCreateTime = ''
      this.maxCreateTime = ''
      this.form.minCreateTime = ''
      this.form.maxCreateTime = ''
      this.createTime = []
      if (val !== 1) {
        this.notDay = true
      } else {
        this.notDay = false
      }
      this.pickerOptions = {...this.pickerOptions}
    },
    onPick (times) {
      if (times.minDate) {
        this.minCreateTime = times.minDate
      } else if (times.maxDate) {
        this.maxCreateTime = times.maxDate
      }
    },
    disabledDate (time) {
      var num = 1
      if (this.notDay) { // 如果不是日选中,按照720天算间隔
        num = 4
      }
      if (this.minCreateTime) {
        return time.getTime() < (new Date(this.minCreateTime).getTime()) || time.getTime() > (new Date(this.minCreateTime).getTime() + Enums.DURING_TIME * num)
      } else if (this.maxCreateTime) {
        return time.getTime() > (new Date(this.maxCreateTime).getTime()) || time.getTime() < (new Date(this.maxCreateTime).getTime() - Enums.DURING_TIME * num)
      } else {
        return false
      }
    },
    // 天数下拉框改变
    selectDay (day) {
      this.minCreateTime = ''
      this.maxCreateTime = ''
      if (day === 0) {
        this.form.minCreateTime = ''
        this.form.maxCreateTime = ''
      } else {
        this.form.minCreateTime = getDay(day)
        this.form.maxCreateTime = getDay(0)
      }
      this.createTime = []
      this.day = day
      this.search()
    },
    // 物流公司列表
    queryLogisticsList (val) {
      WaybillApiAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsOptions = res.data
        }
      })
    },
    // 查询客户运营列表数据
    queryClientTableList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.clientPaginationParams.pageNum
      queryParam.pageSize = this.clientPaginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      BusinessDataStatisticsAjax.QueryClientWaybillList(queryParam).then(response => {
        if (response.code === 200) {
          this.clientTableData = response.data.list
          this.clientPaginationParams.pageNum = response.data.currentPage
          this.clientPaginationParams.total = response.data.total
        }
      })
    },
    // 查询覆盖
    queryWaybillPart () {
      BusinessDataStatisticsAjax.WaybillByOnlinePartQuery(this.form).then(response => {
        if (response.code === 200) {
          this.coverObj = {...response.data}
        }
      })
    },
    // 查询驮付宝业务列表数据
    queryAmountTableList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.onlinePaginationParams.pageNum
      queryParam.pageSize = this.onlinePaginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      // BusinessDataStatisticsAjax.QuerywaybillByOnlinePartList(queryParam).then(response => {
      //   if (response.code === 200) {
      //     debugger
      //     this.tableData = response.data.list
      //     this.onlinePaginationParams.pageNum = response.data.currentPage
      //     this.onlinePaginationParams.total = response.data.total
      //   }
      // })
    },
    // 查询驮付宝运单占比
    queryWaybillByOnlinePart () {
      BusinessDataStatisticsAjax.QueryWaybillByOnlinePartList(this.form).then(response => {
        if (response.code === 200) {
          this.waybillBarData = response.data
        }
      })
    },
    // 查询驮付宝代收货款占比
    queryReceivableGoodsByOline () {
      BusinessDataStatisticsAjax.QueryReceivableGoodsByOlineList(this.form).then(response => {
        if (response.code === 200) {
          this.amountBarData = response.data
        }
      })
    },
    // 查询
    search () {
      this.queryWaybillPart()
      this.queryClientTableList('searchBtn')
      this.queryWaybillByOnlinePart()
      this.queryReceivableGoodsByOline()
    },
    dateChange (val) {
      this.day = ''
      if (!val) {
        // this.minCreateTime = ''
        // this.maxCreateTime = ''
        this.createTime = ''
        this.form.minCreateTime = ''
        this.form.maxCreateTime = ''
      } else {
        this.minCreateTime = ''
        this.maxCreateTime = ''
        this.form.minCreateTime = val[0]
        this.form.maxCreateTime = val[1]
      }
    },
    // 客户运营数据
    clientChangePage (pageSize, pageNumber) {
      this.clientPaginationParams.pageNum = pageNumber
      this.queryClientTableList()
    },
    // 客户运营数据
    clientChangePageSize (pageSize) {
      this.clientPaginationParams.pageNum = 1
      this.clientPaginationParams.pageSize = pageSize
      this.queryClientTableList()
    },
    // 驮付宝业务数据
    onlineChangePage (pageSize, pageNumber) {
      this.onlinePaginationParams.pageNum = pageNumber
      this.queryAmountTableList()
    },
    // 驮付宝业务数据
    onlineChangePageSize (pageSize) {
      this.onlinePaginationParams.pageNum = 1
      this.onlinePaginationParams.pageSize = pageSize
      this.queryAmountTableList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.business-data-statistics {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  .main-con{
    display: flex;
    flex-direction: column;
    height: 1493px;
    background: #fff;
    margin: 20px;
    padding: 0px 35px;
    .search-con{
      width: 100%;
      height: 60px;
      background: #fff;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .common-title{
      height: 50px;
      display: flex;
      align-items: center;
      .mixin-sc(15px;#333);
      font-weight: bold;
      border-bottom: 1px solid rgb(242, 242, 242);
      .blue-icon{
        width: 3px;
        height: 16px;
        background: rgb(96, 116, 211);
        margin-right: 10px;
      }
    }
    .total-con{
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: right;
      .mixin-sc(15px;#333);
    }
    .table-con{
      height: 375px;
    }
    .online{
      margin-top: 20px;
    }
    .bar-con{
      width: 100%;
      height: 390px;
      margin-top: 10px;
    }
  }
  .pagination-con{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .pagination-total-con{
      margin: 10px 0;
      width: 200px;
      height: 28px;
      line-height: 28px;
      margin-left: 20px;
      .mixin-sc(14px;#333);
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.business-data-statistics{
  .search-con{
    .logistics-name.el-input{
      width: 300px;
      margin-right: 20px;
    }
    .el-select{
      width: 100px;
      margin: 0px 20px;
    }
    .el-select.logistics{
      width: 180px;
    }
  }
}
</style>
