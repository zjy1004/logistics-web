<template>
  <div class="Settlement-For-Customers-QueryList">
    <div class="public_card">
      <h3 class="card_header">{{waybillTitle}}</h3>
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="110px">

              <el-form-item label="开单日期:">
                <el-date-picker
                  style="width: 458px;"
                  v-model="dateValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="客户名称:" prop="clientId" v-if="clientIdShow">
                <el-select v-model.number="form.clientId" filterable placeholder="请选择客户" clearable>
                  <el-option
                    v-for="(item) in clientIdOptions"
                    :key="item.id"
                    :label="item.clientName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <div class="box" v-show="showMoreSearch">
              <el-form-item label="发货方:" prop="sendClientName" v-if="sendClientNameDisabled">
                <search-by-name
                  ref="searchSendName"
                  :searchType="'send'"
                  :placeholderText="'请输入发货方名称'"
                />
              </el-form-item>
              <el-form-item label="收货方:" prop="receiveClientName" v-if="receiveClientNameDisabled">
                <search-by-name
                  ref="searchReceiveName"
                  :searchType="'receive'"
                  :placeholderText="'请输入收货方名称'"
                />
              </el-form-item>

              <el-form-item label="运单号:" prop="waybillNumber" v-if="waybillNumberShow">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>

              <el-form-item label="司机:" prop="driverId" v-if="queryDriverShow">
                <el-select v-model.number="form.driverId" placeholder="请选择司机" clearable>
                  <el-option
                    v-for="(item, index) in driverOptions"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="站点:" prop="stationId">
                <el-select v-model.number="form.stationId" filterable placeholder="请选择站点" clearable>
                  <el-option
                    v-for="(item, index) in stationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="线路:" prop="pkLine" v-if="pkLineShow">
                <el-select v-model="form.pkLine" filterable placeholder="请选择线路" @change="changeLine(form.pkLine)" clearable>
                  <el-option
                    v-for="(item, index) in lineNameOptions"
                    :key="index"
                    :label="item.generateVal"
                    :value="item.generateKey">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="班次:" prop="shiftRunName" v-if="shiftRunNameDisabled">
                <el-time-select
                  style="width:168px;"
                  v-model="form.shiftRunName"
                    :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '18:30'
                  }"
                  placeholder="选择发车班次">
                </el-time-select>
              </el-form-item>

              <el-form-item label="运输状态:" prop="waybillStatus" v-if="waybillStatusShow">
                <el-select v-model.number="form.waybillStatus" filterable placeholder="请选择运输状态" clearable>
                  <el-option
                    v-for="(item, index) in waybillState"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="结算方式:" prop="freightSettlementMethod" v-if="waybillStatusShow">
                <el-select v-model.number="form.freightSettlementMethod" placeholder="请选择结算方式" clearable>
                  <el-option
                    v-for="(item, index) in freightSettlementMethodOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="结算状态:" prop="settlementStatus" v-if="financeStatusShow">
                <el-select v-model.number="form.settlementStatus" filterable placeholder="请选择结算状态" clearable>
                  <el-option
                    v-for="(item, index) in settlementStatus"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运单类型:" prop="waybillClassify" v-if="waybillTypeShow">
                <el-select v-model.number="form.waybillClassify" filterable placeholder="请选择运单类型" clearable>
                  <el-option
                    v-for="(item, index) in waybillClassifyOption"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              </div>
            </el-form>
          </div>

        </div>
        <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <div class="toggle-con" @click="showMoreSearch = !showMoreSearch">{{showMoreSearch ? '收起' : '展开'}}</div>
        </div>

        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
            <el-button class="btn-main" @click="batchSettlement" v-if="batchSettlementDisabled">批量确认结算</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              :summary-method="getSummaries"
              :show-summary = "this.$route.query.index === '1' ? true : false"
              border>
              <el-table-column
                :key="1"
                v-if="checkboxShow"
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                :key="2"
                v-if="receivablePersonNameShow"
                min-width="10%"
                prop="receivablePersonName"
                label="收款人">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.receivablePersonName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="3"
                v-if="paySumShow"
                min-width="10%"
                prop="paySum"
                label="总计（元）"
                :render-header="renderColTip">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.paySum}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="4"
                v-if="actualFreightShow"
                min-width="10%"
                prop="actualFreight"
                label="实收运费（元）">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.actualFreight}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="5"
                v-if="actualPaymentGoodsShow"
                min-width="10%"
                prop="actualPaymentGoods"
                label="实收代收（元）">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.actualPaymentGoods}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="6"
                min-width="16%"
                prop="waybillNumber"
                label="运单号">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.waybillNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="7"
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="10%"
                prop="createTime"
                label="开单日期">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="8"
                v-if="sendClientNameShow"
                min-width="15%"
                prop="sendClientName"
                :label=ReceivingGoodsName>
              </el-table-column>
              <el-table-column
                :key="9"
                v-if="receiveClientNameShow"
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                :key="10"
                v-if="driverShow"
                min-width="15%"
                prop="driverName"
                label="司机">
              </el-table-column>
              <el-table-column
                :key="11"
                v-if="sendStationNameShow"
                min-width="15%"
                prop="sendStationName"
                label="发货站点">
              </el-table-column>
              <el-table-column
                :key="12"
                v-if="lineNameShow"
                min-width="10%"
                prop="lineName"
                label="线路">
              </el-table-column>
              <el-table-column
                :key="13"
                v-if="shiftRunNameShow"
                min-width="10%"
                prop="shiftRunName"
                label="班次">
              </el-table-column>
              <el-table-column
                :key="14"
                v-if="packageQuantityShow"
                min-width="4%"
                prop="packageQuantity"
                label="件数">
              </el-table-column>
              <el-table-column
                :key="15"
                v-if="receivableGoodsShow"
                min-width="10%"
                prop="receivableGoods"
                label="代收货款（元）">
              </el-table-column>
              <el-table-column
                :key="16"
                v-if="receivableFreightShow"
                min-width="10%"
                prop="receivableFreight"
                label="运费(元）">
              </el-table-column>
              <el-table-column
                :key="17"
                v-if="waybillStatusNameShow"
                min-width="10%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <el-table-column
                :key="18"
                v-if="freightPayerShow"
                min-width="10%"
                prop="freightPayerName"
                label="费用支付方">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.freightPayerName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="19"
                min-width="10%"
                prop="financeStatusName"
                label="结算状态">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.financeStatusName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="20"
                v-if="freightSettlementMethodShow"
                min-width="10%"
                prop="freightSettlementMethod"
                label="结算方式">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="140">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" v-if="scope.row.checkShow" @click="check(scope.row)">查看</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="scope.row.confirmSettlementShow" @click="confirmSettlement(scope.row)">确认结算</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :dom="this.$refs.form"
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
    <v-dialog
    v-if="dialogVisible"
    :mainText="receiptMainInfo"
    :dialogVisible="dialogVisible"
    @click-cancel="ReceiptCancel"
    @click-sure="ReceiptSure"
    />
    <settlement-dialog
      v-if="settlementDialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="settlementDialogVisible"
      @click-cancel="settlementCancel"
      @click-sure="settlementSure"
      :editInfoProps="settlementEditInfo"
    />
    <pay-dialog
      v-if="showPay"
      :dialogVisible="showPay"
      :merchantNo="merchantNo"
      @click-cancel-form="clickCancel"
      @click-sure-form="clickPaySure"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import waybillManageAjax from '@/api/WaybillManage/WaybillManage'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import VDialog from '@/components/Dialog/Dialog'
