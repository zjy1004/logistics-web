<template>
  <div class="settlement-for-customers-page">
    <div class="top-con">
      <span class="detail_header">财务管理 > 给客户结算 ><span class="info"> {{sendClientName || ''}}</span></span>
    </div>
    <div class="top-con">
      <span style="font-size: 16px;font-weight: bold;">结算操作</span><span>（注：当前页面列表为当前可进行结算的运单列表）</span>
      <span style="margin-left: 100px;">结款人：{{sendClientName || ''}}</span>
    </div>
    <div class="main-con">
      <div class="left-con common-div">
        <div class="tip">请按需勾选需要结算的运单</div>
        <div class="search-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="70px">
            <el-row>
              <el-col :span="18">
                <el-form-item class="date-item" label="开单时间:" prop="time">
                  <el-date-picker
                    style="width: 360px;"
                    v-model="dateValue"
                    type="daterange"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1" :offset="4">
                <el-form-item class="date-item">
                  <el-button @click="search()">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="height: 10px; width; 100%;"></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label=' '>
                  <el-input class="inputWidth" v-model="form.waybillNumberSendName" placeholder="运单号/经销商名称" clearable></el-input>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <div class="table-con">
          <el-table
            ref="leftTable"
            :data="leftTableData"
            style="width: 100%"
            height="100%"
            @selection-change="leftSelectionChange"
            stripe
            border>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="sendClientName"
              label="发货方">
            </el-table-column>
            <el-table-column
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="开单时间">
            </el-table-column>
            <el-table-column
              prop="receivableGoods"
              label="代收货款（元）">
            </el-table-column>
            <el-table-column
              prop="goodsPoundage"
              label="手续费（元）">
            </el-table-column>
            <el-table-column
              prop="actualPaymentGoods"
              label="结算小计（元）">
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
      <div class="right-con common-div">
        <div class="tip">本次预结算运单明细</div>
        <div class="head-con">
          <div class="head-left">总计（元）：<span>￥{{rightTotal}}</span></div>
          <div class="head-left">回付（元）：<span>￥{{sendReceivableFreightTotal}}</span></div>
          <div class="head-right">
            <el-button class="btn-main" @click="ConfirmReceipt">确认结算</el-button>
          </div>
        </div>
        <div class="table-con">
          <el-table
            ref="rightTable"
            :data="rightTableData"
            style="width: 100%"
            height="100%"
            stripe
            border>
            <el-table-column
              prop="sendClientName"
              label="发货方">
            </el-table-column>
            <el-table-column
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              prop="receivableGoods"
              label="代收货款（元）">
            </el-table-column>
            <el-table-column
              prop="goodsPoundage"
              label="手续费（元）">
            </el-table-column>
            <el-table-column
              prop="actualPaymentGoods"
              label="结算小计（元）">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <a class="del" href="javascript:;" type="text" size="small" @click="remove(scope.row)">移除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="main_bottom">
      <el-button class="btn-main" @click="goBack()">返回</el-button>
    </div>

    <receipt-confirm
      v-if="receiptConfirmVisible"
      :dialogVisible="receiptConfirmVisible"
      :receiptAmount="rightTotal"
      :sendReceivableFreight="sendReceivableFreightTotal"
      @click-cancel="receiptConfirmVisible = false"
      @cancel="cancel"
      @click-sure="sure"
    />

  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import SettlementForCustomersAjax from '@/api/SettlementForCustomers/SettlementForCustomers'
import ReceiptConfirm from './ConfirmDialog'
import { mapGetters } from 'vuex'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'

