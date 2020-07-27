<template>
  <div class="drop-shipping-detail">
    <div class="public_card">
      <h3 class="card_header">待发货单详情</h3>
      <div class="card_main">
        <div class="public_list">
          <div class="table-con">
            <el-table
              id="out-table"
              class="print-table"
              :data="tableData"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="20%"
                prop="articleNumber"
                label="货号">
              </el-table-column>
              <el-table-column
                min-width="13%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receivePhone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receivableGoods"
                label="代收货款">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receivableFreightDisplay"
                label="运费">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="shouldReceivableGoods"
                label="司机应收">
              </el-table-column>
            </el-table>
          </div>
          <div class="btns">
            <el-button class="btn-main" v-if="(runStatus === 0 && showDepart) || (runStatus === '0' && showDepart)" @click="depart">发车</el-button>
            <el-button class="btn-main" @click="print">打印配货单</el-button>
            <el-button class="btn-main" @click="goback">返回</el-button>
          </div>
          <!-- <print-picking
            ref="print"
            :hasHeader="true"
            :headerInfo="printHeaderInfo"
            :tableData="printTableData"
          /> -->
          <div class="table-print-con" id="printCon" ref="print">
            <div style="width: 1080px; height: 50px;">
              <div style="width: 860px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                {{printHeaderInfo.articleNumber}} 发货清单
              </div>
              <div style="width: 220px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                打印时间: {{printHeaderInfo.currentDate}} {{printHeaderInfo.currentTime}}
              </div>
            </div>
            <div style="width: 1080px; height: 40px;">
              <div style="width: 270px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                线路: {{printHeaderInfo.lineName}}
              </div>
              <div style="width: 290px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                司机: {{printHeaderInfo.driverName}}
              </div>
              <div style="width: 300px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                电话: {{printHeaderInfo.driverPhone}}
              </div>
              <!-- <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                打印时间: {{printHeaderInfo.currentTime}}
              </div> -->
              <div style="width: 220px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;">
                发车时间: {{printHeaderInfo.departureTime}}
              </div>
            </div>
            <div style="width: 1080px; height: 40px;">
              <div style="width: 730px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="client">运单信息</div>
              <div style="width: 250px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="money">运单费用</div>
              <div style="width: 100px; float: left; fontSize: 13px; border-width: 1px; border-color: #aaaaaa; border-style: solid; height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;" class="other"></div>
            </div>
            <div>
              <table class="print-table" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="width:40px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">序号</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运单号</th>
                    <th style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">货号</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货方</th>
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">联系电话(收)</th>
                    <th style="width:140px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货地址</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">发货方</th><!-- 运单号变为发货方 -->
                    <th style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">代收货款</th>
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运费</th>
                    <th style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">应收</th>
                    <th style="width:99px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; textAlign: center; borderTop: none;">备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="index" v-for="(tr, index) in printTableData">
                    <td style="width:40px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{ index === (printTableData.length - 1) ? '' : index + 1}}
                    </td>
                    <td style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center; word-wrap:break-word;word-break:break-all; ">
                      {{tr.waybillNumber}}
                    </td><!-- 运单号 -->
                    <td style="width:100px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.articleNumber}}<span v-if="index === (printTableData.length - 1)">(件)</span>
                    </td><!-- 货号 -->
                    <td style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveClientName}}
                    </td><!-- 收货方 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receivePhone}}
                    </td><!-- 联系电话 -->
                    <td style="width:140px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveAddress}}
                    </td><!-- 收货地址 -->
                    <td style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.sendClientName}}
                    </td><!-- 发货方 -->
                    <td style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.receivableGoods}}
                    </td><!-- 代收货款 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.receivableFreightDisplay}}
                    </td><!-- 运费 -->
                    <td style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.shouldReceivableGoods}}
                    </td><!-- 应收 -->
                    <td style="width:99px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.remark}}
                    </td><!-- 备注 -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="是否确认发车？"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
