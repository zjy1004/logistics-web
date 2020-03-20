<template>
  <div class="payment-history-detail">
    <div class="public_card">
      <div class="card_main">
        <div class="info">
          <el-table
            :data="paymentInfoData"
            style="width: 100%"
            height="'100%'"
            stripe
            border>
            <el-table-column
              min-width="15%"
              prop="paymentWaybills"
              label="支付单数">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="paymentAmount"
              label="支付金额(元)">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="paymentStatusName"
              label="支付状态">
            </el-table-column>
            <el-table-column
              min-width="20%"
              prop="transactionTime"
              label="发起交易时间">
            </el-table-column>
          </el-table>
        </div>
        <div class="card_form_title">
          <div>
            <span class="title_line"></span>
            <span class="title">明细列表</span>
          </div>
          <div>
            <el-button class="btn-main" @click="exportExcel">&emsp;导出&emsp;</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              height="'100%'"
              stripe
              border>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="createTime"
                label="开单时间">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="waybillNumber"
                label="运单号">
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
                min-width="10%"
                prop="receivableGoods"
                label="代收货款(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="freight"
                label="运费(元)">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="paymentAmount"
                label="支付金额(元)">
              </el-table-column>
              <!-- <el-table-column
                min-width="15%"
                prop="e"
                label="支付状态">
              </el-table-column> -->
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
        </div>
        <div class="card_btn">
          <div class="search-btn-con">
            <el-button class="btn-main" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentHistoryAjax from '@/api/PaymentHistory/PaymentHistory'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'PaymentHistoryDetail',
  data () {
    return {
      form: {
        transactionId: '',
        paymentStatus: ''
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [
        { rowNum: 1, a: 'ZC000922019083000001', b: '卖了发经销商', c: '亚亚修理厂', d: 1000, e: '支付成功', f: '2019-01-27 14:20:29' },
        { rowNum: 2, a: 'ZC000922019083000002', b: '卖了发经销商', c: '亚亚修理厂', d: 2000, e: '支付成功', f: '2019-02-27 14:20:29' },
        { rowNum: 3, a: 'ZC000922019083000003', b: '卖了发经销商', c: '亚亚修理厂', d: 3000, e: '支付失败', f: '2019-03-27 14:20:29' }
      ],
      paymentInfoData: [],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination
  },
  created () {
    let paymentHistoryObj = JSON.parse(this.$route.query.paymentHistoryObj)
    this.paymentInfoData.push(paymentHistoryObj)
    this.form.transactionId = paymentHistoryObj.transactionId
    this.form.paymentStatus = paymentHistoryObj.paymentStatus
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      // let queryParam = { }
      // queryParam.transactionId = this.form.transactionId
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      PaymentHistoryAjax.QueryPaymentHistoryDetail(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (this.paymentInfoData[0].paymentStatus === 3) {
              item.paymentAmount = ''
            }
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    search () {
      this.queryList('searchBtn')
    },
    goBack () {
      this.$router.push({name: 'PaymentHistory'})
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/queryFlowIncomeListExports'
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
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.payment-history-detail{
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
.payment-history-detail{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  .info {
    margin: 40px;
  }
  .card_form_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    margin: 0 40px 10px 40px;
    .title {
      .mixin-sc(16px, #333333);
      font-weight: bold;
    }
    .title_line {
      display: inline-block;
      width: 3px;
      height: 13px;
      background-color: #4987fc;
    }
  }
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
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
      justify-content: flex-end;
    }
  }
}
</style>
