<template>
  <div class="all-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">{{waybillTitle}}</h3> -->
      <div class="card_main">
        <div class="searchBar" id="search-bar">
          <div class="form-con">
            <el-form :inline="true" ref="form" id="search-form" :model="form" class="demo-form-inline" label-width="110px">
              <!-- <el-form-item label="物流公司:" prop="logisticsId">
                <el-select v-model="form.logisticsId" placeholder="请选择物流公司" @change="changeLogistics(form.logisticsId)" clearable>
                  <el-option
                    v-for="(item, index) in logisticsOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="收款人:" prop="receivablePerson" v-if="receivablePersonShow">
                <el-select v-model="form.receivablePerson" placeholder="请选择收款人" clearable>
                  <el-option
                    v-for="(item, index) in LogisticsPersonnelAllOptions"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>

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

              <el-form-item label="收款人交款状态:" prop="receivablePersonHandInStatus" v-if="receivablePersonHandInStatusShow">
                <el-select v-model.number="form.receivablePersonHandInStatus" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="(item,index) in receivablePersonHandInStatusOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="客户名称:" prop="clientName">
                 <el-input :title="form.clientName" v-model="form.clientName" placeholder="请输入客户名称" clearable></el-input>
                <!-- <el-select v-model.number="form.clientId" filterable placeholder="请选择客户" clearable>
                  <el-option
                    v-for="(item,index) in clientIdOptions"
                    :key="index"
                    :label="item.clientName"
                    :value="item.id">
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="结算日期:" v-if="settlementTimeShow">
                <el-date-picker
                  style="width: 400px;"
                  v-model="settleDateValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <div class="more-search-box" v-show="showMoreSearch">
                <!-- <el-form-item label="发货方:" prop="sendClientName" v-if="sendClientNameDisabled">
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
                </el-form-item> -->
                <el-form-item label="运单号:" prop="waybillNumber" v-if="waybillNumberShow">
                  <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
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
                  <el-input v-model="form.shiftRunName" placeholder="请输入班次" clearable></el-input>
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
                <el-form-item label="运费结算方式:" prop="freightSettlementMethod" v-if="waybillStatusShow">
                  <el-select v-model.number="form.freightSettlementMethod" placeholder="请选择运费结算方式" clearable>
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
                <el-form-item label="支付类型:" prop="waybillClassify" v-if="waybillTypeShow">
                  <el-select v-model.number="form.waybillClassify" filterable placeholder="请选择运单类型" clearable>
                    <el-option
                      v-for="(item, index) in waybillClassifyOption"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经营性质:" prop="waybillDeliveryType" v-if="waybillDeliveryTypeShow">
                  <el-select v-model.number="form.waybillDeliveryType" filterable placeholder="请选择经营性质" clearable>
                    <el-option
                      v-for="(item, index) in waybillDeliveryTypeOption"
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
          <!-- <div class="toggle-con" @click="moreSearch(pageFlag)">{{showMoreSearch ? '收起' : '展开'}}</div> -->
        </div>
        <div class="StatisticsTable" v-if="false">
          <div class="leftTable">
            <div class="top">
              <ul>
                <li><span style="font-size: 14px;">收款人</span></li>
              </ul>
            </div>
            <div class="bottom">
              <ul>
                <li class="li">
                  <ul class="ul">
                    <!-- <li><i class="el-icon-warning"><div class="tip-con">收款人已收款运单总和</div><div class="tip-icon"></div></i>应向财务交款总额:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[0].totalAmount: '-'}}</span></li> -->
                    <li>应向财务交款总额:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[0].totalAmount: '-'}}</span></li>
                    <li>代收货款:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[0].goodsAmount: '-'}}</span></li>
                    <li>运费:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[0].freightAmount: '-'}}</span></li>
                  </ul>
                </li>
                <li class="li">
                  <ul class="ul">
                    <!-- <li><i class="el-icon-warning"><div class="tip-con">费用支付方应付款总和</div><div class="tip-icon"></div></i>应向支付方收款总额:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[1].totalAmount: '-'}}</span></li> -->
                    <li>应向支付方收款总额:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[1].totalAmount: '-'}}</span></li>
                    <li>代收货款:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[1].goodsAmount: '-'}}</span></li>
                    <li>运费:&nbsp;&nbsp;<span>{{payeeFeeData&&payeeFeeData.length>0?payeeFeeData[1].freightAmount: '-'}}</span></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="rightTable">
            <div class="top">
              <ul>
                <li><span style="font-size: 14px;">收货方</span></li>
              </ul>
            </div>
            <div class="bottom">
              <ul>
                <li class="li">
                  <ul class="ul">
                    <!-- <li><i class="el-icon-warning"><div class="tip-con">收货方应付运单费用总和</div><div class="tip-icon"></div></i>应付款总额:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[0].totalAmount: '-'}}</span></li> -->
                    <li>应付款总额:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[0].totalAmount: '-'}}</span></li>
                    <li>代收货款:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[0].goodsAmount: '-'}}</span></li>
                    <li>运费:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[0].freightAmount: '-'}}</span></li>
                  </ul>
                </li>
                <li class="li">
                  <ul class="ul">
                    <!-- <li><i class="el-icon-warning"><div class="tip-con">收货方已支付运单金额总和</div><div class="tip-icon"></div></i>已付款总额:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[1].totalAmount: '-'}}</span></li> -->
                    <li>已付款总额:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[1].totalAmount: '-'}}</span></li>
                    <li>代收货款:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[1].goodsAmount: '-'}}</span></li>
                    <li>运费:&nbsp;&nbsp;<span>{{receiveFeeData&&receiveFeeData.length>0?receiveFeeData[1].freightAmount: '-'}}</span></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
            <el-button class="btn-main" @click="batchReceipt" v-if="batchReceiptDisabled">批量确认收款</el-button>
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
              id="elTable"
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
                min-width="14%"
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
                min-width="13%"
                prop="sendClientName"
                :label=ReceivingGoodsName>
              </el-table-column>

              <el-table-column
                :key="9"
                v-if="receiveClientNameShow"
                min-width="13%"
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
                min-width="13%"
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
                min-width="6%"
                prop="packageTotalQuantity"
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
                min-width="8%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <el-table-column
                :key="18"
                v-if="waybillDeliveryTypeShow"
                min-width="10%"
                prop="waybillDeliveryType"
                label="经营性质">
              </el-table-column>
              <el-table-column
                :key="19"
                v-if="waybillTypeShow"
                min-width="10%"
                prop="waybillClassifyName"
                label="支付类型">
              </el-table-column>
              <el-table-column
                :key="20"
                v-if="freightPayerShow"
                min-width="10%"
                prop="freightPayerName"
                label="费用支付方">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.freightPayerName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="financeStatusNameShow"
                :key="21"
                min-width="8%"
                prop="financeStatusName"
                label="结算状态">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.financeStatusName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="24"
                v-if="settlementTimeShow"
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="10%"
                prop="settlementTime"
                label="结算日期">
                <template slot-scope="scope">
                  <span :class="{'adjustmentCol': scope.row.feeUpdateFlag === 1}">{{scope.row.settlementTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="22"
                v-if="freightSettlementMethodShow"
                min-width="10%"
                prop="freightSettlementMethod"
                label="运费结算方式">
              </el-table-column>
              <el-table-column
                :key="23"
                v-if="payTypeShow"
                min-width="10%"
                prop="waybillClassify"
                label="支付类型">
                 <template slot-scope="scope">
                  <span>{{scope.row.waybillClassify === 1 ? '非驮付宝运单' : '驮付宝运单' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" v-if="scope.row.checkShow" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="disabledAllOperation && scope.row.confirmReceiptShow" @click="confirmReceipt(scope.row)">确认收款</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="disabledAllOperation && scope.row.confirmSettlementShow" @click="confirmSettlement(scope.row)">确认结算</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="disabledAllOperation && scope.row.confirmPaymentShow" @click="confirmPayment(scope.row)">确认支付</a>
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
// import waybillManageAjax from '@/api/WaybillManage/WaybillManage'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import VDialog from '@/components/Dialog/Dialog'
import SettlementDialog from './subpage/SettlementDialog'
import { mapGetters } from 'vuex'
import PayDialog from '../OutstandingWaybill/subpage/PayDialog'
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
import SearchByName from '@/components/SearchByName/SearchByName'

export default {
  data () {
    return {
      pageFlag: '', // 页面标识
      disabledAllOperation: false, // 全部运单禁用所有操作
      receiptMainInfo: '', // 确认收款提示文案
      showMoreSearch: true,
      dateValue: '', // 选择范围日期
      settleDateValue: '', // 结算日期范围
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
      batchReceiptDisabled: false,
      packageQuantityShow: true,
      receivableGoodsShow: true,
      checkboxShow: true,
      driverShow: false,
      waybillStatusShow: true,
      waybillClassifyShow: true,
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
      payTypeShow: false,
      waybillDeliveryTypeShow: true,
      settlementTimeShow: true,
      queryDriverShow: true,
      shiftRunNameDisabled: true,
      receivablePersonHandInStatusShow: true,
      // sendClientNameDisabled: true,
      // receiveClientNameDisabled: true,
      // clientIdShow: true,
      receivablePersonNameShow: true,
      receivablePersonShow: true,
      actualFreightShow: true,
      actualPaymentGoodsShow: true,
      freightPayerShow: true,
      freightSettlementMethodShow: true,
      StatisticsTableShow: true,
      financeStatusNameShow: true,
      paySumShow: true,
      waybillTypeShow: true, // 运单类型
      showPay: false, // 确认支付
      form: {
        clientName: '', // 客户名称
        waybillDeliveryType: '', // 经营性质
        // clientId: '', // 客户名称
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
        settlementTimeStart: '', // 结算时间起
        settlementTimeEnd: '', // 结算时间止
        settlementStatus: '', // 结算状态
        queryStatus: '',
        driverId: '', // 司机
        freightSettlementMethod: '', // 运费结算方式
        // receiveClientName: '', // 收货方名称
        // sendClientName: '', // 发货方名称
        receivablePerson: '', // 收款人
        receivablePersonHandInStatus: '', // 收款人交款状态
        waybillClassify: '', // 运单分类
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      multipleSelection: [],
      companyOptions: [],
      LogisticsPersonnelAllOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      waybillState: [
        {id: 11, name: '待装车'},
        {id: 1, name: '已装车'},
        {id: 2, name: '运输中'},
        {id: 3, name: '已签收'},
        {id: 4, name: '已拒签'}
        // {id: 5, name: '已完成'},
        // {id: 6, name: '已取消'}
      ],
      settlementStatus: [
        {id: 23, name: '待收款'},
        {id: 22, name: '待结算'},
        {id: 21, name: '待支付'},
        {id: 3, name: '已完成'},
        {id: 4, name: '已结算'},
        {id: 5, name: '已支付'},
        // {id: 6, name: '已取消'},
        {id: 7, name: '已拒签'}
      ],
      waybillClassifyOption: [
        {id: 2, name: '驮付宝运单'},
        {id: 1, name: '非驮付宝运单'}
      ],
      freightSettlementMethodOptions: [
        {id: 1, name: '现结'},
        {id: 2, name: '月结'},
        {id: 3, name: '包月'},
        {id: 4, name: '回付'}
      ],
      CollectMoneyOptions: [
        {id: 1, name: '待交款'},
        {id: 2, name: '待收款'},
        {id: 3, name: '全部'}
      ],
      receivablePersonHandInStatusOptions: [
        {id: 1, name: '收款人待交款'},
        {id: 10, name: '收款人待收款'}
      ],
      waybillDeliveryTypeOption: [
        {id: 3, name: '联营运单'},
        {id: 4, name: '自营运单'}
      ],
      tableData: [],
      lineNameOptions: [], // 线路列表
      // logisticsOptions: [], // 物流公司列表
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
      this.pageFlag = flag
    },
    dateValue (newVal, oldVal) {
      if (!newVal) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = newVal[0]
        this.form.createTimeEnd = newVal[1]
      }
    },
    settleDateValue (newVal, oldVal) {
      if (!newVal) {
        this.form.settlementTimeStart = ''
        this.form.settlementTimeEnd = ''
      } else {
        this.form.settlementTimeStart = newVal[0]
        this.form.settlementTimeEnd = newVal[1]
      }
    }
  },
  computed: {
    ...mapGetters(['formatDate', 'formatCurrentDate'])
  },
  created () {
    let elTable = document.getElementById('elTable')
    console.log(elTable)
    let flag = this.$route.query.index
    if (Number(flag) === 0) {
      this.disabledAllOperation = false // 全部运单禁用所有操作
    } else {
      this.disabledAllOperation = true
    }
    this.whichPage(flag)
    // this.queryLogisticsList()
    this.getStationList()
    this.getDriversList()
    let sessionClientData = JSON.parse(sessionStorage.getItem('allClientData'))
    if (sessionClientData) {
      // this.GetSessionClientData()
    } else {
      // this.GetClientData()
    }
  },
  methods: {
    whichPage (flag) {
      this.showMoreSearch = true
      // this.updateSearchHeight(flag)
      this.form.currentPage = 1
      if (flag === '0') {
        this.disabledAllOperation = false // 全部运单禁用所有操作
        this.dateValue = [this.formatCurrentDate(), this.formatCurrentDate()]
        this.form.createTimeStart = this.formatCurrentDate() // 创建时间起
        this.form.createTimeEnd = this.formatCurrentDate() // 创建时间止
        // this.form.clientId = '' // 客户名称
        this.form.clientName = '' // 客户名称
        this.form.stationId = ''// 站点
        this.form.waybillNumber = '' // 运单号
        this.form.sendClient = '' // 发货方
        this.form.receiveClient = '' // 收货方
        this.form.pkLine = '' // 线路
        this.form.shiftRunName = '' // 班次
        this.form.waybillStatus = '' // 运单状态
        this.form.settlementStatus = '' // 结算状态
        this.form.driverId = '' // 司机
        this.form.waybillClassify = ''
        this.ReceivingGoodsName = '发货方' // 发货方或者是结款方
        this.waybillTitle = '全部运单'
        this.batchSettlementDisabled = false
        this.batchReceiptDisabled = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.sendStationNameShow = true
        this.sendClientNameShow = true
        this.packageQuantityShow = true
        this.checkboxShow = false
        this.receivableFreightShow = true
        this.waybillStatusNameShow = true
        this.queryDriverShow = true
        this.waybillStatusShow = true
        this.financeStatusShow = true
        this.receiveClientNameShow = true
        this.waybillTypeShow = true
        this.waybillDeliveryTypeShow = true
        this.settlementTimeShow = true
        this.shiftRunNameDisabled = true
        this.freightSettlementMethodShow = true
        this.pkLineShow = true
        this.receivablePersonShow = false
        this.receivablePersonHandInStatusShow = false
        // this.sendClientNameDisabled = false
        // this.receiveClientNameDisabled = false
        // this.clientIdShow = true
        this.receivablePersonNameShow = false
        this.actualFreightShow = false
        this.actualPaymentGoodsShow = false
        this.paySumShow = false
        this.freightPayerShow = false
        this.StatisticsTableShow = false
        this.receivableGoodsShow = true
        this.payTypeShow = false
        this.financeStatusNameShow = true
        this.form.queryStatus = ''
        this.queryAllList(this.form)
        this.queryLineNameList()
      }
      if (flag === '1') {
        // this.dateValue = [this.formatCurrentDate(), this.formatCurrentDate()]
        this.disabledAllOperation = true // 全部运单禁用所有操作

        this.dateValue = ''
        this.settleDateValue = ''
        this.form.receivablePerson = '' // 收款人
        // this.form.clientId = '' // 客户名称
        this.form.clientName = '' // 客户名称
        this.form.stationId = ''// 站点
        this.form.waybillNumber = '' // 运单号
        this.form.sendClient = '' // 发货方
        this.form.receiveClient = '' // 收货方
        this.form.pkLine = '' // 线路
        this.form.shiftRunName = '' // 班次
        this.form.waybillStatus = '' // 运单状态
        // this.form.createTimeStart = this.formatCurrentDate() // 创建时间起
        this.form.createTimeStart = '' // 创建时间起
        // this.form.createTimeEnd = this.formatCurrentDate() // 创建时间止
        this.form.createTimeEnd = '' // 创建时间止
        this.form.settlementStatus = '' // 结算状态
        this.form.driverId = '' // 司机
        this.form.waybillClassify = ''
        this.ReceivingGoodsName = '发货方' // 发货方或者是结款方
        this.waybillTitle = '待收款运单'
        this.batchReceiptDisabled = true
        this.batchSettlementDisabled = false
        this.sendClientNameShow = false
        this.lineNameShow = false
        this.shiftRunNameShow = false
        this.sendStationNameShow = false
        this.checkboxShow = true
        this.freightSettlementMethodShow = false
        this.receivableFreightShow = false
        this.receivableGoodsShow = false
        this.waybillStatusNameShow = false
        this.packageQuantityShow = false
        this.queryDriverShow = false
        this.waybillStatusShow = false
        this.financeStatusShow = false
        this.receiveClientNameShow = false
        this.waybillTypeShow = false
        this.waybillDeliveryTypeShow = false
        this.settlementTimeShow = false
        this.pkLineShow = true
        this.shiftRunNameDisabled = false
        this.receivablePersonShow = true
        this.receivablePersonHandInStatusShow = true
        // this.sendClientNameDisabled = true
        // this.receiveClientNameDisabled = true
        // this.clientIdShow = false
        this.receivablePersonNameShow = true
        this.actualFreightShow = true
        this.actualPaymentGoodsShow = true
        this.paySumShow = true
        this.freightPayerShow = true
        this.StatisticsTableShow = true
        this.payTypeShow = false
        this.financeStatusNameShow = true

        this.form.queryStatus = 1
        // this.form.receivablePersonHandInStatus = 1
        this.FinanceReceivableWaybillList(this.form)
        this.QueryLogisticsPersonnelAll()
        this.queryLineNameList({lineType: 1})
        // this.queryAllList(this.form)
      }
      if (flag === '2') {
        this.disabledAllOperation = true // 全部运单禁用所有操作

        this.dateValue = ''
        this.settleDateValue = ''
        // this.form.clientId = '' // 客户名称
        this.form.clientName = '' // 客户名称
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
        this.batchReceiptDisabled = false
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
        this.waybillDeliveryTypeShow = false
        this.settlementTimeShow = false
        this.pkLineShow = true
        this.shiftRunNameDisabled = true
        this.receivablePersonShow = false
        this.receivablePersonHandInStatusShow = false
        // this.sendClientNameDisabled = false
        // this.receiveClientNameDisabled = false
        // this.clientIdShow = true
        this.receivablePersonNameShow = false
        this.actualFreightShow = false
        this.actualPaymentGoodsShow = false
        this.paySumShow = false
        this.freightPayerShow = false
        this.StatisticsTableShow = false
        this.receivableGoodsShow = true
        this.payTypeShow = false
        this.financeStatusNameShow = true

        this.form.queryStatus = 2
        this.queryAllList(this.form)
        this.queryLineNameList()
      }
      if (flag === '3') {
        this.disabledAllOperation = true // 全部运单禁用所有操作

        this.dateValue = ''
        this.settleDateValue = ''
        // this.form.clientId = '' // 客户名称
        this.form.clientName = '' // 客户名称
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
        this.ReceivingGoodsName = '发货方' // 发货方或者是结款方
        this.waybillTitle = '已完结运单'
        this.batchSettlementDisabled = false
        this.batchReceiptDisabled = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.sendStationNameShow = true
        this.sendClientNameShow = true
        this.packageQuantityShow = false
        this.checkboxShow = false
        this.receivableFreightShow = true
        this.waybillStatusNameShow = false
        this.queryDriverShow = false
        this.waybillStatusShow = false
        this.financeStatusShow = false
        this.receiveClientNameShow = true
        this.waybillTypeShow = false
        this.waybillDeliveryTypeShow = false
        this.settlementTimeShow = false
        this.pkLineShow = true
        this.shiftRunNameDisabled = true
        this.receivablePersonShow = false
        this.receivablePersonHandInStatusShow = false
        // this.sendClientNameDisabled = true
        // this.receiveClientNameDisabled = true
        // this.clientIdShow = false
        this.receivablePersonNameShow = false
        this.actualFreightShow = false
        this.actualPaymentGoodsShow = false
        this.paySumShow = false
        this.freightPayerShow = false
        this.freightSettlementMethodShow = false
        this.StatisticsTableShow = false
        this.receivableGoodsShow = true
        this.payTypeShow = true
        this.financeStatusNameShow = false

        this.form.queryStatus = 4
        // this.queryAllList(this.form)
        this.queryFinishedList(this.form)
        this.queryLineNameList()
      }
    },
    updateSearchHeight (flag) {
      this.$nextTick(() => {
        let moreSearch = document.getElementById('search-bar')
        if (flag === '0') {
          moreSearch.style.minHeight = '202' + 'px'
        } else {
          moreSearch.style.minHeight = '152' + 'px'
        }
      })
    },
    // moreSearch (flag) {
    //   this.$nextTick(() => {
    //     this.showMoreSearch = !this.showMoreSearch
    //     let moreSearch = document.getElementById('search-bar')
    //     if (this.showMoreSearch) {
    //       if (flag === '0') {
    //         moreSearch.style.minHeight = '202' + 'px'
    //       } else {
    //         moreSearch.style.minHeight = '152' + 'px'
    //       }
    //     } else {
    //       moreSearch.style.minHeight = '86' + 'px'
    //     }
    //   })
    // },
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
        // this.form.sendClientName = this.$refs.searchSendName.form.searchName
        // this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
        this.FinanceReceivableWaybillList(this.form)
      } else if (flag === '3') {
        // this.form.sendClientName = this.$refs.searchSendName.form.searchName
        // this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
        // this.queryAllList(this.form)
        this.queryFinishedList(this.form)
      } else {
        this.queryAllList(this.form)
      }
    },
    reset () {
      this.form.freightSettlementMethod = ''
      this.form.driverId = ''
      this.form.waybillClassify = ''
      this.form.receivablePersonHandInStatus = ''
      this.form.receivablePerson = ''
      // this.form.clientId = '' // 客户名称
      this.form.clientName = '' // 客户名称
      this.form.stationId = ''// 站点
      this.form.waybillNumber = '' // 运单号
      this.form.sendClient = '' // 发货方
      this.form.receiveClient = '' // 收货方
      this.form.pkLine = '' // 线路
      this.form.shiftRunName = '' // 班次
      this.form.waybillStatus = '' // 运单状态
      this.dateValue = ''
      this.settleDateValue = ''
      this.form.settlementStatus = '' // 结算状态
      this.form.waybillDeliveryType = '' // 经营性质
      let flag = this.$route.query.index
      if (flag === '1') {
        this.$refs.searchSendName.form.searchName = ''
        this.$refs.searchReceiveName.form.searchName = ''
        // this.dateValue = [this.formatCurrentDate(), this.formatCurrentDate()]
        this.dateValue = ''
        this.settleDateValue = ''
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
      // let params = {
      //   stationId: '', // 站点
      //   waybillNumber: '', // 运单号
      //   sendClientName: '', // 发货方
      //   receiveClientName: '', // 收货方
      //   pkLine: '', // 线路
      //   shiftId: '', // 班次
      //   waybillStatus: '', // 运单状态
      //   createTimeStart: '', // 创建时间起
      //   createTimeEnd: '', // 创建时间止
      //   financeStatus: '', // 结算状态
      //   driverId: '', // 司机
      //   currentPage: '', // 当前页
      //   pageSize: '' // 每页条数
      // }
      // let TimeStart = new Date(this.form.createTimeStart).getTime()
      // let TimeEnd = new Date(this.form.createTimeEnd).getTime()
      // let TimeMid = TimeEnd - TimeStart
      // let flag = 180 * 24 * 3600 * 1000
      // console.log(TimeMid, flag, '====')
      console.log(this.selectionId(this.multipleSelection))
      let flag = this.$route.query.index
      if (flag === '0') {
        let exportFlag = this.validDuringDay(this.form.createTimeStart, this.form.createTimeEnd)
        if (exportFlag) {
          let url = process.env.API_BASE_URL + '/waybill/financeManage/exportFinanceAllWaybillList' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
          window.location.href = url
          this.queryAllList(this.form)
        } else {
          this.$notify({
            type: 'error',
            message: '导出时间范围请选择在6个月以内！'
          })
        }
      } else if (flag === '1') {
        let url = process.env.API_BASE_URL + '/waybill/financeManage/queryFinanceWaitReceivableWaybillExport' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
        window.location.href = url
        this.FinanceReceivableWaybillList(this.form)
      } else if (flag === '3') {
        let url = process.env.API_BASE_URL + '/waybill/financeManage/exportExcelFinishedFinanceWaybill' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
        window.location.href = url
        this.queryFinishedList(this.form)
      } else {
        let url = process.env.API_BASE_URL + '/waybill/financeManage/exports' + '?' + this.encodeParam(this.form) + '&waybillIdList=' + this.selectionId(this.multipleSelection) + '&token=' + sessionStorage.getItem('token')
        window.location.href = url
        this.queryAllList(this.form)
      }

      // let url = process.env.API_BASE_URL + '/waybill/financeManage/exports' + '?' + this.encodeParam(this.form) + '&token=' + sessionStorage.getItem('token')
      // let exportForm = document.getElementById('_exportForm')
      // if (!exportForm) {
      //   exportForm = document.createElement('form')
      //   exportForm.setAttribute('id', '_exportForm')
      //   exportForm.setAttribute('action', url)
      //   exportForm.setAttribute('method', 'post')
      // }
      // document.body.appendChild(exportForm)
      // exportForm.submit()
      // window.location.href = process.env.API_BASE_URL + '/waybill/financeManage/exports'
      // this.exports(this.form)
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
      // this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: this.waybillTitle, waybillId: row.waybillId, freightPayer: row.freightPayer}})
      let option = {
        name: 'FinancWaybillDetail',
        query: {
          waybillTitle: this.waybillTitle,
          waybillId: row.waybillId,
          freightPayer: row.freightPayer
        }
      }
      let routes = this.$router.resolve(option)
      window.open(routes.href, '_blank')
    },
    confirmPayment (row) { // 确认支付
      OutstandingWaybillAjax.Pay({orderIds: [row.waybillId]}).then(response => {
        if (response.code === 200) {
          this.merchantNo = response.data.merchantNo
          this.showPay = true
          window.open(response.data.pcUrl)
        }
      })
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
    confirmReceipt (row) { // 确认收款
      // this.waybillInfoList = [{waybillId: row.waybillId, freightPayer: row.freightPayer}]
      let obj = {}
      obj.waybillId = row.waybillId
      obj.freightPayer = row.freightPayer
      this.waybillInfoList = []
      this.waybillInfoList.push(obj)
      if (row.financeStatus === 10) {
        this.receiptMainInfo = `存在司机待收款的运单，是否确认收款，
        若确认收款则运单将默认签收`
      } else {
        this.receiptMainInfo = '确定执行此操作吗？'
      }
      this.dialogVisible = !this.dialogVisible
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
    batchReceipt () {
      if (this.multipleSelection < 1) { // 批量确认收款
        this.$notify({
          type: 'error',
          message: '请您选择要收款的行!'
        })
      } else {
        this.waybillInfoList = this.multipleSelection.map(item => {
          let obj = {
            waybillId: item.waybillId,
            freightPayer: item.freightPayer
          }
          return obj
        })
        let flag = this.multipleSelection.some(item => {
          return item.financeStatus === 10
        })
        if (flag) {
          this.receiptMainInfo = `存在司机待收款的运单，是否确认收款，
        若确认收款则运单将默认签收`
        } else {
          this.receiptMainInfo = '确定执行此操作吗？'
        }
        this.dialogVisible = !this.dialogVisible
      }
    },
    changeLogistics (val) {
      // this.getStationList({logisticsIdL: val})
      // this.getDriversList({logisticsId: val})
    },
    changePage (pageSize, pageNumber) {
      this.form.pageSize = pageSize
      this.form.currentPage = pageNumber
      let flag = this.$route.query.index
      if (flag === '1') {
        this.FinanceReceivableWaybillList(this.form)
      } else if (flag === '3') {
        this.queryFinishedList(this.form)
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
      } else if (flag === '3') {
        this.queryFinishedList(this.form)
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
      WaybillApiAjax.FinanceAllList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            if (item.waybillDeliveryType === 3) {
              item.waybillDeliveryType = '联营运单'
            }
            if (item.waybillDeliveryType === 4) {
              item.waybillDeliveryType = '自营运单'
            }
            if (item.freightSettlementMethod === 1) {
              item.freightSettlementMethod = '现结'
            }
            if (item.freightSettlementMethod === 2) {
              item.freightSettlementMethod = '月结'
            }
            if (item.freightSettlementMethod === 3) {
              item.freightSettlementMethod = '包月'
            }
            if (item.freightSettlementMethod === 4) {
              item.freightSettlementMethod = '回付'
            }
            if (item.waybillClassify === 1) {
              item.waybillClassifyName = '非驮付宝运单'
            }
            if (item.waybillClassify === 2) {
              item.waybillClassifyName = '驮付宝运单'
              item.settlementTime = '＼'
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '已装车'
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
            if (item.waybillStatus === 6) {
              item.waybillStatusName = '已取消'
            }
            if (item.waybillStatus === 11) {
              item.waybillStatusName = '待装车'
            }
            if (item.financeStatus === 1) {
              item.financeStatusName = '待收款'
              item.checkShow = true
              item.confirmReceiptShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 2) {
              if (item.waybillClassify === 1) {
                item.financeStatusName = '待结算'
                item.checkShow = true
                item.confirmReceiptShow = false
                item.confirmSettlementShow = true
              }
              if (item.waybillClassify === 2) {
                item.financeStatusName = '待支付'
                item.checkShow = true
                item.confirmReceiptShow = false
                item.confirmPaymentShow = true
              }
            }
            if (item.financeStatus === 5) {
              item.financeStatusName = '已支付'
              item.checkShow = true
              item.confirmReceiptShow = false
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 4) {
              item.financeStatusName = '已结算'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 3) {
              item.financeStatusName = '已完成'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 6) {
              item.financeStatusName = '已取消'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 7) {
              item.financeStatusName = '已拒签'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 10) {
              item.financeStatusName = '待收款'
              item.checkShow = true
              item.confirmReceiptShow = true // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            item.confirmReceiptShow = false // 确认收款(全部运单没有实现确认收款)
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    queryFinishedList (val) { // 已完结运单列表
      WaybillApiAjax.FinanceFinishedList(val).then(res => {
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
            if (item.waybillClassify === 1) {
              item.waybillClassifyName = '非驮付宝运单'
            }
            if (item.waybillClassify === 2) {
              item.waybillClassifyName = '驮付宝运单'
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '已装车'
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
              item.confirmReceiptShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 2) {
              if (item.waybillClassify === 1) {
                item.financeStatusName = '待结算'
                item.checkShow = true
                item.confirmReceiptShow = false
                item.confirmSettlementShow = true
              }
              if (item.waybillClassify === 2) {
                item.financeStatusName = '待支付'
                item.checkShow = true
                item.confirmReceiptShow = false
                item.confirmPaymentShow = true
              }
            }
            if (item.financeStatus === 5) {
              item.financeStatusName = '已支付'
              item.checkShow = true
              item.confirmReceiptShow = false
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 4) {
              item.financeStatusName = '已结算'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 3) {
              item.financeStatusName = '已完成'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 6) {
              item.financeStatusName = '已取消'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 7) {
              item.financeStatusName = '已拒签'
              item.checkShow = true
              item.confirmReceiptShow = false // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            if (item.financeStatus === 10) {
              item.financeStatusName = '线下待收款'
              item.checkShow = true
              item.confirmReceiptShow = true // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
            }
            item.confirmReceiptShow = false // 确认收款(全部运单没有实现确认收款)
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
              item.confirmReceiptShow = true
              item.confirmSettlementShow = false
            }
            if (item.financeStatus === 10) {
              item.checkShow = true
              item.confirmReceiptShow = true // 确认收款
              item.confirmSettlementShow = false // 确认结算
              item.confirmPaymentShow = false // 确认支付
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
    queryLogisticsList (val) { // 物流公司列表
      WaybillApiAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsOptions = res.data
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
    QueryLogisticsPersonnelAll (val) { // 查询物流公司下所有员工包括物流公司管理员
      WaybillApiAjax.QueryLogisticsPersonnelAll(val).then(res => {
        if (res.code === 200) {
          this.LogisticsPersonnelAllOptions = res.data
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
    // GetSessionClientData (val) { // 1修理厂2经销商
    //   let sessionClientData = JSON.parse(sessionStorage.getItem('allClientData'))
    //   if (sessionClientData) {
    //     // this.receiveClientNameOptions = res.data[1]
    //     // this.sendClientNameOptions = res.data[2]
    //     let temp = [...sessionClientData.data[1].concat(sessionClientData.data[2])]
    //     let hash = {}
    //     let result = temp.reduce((item, next) => {
    //       if (!hash[next.id]) {
    //         hash[next.id] = true
    //         item.push(next)
    //       }
    //       return item
    //     }, [])
    //     this.clientIdOptions = result
    //   }
    // },
    // GetClientData (val) { // 1修理厂2经销商
    //   waybillManageAjax.GetClientData(val).then(res => {
    //     if (res.code === 200) {
    //       // this.receiveClientNameOptions = res.data[1]
    //       // this.sendClientNameOptions = res.data[2]
    //       let temp = [...res.data[1].concat(res.data[2])]
    //       let hash = {}
    //       let result = temp.reduce((item, next) => {
    //         if (!hash[next.id]) {
    //           hash[next.id] = true
    //           item.push(next)
    //         }
    //         return item
    //       }, [])
    //       this.clientIdOptions = result
    //     }
    //   })
    // },
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
.all-waybill{
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
.all-waybill{
  display: flex;
  flex-direction: column;
  flex: 1;
  //min-height: 768px;
  overflow-y: auto;
  overflow-x: hidden;
  // .more-search-box {
  //   height: 86px;
  // }
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
