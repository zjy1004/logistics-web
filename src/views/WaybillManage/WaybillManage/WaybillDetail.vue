<template>
  <div class="waybillDetail public_card">
    <h3 class="detail_header">运单管理 > {{waybillTitle}} ><span class="currentDetail">运单详情</span></h3>
    <div class="card_main">
      <!-- <div class="waybillState1" v-if="this.stateFlag ===1? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">运输中</span>
        <span class="signedIn">已签收</span>
      </div>
      <div class="waybillState2" v-if="this.stateFlag ===2? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">运输中</span>
        <span class="signedIn">已签收</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===3? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">运输中</span>
        <span class="signedIn">已签收</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===4? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">运输中</span>
        <span class="signedIn">已拒签</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===5? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">运输中</span>
        <span class="signedIn">已退货</span>
      </div>
      <div class="waybillState4" v-if="this.stateFlag ===6? true: false">
        <span class="pendingGoods">待发货</span>
        <span class="transportation">已取消</span>
      </div> -->

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
                min-width="10%"
                prop="waybillDeliveryType"
                label="运单配送类型">
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
                <!-- <li class="box_li"><span>运单号:</span><span>{{this.info.waybillNumber}}</span></li> -->
              </ul>
            </div>

          </div>
        </div>

        <div class="card_form_title" v-if="returnGoodsShow">
          <span class="title_line"></span>
          <span class="title">线路信息</span>
        </div>
        <div class="wayInfo info" v-if="returnGoodsShow">
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
        <!-- 运输信息 -->
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">运输信息</span>
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
          <!-- <div class="radio-con" v-if="printListShow"> -->
          <div class="radio-con">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="checkItem.label" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="btn-con">
            <!-- <el-button class="btn-main" v-if="printListShow" @click="printList()">打印</el-button> -->
            <el-button class="btn-main" @click="printList()">打印</el-button>
            <!-- <el-button class="btn-main" v-if="signedInShow" @click="signedIn">签收</el-button> -->
            <!-- <el-button class="btn-main" v-if="rejectionShow" @click="rejection">拒收</el-button> -->
            <!-- <el-button class="btn-main" v-if="deliverGoodsShow" @click="deliverGoods">发货</el-button> -->
            <el-button class="btn-main" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <reject-dialog
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :editInfo="editInfoObj"
    />

    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :waybillId="printWaybillId"
      :checkList="checkList"
    />
  </div>
</template>