export default {
  name: 'SettlementForCustomersPage',
  data () {
    return {
      dateValue: '',
      sendClientName: '',
      form: {
        sendClient: '',
        createTimeStart: '', // 到账时间起
        createTimeEnd: '', // 到账时间止
        waybillNumberSendName: ''
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      leftTableData: [],
      leftSelection: [],
      rightTableData: [],
      rightSelection: [],
      paginationChange: false,
      receiptConfirmVisible: false
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate']),
    rightTotal () {
      return this.rightTableData.reduce((pre, next, index, array) => {
        return pre + Number(next.actualPaymentGoods)
      }, 0).toFixed(2)
    },
    sendReceivableFreightTotal () {
      return this.rightTableData.reduce((pre, next, index, array) => {
        return pre + Number(next.sendReceivableFreight)
      }, 0).toFixed(2)
    }
  },
  components: {
    VPagination,
    ReceiptConfirm
  },
  created () {
    if (this.$route.query) {
      this.form.sendClient = this.$route.query.sendClient
      this.sendClientName = this.$route.query.sendClientName
      if (this.$route.query.searchDate === null) {
        this.$route.query.searchDate = ''
      }
      this.dateValue = this.$route.query.searchDate
      this.form.createTimeStart = this.$route.query.searchDate[0]
      this.form.createTimeEnd = this.$route.query.searchDate[1]
    }
    this.init()
  },
  watch: {
    leftSelection (newVal, oldVal) {
      const res = new Map()
      Array.from([...oldVal, ...this.rightTableData]).forEach(item => {
        res.set(item.waybillNumber, 1)
      })
      let tempArr = [...newVal, ...oldVal, ...this.rightTableData].filter((item) => !res.has(item.waybillNumber) && res.set(item.waybillNumber, 1))
      if (newVal.length > oldVal.length) {
        this.rightTableData = this.rightTableData.concat(tempArr)
      } else {
        if (!this.paginationChange) {
          let diffArr = oldVal.filter(oldItem => newVal.every(newItem => oldItem.waybillNumber !== newItem.waybillNumber))
          this.rightTableData = this.rightTableData.filter(rightItem => diffArr.every(diffItem => rightItem.waybillNumber !== diffItem.waybillNumber))
        }
      }
      this.$nextTick(() => {
        this.paginationChange = false
      })
    },
    dateValue (newVal, oldVal) {
      if (!newVal) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = newVal[0]
        this.form.createTimeEnd = newVal[1]
      }
    }
  },
  methods: {
    init () {
      this.queryList()
    },
    // 左侧行选中变化
    leftSelectionChange (val) {
      this.leftSelection = val
    },
    goBack () {
      // this.$router.go(-1)
      this.$router.push({name: 'SettlementForCustomersList'})
    },
    remove (rightRow) {
      let leftTable = this.$refs.leftTable
      let leftNowHasRightDelRow = false
      this.leftTableData.forEach(item => {
        if (item.waybillNumber === rightRow.waybillNumber) {
          leftNowHasRightDelRow = true
          leftTable.toggleRowSelection(item, false)
        }
      })
      if (!leftNowHasRightDelRow) { // 右侧点移除的数据不在当前左侧表格所在分页中
        this.rightTableData = this.rightTableData.filter(item => {
          return item.waybillNumber !== rightRow.waybillNumber
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
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
        this.rightTableData = []
      }
      SettlementForCustomersAjax.QuerySettlementOperationList(queryParam).then(res => {
        if (res.code === 200) {
          if (res.data.list.length === 1) {
            this.rightTableData = res.data.list
          }
          this.paginationChange = true
          this.leftTableData = res.data.list
          this.paginationParams.pageNum = res.data.currentPage
          this.paginationParams.total = res.data.total
          if (res.data.total === 0) {
            this.rightTableData = []
          }
          this.diffTable(res.data.total)
        }
      })
    },
    diffTable (total) {
      this.$nextTick(() => {
        let leftTable = this.$refs.leftTable
        if (total === 1) {
          leftTable.toggleRowSelection(this.leftTableData[0], true)
        } else {
          this.leftTableData.forEach(leftItem => {
            this.rightTableData.forEach(rightItem => {
              if (leftItem.waybillNumber === rightItem.waybillNumber) {
                setTimeout(() => {
                  leftTable.toggleRowSelection(leftItem, true)
                })
              } else {
                leftTable.toggleRowSelection(leftItem, false)
              }
            })
          })
        }
      })
    },
    search () {
      this.queryList('searchBtn')
    },
    ConfirmReceipt () {
      if (this.rightTotal <= 0) {
        this.$notify({
          type: 'error',
          message: '结算金额需大于0！'
        })
      } else {
        this.receiptConfirmVisible = true
      }
    },
    sure () {
      let obj = {}
      obj.waybillIdList = this.rightTableData.map(item => {
        return item.waybillId
      })
      obj.flag = 1
      console.log(obj)
      this.Settlement(obj)
    },
    cancel () {
      let obj = {}
      obj.waybillIdList = this.rightTableData.map(item => {
        return item.waybillId
      })
      obj.flag = 0
      console.log(obj)
      this.CancelSettlement(obj)
    },
    Settlement (val) { // 确认结算
      WaybillApiAjax.SettlementAndMonthBatchCollection(val).then(res => {
        if (res.code === 200) {
          this.receiptConfirmVisible = false
          this.queryList('searchBtn')
          this.rightTableData = []
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        } else {
          this.receiptConfirmVisible = false
          this.queryList('searchBtn')
        }
      })
    },
    CancelSettlement (val) { // 确认结算（否）
      WaybillApiAjax.SettlementAndMonthBatchCollection(val).then(res => {
        if (res.code === 200) {
          this.receiptConfirmVisible = false
          this.queryList('searchBtn')
          this.rightTableData = []
          this.$notify({
            type: 'success',
            message: '确认结算成功！'
          })
        } else {
          this.receiptConfirmVisible = false
          this.queryList('searchBtn')
        }
      })
    }
  }
}
</script>

<style lang="less">
.settlement-for-customers-page {
  .search-con {
    .el-form-item__label {
      width: 70px !important;
    }
    .inputWidth {
      .el-input__inner {
        width: 200px ;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../../../style/base.less';
.settlement-for-customers-page{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding: 25px 30px 20px 30px;
  .top-con{
    span {
      font-size: 14px;
      color: #333;
    }
    .detail_header {
      font-size: 16px;
      color: #666;
      font-weight: bold;
      .info {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    height: 40px;
    line-height: 40px;
  }
  .main-con{
    display: flex;
    flex: 1;
    flex-direction: row;
    .common-div{
      flex-direction: column;
      padding: 20px 20px 30px 20px;
      .tip{
        height: 14px;
        .mixin-sc(14px;#333);
        line-height: 14px;
      }
    }
    .left-con{
      display: flex;
      flex: 1;
      background: #fff;
      margin-right: 10px;
      .search-con{
        margin: 10px 0;
        height: 80px;
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
    .right-con{
      display: flex;
      flex: 1;
      background: #fff;
      .head-con{
        height: 40px;
        margin: 20px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .head-left{
          span{
            .mixin-sc(24px;#333);
          }
        }
      }
      .table-con{
        display: flex;
        flex: 1;
      }
    }
  }
  .main_bottom {
    .btn-main {
      float: right;
      margin-top: 10px;
    }
  }
}
</style>