import SettlementDialog from '../FinancWaybillManage/subpage/SettlementDialog'
import { mapGetters } from 'vuex'
import PayDialog from '../OutstandingWaybill/subpage/PayDialog'
import SearchByName from '@/components/SearchByName/SearchByName'

export default {
  data () {
    return {
      showMoreSearch: true,
      dateValue: '', // 选择范围日期
      ReceivingGoodsName: '发货方', // 发货方或者是结款方
      dialogTitle: '',
      dialogWidth: '',
      settlementEditInfo: [], // 编辑结算信息
      dialogVisible: false,
      settlementDialogVisible: false, // 待结算弹框是否显示
      waybillId: [], // 当前行主键ID
      waybillInfoList: [], // 运单确认收款
      freightPayerParmers: '',
      waybillTitle: '',
      batchSettlementDisabled: false,
      packageQuantityShow: true,
      receivableGoodsShow: true,
      checkboxShow: true,
      driverShow: false,
      waybillStatusShow: true,
      financeStatusShow: true,
      receivableFreightShow: true,
      waybillStatusNameShow: true,
      lineNameShow: true,
      shiftRunNameShow: true,
      sendStationNameShow: true,
      sendClientNameShow: true,
      receiveClientNameShow: true,
      waybillNumberShow: true,
      pkLineShow: true,
      queryDriverShow: true,
      shiftRunNameDisabled: true,
      sendClientNameDisabled: true,
      receiveClientNameDisabled: true,
      clientIdShow: true,
      receivablePersonNameShow: true,
      actualFreightShow: true,
      actualPaymentGoodsShow: true,
      freightPayerShow: true,
      freightSettlementMethodShow: true,
      StatisticsTableShow: true,
      paySumShow: true,
      waybillTypeShow: true, // 运单类型
      showPay: false, // 确认支付
      form: {
        clientId: '', // 客户名称
        stationId: '', // 站点
        // logisticsId: '', // 物流公司
        waybillNumber: '', // 运单号
        sendClient: '', // 发货方
        receiveClient: '', // 收货方
        pkLine: '', // 线路
        shiftRunName: '', // 班次
        waybillStatus: '', // 运输状态
        createTimeStart: '', // 创建时间起
        createTimeEnd: '', // 创建时间止
        settlementStatus: '', // 结算状态
        queryStatus: '',
        driverId: '', // 司机
        freightSettlementMethod: '', // 结算方式
        receiveClientName: '', // 收货方名称
        sendClientName: '', // 发货方名称
        waybillClassify: '', // 运单分类
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      multipleSelection: [],
      companyOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      waybillState: [
        {id: 3, name: '已签收'},
        {id: 4, name: '已拒签'},
        {id: 5, name: '已完成'}
      ],
      settlementStatus: [
        {id: 1, name: '待收款'},
        {id: 2, name: '待结算'},
        {id: 3, name: '待支付'},
        {id: 4, name: '已完成'},
        {id: 5, name: '已结算'},
        {id: 6, name: '已支付'}
      ],
      waybillClassifyOption: [
        {id: 2, name: '驮付宝运单'},
        {id: 1, name: '非驮付宝运单'}
      ],
      freightSettlementMethodOptions: [
        {id: 1, name: '现结'},
        {id: 2, name: '月结'},
        {id: 3, name: '包月'}
      ],
      CollectMoneyOptions: [
        {id: 1, name: '待交款'},
        {id: 2, name: '待收款'},
        {id: 3, name: '全部'}
      ],
      tableData: [],
      lineNameOptions: [], // 线路列表
      stationOptions: [], // 站点列表
      driverOptions: [], // 司机列表
      // sendClientNameOptions: [], // 发货方
      // receiveClientNameOptions: [], // 收货方
      clientIdOptions: [], // 收发货方的集合
      merchantNo: '', // 交易流水号
      receiveFeeData: [], // 收货方统计列表
      payeeFeeData: [] // 收款人统计列表
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let flag = newVal.query.index
      this.whichPage(flag)
    },
    dateValue (newVal, oldVal) {
      if (!newVal) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = newVal[0]
        this.form.createTimeEnd = newVal[1]
      }
    }
  },
  computed: {
    ...mapGetters(['formatDate', 'formatCurrentDate'])
  },
  created () {
    this.whichPage()
    this.queryLineNameList()
    this.getStationList()
    this.getDriversList()
    this.GetClientData()
  },
  methods: {
    whichPage (flag) {
      this.dateValue = ''
      this.form.clientId = '' // 客户名称
      this.form.stationId = ''// 站点
      this.form.waybillNumber = '' // 运单号
      this.form.sendClient = '' // 发货方
      this.form.receiveClient = '' // 收货方
      this.form.pkLine = '' // 线路
      this.form.shiftRunName = '' // 班次
      this.form.waybillStatus = '' // 运单状态
      this.form.createTimeStart = '' // 创建时间起
      this.form.createTimeEnd = '' // 创建时间止
      this.form.settlementStatus = '' // 结算状态
      this.form.driverId = '' // 司机
      this.form.waybillClassify = ''
      this.ReceivingGoodsName = '结款方' // 发货方或者是结款方
      this.waybillTitle = '待结算运单'
      this.freightSettlementMethodShow = true
      this.batchSettlementDisabled = true
      this.lineNameShow = false
      this.shiftRunNameShow = false
      this.sendStationNameShow = false
      this.sendClientNameShow = true
      this.packageQuantityShow = false
      this.checkboxShow = true
      this.receivableFreightShow = false
      this.waybillStatusNameShow = false
      this.queryDriverShow = true
      this.waybillStatusShow = false
      this.financeStatusShow = false
      this.receiveClientNameShow = false
      this.waybillTypeShow = false
      this.pkLineShow = true
      this.shiftRunNameDisabled = true
      this.sendClientNameDisabled = false
      this.receiveClientNameDisabled = false
      this.clientIdShow = true
      this.receivablePersonNameShow = false
      this.actualFreightShow = false
      this.actualPaymentGoodsShow = false
      this.paySumShow = false
      this.freightPayerShow = false
      this.StatisticsTableShow = false
      this.receivableGoodsShow = true

      this.form.queryStatus = 2
      this.queryAllList(this.form)
    },
    search () {
      if (this.form.createTimeStart) {
        this.form.createTimeStart = this.formatDate(this.form.createTimeStart)
      }
      if (this.form.createTimeEnd) {
        this.form.createTimeEnd = this.formatDate(this.form.createTimeEnd)
      }
      this.form.currentPage = 1
      let flag = this.$route.query.index
      if (flag === '1') {
        this.form.sendClientName = this.$refs.searchSendName.form.searchName
        this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
        this.FinanceReceivableWaybillList(this.form)
      } else if (flag === '3') {
        this.form.sendClientName = this.$refs.searchSendName.form.searchName
        this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
        this.queryAllList(this.form)
      } else {
        this.queryAllList(this.form)
      }
    },
    reset () {
      this.form.freightSettlementMethod = ''
      this.form.driverId = ''
      this.form.waybillClassify = ''
      this.form.receivablePerson = ''
      this.form.clientId = '' // 客户名称
      this.form.stationId = ''// 站点
      this.form.waybillNumber = '' // 运单号
      this.form.sendClient = '' // 发货方
      this.form.receiveClient = '' // 收货方
      this.form.pkLine = '' // 线路
      this.form.shiftRunName = '' // 班次
      this.form.waybillStatus = '' // 运单状态
      this.dateValue = ''
      this.form.settlementStatus = '' // 结算状态
      let flag = this.$route.query.index
      if (flag === '1') {
        this.$refs.searchSendName.form.searchName = ''
        this.$refs.searchReceiveName.form.searchName = ''
        // this.dateValue = [this.formatCurrentDate(), this.formatCurrentDate()]
        this.dateValue = ''
      }
      if (flag === '3') {
        this.$refs.searchSendName.form.searchName = ''
        this.$refs.searchReceiveName.form.searchName = ''
      }
    },
    encodeParam (json) {
      let tmps = []
      for (var key in json) {
        tmps.push(key + '=' + json[key])
      }
      return tmps.join('&')
    },
    selectionId (arr) {
      arr = arr.map(item => {
        return item.waybillId
      })
      return arr.join(',')
    },
    exportExcel () {
      let flag = this.$route.query.index
      if (flag === '1') {
        let url = process.env.API_BASE_URL + '/waybill/financeManage/queryFinanceWaitReceivableWaybillExport' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
        window.location.href = url
        this.FinanceReceivableWaybillList(this.form)
      } else {
        let url = process.env.API_BASE_URL + '/waybill/financeManage/exports' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
        window.location.href = url
        this.queryAllList(this.form)
      }
    },
    ReceiptSure () { // 弹窗确认收款
      this.Receipt(this.waybillInfoList)
    },
    ReceiptCancel () {
      this.dialogVisible = false
      this.waybillId = []
    },
    settlementSure (val) { // 确认结算
      let obj = {}
      obj.waybillIdList = val
      this.Settlement(obj)
    },
    settlementCancel () {
      this.settlementEditInfo = []
      this.settlementDialogVisible = false
    },
    check (row) {
      this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: this.waybillTitle, waybillId: row.waybillId, freightPayer: row.freightPayer}})
    },
    // 点击支付完成
    clickPaySure (type) {
      // 1处理中 2成功 3失败
      if (type === 2) {
        this.$notify({
          type: 'success',
          message: '支付成功！'
        })
        this.queryAllList(this.form)
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
    },
    confirmSettlement (row) { // 结算
      this.dialogTitle = '请核对以下运单是否已结账'
      this.dialogWidth = '886px'
      this.settlementEditInfo.push(row)
      this.settlementDialogVisible = !this.settlementDialogVisible
    },
    batchSettlement () {
      if (this.multipleSelection < 1) { // 批量确认结算
        this.$notify({
          type: 'error',
          message: '请您选择要结算的行!'
        })
      } else {
        this.dialogTitle = '请核对以下运单是否已结账'
        this.dialogWidth = '886px'
        this.settlementEditInfo = this.multipleSelection
        this.settlementDialogVisible = !this.settlementDialogVisible
      }
    },
    changePage (pageSize, pageNumber) {
      this.form.pageSize = pageSize
      this.form.currentPage = pageNumber
      let flag = this.$route.query.index
      if (flag === '1') {
        this.FinanceReceivableWaybillList(this.form)
      } else {
        this.queryAllList(this.form)
      }
    },
    changePageSize (pageSize) {
      this.form.pageSize = pageSize
      this.form.currentPage = 1
      let flag = this.$route.query.index
      if (flag === '1') {
        this.FinanceReceivableWaybillList(this.form)
      } else {
        this.queryAllList(this.form)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeLine (val) {
      // this.shiftList({lineId: val, beginDate: this.form.createTimeStart, endDate: this.form.createTimeEnd})
    },
    queryAllList (val) { // 全部运单列表
      WaybillApiAjax.FinanceList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            if (item.freightSettlementMethod === 1) {
              item.freightSettlementMethod = '现结'
            }
            if (item.freightSettlementMethod === 2) {
              item.freightSettlementMethod = '月结'
            }
            if (item.freightSettlementMethod === 3) {
              item.freightSettlementMethod = '包月'
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '待发货'
            }
            if (item.waybillStatus === 2) {
              item.waybillStatusName = '运输中'
            }
            if (item.waybillStatus === 3) {
              item.waybillStatusName = '已签收'
            }
            if (item.waybillStatus === 4) {
              item.waybillStatusName = '已拒签'
            }
            if (item.waybillStatus === 5) {
              item.waybillStatusName = '已完成'
            }
            if (item.financeStatus === 1) {
              item.financeStatusName = '待收款'
              item.checkShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 2) {
              if (item.waybillClassify === 1) {
                item.financeStatusName = '待结算'
                item.checkShow = true
                item.confirmSettlementShow = true
              }
              if (item.waybillClassify === 2) {
                item.financeStatusName = '待支付'
                item.checkShow = true
              }
            }
            if (item.financeStatus === 5) {
              item.financeStatusName = '已支付'
              item.checkShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 4) {
              item.financeStatusName = '已结算'
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            if (item.financeStatus === 3) {
              item.financeStatusName = '已完成'
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            if (item.financeStatus === 6) {
              item.financeStatusName = '已取消'
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            if (item.financeStatus === 7) {
              item.financeStatusName = '已拒签'
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            if (item.financeStatus === 10) {
              item.financeStatusName = '线下待收款'
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    FinanceReceivableWaybillList (val) { // 待收款查询
      WaybillApiAjax.FinanceReceivableWaybillList(val).then(res => {
        if (res.code === 200) {
          this.receiveFeeData = res.data.receiveFee
          this.payeeFeeData = res.data.payeeFee
          this.tableData = res.data.list.map(item => {
            // 运费支付方
            if (item.freightPayer === 1) {
              item.freightPayerName = '发货方'
            }
            if (item.freightPayer === 2) {
              item.freightPayerName = '收货方'
            }
            // 结算状态
            item.financeStatusName = '待收款'
            if (item.financeStatus === 1) {
              item.checkShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 10) {
              item.checkShow = true
              item.confirmSettlementShow = false // 确认结算
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        } else {
          this.tableData = []
        }
      })
    },
    queryLineNameList (val) { // 线路列表
      ShiftPlanAjax.queryLineNameList(val).then(res => {
        if (res.code === 200) {
          this.lineNameOptions = res.data
        }
      })
    },
    getStationList (val) { // 物流公司下站点列表
      WaybillApiAjax.getStationList(val).then(res => {
        if (res.code === 200) {
          this.stationOptions = res.data
        }
      })
    },
    getDriversList (val) { // 物流公司下司机列表
      WaybillApiAjax.getDriversList(val).then(res => {
        if (res.code === 200) {
          this.driverOptions = res.data
        }
      })
    },
    Receipt (val) { // 确认收款
      WaybillApiAjax.Receipt(val).then(res => {
        if (res.code === 200) {
          this.waybillId = []
          this.dialogVisible = false
          let flag = this.$route.query.index
          if (flag === '1') {
            this.FinanceReceivableWaybillList(this.form)
          } else {
            this.queryAllList(this.form)
          }
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        }
      })
    },
    Settlement (val) { // 确认结算
      WaybillApiAjax.Settlement(val).then(res => {
        if (res.code === 200) {
          this.settlementDialogVisible = false
          this.settlementEditInfo = []
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        }
      })
    },
    exports (val) { // 导出EXCEL
      WaybillApiAjax.exports(val).then(res => {
        if (res.code === 200) {
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '导出成功！'
          })
        }
      })
    },
    GetClientData (val) { // 1修理厂2经销商
      waybillManageAjax.GetClientData(val).then(res => {
        if (res.code === 200) {
          // this.receiveClientNameOptions = res.data[1]
          // this.sendClientNameOptions = res.data[2]
          this.clientIdOptions = res.data[1].concat(res.data[2])
        }
      })
    },
    renderColTip (h, {column, $index}) {
      let colProp = column.property
      let colTipText = ''
      switch (colProp) {
        case 'paySum': // 总计（元）
          colTipText = '总计=实收运费+实收代收'
          break
        default:
          break
      }
      return (
        <div class="render-col-header">
          <span>{column.label}</span>
          <i class="el-icon-warning">
            <div class="tip-con">{colTipText}</div>
            <div class="tip-icon"></div>
          </i>
        </div>
      )
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })
      return sums
    }

  },
  components: {
    VPagination,
    VDialog,
    SettlementDialog,
    SearchByName,
    PayDialog

  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.Settlement-For-Customers-QueryList{
  .adjustmentCol {
    color: #f00;
  }
  .el-form-item__label {
    width: 110px !important;
  }
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
    white-space: normal!important;
    justify-content: center;
    .el-icon-warning{
      position: relative;
      font-size: 16px;
      text-indent: 0px;
      cursor: pointer;
      color: #747484;
      margin-left: 3px;
      .tip-con{
        display: none;
        position: absolute;
        z-index: 1;
        padding: 3px 5px;
        top: -60px;
        left: -70px;
        width: 170px;
        height: 50px;
        line-height: 15px;
        text-align: left;
        // overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 5px;
        padding: 0px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-warning:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .el-icon-warning:hover{
    color: #4689f2;
    .tip-con,.tip-icon{
      display: block;
    }
  }
  .el-table{
    overflow: visible;
    .el-table__header-wrapper, .el-table__footer-wrapper{
      overflow: visible;
    }
    th{
      overflow: visible;
      text-align: center;
      .cell{
        overflow: visible;
      }
      div.tip-con{
        white-space: normal;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../../style/base.less';
.Settlement-For-Customers-QueryList{
  display: flex;
  flex: 1;
  min-height: 768px;
  overflow-y: auto;
  overflow-x: hidden;
  .StatisticsTable {
    display: flex;
    height: 100px;
    flex-direction: row;
    margin-bottom: 40px;
    .leftTable {
      border: 1px solid #e6ecf8;
      margin: 20px 20px 20px 40px;
      width: 100%;
      height: 100%;
    }
    .rightTable {
      border: 1px solid #e6ecf8;
      margin: 20px 40px 20px 20px;
      width: 100%;
      height: 100%;
    }
    .top {
      width: 100%;
      height: 30px;
      background-color: #f0f2fa;
      border-bottom: 1px solid #e6ecf8;
      ul {
        height: 30px;
        li{
          display: inline-block;
          width: 32%;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
    .bottom {
      width: 100%;
      height: 100px;
      .li {
        width: 100%;
        height: 30px;
        .ul li{
          display: inline-block;
          width: 32%;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
  }
  .public_card .card_main {
    // overflow-y: scroll;
    // overflow-x: hidden;
    overflow: auto;
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

}
</style>
