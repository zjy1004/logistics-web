<template>
  <div class="withdrawalDetail public_card">
    <h3 class="card_header">提现明细</h3>
    <div class="card_main">

      <div style="margin: 40px 40px;">
        <!-- 本次预提现运单明细 -->
        <div class="table-con1">
            <el-table
              :data="tableData2"
              style="width: 100%"
              height="70"
              stripe
              border>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                prop="withdrawCashTime"
                label="申请提现时间"
                >
              </el-table-column>
              <el-table-column
                prop="withdrawCashAmount"
                label="提现金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="formalityFee"
                label="手续费用（元）"
                >
              </el-table-column>
              <el-table-column
                prop="actualArrivalAmount"
                label="实际到账金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="dealStatus"
                label="处理状态"
                >
              </el-table-column>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                prop="bankPaymentTime"
                label="银行处理时间"
                >
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="public_list">
        <!-- 需勾选需要提现的运单 -->
        <div class="listHeader">
          <el-button class="btn-main" @click="exportExcel">导出</el-button>
        </div>
        <div class="table-con">
            <el-table
              ref="form"
              :data="tableData1"
              style="width: 100%"
              height="'100%'"
              stripe
              @selection-change="handleSelectionChange1"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                prop="rowNum"
                width="60"
                label="序号">
              </el-table-column>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                prop="arriveAccountTime"
                label="到账时间"
                >
              </el-table-column>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                prop="createTime"
                label="开单时间"
                >
              </el-table-column>
              <el-table-column
                prop="receivableGoods"
                label="应收货款金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="actualPaymentGoods"
                label="实收货款金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="goodsCommissionRate"
                label="手续费率（%）"
                >
              </el-table-column>
              <el-table-column
                prop="feeAmount"
                label="手续费用（元）"
                >
              </el-table-column>
              <el-table-column
                prop="waybillStatusName"
                label="运单状态"
                >
              </el-table-column>
              <el-table-column
                prop="paymentMethodName"
                label="支付方式"
                >
              </el-table-column>
              <el-table-column
                prop="dealStatus"
                label="处理状态"
                >
              </el-table-column>
              <el-table-column
                prop="waybillNumber"
                label="运单"
                width="220"
                >
              </el-table-column>
              <el-table-column
                prop="receiveClientName"
                label="收货方名称"
                >
              </el-table-column>
            </el-table>
        </div>
        <div class="bottom-con">
          <v-pagination
            :dom="this.$refs.form"
            :pageSize=pagination.pageSize
            :total=pagination.total
            :currentPage=pagination.pageNum
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
import VPagination from '@/components/Pagination/Pagination'
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'

export default {
  data () {
    return {
      queryListParam: {
        transactionId: '',
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      pagination: {pageSize: 10, total: 0, pageNum: 1},
      tableData1: [],
      tableData2: [],
      multipleSelection: []
    }
  },
  created () {
    this.queryListParam.transactionId = this.$route.query.transactionId
    this.QueryWithdrawDetailPackage({transactionId: this.queryListParam.transactionId})
    this.QueryWithdrawDetailInventoryList(this.queryListParam)
  },
  methods: {
    exportExcel () {
      let exportParams = {}
      let obj = {}
      let waybillIdList = this.multipleSelection.map(item => {
        return item.waybillId
      }).join(',')
      obj.waybillIdList = waybillIdList
      obj.transactionId = this.queryListParam.transactionId
      exportParams.queryParams = obj
      exportParams.url = '/finance/api/withdrawRestController/queryWithdrawDetailInventoryExport'
      this.exportList(exportParams)
    },
    handleSelectionChange1 (val) {
      this.multipleSelection = val
    },
    changePageSize (pageSize) {
      this.queryListParam.currentPage = 1
      this.queryListParam.pageSize = pageSize
      this.QueryWithdrawDetailInventoryList(this.queryListParam)
    },
    changePage (pageSize, pageNumber) {
      this.queryListParam.pageSize = pageSize
      this.queryListParam.currentPage = pageNumber
      this.QueryWithdrawDetailInventoryList(this.queryListParam)
    },
    QueryWithdrawDetailPackage (val) { // 查询提现明细接口
      DealerAccountAjax.QueryWithdrawDetailPackage(val).then(res => {
        this.tableData2 = []
        if (res.code === 200) {
          if (res.data.dealStatus === 2) {
            res.data.dealStatus = '成功'
          }
          if (res.data.dealStatus === 3) {
            res.data.dealStatus = '失败'
          }
          if (res.data.dealStatus === 1) {
            res.data.dealStatus = '处理中'
          }
          this.tableData2.push(res.data)
        }
      })
    },
    QueryWithdrawDetailInventoryList (val) { // 提现清单明细列表接口
      DealerAccountAjax.QueryWithdrawDetailInventoryList(val).then(res => {
        if (res.code === 200) {
          this.tableData1 = res.data && res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.goodsPaymentMethod === 1) {
              item.paymentMethodName = '现金支付'
            } else if (item.goodsPaymentMethod === 2) {
              item.paymentMethodName = '支付宝支付'
            } else if (item.goodsPaymentMethod === 3) {
              item.paymentMethodName = '微信支付'
            } else if (item.goodsPaymentMethod === 4) {
              item.paymentMethodName = '在线支付'
            } else if (item.goodsPaymentMethod === 5) {
              item.paymentMethodName = '物流公司代付'
            }
            if (item.dealStatus === 2) {
              item.dealStatus = '成功'
            }
            if (item.dealStatus === 3) {
              item.dealStatus = '失败'
            }
            if (item.dealStatus === 1) {
              item.dealStatus = '处理中'
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '待发货'
            }
            if (item.waybillStatus === 2) {
              item.waybillStatusName = '运输中'
            }
            if (item.waybillStatus === 3) {
              item.waybillStatusName = '已签收'
            }
            if (item.waybillStatus === 4) {
              item.waybillStatusName = '已拒签'
            }
            if (item.waybillStatus === 5) {
              item.waybillStatusName = '已完成'
            }
            return item
          })
          this.pagination.pageSize = res.data.pageSize
          this.queryListParam.currentPage = res.data.currentPage
          this.pagination.total = res.data.total
        }
      })
    }
  },
  components: {
    VPagination
  }
}
</script>

<style lang="less">
.withdrawalDetail {
  .el-table__empty-block {
    min-height: 65px;
  }
  .el-table__empty-text:after {
    background: none;
  }
}
</style>

<style lang="less" scoped>
.withdrawalDetail {
  display: flex;
  flex: 1;
  //margin: 25px 30px 20px 30px;
  flex-direction: column;
  .public_list{
    margin-top: 20px !important;
    display: flex;
    flex: 1;
    flex-direction: column;
    .table-con {
      display: flex;
      flex: 1;
    }
  }
  .bottom-con {
    height: 28px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
    .total {
      flex-grow: 1;
    }
    .pagination {
      flex-grow: 9;
      height: 28px;
    }
  }
}
</style>
