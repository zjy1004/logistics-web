<template>
  <div class="withdrawal public_card">
    <div class="withdrawal_title"><span style="font-size: 16px;font-weight: bold;">提现操作</span>（注：当前页面列表为当前可进行提现的运单列表 当前可提现总额：<span>￥{{totalAmount||0}}</span>
    <i class="el-icon-question">
      <div class="tip-con">{{channelCollectionTypeName}}</div>
      <div class="tip-icon"></div>
    </i>
    ）</div>
      <!-- <h3 class="card_header">提现操作</h3> -->
    <div class="flex_col">
      <div class="card_main leftCard">
        <div class="public_list">
          <p class="cardTitle" >请按需勾选需要提现的运单<span style="color: red; font-size: 15px">（红色为升级前钱包运单）</span></p>
          <div class="search-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="70px">
              <el-row>
                <el-col :span="15">
                  <el-form-item class="date-item" label="开单时间:" prop="time">
                    <el-date-picker
                      style="width: 360px;"
                      v-model="form.time"
                      type="daterange"
                      @change="formDateChange"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-form-item label=''>
                    <el-input class="inputWidth" v-model="form.waybillOrReceiveClientName" placeholder="运单号/修理厂名称" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" :offset="5">
                  <el-form-item class="date-item">
                    <el-button @click="search()">搜索</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 需勾选需要提现的运单 -->
          <div class="table-con">
              <el-table
                ref="multipleTable"
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
                  prop="receiveClientName"
                  label="修理厂名称"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.receiveClientName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="waybillNumber"
                  label="运单号"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.waybillNumber}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  value-format="yyyy-MM-dd HH:mm:ss"
                  prop="createTime"
                  label="开单时间"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.createTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="receivableGoods"
                  label="应收金额（元）"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.receivableGoods}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="collectionFee"
                  label="代收手续费（元）"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.collectionFee}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualPaymentGoods"
                  label="实际到账金额（元）"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.actualPaymentGoods}}</span>
                  </template>
                </el-table-column>
              </el-table>
          </div>
          <div class="bottom-con">
            <v-pagination
              :pageSize=pagination.pageSize
              :total=pagination.total
              :currentPage=pagination.pageNum
              :dom="this.$refs.form"
              :clickSearch="clickSearch"
              @change-page-size="changePageSize"
              @change-page="changePage"
              class="pagination"
            />
          </div>
        </div>

      </div>

      <div class="card_main rightCard">
        <div class="public_list">
          <!-- 本次预提现运单明细 -->
          <p class="cardTitle">本次预提现运单明细</p>
          <div class="listHeader">
            <span class="total">总计（元）：<span style="font-size: 24px;color: #333;">￥{{totalShow || 0}}</span></span>
            <el-button class="btn-main" style="float: right;" @click="WithdrawalSure">确认提现</el-button>
          </div>
          <div class="table-con" style="padding-bottom: 48px;">
              <el-table
                ref="changeTable"
                :data="tableData2"
                style="width: 100%"
                height="'100%'"
                stripe
                @selection-change="handleSelectionChange2"
                border>
                <el-table-column
                  prop="receiveClientName"
                  label="修理厂名称"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.receiveClientName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="waybillNumber"
                  label="运单号"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.waybillNumber}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  value-format="yyyy-MM-dd HH:mm:ss"
                  prop="createTime"
                  label="开单时间"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.createTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualPaymentGoods"
                  label="实际到账金额（元）"
                  >
                  <template slot-scope="scope">
                    <span :class="{'colorFlag': scope.row.walletFlag === 1}">{{scope.row.actualPaymentGoods}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <a class="del" href="javascript:;" type="text" size="small" @click="del(scope.row)">移除</a>
                  </template>
              </el-table-column>
              </el-table>
          </div>
          <!-- <div class="bottom-con">
            <div class="total">总金额：{{totalShow || 0}}元</div>
          </div> -->
        </div>
      </div>
      <withdrawal-dialog
        v-if="dialogShow"
        :dialogVisible="dialogShow"
        @click-cancel-form="clickChangeBankCancel"
        @click-sure-form="clickChangeBankSure"
        :propsObj = propsObj
      />
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'
import WithdrawalDialog from './WithdrawalDialog'
import CommonAxios from '@/api/Common/CommonAxios'

export default {
  data () {
    return {
      totalAmount: '',
      propsObj: {
        waybillIds: [],
        amount: '',
        cardNum: ''
      },
      dialogShow: false,
      totalShow: '',
      clickSearch: false,
      form: {
        waybillOrReceiveClientName: '',
        time: '', // 到账时间
        createTimeStart: '', // 到账时间起
        createTimeEnd: '' // 到账时间止
      },
      clientAccountParam: {
        createTimeEnd: '',
        createTimeStart: '',
        waybillOrReceiveClientName: '', // 运单号或修理厂名称
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      pagination: {pageSize: 10, total: 0, pageNum: 1}, // 代收货款流水分页
      tableData1: [],
      tableData2: [],
      multipleSelection: [],
      withdralalSelection: [],
      emptyArr: [],
      searchFlag: false,
      channelCollectionTypeName: '根据银行相关规定：对公账户内余额，从资金到账日起开始结算，最快T+1个工作日可提现。' // tip提示

    }
  },
  created () {
    this.QueryFlowIncomeList(this.clientAccountParam)
    this.init()
  },
  mounted () {
  },
  watch: {
    multipleSelection (newVal, oldVal) {
      let cancelRow = []
      oldVal.forEach(oldData => {
        let flag = false
        newVal.forEach(newData => {
          if (oldData.waybillNumber === newData.waybillNumber) {
            flag = true
          }
        })
        if (!flag && newVal.length >= 0 && this.searchFlag === false) {
          cancelRow.push(oldData)
        }
      })
      let arr = []
      arr = newVal.concat(this.emptyArr)
      let hash = {}
      arr = arr.reduce((preVal, curVal) => {
        if (hash[curVal.waybillId]) {

        } else if (cancelRow.length > 0) {
          let cancelFlag = false
          cancelRow.forEach(cancelData => {
            if (curVal.waybillId === cancelData.waybillId) {
              cancelFlag = true
            }
          })
          if (!cancelFlag) {
            hash[curVal.waybillId] = true && preVal.push(curVal)
          }
        } else {
          hash[curVal.waybillId] = true && preVal.push(curVal)
        }
        return preVal
      }, [])
      this.tableData2 = arr
      this.emptyArr = arr
    },
    tableData2: {
      handler: function (newVal, oldVal) {
        if (newVal.length > 0) {
          let sum = 0
          newVal.forEach(element => {
            sum += element.actualPaymentGoods
            return sum
          })
          this.totalShow = sum.toFixed(2)
          this.propsObj.waybillIds = newVal.map(item => {
            return item.waybillId
          })
          this.propsObj.amount = this.totalShow
        } else {
          this.totalShow = 0
          this.propsObj.waybillIds = []
          this.propsObj.amount = ''
        }
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.queryAccount()
      this.queryBankInfo()
    },
    queryAccount () {
      CommonAxios.WalletBankAccount().then(response => {
        if (response.code === 200) {
          let {data} = response
          this.totalAmount = data.financeAccountCash || ''
        }
      })
    },
    // 查询银行卡信息
    queryBankInfo () {
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          let {data} = response
          // this.propsObj.cardNum = this.fomatBankNum(data.bankCard)
          this.propsObj.cardNum = data.bankCard
        }
      })
    },
    del (val) { // 移除
      console.log(val)
      this.multipleSelection = this.multipleSelection.filter(item => {
        return item.waybillId !== val.waybillId
      })
      this.emptyArr = this.emptyArr.filter(item => {
        return item.waybillId !== val.waybillId
      })
      this.tableData1.forEach(item => {
        if (val.waybillId === item.waybillId) {
          this.$refs.multipleTable.toggleRowSelection(item, false)
        }
      })
    },
    clickChangeBankCancel (val) {
      this.dialogShow = false
    },
    clickChangeBankSure (val) {
      if (val === 'success') {
        this.propsObj.waybillIds = []
        this.propsObj.amount = ''
        this.dialogShow = false
        this.QueryFlowIncomeList(this.clientAccountParam)
        this.init()
      }
    },
    WithdrawalSure () {
      console.log(this.propsObj.amount, '123')
      if (this.propsObj.amount === '' || this.propsObj.amount <= 0) {
        this.$notify({
          type: 'error',
          message: '提现金额需大于0！'
        })
      } else {
        this.dialogShow = true
      }
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.tableData1.forEach(tabledata => {
            console.log(tabledata.waybillNumber === row.waybillNumber)
            if (tabledata.waybillNumber === row.waybillNumber) {
              this.$refs.multipleTable.toggleRowSelection(tabledata, true)
            }
          })
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    formDateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    search () {
      this.clientAccountParam.currentPage = '1'
      this.searchFlag = true
      this.emptyArr = this.tableData2
      this.clickSearch = true
      this.clientAccountParam.createTimeStart = this.form.createTimeStart
      this.clientAccountParam.createTimeEnd = this.form.createTimeEnd
      this.clientAccountParam.waybillOrReceiveClientName = this.form.waybillOrReceiveClientName
      this.QueryFlowIncomeList(this.clientAccountParam)
    },
    handleSelectionChange1 (val) {
      console.log(val, '---')
      // val.forEach(item => {
      //   item.state = !item.state
      // })
      this.multipleSelection = val
      if (val.length > 0) {
        this.searchFlag = false
      }
    },
    handleSelectionChange2 (val) {
      this.withdralalSelection = val
      if (val.length > 0) {
        let sum = 0
        val.forEach(element => {
          sum += element.actualPaymentGoods
          return sum
        })
        this.propsObj.waybillIds = val.map(item => {
          return item.waybillId
        })
        this.totalShow = sum.toFixed(2)
        this.propsObj.amount = this.totalShow
      }
    },
    changePageSize (pageSize) {
      this.searchFlag = true
      this.emptyArr = this.tableData2
      this.clientAccountParam.currentPage = '1'
      this.clientAccountParam.pageSize = pageSize
      this.QueryFlowIncomeList(this.clientAccountParam)
    },
    changePage (pageSize, pageNumber) {
      this.searchFlag = true
      this.emptyArr = this.tableData2
      this.clientAccountParam.pageSize = pageSize
      this.clientAccountParam.currentPage = pageNumber
      this.QueryFlowIncomeList(this.clientAccountParam)
    },
    QueryFlowIncomeList (val) { // 驮付宝财务流水收入流水分页列表查询
      DealerAccountAjax.WithdrawalOperation(val).then(res => {
        if (res.code === 200) {
          this.tableData1 = res.data && res.data.list.map((item, index) => {
            return item
          })
          this.$nextTick(() => {
            this.toggleSelection(this.tableData2)// 每次更新了数据，触发这个函数即可。
          })
          let sum = 0
          res.data && res.data.list.forEach((innerItem) => {
            sum += innerItem.actualPaymentGoods
            return sum
          })
          // this.totalAmount = sum.toFixed(2)
          this.pagination.pageSize = res.data.pageSize
          this.clientAccountParam.currentPage = res.data.currentPage
          this.pagination.total = res.data.total
        }
      })
    }
  },
  components: {
    VPagination,
    WithdrawalDialog
  }
}
</script>

<style lang="less">
.withdrawal {
  .inputWidth {
  .el-input__inner {
    width: 210px !important;
  }
}
  .colorFlag{
    color: #f00;
  }
}
</style>

<style lang="less" scoped>
@import '../../../../style/base.less';
.withdrawal {
  width: 100%;
  display: flex;
  flex: 1;
  padding: 25px 30px 20px 30px;
  flex-direction: column;
  .withdrawal_title {
    padding: 0 0 0px 10px;
    width: 100%;
    height: 40px;
    line-height: 30px;
    font-size: 14px;
    color: #333;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    .el-icon-question{
      position: relative;
        font-size: 18px;
        text-indent: 0px;
        cursor: pointer;
        color: #747484;
        margin-left: 8px;
      .tip-con{
        display: none;
        position: absolute;
        padding: 3px 5px;
        top: -60px;
        left: -70px;
        width: 180px;
        height: 55px;
        line-height: 15px;
        overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 5px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-question:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .flex_col {
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .card_main {
    //flex-direction: row;
  }
  .leftCard {
    margin: 0 5px !important;
  }
  .rightCard {
    margin: 0 5px !important;
  }
  .listHeader {
    line-height: 40px;
    margin: 30px 0 !important;
  }
  .public_list{
    margin: 20px 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    .cardTitle {
      font-size: 14px;
      color: #333;
      margin-top: 20px;
    }
    .table-con {
      display: flex;
      flex: 1;
    }
  }
  .search-con {
    width: 100%;
    height: 40px;
    margin-top: 30px;
    margin-left: 0px;
    margin-bottom: 30px;
  }
  .bottom-con {
    height: 28px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    .total {
      flex-grow: 1;
      font-size: 14px;
      color: #333;
    }
    .pagination {
      flex-grow: 9;
      height: 28px;
    }
  }
}
</style>
