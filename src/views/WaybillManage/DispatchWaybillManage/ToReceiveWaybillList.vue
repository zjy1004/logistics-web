<template>
  <div class="toReceive-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">待接收运单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="配送类型:">
                <el-select v-model="form.waybillDeliveryType" placeholder="请选择类型" clearable>
                  <el-option
                    v-for="(item, index) in distributionTypeOption"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开单日期:" prop="createTime">
                <el-date-picker
                  style="width: 445px;"
                  v-model="form.createTime"
                  type="daterange"
                  @change="dateChange"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
               <el-form-item label="发货物流:">
                <el-select v-model="form.logisticsId" placeholder="请选择发货物流" clearable>
                  <el-option
                    v-for="(item, index) in sendLogisticsIdOption"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="batchReceipt">批量接货</el-button>
            <el-button class="btn-main" @click="print()">打印接货单</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              border>
              <el-table-column
                type="selection"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="waybillDeliveryType"
                label="配送类型">
                <template slot-scope="scope">
                  <span>{{scope.row.waybillDeliveryType === 3 ? '联营调度运单' : '自营调度运单'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="receipt(scope.row)">接货</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
          <div class="table-print-con" id="printCon" ref="print">
            <div style="width: 1050px; height: 50px;">
              <div style="width: 690px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                接货清单
              </div>
              <div style="width: 360px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">
                打印时间: {{printHeaderInfo.currentDate}} {{printHeaderInfo.currentTime}}
              </div>
            </div>
            <!-- <div style="width: 1050px; height: 40px;">
              <div style="width: 270px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                线路: {{printHeaderInfo.lineName}}
              </div>
              <div style="width: 280px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                司机: {{printHeaderInfo.driverName}}
              </div>
              <div style="width: 280px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">
                电话: {{printHeaderInfo.driverPhone}}
              </div>
              <div style="width: 220px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;">
                发车时间: {{printHeaderInfo.departureTime}}
              </div>
            </div> -->
            <div style="width: 1050px; height: 40px;">
              <div style="width: 690px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="client">运单信息</div>
              <div style="width: 250px; float: left; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="money">运单费用</div>
              <div style="width: 110px; float: left; fontSize: 13px; border-width: 1px; border-color: #aaaaaa; border-style: solid; height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;" class="other"></div>
            </div>
            <div>
              <table class="print-table" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="width:40px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">序号</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运单号</th>
                    <th style="width:70px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">件数</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货方</th>
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">联系电话(收)</th>
                    <th style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">收货地址</th>
                    <th style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">发货方</th><!-- 运单号变为发货方 -->
                    <th style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">代收货款</th>
                    <th style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">运费</th>
                    <th style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; borderRight: none; height: 40px; verticalAlign: middle; textAlign: center;">应收</th>
                    <th style="width:109px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; textAlign: center; borderTop: none;">备注</th>
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
                    <td style="width:70px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.totalQuantity}}<span v-if="index === (printTableData.length - 1)">(件)</span>
                    </td><!-- 货号 -->
                    <td style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveClientName}}
                    </td><!-- 收货方 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveClientPhone}}
                    </td><!-- 联系电话 -->
                    <td style="width:130px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.receiveAddress}}
                    </td><!-- 收货地址 -->
                    <td style="width:120px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      {{tr.sendClientName}}
                    </td><!-- 发货方 -->
                    <td style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.receivableGoods}}
                    </td><!-- 代收货款 -->
                    <td style="width:90px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.receivableFreight}}
                    </td><!-- 运费 -->
                    <td style="width:80px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
                      ￥{{tr.shouldReceivableGoods}}
                    </td><!-- 应收 -->
                    <td style="width:109px; fontSize: 13px; border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">
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
  </div>
</template>

