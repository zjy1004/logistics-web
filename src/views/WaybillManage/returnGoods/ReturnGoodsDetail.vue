<template>
  <div class="waybillDetail public_card">
    <h3 class="detail_header">运单管理 > {{waybillTitle}} ><span class="currentDetail">运单详情</span></h3>
    <div class="card_main">
      <!-- <div class="waybillState1" v-if="this.stateFlag ===1? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已完成</span>
      </div>
      <div class="waybillState2" v-if="this.stateFlag ===2? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已完成</span>
      </div>
      <div class="waybillState3" v-if="this.stateFlag ===3? true: false">
        <span class="pendingGoods">待收款</span>
        <span class="transportation">待结算</span>
        <span class="signedIn">已完成</span>
      </div>
      <div class="completed" v-if="false">
        已完成
      </div> -->

      <div class="card_con">
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
          <span class="title">运单信息</span>
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
            <el-button class="btn-main" v-if="confirmPutInStorageShow" @click="confirmPutInStorage()">确认入库</el-button>
            <el-button class="btn-main" v-if="confirmReturnGoodsShow" @click="confirmReturnGoods()">确认退货</el-button>
            <el-button class="btn-main" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>

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
import PrintWayAndBoxBill from '../NewWaybill/subpage/printWayBoxBill'
import ENUMS from '@/enums/enums'
export default {
  data () {
    return {
      printWaybillId: '',
      printListShow: true,
      checkList: ['4'],
      checkGroup: [],
      waybillTitle: '',
      companyOptions: [],
      ReceivablesTableData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      info: {
        receiveClientInfo: {},
        sendClientInfo: {},
        lineShiftDriverVo: {},
        waybillOperateVoList: {}
      },
      pageIndex: '', // 返回
      confirmPutInStorageShow: true,
      confirmReturnGoodsShow: true,
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
    if (title === '待入库运单') {
      this.confirmPutInStorageShow = true
      this.confirmReturnGoodsShow = false
      this.printListShow = true
    }
    if (title === '待退货运单') {
      this.confirmPutInStorageShow = false
      this.confirmReturnGoodsShow = true
      this.printListShow = true
    }
    if (title === '已完成运单' || title === '已取消运单') {
      this.confirmPutInStorageShow = false
      this.confirmReturnGoodsShow = false
      this.printListShow = false
    }
    this.waybillTitle = title
    let waybillId = this.$route.query.waybillId
    this.queryWaybillInfo({waybillId: waybillId})
    this.printWaybillId = waybillId
    this.checkGroup = [...ENUMS.checkGroup]
  },
  methods: {
    printList () { // 打印
      setTimeout(() => {
        this.$refs.printComponent.init()
      }, 10)
    },
    confirmPutInStorage () { // 确认入库
      let obj = {}
      obj.waybillIdList = this.$route.query.waybillId
      obj.waybillStatus = 9
      this.waybillPutInStorageReturnGoodsBatch(obj, 'putInStorage')
    },
    confirmReturnGoods () { // 确认退货
      let obj = {}
      obj.waybillIdList = this.$route.query.waybillId
      obj.waybillStatus = 10
      this.waybillPutInStorageReturnGoodsBatch(obj, 'returnGoods')
    },
    goBack () {
      let waybillTitle = this.$route.query.waybillTitle
      if (waybillTitle === '待入库运单') {
        this.pageIndex = 'prepareForStorage'
      }
      if (waybillTitle === '待退货运单') {
        this.pageIndex = 'prepareForReturn'
      }
      if (waybillTitle === '已完成运单') {
        this.pageIndex = 'prepareForStorageComplete'
      }
      if (waybillTitle === '已取消运单') {
        this.pageIndex = 'cancel'
      }
      this.$router.push({name: 'ReturnGoodsList', query: {index: this.pageIndex}})
    },
    queryWaybillInfo (val) { // 详情
      WaybillApiAjax.waybillInfo(val).then(res => {
        if (res.code === 200) {
          // this.tableData = []
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
          // let receivableGoods = res.data.receivableGoods + '元'
          // let receivableFreight = res.data.receivableFreight + '元'
          // this.tableData.push({settlementMethod: res.data.settlementMethod, freightPayer: res.data.freightPayer, receivableGoods: receivableGoods, receivableFreight: receivableFreight})
          this.ReceivablesTableData = res.data.waybillFeeVoList
        }
      })
    },
    waybillPutInStorageReturnGoodsBatch (val, flag) { // 退货运单确认入库9确认退货10(批量)
      WaybillApiAjax.waybillPutInStorageReturnGoodsBatch(val).then(res => {
        if (res.code === 200) {
          if (flag === 'putInStorage') {
            let waybillId = this.$route.query.waybillId
            this.queryWaybillInfo({waybillId: waybillId})
            this.$router.push({name: 'ReturnGoodsList', query: {index: 'prepareForStorage'}})
            this.$notify({
              type: 'success',
              message: '入库成功！'
            })
          }
          if (flag === 'returnGoods') {
            let waybillId = this.$route.query.waybillId
            this.queryWaybillInfo({waybillId: waybillId})
            this.$router.push({name: 'ReturnGoodsList', query: {index: 'prepareForReturn'}})
            this.$notify({
              type: 'success',
              message: '退货成功！'
            })
          }
        }
      })
    }
  },
  components: {
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
      min-height: 239px;
      overflow: auto;
      border: solid 1px #e6ecf8;
      .waybillInfoBox {
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
