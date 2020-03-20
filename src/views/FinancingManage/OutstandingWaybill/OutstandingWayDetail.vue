<template>
  <div class="waybillDetail public_card">
    <h3 class="detail_header">财务管理 > 待支付运单 ><span class="currentDetail">待支付运单详情</span></h3>
    <div class="card_main">
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
                <li class="box_li"><span>收货方：</span><span>{{detailData.receiveClientInfo.clientName}}</span></li>
                <li class="box_li"><span>客户编码:</span><span>{{detailData.receiveClientInfo.clientCode}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{detailData.receiveClientInfo.phone}}</span></li>
                <li class="box_li"><span>服务站：</span><span>{{detailData.receiveClientInfo.stationName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{detailData.receiveClientInfo.address}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>发货方：</span><span>{{detailData.sendClientInfo.clientName}}</span></li>
                <li class="box_li"><span>客户编码:</span><span>{{detailData.sendClientInfo.clientCode}}</span></li>
                <li class="box_li"><span>联系电话：</span><span>{{detailData.sendClientInfo.phone}}</span></li>
                <li class="box_li"><span>服务站：</span><span>{{detailData.sendClientInfo.stationName}}</span></li>
                <li class="box_li"><span>联系地址:</span><span>{{detailData.sendClientInfo.address}}</span></li>
                <li class="box_li"><span>运单号:</span><span>{{detailData.waybillNumber}}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">线路信息</span>
        </div>
        <div class="wayInfo info">
          <div class="wayInfoBox">
            <div class="box_left">
              <ul class="box_main">
                <li class="box_li"><span>线路|班次：</span><span>{{this.lineData[0].lineAndDepartureTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li class="box_li"><span>司机：</span><span>{{this.lineData[0].driver}}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">应收款信息</span>
        </div>
        <div class="info">
          <el-table
            :data="tableData"
            style="width: 100%"
            stripe
            border>
            <el-table-column
              min-width="10%"
              prop="settlementMethodName"
              label="结算方式">
            </el-table-column>
            <el-table-column
              min-width="10%"
              prop="freightPayer"
              label="付费方">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="receivableGoods"
              label="代收（元）">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="receivableFreight"
              label="运费（元）">
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
            <div class="box_left">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in detailData.waybillOperateVoList"><span>{{item.operateTypeName}}：</span> <span>{{item.operateTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in detailData.waybillOperateVoList"><span>操作人：</span> <span>{{item.operatePersonName}}</span></li>
              </ul>
            </div>
            <div class="clear"></div>
          </div>
        </div>
        <!-- 财务信息 -->
        <div class="card_form_title" style="margin-top: 30px;">
          <span class="title_line"></span>
          <span class="title">财务信息</span>
        </div>
        <div class="waybillInfo">
          <div class="waybillInfoBox">
            <div class="box_left">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (detailData.waybillFinanceOperateList)"><span>{{item.operateTypeName}}：</span> <span>{{item.operateTime}}</span></li>
              </ul>
            </div>
            <div class="box_right">
              <ul class="box_main">
                <li :key="key" v-for="(item, key) in (detailData.waybillFinanceOperateList)"><span>操作人：</span> <span>{{item.operatePersonName}}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
          <div class="btn-con">
            <el-button class="btn-main" @click="surePay">确认支付</el-button>
            <el-button @click="goback">返回</el-button>
          </div>
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
import PayDialog from './subpage/PayDialog'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
export default {
  data () {
    return {
      showPay: false,
      waybillId: '',
      userStatus: '',
      detailData: {
        receiveClientInfo: {
          clientName: '',
          clientCode: '',
          phone: '',
          stationName: '',
          address: ''
        },
        sendClientInfo: {
          clientName: '',
          clientCode: '',
          phone: '',
          stationName: '',
          address: ''
        },
        waybillNumber: '',
        lineName: '',
        lineShiftDriverVo: {
          departureTime: '',
          driver: ''
        },
        settlementMethodName: '',
        freightPayer: '',
        receivableFreight: '',
        receivableGoods: '',
        waybillOperateVoList: []
      },
      merchantNo: '',
      lineData: [{lineAndDepartureTime: '', driver: ''}],
      tableData: []
    }
  },
  components: {
    PayDialog
  },
  created () {
    let waybillId = this.$route.query.waybillId
    this.waybillId = waybillId
    this.init()
  },
  methods: {
    init () {
      this.queryDetail({waybillId: this.waybillId})
    },
    // 查询详情
    queryDetail (val) {
      WaybillApiAjax.waybillInfo(val).then(res => {
        if (res.code === 200) {
          this.detailData = {...res.data}
          this.lineData = [
            {lineAndDepartureTime: `${this.detailData.lineName} ${this.detailData.lineShiftDriverVo.departureTime}`, driver: this.detailData.lineShiftDriverVo.driver}
          ]
          this.tableData = [
            {
              settlementMethodName: '',
              freightPayer: this.detailData.freightPayer === 1 ? ' 发货方' : '收货方',
              receivableGoods: this.detailData.receivableFreight,
              receivableFreight: this.detailData.receivableGoods
            }
          ]
          let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          userInfo.settlementMethod.forEach(item => {
            if (this.detailData.settlementMethod === item.generateKey) {
              this.tableData[0].settlementMethodName = item.generateVal
            }
          })
        }
      })
    },
    surePay () {
      OutstandingWaybillAjax.Pay({orderIds: [this.waybillId]}).then(response => {
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
        this.$router.push({name: 'OutstandingWaybill'})
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
    goback () {
      this.$router.push({name: 'OutstandingWaybill'})
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
    .record-row{
      height: auto;
      margin-top: 30px;
      .record-ul{
        height: 100px;
        li{
          height: 20px;
          margin-bottom: 10px;
          .label-text{
            float: left;
            width: 20%;
            height: 20px;
            text-align: center;
          }
          .time{
            float: left;
            width: 35%;
            height: 20px;
            text-align: center;
          }
          .personName{
            float: left;
            width: 25%;
            height: 20px;
            text-align: center;
          }
        }
        div{
          .mixin-sc(13px;#333);
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
      .btn-con {
        height: 32px;
        line-height: 32px;
        float: left;

      }
    }
  }
}
</style>
