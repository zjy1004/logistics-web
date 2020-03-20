<template>
  <div class="paymentCheck">
    <div class="public_card">
      <!-- <h3 class="card_header">待接收运单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="司机:">
                <el-select v-model="form.driverId" placeholder="请选择司机" clearable>
                  <el-option
                    v-for="(item, index) in driverOption"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发货方名称:" prop="sendClientName">
                <el-input v-model="form.sendClientName" placeholder="请输入发货方名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="收货方名称:" prop="receiveClientName">
                <el-input v-model="form.receiveClientName" placeholder="请输入收货方名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
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
                <el-select v-model="form.receiptStatus" placeholder="请选择收款状态" clearable>
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
            <el-button class="btn-main" @click="exportExcel">导出EXCEL</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              border>
              <!-- <el-table-column
                type="selection"
                width="60">
              </el-table-column> -->
              <el-table-column
                width="60"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="senderName"
                label="司机">
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
                min-width="8%"
                prop="receivableGoods"
                label="代收货款">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receiptStatus"
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.receiptStatus === 1 ? '未收货款' : '已收货款'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" v-if="scope.row.receiptStatus === 1" href="javascript:;" type="text" size="small" @click="confirmReceipt(scope.row)">收取货款</a>
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
            :closeClickModal="false"
            @click-cancel="ReceiptCancel"
            @click-sure="ReceiptSure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import TimelyWaybillAjax from '@/api/TimelyDeliveryApi/TimelyWaybillManageApi'
import FreightCheckAjax from '@/api/TimelyDeliveryApi/FreightCheckApi'
import VDialog from '@/components/Dialog/Dialog'
import PaymentCheckAjax from '@/api/TimelyDeliveryApi/PaymentCheckApi'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'PaymentCheck',
  components: {
    VPagination,
    SearchByName,
    VDialog
  },
  data () {
    return {
      dialogVisible: false,
      receiptWaybillIdList: [], // 运单确认收款
      receiptMainInfo: '', // 确认收款提示文案
      waybillId: '',
      driverOption: [{id: 1, name: '司机1'}, {id: 2, name: '司机2'}], // 司机下拉
      statusOption: [ // 类型下拉
        {id: '', name: '全部'},
        {id: 1, name: '未收货款'},
        {id: 2, name: '已收货款'}
      ],
      form: {
        sendClientName: '', // 发货方名称
        receiveClientName: '', // 收货方名称
        driverId: '', // 司机Id
        waybillNumber: '', // 运单号
        receiptStatus: '', // 收款状态
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
  created () {
    this.init()
  },
  methods: {
    init () {
      // this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      // this.form.createTimeStart = this.formatCurrentDate()
      // this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
      this.queryDriverList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      console.log(queryParam)
      PaymentCheckAjax.QueryList(queryParam).then(response => {
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
    queryDriverList () { // 获取司机下拉
      TimelyWaybillAjax.QueryDriverList().then(res => {
        if (res.code === 200) {
          this.driverOption = res.data
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
      this.form.driverId = ''
      this.form.sendClientName = ''
      this.form.receiveClientName = ''
      this.form.waybillNumber = ''
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.receiptStatus = ''
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
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/flash/flash/export/paymentCheck'
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
      this.receiptWaybillIdList.push(row.receiptId)
      if (row.waybillStatus === 10 || row.waybillStatus === 20) {
        this.receiptMainInfo = `收款运单中包含未签收运单，确认收款后运单状态自动变为已签收，是否继续操作？`
      } else {
        this.receiptMainInfo = '是否确认收款？'
      }
      this.dialogVisible = !this.dialogVisible
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
    clickCancel () { // 弹框取消
      this.dialogVisible = false
      this.waybillId = ''
    },
    clickSure () { // 弹框确定
      this.receipt(this.waybillId)
    },
    // 行查看
    check (row) {
      this.$router.push({name: 'TimelyWaybillDetail', query: {waybillTitle: '货款核对', waybillId: row.waybillId, from: 'PaymentCheck'}})
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.paymentCheck{
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
.paymentCheck{
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
