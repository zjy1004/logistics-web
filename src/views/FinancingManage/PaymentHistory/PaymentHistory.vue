<template>
  <div class="payment-history">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="发起交易时间:" prop="paymentTime">
                <el-date-picker
                  style="width: 445px;"
                  v-model="paymentTime"
                  type="daterange"
                  @change="dateChange"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="支付状态:" prop="paymentStatus">
                <el-select v-model.number="form.paymentStatus" placeholder="请选择支付状态" clearable filterable>
                  <el-option
                    v-for="item in paymentOption"
                    :key="item.id"
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
                width="40">
              </el-table-column> -->
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="paymentWaybills"
                label="支付运单数">
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
              <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentHistoryAjax from '@/api/PaymentHistory/PaymentHistory'
import VPagination from '@/components/Pagination/Pagination'
// import PayDialog from './subpage/PayDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'PaymentHistory',
  data () {
    return {
      paymentOption: [
        {id: 2, name: '支付成功'},
        {id: 3, name: '支付失败'}
      ], // 支付状态下拉
      paymentTime: '', // 支付时间
      form: {
        createTimeStart: '', // 支付开始时间
        createTimeEnd: '', // 支付截止时间
        paymentStatus: 2 // 支付状态
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [
        { rowNum: 1, a: 10, b: 1000, c: '支付成功', d: '2019-01-27 14:20:29' },
        { rowNum: 2, a: 20, b: 2000, c: '支付成功', d: '2019-02-27 14:20:29' },
        { rowNum: 3, a: 30, b: 3000, c: '支付失败', d: '2019-03-27 14:20:29' }
      ],
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
    this.init()
  },
  methods: {
    init () {
      // this.paymentTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      // this.form.createTimeStart = this.formatCurrentDate()
      // this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      PaymentHistoryAjax.QueryPaymentHistoryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.paymentStatus === 2) {
              item.paymentStatusName = '支付成功'
            }
            if (item.paymentStatus === 3) {
              item.paymentStatusName = '支付失败'
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
    goBack () {},
    resetForm () {
      this.$refs.form.resetFields()
      this.paymentTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.paymentTime = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      exportParams.queryParams = this.form
      exportParams.url = '/finance/api/finaTransaction/queryFinancePaymentRecordVoExports'
      // exportParams.waybillIdList = waybillIdList
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
    // 行查询
    check (row) {
      // this.$router.push({name: 'PaymentHistoryDetail', query: {paymentHistoryObj: JSON.stringify(row)}})
      let option = {
        name: 'PaymentHistoryDetail',
        query: {
          paymentHistoryObj: JSON.stringify(row)
        }
      }
      let routes = this.$router.resolve(option)
      window.open(routes.href, '_blank')
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.payment-history{
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
.payment-history{
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
}
</style>
