<template>
  <div class="BookkeepingFlow public_card">
    <h3 class="card_header">在线支付记账流水</h3>
    <account-and-bank/>
    <div class="card_main">
      <!-- <div class="searchBar">
        <div class="searchBar_main">
          <span class="m_label">累计收入总额：</span><span class="m_content">123</span>
          <span class="m_label">佣金分成支出总额：</span><span class="m_content">123</span>
          <span class="m_label">通道费用支出总额：</span><span class="m_content">123</span>
        </div>
      </div> -->
      <div class="public_list">
      <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收入流水" name="first">
          <div class="listHeader1">
            <el-form :inline="true" ref="form1" :model="form1" class="demo-form-inline" label-width="80px">
              <el-form-item label="到账时间：">
                <el-date-picker
                  style="width: 445px;"
                  v-model="dateValue1"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label=" ">
                <el-input class="inputWidth" v-model="form1.paymentFlowNumber" placeholder="请输入支付流水号" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="search1">搜索</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button class="btn-main" @click="exportExcel1">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-con">
            <el-table
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
                label="序号"
                width="60"
                >
              </el-table-column>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                prop="arriveAccountTime"
                label="到账时间"
                >
              </el-table-column>
              <el-table-column
                prop="collectionGoods"
                label="代收货款（元）"
                >
              </el-table-column>
              <!-- <el-table-column
                prop="commissionRate"
                label="佣金比率（%）"
                >
              </el-table-column> -->
              <el-table-column
                prop="receivableAmount"
                label="应收金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="actualAmount"
                label="实入金额（元）"
                >
              </el-table-column>
              <el-table-column
                prop="paymentMethod"
                label="支付方式"
                >
              </el-table-column>
              <el-table-column
                prop="settlementStatus"
                label="处理状态"
                >
              </el-table-column>
              <el-table-column
                prop="incomeType"
                label="收入类别"
                >
              </el-table-column>
              <el-table-column
                prop="paymentFlowNumber"
                label="支付流水号"
                width="220"
                >
              </el-table-column>
            </el-table>
          </div>
          <div class="main_footer">
            <!-- <div class="main_footer_L">
              <span>总金额:</span>
              <span>{{totalAmount1 || 0}}元</span>
            </div> -->
            <div class="main_footer_R">
              <v-pagination
                :dom="this.$refs.form1"
                :clickSearch="clickSearch1"
                :pageSize=paginationParams1.pageSize
                :total=paginationParams1.total
                :currentPage=paginationParams1.pageNum
                :className="'basicParamPagination'"
                @change-page-size="changePageSize1"
                @change-page="changePage1"
                class="pagination"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="佣金分成支出" name="second">
          <div class="listHeader1">
            <el-form :inline="true" ref="form2" :model="form2" class="demo-form-inline" label-width="80px">
              <el-form-item label="支出时间：">
                <el-date-picker
                  style="width: 445px;"
                  v-model="dateValue2"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label=" ">
                <el-input class="inputWidth" v-model="form2.paymentFlowNumber" placeholder="请输入支付流水号/支付对象" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="search2">搜索</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button class="btn-main" @click="exportExcel2">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-con">
          <el-table
            :data="tableData2"
            style="width: 100%"
            height="'100%'"
            stripe
            @selection-change="handleSelectionChange2"
            border>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="rowNum"
              label="序号"
              width="60"
              >
            </el-table-column>
            <el-table-column
              prop="paymentTime"
              label="支出时间"
              >
            </el-table-column>
            <el-table-column
              prop="accountAmount"
              label="入账金额（元）"
              >
            </el-table-column>
            <el-table-column
              prop="separableAccount"
              label="可分账额度（元）"
              >
            </el-table-column>
            <el-table-column
              prop="accountRatio"
              label="分账比率（%）"
              >
            </el-table-column>
            <el-table-column
              prop="paymentAmount"
              label="支付金额（元）"
              >
            </el-table-column>
            <el-table-column
              prop="paymentMethod"
              label="支付方式"
              >
            </el-table-column>
            <el-table-column
              prop="paymentStatus"
              label="支付状态"
              >
            </el-table-column>
            <el-table-column
              prop="paymentObject"
              label="支付对象"
              >
            </el-table-column>
            <el-table-column
              prop="paymentFlowNumber"
              label="支付流水号"
              width="220"
              >
            </el-table-column>
          </el-table>
          </div>
          <div class="main_footer">
            <!-- <div class="main_footer_L">
              <span>总金额:</span>
              <span>{{totalAmount2 || 0}}元</span>
            </div> -->
            <div class="main_footer_R">
              <v-pagination
                :dom="this.$refs.form2"
                :clickSearch="clickSearch2"
                :pageSize=paginationParams2.pageSize
                :total=paginationParams2.total
                :currentPage=paginationParams2.pageNum
                :className="'basicParamPagination'"
                @change-page-size="changePageSize2"
                @change-page="changePage2"
                class="pagination"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通道费用结算支出" name="three">
          <div class="listHeader1">
            <el-form :inline="true" ref="form3" :model="form3" class="demo-form-inline" label-width="80px">
              <el-form-item label="支付时间：">
                <el-date-picker
                  style="width: 445px;"
                  v-model="dateValue3"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label=" ">
                <el-input class="inputWidth" v-model="form3.paymentFlowNumber" placeholder="请输入支付流水号" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="search3">搜索</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button class="btn-main" @click="exportExcel3">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-con">
          <el-table
            :data="tableData3"
            style="width: 100%"
            height="'100%'"
            stripe
            @selection-change="handleSelectionChange3"
            border>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="rowNum"
              label="序号"
              width="60"
              >
            </el-table-column>
            <el-table-column
              prop="paymentTime"
              label="支付时间"
              >
            </el-table-column>
            <el-table-column
              prop="waybillAmount"
              label="运单金额（元）"
              >
            </el-table-column>
            <el-table-column
              prop="channelFeeRate"
              label="通道费率"
              >
            </el-table-column>
            <el-table-column
              prop="channelFee"
              label="通道费用（元）"
              >
            </el-table-column>
            <el-table-column
              prop="paymentMethod"
              label="支付方式"
              >
            </el-table-column>
            <el-table-column
              prop="paymentStatus"
              label="支付状态"
              >
            </el-table-column>
            <el-table-column
              prop="paymentFlowNumber"
              label="支付流水号"
              width="220"
              >
            </el-table-column>
          </el-table>
          </div>
          <div class="main_footer">
            <!-- <div class="main_footer_L">
              <span>总金额:</span>
              <span>{{totalAmount3 || 0}}元</span>
            </div> -->
            <div class="main_footer_R">
              <v-pagination
                :dom="this.$refs.form3"
                :clickSearch="clickSearch3"
                :pageSize=paginationParams3.pageSize
                :total=paginationParams3.total
                :currentPage=paginationParams3.pageNum
                :className="'basicParamPagination'"
                @change-page-size="changePageSize3"
                @change-page="changePage3"
                class="pagination"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import AccountAndBank from '../../ServiceCenter/FundsAccount/subpage/AccountAndBank'