<script>
import ToReceiveWaybillAjax from '@/api/WaybillManage/ToReceiveWaybill'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'MonthlyFreight',
  data () {
    return {
      distributionTypeOption: [{id: 2, name: '自营调度运单'}, {id: 3, name: '联营调度运单'}], // 配送类型
      form: {
        waybillDeliveryType: '', // 配送类型
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        logisticsId: '',
        waybillNumber: '' // 运单号
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: [],
      sendLogisticsIdOption: [],
      printHeaderInfo: {},
      printTableData: []

    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName
  },
  created () {
    let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
    this.queryLogistics(userInfoObj.logisticsId)
    this.init()
  },
  methods: {
    init () {
      // this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      // this.form.createTimeStart = this.formatCurrentDate()
      // this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
    },
    queryLogistics (val) {
      ToReceiveWaybillAjax.QueryLogistics({logisticsIdInitiate: val}).then(res => {
        if (res.code === 200) {
          this.sendLogisticsIdOption = res.data
        }
      })
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      ToReceiveWaybillAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            // item.rowNum = index + 1
            if (item.receiptStatus === 10) {
              item.financeStausName = '未收款'
            } else if (item.receiptStatus === 3) {
              item.financeStausName = '已收款'
            } else {
              item.financeStausName = ''
            }
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    queryPrintInfo (val) {
      ToReceiveWaybillAjax.Print(val).then(response => {
        if (response.code === 200) {
          let curDate = new Date()
          this.printHeaderInfo.currentDate = `${curDate.getFullYear()}/${curDate.getMonth() + 1}/${curDate.getDate()}`
          this.printHeaderInfo.currentTime = `${curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}`
          this.printTableData = [...response.data]
          // if (this.printTableData.length > 0) {
          let sumReceivableGoods = 0 // 代收货款合计
          let sumReceivableFreight = 0 // 运费合计
          let sumWaybillReceivable = 0 // 司机应收合计
          let sumTotalQuantity = 0 // 包裹件数合计
          let sumShouldReceivableGoods = 0 // 应收合计
          this.printTableData.forEach(item => {
            sumReceivableGoods += Number(item.receivableGoods)
            if (item.freightPayer === 2) {
              sumReceivableFreight += Number.isNaN(Number(item.receivableFreight)) ? 0 : Number(item.receivableFreight)
            }
            sumWaybillReceivable += Number(item.waybillReceivable)
            sumTotalQuantity += Number(item.totalQuantity)
            sumShouldReceivableGoods += Number(item.shouldReceivableGoods)
          })
          this.printTableData.map(item => {
            item.waybillNumber = item.waybillNumber.toString()
            item.receiveAddress = item.receiveAddress.substr(0, 26)
            item.totalQuantity = item.totalQuantity + '件'
            if (item.freightPayer === 1) {
              item.receivableFreight = item.receivableFreight + '(现付)'
            }
            return item
          })
          let sumObj = {
            waybillNumber: '合计',
            receivableGoods: sumReceivableGoods.toFixed(2),
            receivableFreight: sumReceivableFreight.toFixed(2),
            waybillReceivable: sumWaybillReceivable.toFixed(2),
            totalQuantity: sumTotalQuantity,
            shouldReceivableGoods: sumShouldReceivableGoods.toFixed(2)
          }
          this.printTableData.push(sumObj)
          this.$nextTick(() => {
            this.$print(this.$refs.print)
          })
        }
      })
    },
    print () {
      if (this.form.logisticsId === '') {
        this.$notify({
          type: 'error',
          message: '请先选择发货物流！'
        })
      } else {
        this.queryPrintInfo(this.form)
      }
    },
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.distributionType = ''
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.createTime = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    // 批量确认收款
    batchReceipt () {
      let obj = {}
      obj.waybillIdList = this.selection.map(item => {
        return item.waybillId
      })
      if (this.selection.length > 0) {
        let obj = {}
        obj.waybillIdList = this.selection.map(item => {
          return item.waybillId
        })
        this.confirmReceipt(obj)
      } else {
        this.$notify({
          type: 'error',
          message: '请勾选接货行！'
        })
      }
    },
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    },
    // 确认收款
    confirmReceipt (waybillIdList) {
      ToReceiveWaybillAjax.Receipt(waybillIdList).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '接货成功！'
          })
          this.queryList()
        }
      })
    },
    // 行确认收款
    receipt (row) {
      this.confirmReceipt({waybillIdList: row.waybillId})
    },
    // 行查看
    check (row) {
      // this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: '待接货运单', waybillId: row.waybillId, from: 'MonthlyFreight', freightPayer: row.freightPayer}})
      this.$router.push({name: 'WaybillDetail', query: {waybillTitle: '待接收运单', waybillId: row.waybillId, pageIndex: '6'}})
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.toReceive-waybill{
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-select .el-input.is-disabled .el-input__inner{
    height: 32px;
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.toReceive-waybill{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 30px;
    margin-top: 0px;
    background: #fff;
    .btn-con{
      height: 34px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .table-con{
      display: flex;
      flex: 1;
      min-height: 160px;
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
    .table-print-con{
      display: none;
    }
  }
}
</style>