<script>
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import RejectDialog from './subpage/RejectDialog'
import ENUMS from '@/enums/enums'
import PrintWayAndBoxBill from '../NewWaybill/subpage/printWayBoxBill'
export default {
  data () {
    return {
      printWaybillId: '',
      checkGroup: [],
      checkList: [],
      printListShow: false, // 是否显示打印
      dialogVisible: false, // 拒收弹窗
      dialogWidth: '', // 拒收弹窗宽度
      dialogTitle: '', // 拒收弹窗标题
      editInfoObj: {}, // 拒收信息
      waybillTitle: '',
      companyOptions: [],
      tableData: [],
      ReceivablesTableData: [],
      GoodsInfoData: [],
      waybillInfoData: [],
      dialogImageUrl: '',
      returnGoodsShow: true,
      info: {
        receiveClientInfo: {},
        sendClientInfo: {},
        lineShiftDriverVo: {},
        waybillOperateVoList: {}
      },
      pageIndex: '', // 返回
      signedInShow: true,
      rejectionShow: true,
      deliverGoodsShow: true,
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
      this.signedInShow = true
      this.rejectionShow = true
      this.deliverGoodsShow = true
      this.printListShow = false
    }
    if (title === '待发货运单') {
      this.signedInShow = false
      this.rejectionShow = false
      this.deliverGoodsShow = true
      this.printListShow = true
    }
    if (title === '运输中运单') {
      this.signedInShow = true
      this.rejectionShow = true
      this.deliverGoodsShow = false
      this.printListShow = false
    }
    if (title === '已签收运单') {
      this.signedInShow = false
      this.rejectionShow = false
      this.deliverGoodsShow = false
      this.printListShow = false
    }
    if (title === '已关闭运单') {
      this.signedInShow = false
      this.rejectionShow = false
      this.deliverGoodsShow = false
      this.printListShow = false
    }
    if (title === '退货运单') {
      this.signedInShow = false
      this.rejectionShow = false
      this.deliverGoodsShow = false
      this.returnGoodsShow = false
      this.printListShow = false
    }
    this.waybillTitle = title
    let waybillId = this.$route.query.waybillId
    this.queryWaybillInfo({waybillId: waybillId})
    this.printWaybillId = waybillId
    this.checkGroup = [...ENUMS.checkGroup]
    this.checkList = this.checkGroup.map(item => {
      return item.label
    })
  },
  methods: {
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.attachDialog = true
    },
    printList () { // 打印
      setTimeout(() => {
        this.$refs.printComponent.init()
      }, 10)
    },
    clickDialogSure (val) {
      this.Reject(val)
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    signedIn () { // 签收
      let waybillId = this.$route.query.waybillId
      this.Signing({waybillIdList: waybillId})
    },
    rejection () { // 拒收
      this.dialogTitle = '确认是否拒收'
      this.dialogWidth = '486px'
      this.dialogVisible = true
    },
    deliverGoods () { // 发货
      let waybillId = this.$route.query.waybillId
      this.Transport({waybillIdList: waybillId})
    },
    goBack () {
      let pIndex = this.$route.query.pageIndex
      let waybillTitle = this.$route.query.waybillTitle
      if (pIndex === '0') {
        this.pageIndex = '0'
      } else {
        if (waybillTitle === '待发货运单') {
          this.pageIndex = '1'
        }
        if (waybillTitle === '运输中运单') {
          this.pageIndex = '2'
        }
        if (waybillTitle === '已签收运单') {
          this.pageIndex = '3'
        }
        if (waybillTitle === '已关闭运单') {
          this.pageIndex = '4'
        }
        if (waybillTitle === '退货运单') {
          this.pageIndex = '5'
        }
        if (waybillTitle === '待接收运单') {
          this.pageIndex = '6'
        }
      }
      if (this.pageIndex === '6') {
        this.$router.push({name: 'ToReceiveWaybillList'})
      } else if (waybillTitle === '调度运单查询') {
        this.$router.push({name: 'DispatchWaybillList'})
      } else {
        this.$router.push({name: 'AllWaybill', query: {index: this.pageIndex}})
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
          let receivableGoods = res.data.receivableGoods + '元'
          let receivableFreight = res.data.receivableFreight + '元'
          this.tableData.push({settlementMethod: res.data.settlementMethod, freightPayer: res.data.freightPayer, receivableGoods: receivableGoods, receivableFreight: receivableFreight})
          if (res.data.waybillStatus === 11) {
            this.signedInShow = false // 签收
            this.rejectionShow = false // 拒签
            this.deliverGoodsShow = false // 发货
          }
          if (res.data.waybillStatus === 1) {
            this.signedInShow = false
            this.rejectionShow = false
            this.deliverGoodsShow = true
            this.stateFlag = 1
          }

          if (res.data.waybillStatus === 2) {
            this.signedInShow = true
            this.rejectionShow = true
            this.deliverGoodsShow = false
            this.stateFlag = 2
          }
          if (res.data.waybillStatus === 3) {
            this.signedInShow = false
            this.rejectionShow = false
            this.deliverGoodsShow = false
            this.stateFlag = 3
          }
          if (res.data.waybillStatus === 4) {
            this.signedInShow = false
            this.rejectionShow = false
            this.deliverGoodsShow = false
            this.stateFlag = 4
          }
          if (res.data.waybillStatus === 6) {
            this.signedInShow = false
            this.rejectionShow = false
            this.deliverGoodsShow = false
            this.stateFlag = 6
          }
          if (res.data.waybillStatus === null) {
            if (res.data.waybillType) {
              this.signedInShow = false
              this.rejectionShow = false
              this.deliverGoodsShow = false
              this.stateFlag = 5
            }
          }

          if (res.data.waybillClassify === 1) {
            res.data.waybillClassify = '普通运单'
          }
          if (res.data.waybillClassify === 2) {
            res.data.waybillClassify = '驮付宝运单'
          }
          if (res.data.waybillStatus === 11) {
            res.data.waybillStatusName = '待装车'
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

          if (res.data.waybillDeliveryType === 1) {
            res.data.waybillDeliveryType = '城配运单'
          }
          if (res.data.waybillDeliveryType === 2) {
            res.data.waybillDeliveryType = '自营调度运单'
          }
          if (res.data.waybillDeliveryType === 3) {
            res.data.waybillDeliveryType = '联营调度运单'
          }

          this.waybillInfoData.push({waybillNumber: res.data.waybillNumber, waybillClassify: res.data.waybillClassify, waybillStatus: res.data.waybillStatusName, paymentMethod: res.data.paymentMethod, waybillDeliveryType: res.data.waybillDeliveryType})

          this.editInfoObj.waybillId = this.$route.query.waybillId
          this.editInfoObj.sendClientName = res.data.sendClientInfo.clientName
          this.editInfoObj.receiveClientName = res.data.receiveClientInfo.clientName
          this.ReceivablesTableData = res.data.waybillFeeVoList
          this.GoodsInfoData = res.data.waybillMessages.map((item, index) => {
            item.SerialNumber = index + 1
            return item
          })
        }
      })
    },
    Signing (val) { // 签收
      WaybillApiAjax.Signing(val).then(res => {
        if (res.code === 200) {
          let waybillId = this.$route.query.waybillId
          this.queryWaybillInfo({waybillId: waybillId})
          this.$notify({
            type: 'success',
            message: '签收成功！'
          })
        }
      })
    },
    Reject (val) { // 拒收
      WaybillApiAjax.Reject(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          let waybillId = this.$route.query.waybillId
          this.queryWaybillInfo({waybillId: waybillId})
          this.$notify({
            type: 'success',
            message: '拒收成功！'
          })
        }
      })
    },
    Transport (val) { // 发货
      WaybillApiAjax.Transport(val).then(res => {
        if (res.code === 200) {
          let waybillId = this.$route.query.waybillId
          this.queryWaybillInfo({waybillId: waybillId})
          this.$notify({
            type: 'success',
            message: '发货成功！'
          })
        }
      })
    }
  },
  components: {
    RejectDialog,
    PrintWayAndBoxBill
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
  .waybillState4 {
    width: 232px;
    height: 28px;
    margin: 36px 0 0 40px;
    background: url(../../../image/5.png);
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
}
</style>

<style lang="less" scoped>
@import '../../../style/base.less';
.waybillDetail {
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
        overflow: auto;
        height: 100%;
        padding: 23px 0 23px 54px;
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
    font-size: 13px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
      .radio-con {
        height: 32px;
        line-height: 32px;
        float: left;
        margin-right: 30px;
      }
      .btn-con {
        height: 32px;
        line-height: 32px;
        float: left;
      }
    }
  }
}
</style>