import BookkeepingFlowAjax from '@/api/BookkeepingFlow/BookkeepingFlow'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'BookkeepingFlow',
  data () {
    return {
      clickSearch1: false,
      clickSearch2: false,
      clickSearch3: false,
      dateValue1: '',
      dateValue2: '',
      dateValue3: '',
      activeName: 'first',
      totalAmount1: '', // 总金额
      totalAmount2: '', // 总金额
      totalAmount3: '', // 总金额
      totalAmountFlag1: '', // 总金额
      totalAmountFlag2: '', // 总金额
      totalAmountFlag3: '', // 总金额
      flowIncomeParam: {
        arriveAccountTimeEnd: '',
        arriveAccountTimeStart: '',
        paymentFlowNumber: '', // 支付流水号
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      flowCommissionDivideIntoParam: {
        paymentTimeEnd: '',
        paymentTimeStart: '',
        paymentFlowNumber: '', // 支付流水号
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      flowChannelFeeParam: {
        paymentTimeEnd: '',
        paymentTimeStart: '',
        paymentFlowNumber: '', // 支付流水号
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      paginationParams1: {pageSize: 10, total: 0, pageNum: 1},
      paginationParams2: {pageSize: 10, total: 0, pageNum: 1},
      paginationParams3: {pageSize: 10, total: 0, pageNum: 1},
      form1: {
        arriveAccountTimeEnd: '',
        arriveAccountTimeStart: '',
        paymentFlowNumber: '' // 支付流水号
      },
      form2: {
        paymentTimeEnd: '',
        paymentTimeStart: '',
        paymentFlowNumber: '' // 支付流水号
      },
      form3: {
        paymentTimeEnd: '',
        paymentTimeStart: '',
        paymentFlowNumber: '' // 支付流水号
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      multipleSelection1: [],
      multipleSelection2: [],
      multipleSelection3: []
    }
  },
  watch: {
    dateValue1 (newVal, oldVal) {
      if (newVal === null) {
        this.form1.arriveAccountTimeStart = ''
        this.form1.arriveAccountTimeEnd = ''
      } else {
        this.form1.arriveAccountTimeStart = newVal[0]
        this.form1.arriveAccountTimeEnd = newVal[1]
      }
    },
    dateValue2 (newVal, oldVal) {
      if (newVal === null) {
        this.form2.paymentTimeStart = ''
        this.form2.paymentTimeEnd = ''
      } else {
        this.form2.paymentTimeStart = newVal[0]
        this.form2.paymentTimeEnd = newVal[1]
      }
    },
    dateValue3 (newVal, oldVal) {
      if (newVal === null) {
        this.form3.paymentTimeStart = ''
        this.form3.paymentTimeEnd = ''
      } else {
        this.form3.paymentTimeStart = newVal[0]
        this.form3.paymentTimeEnd = newVal[1]
      }
    }
  },
  created () {
    this.QueryFlowIncomeList(this.flowIncomeParam)
    // this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
    // this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
      // this.$refs.form1.clearSelection()
      if (tab.name === 'first') {
        this.QueryFlowIncomeList(this.flowIncomeParam)
      }
      if (tab.name === 'second') {
        this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
      }
      if (tab.name === 'three') {
        this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
      }
    },
    handleSelectionChange1 (val) {
      if (val.length > 0) {
        let sum = 0
        val.forEach(element => {
          sum += element.receivableAmount
          return sum
        })
        this.totalAmount1 = sum.toFixed(2)
      } else {
        this.totalAmount1 = this.totalAmountFlag1
      }
      this.multipleSelection1 = val
    },
    handleSelectionChange2 (val) {
      if (val.length > 0) {
        let sum = 0
        val.forEach(element => {
          sum += element.paymentAmount
          return sum
        })
        this.totalAmount2 = sum.toFixed(2)
      } else {
        this.totalAmount2 = this.totalAmountFlag2
      }
      this.multipleSelection2 = val
    },
    handleSelectionChange3 (val) {
      if (val.length > 0) {
        let sum = 0
        val.forEach(element => {
          sum += element.channelFee
          return sum
        })
        this.totalAmount3 = sum.toFixed(2)
      } else {
        this.totalAmount3 = this.totalAmountFlag3
      }
      this.multipleSelection3 = val
    },
    exportExcel1 () {
      let url = process.env.API_BASE_URL + '/finance/api/finaFlow/queryFlowIncomeListExports' + '?' + this.encodeParam(this.form1) + '&flowIdList=' + this.selectionId(this.multipleSelection1) + '&token=' + sessionStorage.getItem('token')
      window.location.href = url
      this.QueryFlowIncomeList(this.flowIncomeParam)
    },
    exportExcel2 () {
      let url = process.env.API_BASE_URL + '/finance/poi/easyPoiExportController/exportFlowCommissionDivideIntoList' + '?' + this.encodeParam(this.form2) + '&flowIdList=' + this.selectionId(this.multipleSelection2) + '&token=' + sessionStorage.getItem('token')
      window.location.href = url
      this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
    },
    exportExcel3 () {
      let url = process.env.API_BASE_URL + '/finance/poi/easyPoiExportController/exportFinanceFlowChannelCostList' + '?' + this.encodeParam(this.form3) + '&flowIdList=' + this.selectionId(this.multipleSelection3) + '&token=' + sessionStorage.getItem('token')
      window.location.href = url
      this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
    },
    encodeParam (json) {
      let tmps = []
      for (var key in json) {
        tmps.push(key + '=' + json[key])
      }
      return tmps.join('&')
    },
    selectionId (arr) {
      arr = arr.map(item => {
        return item.flowId
      })
      return arr.join(',')
    },
    search1 () {
      this.flowIncomeParam.currentPage = 1
      this.clickSearch1 = true
      this.flowIncomeParam.arriveAccountTimeStart = this.form1.arriveAccountTimeStart
      this.flowIncomeParam.arriveAccountTimeEnd = this.form1.arriveAccountTimeEnd
      this.flowIncomeParam.paymentFlowNumber = this.form1.paymentFlowNumber
      this.QueryFlowIncomeList(this.flowIncomeParam)
    },
    search2 () {
      this.flowCommissionDivideIntoParam.currentPage = 1
      this.clickSearch2 = true
      this.flowCommissionDivideIntoParam.paymentTimeEnd = this.form2.paymentTimeEnd
      this.flowCommissionDivideIntoParam.paymentTimeStart = this.form2.paymentTimeStart
      this.flowCommissionDivideIntoParam.paymentFlowNumber = this.form2.paymentFlowNumber
      this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
    },
    search3 () {
      this.flowChannelFeeParam.currentPage = 1
      this.clickSearch3 = true
      this.flowChannelFeeParam.paymentTimeStart = this.form3.paymentTimeStart
      this.flowChannelFeeParam.paymentTimeEnd = this.form3.paymentTimeEnd
      this.flowChannelFeeParam.paymentFlowNumber = this.form3.paymentFlowNumber
      this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
    },
    changePage1 (pageSize, pageNum) {
      this.flowIncomeParam.pageSize = pageSize
      this.flowIncomeParam.currentPage = pageNum
      this.QueryFlowIncomeList(this.flowIncomeParam)
    },
    changePageSize1 (pageSize) {
      this.flowIncomeParam.pageSize = pageSize
      this.flowIncomeParam.currentPage = '1'
      this.QueryFlowIncomeList(this.flowIncomeParam)
    },
    changePageSize2 (pageSize) {
      this.flowCommissionDivideIntoParam.pageSize = pageSize
      this.flowCommissionDivideIntoParam.currentPage = '1'
      this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
    },
    changePage2 (pageSize, pageNum) {
      this.flowCommissionDivideIntoParam.pageSize = pageSize
      this.flowCommissionDivideIntoParam.currentPage = pageNum
      this.QueryFlowCommissionDivideIntoList(this.flowCommissionDivideIntoParam)
    },
    changePageSize3 (pageSize) {
      this.flowChannelFeeParam.pageSize = pageSize
      this.flowChannelFeeParam.currentPage = '1'
      this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
    },
    changePage3 (pageSize, pageNum) {
      this.flowChannelFeeParam.pageSize = pageSize
      this.flowChannelFeeParam.currentPage = pageNum
      this.QueryFinanceFlowChannelCostList(this.flowChannelFeeParam)
    },
    QueryFlowIncomeList (val) { // 驮付宝财务流水收入流水分页列表查询
      BookkeepingFlowAjax.QueryFlowIncomeList(val).then(res => {
        if (res.code === 200) {
          this.tableData1 = res.data && res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.paymentMethod === 1) {
              item.paymentMethod = '现金支付'
            }
            if (item.paymentMethod === 2) {
              item.paymentMethod = '支付宝支付'
            }
            if (item.paymentMethod === 3) {
              item.paymentMethod = '微信支付'
            }
            if (item.paymentMethod === 4) {
              item.paymentMethod = '在线支付'
            }
            if (item.paymentMethod === 5) {
              item.paymentMethod = '物流公司代付'
            }
            if (item.settlementStatus === 2) {
              item.settlementStatus = '成功'
            }
            if (item.settlementStatus === 3) {
              item.settlementStatus = '失败'
            }
            if (item.settlementStatus === 1) {
              item.settlementStatus = '处理中'
            }
            if (item.incomeType === 1) {
              item.incomeType = '收入'
            }
            if (item.incomeType === 2) {
              item.incomeType = '支出'
            }
            return item
          })
          this.totalAmount1 = res.totalAmount
          this.totalAmountFlag1 = res.totalAmount
          this.paginationParams1.pageSize = res.data.pageSize
          this.flowIncomeParam.currentPage = res.data.currentPage
          this.paginationParams1.pageNum = res.data.currentPage
          this.paginationParams1.total = res.data.total
        }
      })
    },
    QueryFlowCommissionDivideIntoList (val) { // 驮付宝财务流水收入流水分页列表查询
      BookkeepingFlowAjax.QueryFlowCommissionDivideIntoList(val).then(res => {
        if (res.code === 200) {
          this.tableData2 = res.data && res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.paymentMethod === 1) {
              item.paymentMethod = '现金支付'
            }
            if (item.paymentMethod === 2) {
              item.paymentMethod = '支付宝支付'
            }
            if (item.paymentMethod === 3) {
              item.paymentMethod = '微信支付'
            }
            if (item.paymentMethod === 4) {
              item.paymentMethod = '在线支付'
            }
            if (item.paymentMethod === 5) {
              item.paymentMethod = '物流公司代付'
            }
            if (item.paymentStatus === 2) {
              item.paymentStatus = '成功'
            }
            if (item.paymentStatus === 3) {
              item.paymentStatus = '失败'
            }
            if (item.paymentStatus === 1) {
              item.paymentStatus = '处理中'
            }
            return item
          })
          this.totalAmount2 = res.totalAmount
          this.totalAmountFlag2 = res.totalAmount
          this.paginationParams2.pageSize = res.data.pageSize
          this.flowCommissionDivideIntoParam.currentPage = res.data.currentPage
          this.paginationParams2.pageNum = res.data.currentPage
          this.paginationParams2.total = res.data.total
        }
      })
    },
    QueryFinanceFlowChannelCostList (val) { // 驮付宝财务流水通道费用分页列表查询
      BookkeepingFlowAjax.QueryFinanceFlowChannelCostList(val).then(res => {
        if (res.code === 200) {
          this.tableData3 = res.data && res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.paymentMethod === 1) {
              item.paymentMethod = '现金支付'
            }
            if (item.paymentMethod === 2) {
              item.paymentMethod = '支付宝支付'
            }
            if (item.paymentMethod === 3) {
              item.paymentMethod = '微信支付'
            }
            if (item.paymentMethod === 4) {
              item.paymentMethod = '在线支付'
            }
            if (item.paymentMethod === 5) {
              item.paymentMethod = '物流公司代付'
            }
            if (item.paymentStatus === 2) {
              item.paymentStatus = '成功'
            }
            if (item.paymentStatus === 3) {
              item.paymentStatus = '失败'
            }
            if (item.paymentStatus === 1) {
              item.paymentStatus = '处理中'
            }
            return item
          })
          this.totalAmount3 = res.totalAmount
          this.totalAmountFlag3 = res.totalAmount
          this.paginationParams3.pageSize = res.data.pageSize
          this.flowChannelFeeParam.currentPage = res.data.currentPage
          this.paginationParams3.pageNum = res.data.currentPage
          this.paginationParams3.total = res.data.total
        }
      })
    }
  },
  components: {
    VPagination,
    AccountAndBank
  }
}
</script>
<style lang="less">
.BookkeepingFlow {
  .searchBar_main {
    height: 60px;
    line-height: 60px;
    .m_label {
      margin-left: 90px;
    }
  }
 .search-btn-con{
  margin-top: 15px !important;
}
.inputWidth {
  .el-input__inner {
    width: 210px !important;
  }
}
.top-con {
  margin: 25px 30px 20px 30px;
  width: auto !important;
}
}
</style>

<style lang="less" scoped>
.BookkeepingFlow {
  display: flex;
  flex: 1;
  .public_list{
    margin-top: 20px !important;
    display: flex;
    flex: 1;
    flex-direction: column;
  .table-con {
    display: flex;
    flex: 1;
  }
  .main_footer {
    // height: 28px;
    // line-height: 28px;
     display: flex;
    .main_footer_L {
      height: 28px;
      line-height: 28px;
      flex-grow: 1;
      margin: 10px 0;
    }
    .main_footer_R {
      flex-grow: 9;
    }
  }
  .listHeader1 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .top-con {
    margin-left: 0;
    margin-bottom: 20px;
  }
  }
  .card_main {
    margin-top: 0 !important;
  }
  .pagination {
    margin: 10px 0;
  }
  .el-tab-pane {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
