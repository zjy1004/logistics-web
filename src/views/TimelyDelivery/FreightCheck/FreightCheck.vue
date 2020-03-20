<template>
  <div class="freight-check">
    <div class="public_card">
      <!-- <h3 class="card_header">运费管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="80px">
              <el-form-item label="员工:">
                <el-select v-model="form.driver" placeholder="请选择员工" clearable>
                  <el-option
                    v-for="(item, index) in staffOption"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId">
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
              <el-form-item label="状态:">
                <el-select v-model="form.financeStatus" placeholder="请选择收款状态" clearable>
                  <el-option
                    v-for="(item, index) in statusOption"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
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
            <el-button class="btn-main" @click="batchReceipt">批量收款</el-button>
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              :summary-method="getSummaries"
              @selection-change="selectionChange"
              border>
              <el-table-column
                type="selection"
                width="60">
              </el-table-column>
              <el-table-column
                width="60"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receiptUserName"
                label="员工">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receiveClientName"
                label="收货方">
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
                min-width="10%"
                prop="freight"
                label="运费(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="subsidyFreight"
                label="补贴(元)">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="financeStatus"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.financeStatus === 1 ? '待收款' : '已收款'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.financeStatus === 1" @click="confirmReceipt(scope.row)">确认收款</a>
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
            :mainText="receiptMainInfo"
            :dialogVisible="dialogVisible"
            @click-cancel="ReceiptCancel"
            @click-sure="ReceiptSure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import ToReceiveWaybillAjax from '@/api/WaybillManage/ToReceiveWaybill'
import FreightCheckAjax from '@/api/TimelyDeliveryApi/FreightCheckApi'
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'FreightCheck',
  data () {
    return {
      receiptWaybillIdList: [], // 运单确认收款
      dialogVisible: false,
      receiptMainInfo: '', // 确认收款提示文案
      staffOption: [{id: 1, name: '员工1'}, {id: 2, name: '员工2'}, {id: 2, name: '员工2'}], // 司机下拉
      statusOption: [ // 类型下拉
        {id: '', name: '全部'},
        {id: 1, name: '待收款'},
        {id: 2, name: '已收款'}
      ],
      form: {
        driver: '', // 司机Id
        financeStatus: '', // 状态
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [
      ],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName,
    VDialog
  },
  created () {
    this.init()
    // console.log(this.getSummaries())
  },
  methods: {
    init () {
      // this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      // this.form.createTimeStart = this.formatCurrentDate()
      // this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
      this.queryStaffList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      FreightCheckAjax.QueryFreightCheckList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
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
      this.form.driver = ''
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.financeStatus = ''
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
    queryStaffList () {
      FreightCheckAjax.QueryStaffList().then(res => {
        if (res.code === 200) {
          this.staffOption = res.data
        }
      })
    },
    ReceiptCancel () { // 弹框取消
      this.dialogVisible = false
      this.receiptWaybillIdList = []
    },
    ReceiptSure () { // 弹窗确认收款
      this.dialogVisible = false
      this.receipt(this.receiptWaybillIdList)
    },
    confirmReceipt (row) { // 行确认收款
      this.receiptWaybillIdList = []
      this.receiptWaybillIdList.push(row.flashWaybillReceiptId)
      if (row.waybillStatus === 10 || row.waybillStatus === 20) {
        this.receiptMainInfo = `收款运单中包含未签收运单，确认收款后运单状态自动变为已签收，是否继续操作？`
      } else {
        this.receiptMainInfo = '确定是否收款？'
      }
      this.dialogVisible = !this.dialogVisible
    },
    batchReceipt () {
      if (this.selection < 1) { // 批量确认收款
        this.$notify({
          type: 'error',
          message: '请您选择要收款的行!'
        })
      } else {
        let haveReceipt = this.selection.some(item => {
          return item.financeStatus === 2
        })
        if (haveReceipt) {
          this.$notify({
            type: 'error',
            message: '收款运单中包含已收款运单，请重新选择'
          })
        } else {
          this.receiptWaybillIdList = this.selection.map(item => {
            return item.flashWaybillReceiptId
          })
          let flag = this.selection.some(item => {
            return item.waybillStatus === 10 || item.waybillStatus === 20
          })
          if (flag) {
            this.receiptMainInfo = `收款运单中包含未签收运单，确认收款后运单状态自动变为已签收，是否继续操作？`
          } else {
            this.receiptMainInfo = '是否确认收款？'
          }
          this.dialogVisible = !this.dialogVisible
        }
      }
    },
    receipt (val) { // 收款请求
      FreightCheckAjax.Receipt(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.receiptWaybillIdList = []
          this.queryList()
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        } else {
          this.dialogVisible = false
          this.receiptWaybillIdList = []
        }
      })
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/flash/flash/waybill/freightCheckExports'
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
    // 行查看
    check (row) {
      this.$router.push({name: 'TimelyWaybillDetail', query: {waybillTitle: '运费核对', waybillId: row.flashWaybillId, from: 'FreightCheck'}})
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 7 || index === 8) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2)
            sums[index] += ' 元'
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.freight-check{
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
.freight-check{
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
  }
}
</style>
