<template>
  <div class="Unsettlement-for-customersList">
    <div class="public_card">
      <h3 class="card_header">给客户结算>未结算运单查看</h3>
      <h3 class="card_header">结算客户：{{Mtitle}}</h3>
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <div class="common-search">
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

                <el-form-item label="运单号:" prop="waybillNumber">
                  <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable class="inputWidth"></el-input>
                </el-form-item>

              </div>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
            <!-- <el-button @click="resetForm">重置</el-button> -->
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
            <span style="float: right;">
              <el-checkbox v-model='checked' @change="changeState">只显示  "待结算"</el-checkbox>
            </span>
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
                min-width="6%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="15%"
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
                prop="receivableGoods"
                label="代收货款（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="fee"
                label="手续费（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="settlementSubtotal"
                label="结算小计（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="financeStatus"
                label="结算状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.financeStatus === '待结算'" @click="confirmSettlement(scope.row)">确认结算</a>
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

          <v-dialog
            v-if="dialogVisible"
            :mainText="`请确认是否结算？`"
            :dialogVisible="dialogVisible"
            @click-cancel="ReceiptCancel"
            @click-sure="ReceiptSure"
          />

          <receipt-confirm
            v-if="receiptConfirmVisible"
            :dialogVisible="receiptConfirmVisible"
            :receiptAmount="rightTotal"
            :sendReceivableFreight="sendReceivableFreightTotal"
            @click-cancel="receiptConfirmVisibleCancel"
            @cancel="cancel"
            @click-sure="sure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettlementForCustomersAjax from '@/api/SettlementForCustomers/SettlementForCustomers'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import ReceiptConfirm from './ConfirmDialog'
import VDialog from '@/components/Dialog/Dialog'

import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'UnSettlementForCustomersList',
  data () {
    return {
      dialogVisible: false,
      receiptConfirmVisible: false,
      checked: false,
      Mtitle: '',
      form: {
        sendClient: '', // 发货方id
        financeStatus: '',
        createTime: '',
        waybillNumber: '',
        createTimeStart: '', // 开始时间
        createTimeEnd: '' // 截止时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: [],
      waybillIdList: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    VDialog,
    ReceiptConfirm

  },
  created () {
    this.Mtitle = this.$route.query.title || ''
    this.form.sendClient = this.$route.query.sendClient || ''
    this.form.createTime = this.$route.query.searchDate || ''
    this.form.createTimeStart = this.$route.query.searchDate ? this.$route.query.searchDate[0] : ''
    this.form.createTimeEnd = this.$route.query.searchDate ? this.$route.query.searchDate[1] : ''
    console.log(this.$route.query)
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    changeState (val) {
      if (val) {
        this.form.financeStatus = 2
      } else {
        this.form.financeStatus = ''
      }
      this.queryList('searchBtn')
    },
    ReceiptCancel () {
      this.dialogVisible = false
      this.waybillIdList = []
    },
    ReceiptSure () {
      this.Settlement({waybillIdList: this.waybillIdList})
    },
    check (row) {
      this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: '向员工收款>查看收款信息', waybillId: row.waybillId, freightPayer: row.freightPayer, title: this.Mtitle}})
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      SettlementForCustomersAjax.QueryCheckList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            if (item.financeStatus === 2) {
              item.financeStatus = '待结算'
            } else { // 10 1
              item.financeStatus = '待收款'
            }
            item.rowNum = index + 1
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
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.waybillNumber = ''
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
    // 行确认结算
    confirmSettlement (row) {
      if (row.settlementMethod === 4) {
        this.receiptConfirmVisible = true
        this.rightTotal = row.settlementSubtotal.toFixed(2)
        this.sendReceivableFreightTotal = row.sendReceivableFreight.toFixed(2)
      } else {
        this.dialogVisible = true
      }
      this.waybillIdList.push(row.waybillId)
    },
    Settlement (val) { // 确认结算
      WaybillApiAjax.Settlement(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.waybillIdList = []
          this.queryList(this.form)
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        } else {
          this.dialogVisible = false
          this.waybillIdList = []
          this.queryList(this.form)
        }
      })
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/export/reconciliation/client/check/list'
      this.exportList(exportParams)
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
    receiptConfirmVisibleCancel () {
      this.receiptConfirmVisible = false
      this.waybillIdList = []
    },
    sure () {
      let obj = {}
      obj.waybillIdList = this.waybillIdList
      obj.flag = 1
      console.log(obj)
      this.SureSettlement(obj)
    },
    cancel () {
      let obj = {}
      obj.waybillIdList = this.waybillIdList
      obj.flag = 0
      console.log(obj)
      this.CancelSettlement(obj)
    },
    SureSettlement (val) { // 确认结算
      WaybillApiAjax.SettlementAndMonthBatchCollection(val).then(res => {
        if (res.code === 200) {
          this.receiptConfirmVisible = false
          this.queryList(this.form)
          this.waybillIdList = []
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        } else {
          this.receiptConfirmVisible = false
          this.queryList(this.form)
        }
      })
    },
    CancelSettlement (val) { // 确认结算（否）
      WaybillApiAjax.SettlementAndMonthBatchCollection(val).then(res => {
        if (res.code === 200) {
          this.receiptConfirmVisible = false
          this.queryList(this.form)
          this.waybillIdList = []
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        } else {
          this.receiptConfirmVisible = false
          this.queryList(this.form)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '../../../../style/base.less';
.Unsettlement-for-customersList{
  .inputWidth {
    .el-input__inner {
      width: 200px;
    }
  }
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
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
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
@import '../../../../style/base.less';
.Unsettlement-for-customersList{
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
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
  }
  .search-btn-con{
    margin-top: 15px!important;
  }
}
</style>
