<template>
  <div class="outstanding-waybill">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <div class="common-search">
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
                <el-form-item label="司机:" prop="driverId">
                  <el-select v-model.number="form.driverId" @change="lineChange" placeholder="请选择司机" clearable filterable>
                    <el-option
                      v-for="item in driverOptions"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运单号:" prop="waybillNumber">
                  <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
                </el-form-item>
              </div>
              <transition name="draw">
                <div class="box" v-show="showMoreSearch">
                  <el-form-item label="站点:" prop="stationId">
                    <el-select v-model.number="form.stationId" placeholder="请选择站点" clearable>
                      <el-option
                        v-for="item in stationOptions"
                        :key="item.stationId"
                        :label="item.stationName"
                        :value="item.stationId">
                      </el-option>
                    </el-select>
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
                    <el-select v-model.number="form.pkLine" @change="lineChange" placeholder="请选择线路" clearable filterable>
                      <el-option
                        v-for="item in lineOptions"
                        :key="item.generateKey"
                        :label="item.generateVal"
                        :value="item.generateKey">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="班次:" prop="shiftRunName">
                    <el-input v-model="form.shiftRunName" placeholder="请输入班次" clearable></el-input>
                    <!-- <el-time-select
                      v-model="form.shiftRunName"
                      :picker-options="{
                        start: '08:30',
                        step: '00:30',
                        end: '18:30'
                      }"
                      placeholder="选择发车班次">
                    </el-time-select> -->
                  </el-form-item>
                </div>
              </transition>
            </el-form>
          </div>
        </div>
        <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <div class="toggle-con" @click="showMoreSearch = !showMoreSearch">{{showMoreSearch ? '收起' : '展开'}}</div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
            <el-button class="btn-main" @click="batchSurePay">批量确认支付</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="6%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
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
                min-width="12%"
                prop="receivableGoods"
                label="代收货款（元）">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="settlementMethod"
                label="结算方式">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="financeStatusName"
                label="结算状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="surePay(scope.row)">确认支付</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
          <pay-dialog
            v-if="showPay"
            :dialogVisible="showPay"
            :merchantNo="merchantNo"
            @click-cancel-form="clickCancel"
            @click-sure-form="clickPaySure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
import PayDialog from './subpage/PayDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'OutstandingWaybill',
  data () {
    return {
      showMoreSearch: true,
      showPay: false,
      activeNames: ['1'],
      stationOptions: [], // 站点
      driverOptions: [], // 司机下拉
      lineOptions: [], // 线路下拉
      shiftOptions: [], // 班次下拉
      form: {
        queryStatus: 3,
        stationId: '', // 站点
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        driverId: '', // 司机
        sendClientName: '', // 发货方
        receiveClientName: '', // 收货方
        waybillNumber: '', // 运单号
        pkLine: '', // 线路
        shiftRunName: '' // 班次
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: [],
      merchantNo: '' // 交易流水号
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName,
    PayDialog
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
      this.getStationList()
      this.getDriversList()
      this.queryLineNameList()
      this.queryList()
    },
    getStationList () { // 物流公司下站点列表
      WaybillApiAjax.getStationList().then(res => {
        if (res.code === 200) {
          this.stationOptions = res.data
        }
      })
    },
    getDriversList () { // 物流公司下司机列表
      WaybillApiAjax.getDriversList().then(res => {
        if (res.code === 200) {
          this.driverOptions = res.data
        }
      })
    },
    queryLineNameList (val) { // 线路列表
      ShiftPlanAjax.queryLineNameList(val).then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
        }
      })
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      OutstandingWaybillAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            item.settlementMethod = '驮付宝现金支付'
            item.financeStatusName = '待支付'
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    search () {
      this.form.sendClientName = this.$refs.searchSendName.form.searchName
      this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
      this.queryList('searchBtn')
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
      this.$refs.searchSendName.form.searchName = ''
      this.$refs.searchReceiveName.form.searchName = ''
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
    // 线路变化
    lineChange () {

    },
    // 批量确认支付
    batchSurePay () {
      if (this.selection.length > 0) {
        let ids = this.selection.map(item => {
          return item.waybillId
        }).join(',')
        OutstandingWaybillAjax.Pay({orderIds: ids}).then(response => {
          if (response.code === 200) {
            this.merchantNo = response.data.merchantNo
            this.showPay = true
            window.open(response.data.pcUrl)
          }
        })
      } else {
        this.$notify({
          type: 'error',
          message: '请选择支付行！'
        })
      }
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/exports'
      exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
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
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    },
    // 行确认支付
    surePay (row) {
      OutstandingWaybillAjax.Pay({orderIds: [row.waybillId]}).then(response => {
        if (response.code === 200) {
          this.merchantNo = response.data.merchantNo
          this.showPay = true
          window.open(response.data.pcUrl)
        }
      })
    },
    // 行查询
    check (row) {
      // this.$router.push({name: 'OutstandingWayDetail', query: { waybillId: row.waybillId }})
      this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: '待支付运单', waybillId: row.waybillId}})
    },
    // 点击支付完成
    clickPaySure (type) {
      // 1处理中 2成功 3失败
      if (type === 2) {
        this.$notify({
          type: 'success',
          message: '支付成功！'
        })
        this.queryList()
      } else if (type === 3) {
        this.$notify({
          type: 'error',
          message: '支付失败！'
        })
      } else {
        this.$notify({
          type: 'error',
          message: '支付处理中！'
        })
      }
      this.showPay = false
    },
    clickCancel () {
      this.showPay = false
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.outstanding-waybill{
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-select .el-input.is-disabled .el-input__inner{
    height: 32px;
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.outstanding-waybill{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 30px;
    margin-top: 0px;
    background: #fff;
    .btn-con{
      height: 34px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .table-con{
      display: flex;
      flex: 1;
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
  }
}
</style>
