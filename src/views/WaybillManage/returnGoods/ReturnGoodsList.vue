<template>
  <div class="all-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">{{waybillTitle}}</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>
              <el-form-item label="发货方:" prop="sendClient">
                <el-select v-model.number="form.sendClient" filterable placeholder="请选择发货方" clearable>
                  <el-option
                    v-for="(item, index) in RepairDepotOptions"
                    :key="index"
                    :label="item.clientName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="收货方:" prop="receiveClient">
                <el-select v-model="form.receiveClient" filterable placeholder="请选择收货方" clearable>
                  <el-option
                    v-for="(item, index) in DistributorOptions"
                    :key="index"
                    :label="item.clientName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="箱单号:" prop="articleNumber">
                <el-input v-model="form.articleNumber" placeholder="请输入箱单号" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="开单日期:">
                 <el-date-picker
                  style="width: 400px;"
                  v-model="createDateValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="退货日期:" v-if="retrunDateShow">
                 <el-date-picker
                  style="width: 400px;"
                  v-model="returnDateValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="是否打印配货单:" label-width="110px!important" prop="printInvoice" v-if="printInvoiceShow">
                <!-- <el-checkbox v-if="checkBoxShow" v-model="form.checked">已打印配货单</el-checkbox> -->
                <el-select v-model="form.printInvoice" filterable placeholder="请选择是否打印配货单" clearable>
                  <el-option
                    v-for="(item, index) in printInvoiceOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
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
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
            <el-button class="btn-main" v-if="printListShow" @click="printList">打印配货单</el-button>
            <el-button class="btn-main" @click="batchConfirmPutInStorage" v-if="false">确认入库</el-button>
            <el-button class="btn-main" @click="batchConfirmReturnGoods" v-if="confirmReturnGoodsDisabled">确认退货</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <el-table-column
                key="1"
                v-if="checkedBoxShow"
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                key="2"
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <!-- <el-table-column
                key="3"
                min-width="15%"
                prop="articleNumber"
                label="箱单号">
              </el-table-column> -->
              <el-table-column
                key="4"
                min-width="15%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                key="5"
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="15%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                v-if="retrunDateShow"
                key="12"
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="15%"
                prop="returnTime"
                label="退货日期">
              </el-table-column>
              <el-table-column
                key="6"
                min-width="15%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                key="7"
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                key="8"
                min-width="10%"
                prop="packageQuantity"
                label="件数">
              </el-table-column>
              <el-table-column
                key="9"
                min-width="10%"
                prop="receivableGoods"
                label="代收货款（元）">
              </el-table-column>
              <el-table-column
                key="10"
                min-width="10%"
                prop="receivableFreight"
                label="运费(元）">
              </el-table-column>
              <el-table-column
                key="11"
                fixed="right"
                label="操作"
                min-width="18%">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <!-- <a class="check" href="javascript:;" type="text" size="small" v-if="scope.row.confirmReturnGoodsShow" @click="printPage(scope.row)">打印配货单</a> -->
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.confirmPutInStorageShow" @click="confirmPutInStorage(scope.row)">确认入库</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="scope.row.confirmReturnGoodsShow" @click="confirmReturnGoods(scope.row)">确认退货</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="scope.row.cancelWaybillShow" @click="cancelWaybill(scope.row)">取消</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
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
      :mainText="mainText"
      :dialogVisible="dialogVisible"
      @click-cancel="returnGoodsCancel"
      @click-sure="returnGoodsSure"
    />

    <put-in-storage-dialog
      v-if="putInStorageDialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="putInStorageDialogVisible"
      @click-cancel="putInStorageCancel"
      @click-sure="putInStorageSure"
      :editInfoProps="putInStorageDialogInfo"
    />

    <!-- 三联运单与箱单 -->
    <print-way-and-box-bill
      ref="printComponent"
      :waybillId="printWaybillId"
      :isPrintwayBill="isPrintwayBill"
      :isPrintBoxBill="isPrintBoxBill"
    />
    <!-- 配货单 -->
    <section  class="table-print-con" ref="print">
      <div style="width: 860px; height: 50px;">
        <div style="width: 540px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">退货清单</div>
        <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">日期: {{printHeaderInfo.currentDate}}</div>
        <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">打印时间: {{printHeaderInfo.currentTime}}</div>
      </div>
      <div style="width: 860px; height: 40px;">
        <div style="width: 540px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="client">客户信息</div>
        <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="money">应收金额</div>
        <div style="width: 160px; float: left; border-width: 1px; border-color: #aaaaaa; border-style: solid; height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;" class="other">其他</div>
      </div>
      <div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width:40px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">序号</th>
              <th style="width:120px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">收货方</th>
              <th style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">货号</th>
              <th style="width:60px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">件数</th>
              <th style="width:120px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">发货方</th><!-- 运单号变为发货方 -->
              <th style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">联系电话(收货方)</th>
              <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">代收货款</th>
              <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">运费</th>
              <!-- <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">司机应收</th> -->
              <th style="width:160px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="index" v-for="(tr, index) in printTableData">
              <td style="width:40px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{ index === (printTableData.length - 1) ? '' : index + 1}}</td>
              <td style="width:120px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receiveClientName}}</td><!-- 收货方 -->
              <td style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.articleNumber}}</td><!-- 货号 -->
              <td style="width:60px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.packageQuantity}}</td><!-- 件数 -->
              <td style="width:120px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.sendClientName}}</td><!-- 运单号变为发货方 -->
              <td style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivePhone}}</td><!-- 联系电话 -->
              <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivableGoods}}</td><!-- 代收货款 -->
              <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivableFreight}}</td><!-- 运费 -->
              <!-- <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.waybillReceivable}}</td> --><!-- 司机应收 -->
              <td style="width:160px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.remark}}</td><!-- 备注 -->
            </tr>
          </tbody>
        </table>
      </div>
    </section >

  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import waybillManageAjax from '@/api/WaybillManage/WaybillManage'
