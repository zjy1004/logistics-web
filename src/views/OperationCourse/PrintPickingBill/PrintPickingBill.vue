<template>
  <div class="print-picking-bill">
    <div class="public_card">
      <!-- <h3 class="card_header">打印配货单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="当前时间:" prop="curTime">
                <div class="curTimeText">{{form.curTime}}</div>
              </el-form-item>
              <el-form-item class="date" label="日期:" prop="shiftDate">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="form.shiftDate"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="线路:" prop="pkLineObj">
                <el-select v-model="form.pkLineObj" filterable placeholder="请选择线路" value-key="generateKey" clearable>
                  <el-option
                    v-for="(item, index) in pkLineOptions"
                    :key="index"
                    :label="item.generateVal"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="司机:" prop="driveObj">
                <el-select v-model="form.driveObj" filterable placeholder="请选择司机" value-key="userId" clearable>
                  <el-option
                    v-for="(item, index) in driveOptions"
                    :key="index"
                    :label="item.userName"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" :disabled="exportDisabled" @click="exportExcel()">导出配货单</el-button>
            <el-button :disabled="exportDisabled" @click="printReceiveWaybill()">打印收货运单</el-button>
            <el-button :disabled="exportDisabled" @click="printLogisticsWaybill()">打印物流运单</el-button>
          </div>
          <div class="table-con">
            <el-table
              ref="tableId"
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
                min-width="10%"
                prop="shiftTime"
                label="日期">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="lineName"
                label="线路">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="departureTime"
                label="班次">
                <template slot-scope="scope">
                  <span>{{scope.row.departureTime}}{{scope.row.temporaryFlag === 1 ? '（临时）' : ''}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                min-width="15%"
                prop="carNumber"
                label="车牌号">
              </el-table-column> -->
              <el-table-column
                min-width="10%"
                prop="driverName"
                label="司机">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillCounts"
                label="待发车单数">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="totalQuantity"
                label="待装车件数">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a class="print" href="javascript:;" type="text" size="small" @click="print(scope.row)">打印配货单</a>
                  <a class="searchRow" href="javascript:;" type="text" size="small" @click="searchRow(scope.row)">查询</a>
                  <a class="searchRow" href="javascript:;" type="text" size="small" v-if="scope.row.runStatus === 0" @click="depart(scope.row)">发车</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
          <!-- <print-picking
            ref="printCon"
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
      :className="'param'"
      mainText="所选班次单量超过100，请确认打印机纸张是否充足且打印过程中如果需要换纸，请不要关闭电源否则会导致数据丢失?"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
      sureBtn="继续打印"
      cancelBtn="不打了"
    />

    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :batchPrintDate="batchPrintObj"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
import PrintPickingAjax from '@/api/PrintPickingBill/PrintPickingBill'
import RouteAjax from '@/api/RouteManage/RouteManage'
import { mapGetters } from 'vuex'
import PrintWayAndBoxBill from '../../WaybillManage/NewWaybill/subpage/printWayBoxBill'

let logisticsId
export default {
  name: 'PrintPickingBill',
  data () {
    return {
      clickSearch: false,
      form: {
        curTime: '',
        pkLineObj: {generateKey: '', generateVal: ''},
        driveObj: {userId: '', userName: ''},
        shiftDate: ''
      },
      selection: [],
      row: null,
      dialogVisible: false,
      dialogFlag: '',
      pkLineOptions: [],
      driveOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      tableData: [],
      printTableData: [],
      printHeaderInfo: {
        currentDate: '', // 日期
        currentTime: '', // 打印时间
        driverName: '', // 司机
        driverPhone: '', // 司机电话
        // carNumber: '', // 车牌号
        articleNumber: '', // 货号
        departureTime: '' // 发车时间，班次时间
      },
      printData: [], // 打印运单数据
      batchPrintObj: {
        printArr: [],
        printType: ''
      },
      printDateNum: 0
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    exportDisabled () {
      return this.selection.length === 0
    }
  },
  created () {
    let curDate = new Date()
    this.form.curTime = `${curDate.getFullYear()}-${curDate.getMonth() + 1}-${curDate.getDate()} ${curDate.getHours()}:${curDate.getMinutes()}`
    this.form.shiftDate = this.formatCurrentDate()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      logisticsId = JSON.parse(userInfo).logisticsId
    }

    this.init()
  },
  watch: {
  },
  methods: {
    init () {
      this.queryList()
      this.queryLines()
      this.queryDrivers()
    },
    queryPrintHeader (id, runStatus, shiftFlag) {
      PrintPickingAjax.QueryPrintheaderInfo({id: id}).then(response => {
        if (response.code === 200) {
          let { data } = response
          this.printHeaderInfo.driverName = data.driverName
          this.printHeaderInfo.driverPhone = data.driverPhone
          this.printHeaderInfo.lineName = data.lineName
          this.printHeaderInfo.articleNumber = data.articleNumber
          this.printHeaderInfo.departureTime = data.departureTime
          let curDate = new Date()
          this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
          this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}`
          PrintPickingAjax.QueryDeliveryList({shiftRunId: id, runStatus: runStatus, shiftFlag: shiftFlag}).then(response => {
            if (response.code === 200) {
              this.printTableData = [...response.data]
              // if (this.printTableData.length > 0) {
              let sumReceivableGoods = 0 // 代收货款合计
              let sumReceivableFreightDisplay = 0 // 运费合计
              let sumWaybillReceivable = 0 // 司机应收合计
              let sumTotalQuantity = 0 // 包裹件数合计
              let sumShouldReceivableGoods = 0 // 应收合计
              this.printTableData.forEach(item => {
                sumReceivableGoods += Number(item.receivableGoods)
                if (item.freightPayer === 2) {
                  sumReceivableFreightDisplay += Number.isNaN(Number(item.receivableFreightDisplay)) ? 0 : Number(item.receivableFreightDisplay)
                }
                sumWaybillReceivable += Number(item.waybillReceivable)
                sumTotalQuantity += Number(item.totalQuantity)
                sumShouldReceivableGoods += Number(item.shouldReceivableGoods)
              })
              this.printTableData.map(item => {
                item.waybillNumber = item.waybillNumber.toString()
                return item
              })
              let sumObj = {
                waybillNumber: '合计',
                receivableGoods: sumReceivableGoods.toFixed(2),
                receivableFreightDisplay: sumReceivableFreightDisplay.toFixed(2),
                waybillReceivable: sumWaybillReceivable.toFixed(2),
                articleNumber: sumTotalQuantity,
                shouldReceivableGoods: sumShouldReceivableGoods.toFixed(2)
              }
              this.printTableData.push(sumObj)
              // this.$refs.printCon.init()
              this.$nextTick(() => {
                this.$print(this.$refs.print)
              })
              // }
            }
          })
        }
      })
    },
    queryList (type) {
      let postData = {
        currentPage: type === 'searchBtn' ? 1 : this.paginationParams.pageNum,
        pageSize: this.paginationParams.pageSize,
        lineId: this.form.pkLineObj.generateKey,
        driverId: this.form.driveObj.userId,
        shiftDate: this.form.shiftDate || ''
      }
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      PrintPickingAjax.QueryList(postData).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    queryLines () {
      RouteAjax.QueryLines().then(response => {
        if (response.code === 200) {
          this.pkLineOptions = response.data
        }
      })
    },
    queryDrivers () {
      RouteAjax.QueryDrivers({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.driveOptions = response.data
        }
      })
    },
    search () {
      this.queryList('searchBtn')
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    print (row) {
      this.row = row
      this.queryPrintHeader(this.row.id, this.row.runStatus, this.row.shiftFlag)
    },
    searchRow (row) {
      this.$router.push({name: 'DropShippingDetail', query: { id: row.id, runStatus: row.runStatus, shiftFlag: row.shiftFlag }})
    },
    // 行发车
    depart (row) {
      if (row.runStatus === 0) { // 没发车
        PrintPickingAjax.Departure({shiftRunId: row.id}).then(response => {
          if (response.code === 200) {
            this.$notify({
              type: 'success',
              message: '发车成功！'
            })
            this.queryList()
          }
        })
      }
    },
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let shiftRunIdList = this.selection.map(item => {
        return item.id
      }).join(',')
      let obj = {}
      obj.shiftRunIdList = shiftRunIdList
      exportParams.queryParams = obj
      // this.form.shiftRunIdList = shiftRunIdList
      // exportParams.queryParams = this.form
      exportParams.url = '/waybill/export/exportMapDeliveryList'
      this.exportList(exportParams)
    },
    queryPrintWaybillData (val, flag) {
      PrintPickingAjax.BatchPrintingWaybill(val).then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.batchPrintObj.printArr = data
          this.batchPrintObj.printType = flag
          this.printDateNum = data.length
          this.selection = []
          this.$refs.tableId.clearSelection()
          if (data.length < 100) {
            this.$refs.printComponent.batchPrint()
          } else {
            this.dialogVisible = true
          }
        }
      })
    },
    // 打印收货运单
    printReceiveWaybill () {
      this.dialogFlag = '收方'
      let arrList = this.selection.map(item => {
        return item.id
      })
      this.queryPrintWaybillData({runShiftIdList: arrList}, '收方')
    },
    // 打印物流运单
    printLogisticsWaybill () {
      this.dialogFlag = '物流公司回执'
      let arrList = this.selection.map(item => {
        return item.id
      })
      this.queryPrintWaybillData({runShiftIdList: arrList}, '物流公司回执')
    },
    clickSure () {
      this.dialogVisible = false
      this.$refs.printComponent.batchPrint()
    },
    clickCancel () {
      this.dialogVisible = false
    }
  },
  components: {
    VPagination,
    VDialog,
    PrintWayAndBoxBill
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.print-picking-bill{
  .pagination{
    margin-top: 10px;
  }
  .date{
    .el-date-editor.el-input{
      width: 168px!important;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.print-picking-bill{
  display: flex;
  flex: 1;
  .search-btn-con{
    margin-top: 15px!important;
  }
  .public_list{
    display: flex;
    flex-direction: column;
  }
  .table-con{
    display: flex;
    flex: 1;
  }
  .pagination{
    margin-top: 10px;
  }
  .table-print-con{
    display: none;
  }
}
</style>
