<template>
  <div class="waybillDetail public_card">
    <h3 class="detail_header">财务管理 > {{waybillTitle}} ><span class="currentDetail">运单详情</span></h3>
    <div class="card_main">
      <div class="waybillState1" v-if="this.stateFlag ===1? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已结算</span>
      </div>
      <div class="waybillState2" v-if="this.stateFlag ===2? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已结算</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===3? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已结算</span>
      </div>
      <div class="waybillState2" v-if="this.stateFlag ===5? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待支付</span>
        <span class="signedIn">已支付</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===6? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待支付</span>
        <span class="signedIn">已支付</span>
      </div>
      <div class="waybillState1" v-if="this.stateFlag ===7? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待支付</span>
        <span class="signedIn">已支付</span>
      </div>
      <div class="completed" v-if="this.stateFlag ===4? true: false">
        已完成
      </div>

      <div class="card_con">

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">运单信息</span>
        </div>
        <div class="info">
            <el-table
              :data="waybillInfoData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillClassify"
                label="运单种类">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="waybillStatus"
                label="运输状态">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="paymentMethod"
                label="支付方式">
              </el-table-column>
            </el-table>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">基础信息</span>
        </div>
        <div class="basicInfo info">
          <div class="box">
            <ul class="box_head">
              <li class="box_head_li">收货方</li>
              <li class="box_head_li">发货方</li>
            </ul>
            <div class="box_left">
              <ul class="box_main">
                <li class="box_li"><span>收货方：</span><span>{{this.info.receiveClientInfo.clientName}}</span></li>
                <li class="box_li"><span>客户编码:</span><span>{{this.info.receiveClientInfo.clientCode}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{this.info.receiveClientInfo.phone}}</span></li>
                <li class="box_li"><span>服务站：</span><span>{{this.info.receiveClientInfo.stationName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{this.info.receiveClientInfo.address}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>发货方：</span><span>{{this.info.sendClientInfo.clientName}}</span></li>
                <li class="box_li"><span>客户编码:</span><span>{{this.info.sendClientInfo.clientCode}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{this.info.sendClientInfo.phone}}</span></li>
                <li class="box_li"><span>服务站：</span><span>{{this.info.sendClientInfo.stationName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{this.info.sendClientInfo.address}}</span></li>
                <li class="box_li"><span>运单号:</span><span>{{this.info.waybillNumber}}</span></li>
              </ul>
            </div>

          </div>
        </div>

        <div class="card_form_title" v-if="waybillTypeShow">
          <span class="title_line"></span>
          <span class="title">线路信息</span>
        </div>
        <div class="wayInfo info" v-if="waybillTypeShow">
          <div class="wayInfoBox">
            <div class="box_left">
              <ul class="box_main">
                <li class="box_li"><span>线路|班次：</span><span>{{this.info.lineShiftDriverVo.lineName}} {{this.info.lineShiftDriverVo.departureTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>司机：</span><span>{{this.info.lineShiftDriverVo.driver}}</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">货品信息</span>
        </div>
        <div class="info">
            <el-table
              :data="GoodsInfoData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="SerialNumber"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="packageName"
                label="货物名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="packageQuantity"
                label="包裹数">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">费用信息</span>
        </div>
        <div class="info">
            <el-table
              :data="ReceivablesTableData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="feeType"
                label="费用类型">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="feeAmount"
                label="费用(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="freightSettlementMethod"
                label="结算方式">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="freightPayerString"
                label="付款方">
              </el-table-column>
            </el-table>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">收款调整信息</span>
        </div>
        <div class="info">
            <el-table
              :data="FeeAdjustmentTableData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="10%"
                prop="feeType"
                label="修改内容">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="payerName"
                label="付款方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="oldValue"
                label="应收(元)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="newValue"
                label="修改后金额(元)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="changeBalance"
                label="变更差额(元)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="createTime"
                label="修改时间">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="userName"
                label="修改人">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
        </div>

        <!-- 运输信息 -->
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">运输信息{{waybillType}}</span>
        </div>
        <div class="waybillInfo">
          <div class="waybillInfoBox">
            <!-- <div class="box_left">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (this.info.waybillOperateVoList)"><span>{{item.operateTypeName}}：</span> <span>{{item.operateTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (this.info.waybillOperateVoList)"><span>操作人：</span> <span>{{item.operatePersonName}}</span></li>
              </ul>
            </div> -->
            <!-- <div class="clear"></div> -->
            <ul class="box_main">
              <li :key="key" v-for="(item, key) in (this.info.waybillOperateVoList)"><span>{{item.operate}}</span></li>
            </ul>
          </div>
        </div>
        <!-- 财务信息 -->
        <div class="card_form_title" style="margin-top: 30px;" v-if="this.info.waybillFinanceOperateList&&this.info.waybillFinanceOperateList.length>0?true:false">
          <span class="title_line"></span>
          <span class="title">财务信息</span>
        </div>
        <div class="waybillInfo" v-if="this.info.waybillFinanceOperateList&&this.info.waybillFinanceOperateList.length>0?true:false">
          <div class="waybillInfoBox">
            <!-- <div class="box_left">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (this.info.waybillFinanceOperateList)"><span>{{item.operateTypeName}}：</span> <span>{{item.operateTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (this.info.waybillFinanceOperateList)"><span>操作人：</span> <span>{{item.operatePersonName}}</span></li>
              </ul>
            </div> -->
            <!-- <div class="clear"></div> -->
            <ul class="box_main">
              <li :key="key" v-for="(item, key) in (this.info.waybillFinanceOperateList)"><span>{{item.operate}}</span></li>
            </ul>
          </div>
        </div>

        <!-- 附件 -->
        <div class="card_form_title" style="margin-top: 30px;" v-if="fileList.length>0?true:false">
          <span class="title_line"></span>
          <span class="title">附件</span>
        </div>
        <div class="waybillInfo" v-if="fileList.length>0?true:false">
          <div class="waybillInfoBox">
            <!-- <div class="attachCss" v-for="(url,key) in this.info.attachInfoList" :key="key"> -->
              <!-- <img
                style="width: 200px; height: 200px"
                :src="url"
                /> -->
                  <el-upload
                  disabled
                  :action="uploadAction"
                  :file-list="fileList"
                  :limit="3"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  >

                </el-upload>
                <el-dialog :visible.sync="attachDialog">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
        <!-- <el-button class="btn-main" v-if="confirmReceiptShow" @click="confirmReceipt">确认收款</el-button>
        <el-button class="btn-main" v-if="confirmSettlementShow" @click="confirmSettlement">确认结算</el-button>
        <el-button class="btn-main" v-if="confirmPaymentShow" @click="confirmPayment">确认支付</el-button> -->
        <el-button class="btn-main" v-if="false" @click="confirmReceipt">确认收款</el-button>
        <el-button class="btn-main" v-if="false" @click="confirmSettlement">确认结算</el-button>
        <el-button class="btn-main" v-if="false" @click="confirmPayment">确认支付</el-button>
        <el-button class="btn-main" @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
    <pay-dialog
      v-if="showPay"
      :dialogVisible="showPay"
      :merchantNo="merchantNo"
      @click-cancel-form="showPay = false"
      @click-sure-form="clickPaySure"
    />
  </div>
</template>

<script>
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
import PayDialog from '../OutstandingWaybill/subpage/PayDialog'
import MonthlyFreightAjax from '@/api/MonthlyFreight/MonthlyFreight'

export default {
  data () {
    return {
      showPay: false,
      merchantNo: '', // 交易流水号
      waybillType: '', // 运单类型
      waybillTypeShow: true, // 退货运单时隐藏线路信息
      waybillTitle: '',
      companyOptions: [],
      tableData: [],
      waybillInfoData: [],
      ReceivablesTableData: [],
      FeeAdjustmentTableData: [],
      GoodsInfoData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      info: {
        receiveClientInfo: {},
        sendClientInfo: {},
        lineShiftDriverVo: {},
        waybillOperateVoList: {}
      },
      pageIndex: '', // 返回
      confirmReceiptShow: true,
      confirmSettlementShow: true,
      confirmPaymentShow: true,
      attachDialog: false,
      uploadAction: `${process.env.API_BASE_URL}/crm/attach/fileUpload`,
      fileList: [],
      stateFlag: '' // 当前运单流转状态
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let title = newVal.query.waybillTitle
      this.waybillTitle = title
    }
  },
  created () {
    let title = this.$route.query.waybillTitle
    if (title === '全部运单') {
      this.confirmReceiptShow = true
      this.confirmSettlementShow = true
    }
    if (title === '待收款运单') {
      this.confirmReceiptShow = true
      this.confirmSettlementShow = false
    }
    if (title === '待结算运单') {
      this.confirmReceiptShow = false
      this.confirmSettlementShow = true
    }
    if (title === '已完结运单') {
      this.confirmReceiptShow = false
      this.confirmSettlementShow = false
    }
    this.waybillTitle = title
    let waybillId = this.$route.query.waybillId
    this.queryWaybillInfo({waybillId: waybillId})
  },
  methods: {
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.attachDialog = true
    },
    confirmReceipt () { // 确认收款
      let waybillId = this.$route.query.waybillId
      let freightPayer = this.$route.query.freightPayer
      let obj = {}
      obj.waybillId = waybillId
      obj.freightPayer = freightPayer
      let waybillInfoList = []
      waybillInfoList.push(obj)
      let from = this.$route.query.from
      if (from && from === 'MonthlyFreight') {
        this.MonthlyFreightReceipt(waybillInfoList)
      } else {
        this.Receipt(waybillInfoList)
      }
    },
    confirmSettlement () { // 确认收款
      let waybillId = this.$route.query.waybillId
      this.Settlement({waybillIdList: waybillId})
    },
    confirmPayment () { // 确认支付
      let waybillId = this.$route.query.waybillId
      OutstandingWaybillAjax.Pay({orderIds: [waybillId]}).then(response => {
        if (response.code === 200) {
          this.merchantNo = response.data.merchantNo
          this.showPay = true
          window.open(response.data.pcUrl)
        }
      })
    },
    clickPaySure (type) {
      // 1处理中 2成功 3失败
      this.showPay = false
      if (type === 2) {
        this.$notify({
          type: 'success',
          message: '支付成功！'
        })
        // this.$router.push({name: 'FinancWaybillLists', query: {index: '0'}})
        let waybillId = this.$route.query.waybillId
        this.queryWaybillInfo({waybillId: waybillId})
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
    },
    goBack () {
      let from = this.$route.query.from
      let waybillTitle = this.$route.query.waybillTitle
      let unSettlementTitle = this.$route.query.title
      let unSettlementWaybillId = this.$route.query.waybillId

      if (waybillTitle === '待支付运单') {
        this.$router.push({name: 'OutstandingWaybill'})
      } else if (waybillTitle === '向员工收款>查看收款信息') {
        this.$router.push({name: 'UnSettlementForCustomersList', query: {title: unSettlementTitle, waybillId: unSettlementWaybillId}})
      } else if (from && from === 'MonthlyFreight') {
        this.$router.push({name: 'MonthlyFreight'})
      } else {
        if (waybillTitle === '全部运单') {
          this.pageIndex = '0'
        }
        if (waybillTitle === '待收款运单') {
          this.pageIndex = '1'
        }
        if (waybillTitle === '待结算运单') {
          this.pageIndex = '2'
        }
        if (waybillTitle === '已完结运单') {
          this.pageIndex = '3'
        }
        this.$router.push({name: 'FinancWaybillLists', query: {index: this.pageIndex}})
      }
    },
    queryWaybillInfo (val) { // 详情
      WaybillApiAjax.waybillInfo(val).then(res => {
        if (res.code === 200) {
          this.tableData = []
          this.waybillInfoData = []
          let obj = {
            name: '',
            url: ''
          }
          res.data.attachInfoList.forEach(item => {
            obj.url = item
            this.fileList.push(obj)
          })
          this.info = res.data
          if (res.data.settlementMethod === 1) {
            res.data.settlementMethod = '现结'
          }
          if (res.data.settlementMethod === 2) {
            res.data.settlementMethod = '月结'
          }
          if (res.data.settlementMethod === 3) {
            res.data.settlementMethod = '包月'
          }
          if (res.data.freightPayer === 1) {
            res.data.freightPayer = '发货方'
          }
          if (res.data.freightPayer === 2) {
            res.data.freightPayer = '收货方'
          }
          let receivableGoods = res.data.receivableGoods + '元'
          let receivableFreight = res.data.receivableFreight + '元'
          this.tableData.push({settlementMethod: res.data.settlementMethod, freightPayer: res.data.freightPayer, receivableGoods: receivableGoods, receivableFreight: receivableFreight})
          console.log(res.data)

          if (res.data.financeStatus === 1) { // 代收款
            this.confirmReceiptShow = true
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            // this.stateFlag = 1
            this.stateFlag = ''
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = true
              this.confirmSettlementShow = false
              this.confirmPaymentShow = false
              // this.stateFlag = 7
              this.stateFlag = ''
            }
          }

          if (res.data.financeStatus === 2) {
            if (res.data.waybillClassify === 1) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = true
              this.confirmPaymentShow = false
              // this.stateFlag = 2
              this.stateFlag = ''
            }
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = false
              this.confirmPaymentShow = true
              // this.stateFlag = 5
              this.stateFlag = ''
            }
          }
          if (res.data.financeStatus === 3) {
            this.confirmReceiptShow = false
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false

            // this.stateFlag = 3
            if (res.data.receivableGoods === 0 && res.data.receivableFreight === 0) {
              // this.stateFlag = 4 // 代收货款=0&&运费=0 财务状态为已完成
              this.stateFlag = ''
            }
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = false
              this.confirmPaymentShow = false
              // this.stateFlag = 6
              this.stateFlag = ''
            }
          }
          if (res.data.financeStatus === 4) {
            this.confirmReceiptShow = false
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            // this.stateFlag = 3
            this.stateFlag = ''

            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = false
              this.confirmPaymentShow = true
              // this.stateFlag = 5
              this.stateFlag = ''
            }
          }

          if (res.data.financeStatus === 5) {
            this.confirmReceiptShow = false
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = false
              this.confirmPaymentShow = false
              // this.stateFlag = 6
              this.stateFlag = ''
            }
          }

          if (res.data.financeStatus === 7) {
            this.confirmReceiptShow = false
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = false
              this.confirmSettlementShow = false
              this.confirmPaymentShow = false
              // this.stateFlag = 4
              this.stateFlag = ''
            }
          }
          if (res.data.financeStatus === 10) { // 代收款
            this.confirmReceiptShow = true
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            this.stateFlag = ''
            if (res.data.waybillClassify === 2) {
              this.confirmReceiptShow = true
              this.confirmSettlementShow = false
              this.confirmPaymentShow = false
              // this.stateFlag = 4
              this.stateFlag = ''
            }
          }

          let from = this.$route.query.from // 月结运费过来的都不显示确认结算和确认支付
          if (from === 'MonthlyFreight') {
            this.confirmSettlementShow = false
            this.confirmPaymentShow = false
            this.confirmReceiptShow = false
            this.stateFlag = ''
          }

          if (res.data.waybillType === 2 || res.data.waybillType === 4) {
            this.waybillType = ' (退货)'
            this.waybillTypeShow = false
          } else {
            this.waybillTypeShow = true
          }

          if (res.data.waybillClassify === 1) {
            res.data.waybillClassify = '普通运单'
          }
          if (res.data.waybillClassify === 2) {
            res.data.waybillClassify = '驮付宝运单'
          }
          if (res.data.waybillStatus === 1) {
            res.data.waybillStatusName = '已装车'
          }
          if (res.data.waybillStatus === 2) {
            res.data.waybillStatusName = '运输中'
          }
          if (res.data.waybillStatus === 3) {
            res.data.waybillStatusName = '已签收'
          }
          if (res.data.waybillStatus === 4) {
            res.data.waybillStatusName = '已拒签'
          }
          if (res.data.waybillStatus === 5) {
            res.data.waybillStatusName = '已完成'
          }
          if (res.data.waybillStatus === 6) {
            res.data.waybillStatusName = '已取消'
          }
          if (res.data.waybillStatus === 9) {
            res.data.waybillStatusName = '待入库'
          }
          if (res.data.waybillStatus === 10) {
            res.data.waybillStatusName = '待退货'
          }
          if (res.data.waybillStatus === 11) {
            res.data.waybillStatusName = '待装车'
          }

          if (res.data.paymentMethod === 1) {
            res.data.paymentMethod = '现金支付'
          }
          if (res.data.paymentMethod === 2) {
            res.data.paymentMethod = '支付宝支付'
          }
          if (res.data.paymentMethod === 3) {
            res.data.paymentMethod = '微信支付'
          }
          if (res.data.paymentMethod === 4) {
            res.data.paymentMethod = '在线支付'
          }
          if (res.data.paymentMethod === 5) {
            res.data.paymentMethod = '物流公司代付'
          }

          this.waybillInfoData.push({waybillNumber: res.data.waybillNumber, waybillClassify: res.data.waybillClassify, waybillStatus: res.data.waybillStatusName, paymentMethod: res.data.paymentMethod})
          this.ReceivablesTableData = res.data.waybillFeeVoList
          this.FeeAdjustmentTableData = res.data.waybillFeeUpdateRecordVoList.map(item => {
            if (item.payer === 1) {
              item.payerName = '发货方'
            } else if (item.payer === 2) {
              item.payerName = '收货方'
            } else {
              item.payerName = ''
            }
            return item
          })
          this.GoodsInfoData = res.data.waybillMessages.map((item, index) => {
            item.SerialNumber = index + 1
            return item
          })
        }
      })
    },
    Receipt (val) { // 确认收款（运单）
      WaybillApiAjax.Receipt(val).then(res => {
        let waybillId = this.$route.query.waybillId
        this.queryWaybillInfo({waybillId: waybillId})
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        }
      })
    },
    MonthlyFreightReceipt (waybillPropsList) {
      MonthlyFreightAjax.Pay(waybillPropsList).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        }
      })
    },
    Settlement (val) { // 确认结算
      WaybillApiAjax.Settlement(val).then(res => {
        let waybillId = this.$route.query.waybillId
        this.queryWaybillInfo({waybillId: waybillId})
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        }
      })
    }
  },
  components: {
    PayDialog
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.waybillDetail {
  .addressDetail .el-input__inner {
     width: 605px !important;
  }
  .waybillState1 {
    width: 349px;
    height: 28px;
    margin: 36px 0 0 40px;
    background: url(../../../image/1.png);
    .pendingGoods {
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .transportation {
      margin-left: 10px;
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #666666);
      line-height: 28px;
      text-align: center;
    }
    .signedIn {
      display: inline-block;
      margin-left: 10px;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #666666);
      line-height: 28px;
      text-align: center;
    }
  }
  .waybillState2 {
    width: 349px;
    height: 28px;
    margin: 36px 0 0 40px;
    background: url(../../../image/2.png);
    .pendingGoods {
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .transportation {
      margin-left: 10px;
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .signedIn {
      display: inline-block;
      margin-left: 10px;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #666666);
      line-height: 28px;
      text-align: center;
    }
  }
  .waybillState3 {
    width: 349px;
    height: 28px;
    margin: 36px 0 0 40px;
    background: url(../../../image/3.png);
    .pendingGoods {
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .transportation {
      margin-left: 10px;
      display: inline-block;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
    .signedIn {
      display: inline-block;
      margin-left: 10px;
      width: 103px;
      height: 28px;
      .mixin-sc(12px, #ffffff);
      line-height: 28px;
      text-align: center;
    }
  }
  .completed {
    margin: 36px 0 0 40px;
    width: 103px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background: #4987fc;
  }
}
</style>

<style lang="less" scoped>
@import '../../../style/base.less';
.waybillDetail {
  .clear{
    clear: both;
  }
  .basicInfo {
    .box {
      width: 100%;
      height: 270px;
      border: solid 1px #e6ecf8;
      .box_head {
        width: 100%;
        height: 35px;
        background: #f0f2fa;
      .box_head_li {
        width: 50%;
        float: left;
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 13px;
      }
      .box_head_li:first-child {
        border-right: 1px solid #e6ecf8;
      }
      }
      .box_left {
        width: 50%;
        height: 235px;
        float: left;
        border-right: 1px solid #e6ecf8;
        .box_main {
          margin: 23px 0 0 54px;
          .box_li {
            margin-bottom: 23px;
            span {
              font-size: 13px;
            }
          }
          .box_li span:first-child {
          width: 70px;
          display: inline-block;
          }
        }
      }
      .box_right {
        float: left;
        height: 235px;
        width: 50%;
        .box_main {
          margin: 23px 0 0 54px;
          .box_li {
            margin-bottom: 23px;
            span {
              font-size: 13px;
            }
          }
          .box_li span:first-child {
          width: 70px;
          display: inline-block;
          }
        }
      }
    }

  }

  .wayInfoBox {
      width: 100%;
      height: 62px;
      border: solid 1px #e6ecf8;
      .box_left {
        width: 50%;
        height: 62px;
        line-height: 62px;
        float: left;
        border-right: 1px solid #e6ecf8;
        .box_main {
          margin-left: 54px;
          span {
            font-size: 13px;
          }
            .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
      .box_right {
        width: 50%;
        height: 62px;
        line-height: 62px;
        float: left;
        .box_main {
          margin-left: 54px;
          span {
            font-size: 13px;
          }
            .box_li span:first-child {
            width: 70px;
            display: inline-block;
          }
        }
      }
  }

  .waybillInfo {
      width: 100%;
      height: 239px;
      border: solid 1px #e6ecf8;
      .waybillInfoBox {
        height: 100%;
        padding: 23px 0 23px 54px;
        overflow: auto;
        .box_left {
          float: left;
          width: 50%;
        }
        .box_right {
          float: left;
          width: 50%;
        }
        .box_main li {
          margin-bottom: 23px;
          span {
            font-size: 13px;
          }
        }
      }
  }
  .info {
    margin-bottom: 30px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
      justify-content: flex-end;
    }
  }
}
</style>