import VDialog from '@/components/Dialog/Dialog'
import PutInStorageDialog from './subpage/PutInStorageDialog'
import { mapGetters } from 'vuex'
import PrintWayAndBoxBill from '../NewWaybill/subpage/printWayBoxBill'

export default {
  data () {
    return {
      pageFlag: '',
      clickSearch: false,
      printHeaderInfo: {}, // 配货单
      printTableData: [], // 配货单
      printWaybillId: '', // 三联单
      isPrintwayBill: false,
      isPrintBoxBill: false,
      printListShow: false,
      retrunDateShow: true,
      dialogVisible: false,
      putInStorageDialogVisible: false, // 待入库显示
      confirmPutInStorageDisabled: false,
      confirmReturnGoodsDisabled: false,
      checkedBoxShow: true,
      printInvoiceShow: true,
      mainText: '', // 退货弹出窗内容
      createDateValue: '', // 可选择日期范围
      returnDateValue: '',
      waybillTitle: '', // 当前页
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        waybillNumber: '', // 运单号
        receiveClient: '', // 经销商
        sendClient: '', // 修理厂
        createTimeStart: '', // 创建时间起
        createTimeEnd: '', // 创建时间止
        returnTimeStart: '', // 退货时间起
        returnTimeEnd: '', // 退货时间止
        articleNumber: '', // 箱单号
        printInvoice: '', // 是否打印配货单
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      printInvoiceOptions: [{id: 1, name: '已打印配货单'}, {id: 2, name: '未打印配货单'}],
      DistributorOptions: [], // 经销商
      RepairDepotOptions: [], // 修理厂
      tableData: [],
      multipleSelection: [] // 全选
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let flag = newVal.query.index
      this.pageFlag = flag
      this.whichPage(flag)
    },
    createDateValue (newVal, oldVal) {
      if (newVal === null) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = newVal[0]
        this.form.createTimeEnd = newVal[1]
      }
    },
    returnDateValue (newVal, oldVal) {
      if (newVal === null) {
        this.form.returnTimeStart = ''
        this.form.returnTimeEnd = ''
      } else {
        this.form.returnTimeStart = newVal[0]
        this.form.returnTimeEnd = newVal[1]
      }
    }
  },
  computed: {
    ...mapGetters(['formatDate'])
  },
  created () {
    this.GetClientData()
    let flag = this.$route.query.index
    this.whichPage(flag)
  },
  methods: {
    printPage (val) {
      let curDate = new Date()
      this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
      this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes()}`
      this.printTableData.push(val)
      this.waybillPrintInvoiceBatch({waybillIdList: val.waybillId})
      let sumReceivableGoods = 0 // 代收货款合计
      let sumReceivableFreight = 0 // 运费合计
      sumReceivableGoods += Number(val.receivableGoods)
      sumReceivableFreight += Number(val.receivableFreight)
      let sumObj = {
        receiveClientName: '合计',
        receivableGoods: sumReceivableGoods.toFixed(2),
        receivableFreight: sumReceivableFreight.toFixed(2)
      }
      this.printTableData.push(sumObj)
      this.$nextTick(() => {
        this.$print(this.$refs.print)
      })
    },
    whichPage (value) {
      if (value === 'prepareForStorage') {
        this.form.waybillNumber = '' // 运单号
        this.form.articleNumber = '' // 箱单号
        this.form.printInvoice = '' // 是否打印配货单
        this.form.createTimeStart = '' // 创建时间起
        this.form.createTimeEnd = '' // 创建时间止
        this.form.returnTimeStart = '' // 退货时间起
        this.form.returnTimeEnd = '' // 退货时间止
        this.form.receiveClient = '' // 经销商
        this.form.sendClient = '' // 修理厂
        this.printListShow = false
        this.retrunDateShow = false
        this.confirmPutInStorageDisabled = true
        this.confirmReturnGoodsDisabled = false
        this.waybillTitle = '待入库运单'
        this.printInvoiceShow = false
        this.form.waybillNumber = ''
        this.createDateValue = ''
        this.returnDateValue = ''
        this.form.waybillType = 2
        this.form.queryStatus = 9
        this.QueryListByStatus(this.form)
        this.checkedBoxShow = false
      }
      if (value === 'prepareForReturn') {
        this.form.waybillNumber = '' // 运单号
        this.form.articleNumber = '' // 箱单号
        this.form.printInvoice = '' // 是否打印配货单
        this.form.createTimeStart = '' // 创建时间起
        this.form.createTimeEnd = '' // 创建时间止
        this.form.returnTimeStart = '' // 退货时间起
        this.form.returnTimeEnd = '' // 退货时间止
        this.form.receiveClient = '' // 经销商
        this.form.sendClient = '' // 修理厂
        this.printListShow = true
        this.confirmPutInStorageDisabled = false
        this.confirmReturnGoodsDisabled = true
        this.waybillTitle = '待退货运单'
        this.checkedBoxShow = true
        this.printInvoiceShow = true
        this.retrunDateShow = false
        this.form.waybillNumber = ''
        this.createDateValue = ''
        this.returnDateValue = ''
        this.form.waybillType = 2
        this.form.queryStatus = 10
        this.QueryListByStatus(this.form)
      }
      if (value === 'prepareForStorageComplete') {
        this.form.waybillNumber = '' // 运单号
        this.form.articleNumber = '' // 箱单号
        this.form.printInvoice = '' // 是否打印配货单
        this.form.createTimeStart = '' // 创建时间起
        this.form.createTimeEnd = '' // 创建时间止
        this.form.returnTimeStart = '' // 退货时间起
        this.form.returnTimeEnd = '' // 退货时间止
        this.form.receiveClient = '' // 经销商
        this.form.sendClient = '' // 修理厂
        this.printListShow = false
        this.retrunDateShow = true
        this.confirmPutInStorageDisabled = false
        this.confirmReturnGoodsDisabled = false
        this.waybillTitle = '已完成运单'
        this.checkedBoxShow = false
        this.printInvoiceShow = false
        this.form.waybillNumber = ''
        this.createDateValue = ''
        this.returnDateValue = ''
        this.form.waybillType = 2
        this.form.queryStatus = 5
        this.QueryListByStatus(this.form)
      }
      if (value === 'cancel') {
        this.form.waybillNumber = '' // 运单号
        this.form.articleNumber = '' // 箱单号
        this.form.printInvoice = '' // 是否打印配货单
        this.form.createTimeStart = '' // 创建时间起
        this.form.createTimeEnd = '' // 创建时间止
        this.form.returnTimeStart = '' // 退货时间起
        this.form.returnTimeEnd = '' // 退货时间止
        this.form.receiveClient = '' // 经销商
        this.form.sendClient = '' // 修理厂
        this.printListShow = false
        this.retrunDateShow = false
        this.confirmPutInStorageDisabled = false
        this.confirmReturnGoodsDisabled = false
        this.waybillTitle = '已取消运单'
        this.checkedBoxShow = false
        this.printInvoiceShow = false
        this.form.waybillNumber = ''
        this.createDateValue = ''
        this.returnDateValue = ''
        this.form.waybillType = 2
        this.form.queryStatus = 6
        this.QueryListByStatus(this.form)
      }
    },
    changePage (pageSize, pageNumber) {
      this.form.pageSize = pageSize
      this.form.currentPage = pageNumber
      this.QueryListByStatus(this.form)
    },
    changePageSize (pageSize) {
      this.form.pageSize = pageSize
      this.form.currentPage = 1
      this.QueryListByStatus(this.form)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.clickSearch = true
      this.form.currentPage = 1
      this.QueryListByStatus(this.form)
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/waybillManage/exportExcelReturnGoodsWaybill'
      // exportParams.waybillIdList = waybillIdList
      this.exportList(exportParams)
    },
    printList () {
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要打印的行!'
        })
      } else {
        this.waybillIdList = this.multipleSelection.map(item => {
          return item.waybillId
        })
        let curDate = new Date()
        this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
        this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}`
        this.printTableData = this.multipleSelection
        this.waybillPrintInvoiceBatch({waybillIdList: this.waybillIdList})
        if (this.multipleSelection.length > 0) {
          let sumReceivableGoods = 0 // 代收货款合计
          let sumReceivableFreight = 0 // 运费合计
          let sumPackageQuantity = 0 // 件数合计
          this.multipleSelection.forEach(item => {
            sumReceivableGoods += Number(item.receivableGoods)
            sumReceivableFreight += Number(item.receivableFreight)
            sumPackageQuantity += Number(item.packageQuantity)
          })
          let sumObj = {
            receiveClientName: '合计',
            receivableGoods: sumReceivableGoods,
            receivableFreight: sumReceivableFreight,
            packageQuantity: sumPackageQuantity + '件'
          }
          console.log(this.printTableData)
          this.printTableData.push(sumObj)
          this.$nextTick(() => {
            console.log(this.$refs.print)
            // let printHtml = document.getElementById('print').innerHTML // 获取需要生成pdf页面的div代码
            // let wind = window.open('', 'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
            // wind.document.body.innerHTML = printHtml
            // window.print() // 打印当前窗口
            // return false

            // let formPrint = document.getElementById('print')
            // let newStr = formPrint.innerHTML
            // let oldStr = document.body.innerHTML
            // document.body.innerHTML = newStr
            // window.print()
            // // window.location.reload()
            // document.body.innerHTML = oldStr
            // return false
            this.$print(this.$refs.print)
          })
        }
      }
    },
    printThreeList (val) {
      setTimeout(() => {
        if (val.checkList.length === 2) {
          this.isPrintwayBill = true
          this.isPrintBoxBill = true
        } else if (val.checkList.length === 1) {
          if (val.checkList[0] === '打印运单') {
            // 打印三联
            this.isPrintwayBill = true
            this.isPrintBoxBill = false
          } else {
            // 打印箱单
            this.isPrintwayBill = false
            this.isPrintBoxBill = true
          }
        } else {
          this.isPrintwayBill = false
          this.isPrintBoxBill = false
        }
        this.$refs.printComponent.init()
      }, 10)
    },
    check (val) {
      this.$router.push({name: 'ReturnGoodsDetail', query: {waybillTitle: this.waybillTitle, waybillId: val.waybillId}})
    },
    batchConfirmPutInStorage (val) { // 批量确认入库
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要入库的行!'
        })
      } else {
        this.putInStorageDialogVisible = true
        this.putInStorageDialogInfo = this.multipleSelection
        this.dialogWidth = '486px'
        this.dialogTitle = '请确认是否已入库'
      }
    },
    confirmPutInStorage (val) { // 确认入库
      this.putInStorageDialogVisible = true
      this.dialogWidth = '486px'
      this.dialogTitle = '请确认是否已入库'
      this.putInStorageDialogInfo = val
    },
    batchConfirmReturnGoods () { // 批量确认退货
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要退货的行!'
        })
      } else {
        this.returnGoodsId = this.multipleSelection.map(item => {
          return item.waybillId
        })
        this.dialogVisible = true
        this.mainText = '请确认是否已退货'
      }
    },
    confirmReturnGoods (val) { // 确认退货
      this.dialogVisible = true
      this.mainText = '请确认是否已退货'
      this.returnGoodsId = val.waybillId
    },
    returnGoodsCancel () {
      this.dialogVisible = false
    },
    returnGoodsSure () { // 点击确认退货
      let obj = {}
      obj.waybillIdList = this.returnGoodsId
      obj.waybillStatus = 10
      this.waybillPutInStorageReturnGoodsBatch(obj, 'returnGoods')
    },
    putInStorageCancel () { // 入库取消
      this.putInStorageDialogVisible = false
    },
    putInStorageSure (val, printInfo) { // 入库确认
      let obj = {}
      obj.waybillStatus = 9
      if (Array.isArray(val)) {
        if (val.length === 1) {
          obj.waybillIdList = val[0].waybillId
        } else {
          obj.waybillIdList = val.map(item => {
            return item.waybillId
          })
        }
      } else {
        obj.waybillIdList = val.waybillId
        this.printWaybillId = val.waybillId
      }
      this.printThreeList(printInfo)
      this.waybillPutInStorageReturnGoodsBatch(obj, 'putInStorage')
    },
    cancelWaybill (val) { // 取消运单
      this.Cancel({waybillId: val.waybillId})
    },
    QueryListByStatus (val) { // 运单列表
      WaybillApiAjax.QueryListByStatus(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.waybillStatus === 9) {
              item.confirmPutInStorageShow = true
              item.confirmReturnGoodsShow = false
              item.cancelWaybillShow = true
            }
            if (item.waybillStatus === 10) {
              item.confirmPutInStorageShow = false
              item.confirmReturnGoodsShow = true
              item.cancelWaybillShow = true
            }
            if (item.waybillStatus === 5) {
              item.confirmPutInStorageShow = false
              item.confirmReturnGoodsShow = false
              item.cancelWaybillShow = false
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    GetClientData (val) { // 1修理厂2经销商
      waybillManageAjax.GetClientData(val).then(res => {
        if (res.code === 200) {
          this.RepairDepotOptions = res.data[1]
          this.DistributorOptions = res.data[2]
        }
      })
    },
    waybillPutInStorageReturnGoodsBatch (val, flag) { // 退货运单确认入库9确认退货10(批量)
      WaybillApiAjax.waybillPutInStorageReturnGoodsBatch(val).then(res => {
        if (res.code === 200) {
          if (flag === 'putInStorage') {
            this.putInStorageDialogVisible = false
            this.QueryListByStatus(this.form)
            this.$notify({
              type: 'success',
              message: '入库成功！'
            })
          }
          if (flag === 'returnGoods') {
            this.dialogVisible = false
            this.QueryListByStatus(this.form)
            this.$notify({
              type: 'success',
              message: '退货成功！'
            })
          }
        }
      })
    },
    waybillPrintInvoiceBatch (val) { // 打印配货单状态修改(批量)
      WaybillApiAjax.waybillPrintInvoiceBatch(val).then(res => {
        if (res.code === 200) {
          this.QueryListByStatus(this.form)
        }
      })
    },
    Cancel (val) { // 取消运单
      WaybillApiAjax.Cancel(val).then(res => {
        if (res.code === 200) {
          this.QueryListByStatus(this.form)
          this.$notify({
            type: 'success',
            message: '取消成功！'
          })
        }
      })
    }
  },
  components: {
    VPagination,
    VDialog,
    PutInStorageDialog,
    PrintWayAndBoxBill
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.all-waybill{
  flex: 1;
  display: flex;
  .public_list{
    display: flex;
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
  .table-print-con{
    display: none;
  }
}
</style>