import PrintPickingAjax from '@/api/PrintPickingBill/PrintPickingBill'
import VDialog from '@/components/Dialog/Dialog'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'DropShippingDetail',
  data () {
    return {
      shiftRunId: '',
      runStatus: '',
      printHeaderInfo: {
        currentDate: '', // 日期
        currentTime: '', // 打印时间
        driverName: '', // 司机
        driverPhone: '', // 司机电话
        carNumber: '', // 车牌号
        articleNumber: '', // 货号
        departureTime: '' // 发车时间，班次时间
      },
      dialogVisible: false,
      tableData: [],
      printTableData: [],
      showDepart: true
    }
  },
  created () {
    let query = this.$route.query
    if (query) {
      this.shiftRunId = query.id
    } else {
      this.runStatus = ''
      this.shiftRunId = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.queryList()
      this.queryPrintHeader()
    },
    queryList () {
      PrintPickingAjax.QueryDeliveryList({shiftRunId: this.shiftRunId, runStatus: this.$route.query.runStatus, shiftFlag: this.$route.query.shiftFlag}).then(response => {
        if (response.code === 200) {
          this.tableData = [...response.data]
          this.printTableData = [...response.data]
          let sumReceivableGoods = 0 // 代收货款合计
          let sumReceivableFreightDisplay = 0 // 运费合计
          let sumTotalQuantity = 0 // 包裹件数合计
          let sumShouldReceivableGoods = 0 // 应收合计
          this.tableData.forEach(item => {
            sumReceivableGoods += Number(item.receivableGoods)
            if (item.freightPayer === 2) {
              sumReceivableFreightDisplay += Number.isNaN(Number(item.receivableFreightDisplay)) ? 0 : Number(item.receivableFreightDisplay)
            }
            sumTotalQuantity += Number(item.totalQuantity)
            sumShouldReceivableGoods += Number(item.shouldReceivableGoods)
          })
          let printSumObj = {
            waybillNumber: '合计',
            receivableGoods: sumReceivableGoods.toFixed(2),
            receivableFreightDisplay: sumReceivableFreightDisplay.toFixed(2),
            articleNumber: sumTotalQuantity,
            shouldReceivableGoods: sumShouldReceivableGoods.toFixed(2)
          }
          this.printTableData.push(printSumObj)
        }
      })
    },
    queryPrintHeader () {
      PrintPickingAjax.QueryPrintheaderInfo({id: this.shiftRunId}).then(response => {
        if (response.code === 200) {
          let { data } = response
          this.runStatus = data.runStatus
          this.printHeaderInfo.driverName = data.driverName
          this.printHeaderInfo.driverPhone = data.driverPhone
          this.printHeaderInfo.lineName = data.lineName
          this.printHeaderInfo.articleNumber = data.articleNumber
          this.printHeaderInfo.departureTime = data.departureTime
        }
      })
    },
    // 行发车
    depart () {
      if (this.runStatus === 0) { // 没发车
        this.dialogVisible = true
      }
    },
    print () {
      let curDate = new Date()
      this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
      this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}`
      this.$nextTick(() => {
        this.$print(this.$refs.print)
      })
    },
    clickSure () {
      this.dialogVisible = false
      PrintPickingAjax.Departure({shiftRunId: this.shiftRunId}).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '发车成功！'
          })
          this.showDepart = false
          this.init()
        }
      })
    },
    clickCancel () {
      this.dialogVisible = false
    },
    goback () {
      this.$router.push({name: 'PrintPickingBill'})
    },
    download () {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.drop-shipping-detail{
  .table-print-con{
    display: none;
  }
  /* .table-print-con{
    -width: 595px;
    margin: 0 auto;
    .print-table{
      -width: 550px;
      margin: 0 auto;
      border-collapse:collapse;
      td{
        border: 1px solid #aaa;
      }
      .articleNumber{
        width: 100px;
      }
      .waybillNumber{
        width: 150px;
      }
      .receiveClient{
        width: 150px;
      }
      .receivePhone{
        width: 100px;
      }
      .receivableGoods{
        width: 80px;
      }
      .receivableFreight{
        width: 80px;
      }
      .waybillReceivable{
        width: 80px;
      }
    }
  } */
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.drop-shipping-detail{
  display: flex;
  flex: 1;
  .public_list{
    display: flex;
    flex-direction: column;
    .table-con{
      display: flex;
      flex: 1;
      margin-top: 30px;
    }
    .btns{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 32px;
      margin-top: 10px;
    }
    .table-print-con{
      -width: 595px;
      margin: 0 auto;
      .print-table{
        -width: 550px;
        margin: 0 auto;
        border-collapse:collapse;
        td{
          border: 1px solid #aaa;
        }
        .articleNumber{
          width: 100px;
        }
        .waybillNumber{
          width: 150px;
        }
        .receiveClient{
          width: 150px;
        }
        .receivePhone{
          width: 100px;
        }
        .receivableGoods{
          width: 80px;
        }
        .receivableFreight{
          width: 80px;
        }
        .waybillReceivable{
          width: 80px;
        }
      }
    }
  }
}
</style>
