<template>
  <div class="waybillDetail public_card">
    <h3 class="detail_header">即时配送 > {{waybillTitle}} ><span class="currentDetail">运单详情</span></h3>
    <div class="card_main">
      <div class="card_con">
        <!-- 运单信息 -->
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
                min-width="20%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="collectorName"
                label="揽收">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="senderName"
                label="派送">
              </el-table-column>
            </el-table>
        </div>
        <!-- 基础信息 -->
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
                <li class="box_li"><span>收货方：</span><span>{{baseInfo.receiveClientName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{baseInfo.receiveClientAddress}}</span></li>
                <li class="box_li"><span>电话：</span><span>{{baseInfo.receiveClientPhone}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>发货方：</span><span>{{baseInfo.sendClientName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{baseInfo.sendClientAddress}}</span></li>
                <li class="box_li"><span>电话：</span><span>{{baseInfo.sendClientPhone}}</span></li>
              </ul>
            </div>

          </div>
        </div>
        <!-- 货品信息 -->
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">货品信息</span>
        </div>
        <div class="info">
            <el-table
              :data="packageInfoData"
              style="width: 100%"
              stripe
              border>
              <!-- <el-table-column
                min-width="10%"
                prop="SerialNumber"
                label="序号">
              </el-table-column> -->
              <el-table-column
                min-width="10%"
                prop="commodityName"
                label="货物名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="commodityNumber"
                label="数量">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="commodityRemark"
                label="备注">
              </el-table-column>
            </el-table>
        </div>
        <!-- 费用信息 -->
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">费用信息</span>
        </div>
        <div class="info">
            <el-table
              :data="feeTableData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="15%"
                prop="sendFreight"
                label="运费(发货方付)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveFreight"
                label="运费(收货方付)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="subsidyFreight"
                label="运费(减免)">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receivableGoods"
                label="代收货款">
              </el-table-column>
              <el-table-column
                min-width="25%"
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
        </div>
        <!-- 收款信息 -->
        <div v-show="routeFrom !== 'TimelyWaybillManage'" class="card_form_title">
          <span class="title_line"></span>
          <span class="title">收款信息</span>
        </div>
        <div v-if="routeFrom !== 'TimelyWaybillManage'" class="info">
            <el-table
              :data="receiptTableData"
              style="width: 100%"
              stripe
              border>
              <el-table-column
                min-width="15%"
                prop="employee"
                label="司机">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="feeTypeName"
                label="费用类型">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="fee"
                label="费用">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="financeStatus"
                label="状态">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="receivablesTime"
                label="收款时间">
              </el-table-column>
            </el-table>
        </div>
        <!-- 操作记录 -->
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">操作记录</span>
        </div>
        <div class="waybillInfo">
          <div class="waybillInfoBox">
            <ul class="box_main">
              <li :key="key" v-for="(item, key) in waybillOperateList"><span>{{item}}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
          <!-- <div class="radio-con">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="打印运单"></el-checkbox>
              <el-checkbox label="打印箱单"></el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="btn-con">
            <!-- <el-button class="btn-main" @click="printList()">打印运单</el-button> -->
            <el-button class="btn-main" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :waybillId="printWaybillId"
      :isPrintwayBill="isPrintwayBill"
      :isPrintBoxBill="isPrintBoxBill"
    />
  </div>
</template>

<script>
// import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import TimelyWaybillAjax from '@/api/TimelyDeliveryApi/TimelyWaybillManageApi'
import PrintWayAndBoxBill from '../StationOrder/subpage/printWayBill'
export default {
  name: 'TimelyWaybillDetail',
  components: {
    PrintWayAndBoxBill
  },
  data () {
    return {
      isPrintwayBill: false,
      isPrintBoxBill: false,
      printWaybillId: '',
      checkList: ['打印运单', '打印箱单'],
      printListShow: false, // 是否显示打印
      waybillTitle: '',
      waybillInfoData: [ // 运单信息
      ],
      baseInfo: { // 基础信息
      },
      packageInfoData: [ // 货品信息
      ],
      feeTableData: [ // 费用信息
      ],
      receiptTableData: [ // 收款信息
      ],
      rejectTableData: [ // 拒收信息
        {a: '100', b: '200', c: '25', d: '司机', e: '2019-06-10 15:25:20', f: '拒收'}
      ],
      waybillOperateList: [], // 操作记录
      info: {
        receiveClientInfo: {},
        sendClientInfo: {},
        lineShiftDriverVo: {},
        waybillOperateVoList: {}
      },
      routeFrom: '' // 返回
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let title = newVal.query.waybillTitle
      this.waybillTitle = title
    }
  },
  created () {
    let query = this.$route.query
    let title = query.waybillTitle
    this.waybillTitle = title
    let from = query.from
    this.routeFrom = from
    let waybillId = query.waybillId
    this.queryWaybillInfo(waybillId)
    this.printWaybillId = waybillId
  },
  methods: {
    queryWaybillInfo (val) { // 详情
      TimelyWaybillAjax.QueryWaybillInfo({flashWaybillId: val}).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.waybillInfoData.push(data.waybillMessage)
          this.baseInfo = data.clientMessage
          this.packageInfoData.push(data.packageMessage)
          this.feeTableData.push(data.feeMessage)
          this.receiptTableData = data.paymentStatusList.map(item => {
            if (item.feeType === '1') {
              item.feeType = '发货方运费'
            } else if (item.feeType === '2') {
              item.feeType = '收货方运费'
            } else {
              item.feeType = '代收货款'
            }
            if (item.financeStatus === 1) {
              item.financeStatus = '待收款'
            } else if (item.financeStatus === 2) {
              item.financeStatus = '已收款'
            } else {
              item.financeStatus = '已完成'
            }
            return item
          })
          this.waybillOperateList = data.operate
        }
      })
    },
    goBack () {
      if (this.routeFrom === 'TimelyWaybillManage') {
        this.$router.push({name: 'TimelyWaybillManage'})
      } else if (this.routeFrom === 'PaymentCheck') {
        this.$router.push({name: 'PaymentCheck'})
      } else {
        this.$router.push({name: 'FreightCheck'})
      }
    },
    printList () { // 打印
      setTimeout(() => {
        this.isPrintwayBill = true
        this.$refs.printComponent.init()
      }, 10)
      // setTimeout(() => {
      //   if (this.checkList.length === 2) {
      //     this.isPrintwayBill = true
      //     this.isPrintBoxBill = true
      //   } else if (this.checkList.length === 1) {
      //     if (this.checkList[0] === '打印运单') {
      //       // 打印三联
      //       this.isPrintwayBill = true
      //       this.isPrintBoxBill = false
      //     } else {
      //       // 打印箱单
      //       this.isPrintwayBill = false
      //       this.isPrintBoxBill = true
      //     }
      //   } else {
      //     this.isPrintwayBill = false
      //     this.isPrintBoxBill = false
      //   }
      //   this.$refs.printComponent.init()
      // }, 10)
    }
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
      height: 200px;
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
        height: 160px;
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
        height: 160px;
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
      min-height: 240px;
      border: solid 1px #e6ecf8;
      .waybillInfoBox {
        // overflow: auto;
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
