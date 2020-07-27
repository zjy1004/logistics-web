<template>
  <div class="receiptfrom-be-born-with">
    <div class="top-con">
      <span class="detail_header">财务管理 > 向落地配收款 > <span class="info">{{logisticsName || ''}}</span></span>
    </div>
    <div class="top-con">
      <span style="font-size: 16px;font-weight: bold;">收款操作</span><span>（注：当前页面列表为当前可进行收款的运单列表）</span>
      <span style="margin-left: 100px;">交款人：{{logisticsName || ''}}</span>
    </div>
    <div class="main-con">
      <div class="left-con common-div">
        <div v-if="false" class="tip">请按需勾选需要收款的运单</div>
        <div class="search-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="70px">
            <el-row>
              <el-col :span="13">
                <el-form-item class="receiveStatus selectWidth" label="落地配收款状态:" prop="landReceiveStatus">
                  <el-select v-model.number="form.landReceiveStatus" placeholder="请选择落地配收款状态" clearable>
                    <el-option
                      v-for="(item, index) in landReceiveOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="0">
                <el-form-item label=''>
                  <el-input class="inputWidth" v-model="form.waybillNumberOrReceiveClientName" placeholder="运单号/修理厂名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="0">
                <el-form-item class="date-item">
                  <el-button @click="search">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="height: 5px; width: 100%"></div>
            <el-row>
              <el-col :span="24">
                <el-form-item class="date-item" label="开单时间:" prop="createTime">
                  <el-date-picker
                    style="width: 330px;"
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
              min-width="18%"
              prop="receiveClientName"
              label="收货方名称">
            </el-table-column>
            <el-table-column
              min-width="18%"
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="createTime"
              label="开单时间">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="aggregateAmount"
              label="应收总额（元）">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="actualGoods"
              label="代收货款（元）">
            </el-table-column>
            <el-table-column
              min-width="12%"
              prop="actualFreight"
              label="运费（元）">
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
        <div class="tip">本次预收款运单明细</div>
        <div class="head-con">
          <div class="head-left">总计（元）：<span>￥{{rightTotal}}</span></div>
          <div class="head-right">
            <el-button class="btn-main" @click="sureReceipt">确认收款</el-button>
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
              min-width="18%"
              prop="receiveClientName"
              label="收货方名称">
            </el-table-column>
            <el-table-column
              min-width="18%"
              prop="waybillNumber"
              label="运单号">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="createTime"
              label="开单时间">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="aggregateAmount"
              label="应收总额（元）">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="actualGoods"
              label="代收货款（元）">
            </el-table-column>
            <el-table-column
              min-width="12%"
              prop="actualFreight"
              label="运费（元）">
            </el-table-column>
            <el-table-column
              label="操作"
              width="70">
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
      :personName="logisticsName"
      @click-cancel="receiptConfirmVisible = false"
      @click-sure="sure"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import ReceiptfromBeBornWithAjax from '@/api/ReceiptfromBeBornWith/ReceiptfromBeBornWith'
import ReceiptFromStaffAjax from '@/api/ReceiptFromStaff/ReceiptFromStaff'
import ReceiptConfirm from './ReceiptConfirm'
import { mapGetters } from 'vuex'
export default {
  name: 'ReceiptfromBeBornWith',
  data () {
    return {
      logisticsName: '',
      form: {
        landReceiveStatus: '',
        logisticsId: '',
        createTime: '',
        logisticsIdLand: '', // 落地配物流公司id
        receivePartyName: '',
        createTimeStart: '', // 到账时间起
        createTimeEnd: '', // 到账时间止
        waybillNumberOrReceiveClientName: '' // 运单号Or收货方名称
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      leftTableData: [],
      leftSelection: [],
      rightTableData: [],
      paginationChange: false,
      receiptConfirmVisible: false,
      landReceiveOptions: [
        {name: '全部', id: ''},
        {name: '已收款', id: 1},
        {name: '未收款', id: 2}
      ]
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate']),
    rightTotal () {
      return this.rightTableData.reduce((pre, next, index, array) => {
        return pre + next.aggregateAmount
      }, 0).toFixed(2)
    }
  },
  components: {
    VPagination,
    ReceiptConfirm
  },
  created () {
    if (this.$route.query) {
      this.form.logisticsIdLand = this.$route.query.logisticsId
      this.logisticsName = this.$route.query.logisticsName
      this.form.landReceiveStatus = Number(this.$route.query.landReceiveStatus) || ''
      this.form.createTimeStart = this.$route.query.createTimeStart || ''
      this.form.createTimeEnd = this.$route.query.createTimeEnd || ''
      this.form.createTime = this.form.createTimeStart ? [this.form.createTimeStart, this.form.createTimeEnd] : []
    }
    this.init()
  },
  watch: {
    leftSelection (newVal, oldVal) {
      const res = new Map()
      Array.from([...oldVal, ...this.rightTableData]).forEach(item => {
        res.set(item.waybillId, 1)
      })
      let tempArr = [...newVal, ...oldVal, ...this.rightTableData].filter((item) => !res.has(item.waybillId) && res.set(item.waybillId, 1))
      if (newVal.length > oldVal.length) {
        this.rightTableData = this.rightTableData.concat(tempArr)
      } else {
        if (!this.paginationChange) {
          let diffArr = oldVal.filter(oldItem => newVal.every(newItem => oldItem.waybillId !== newItem.waybillId))
          this.rightTableData = this.rightTableData.filter(rightItem => diffArr.every(diffItem => rightItem.waybillId !== diffItem.waybillId))
        }
      }
      this.$nextTick(() => {
        this.paginationChange = false
      })
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
      this.$router.push({name: 'ReceiptfromBeBornWithList'})
    },
    remove (rightRow) {
      let leftTable = this.$refs.leftTable
      let leftNowHasRightDelRow = false
      this.leftTableData.forEach(item => {
        if (item.waybillId === rightRow.waybillId) {
          leftNowHasRightDelRow = true
          leftTable.toggleRowSelection(item, false)
        }
      })
      if (!leftNowHasRightDelRow) { // 右侧点移除的数据不在当前左侧表格所在分页中
        this.rightTableData = this.rightTableData.filter(item => {
          return item.waybillId !== rightRow.waybillId
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
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
        this.rightTableData = []
      }
      ReceiptfromBeBornWithAjax.queryFinanceReconciliationLandVoList(queryParam).then(res => {
        if (res.code === 200) {
          this.paginationChange = true
          this.leftTableData = res.data.list || []
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
              if (leftItem.waybillId === rightItem.waybillId) {
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
    sureReceipt () {
      if (this.rightTotal <= 0) {
        this.$notify({
          type: 'error',
          message: '收款金额需大于0！'
        })
      } else {
        this.receiptConfirmVisible = true
      }
    },
    sure () {
      let receiptParams = {receivedType: 2}
      receiptParams.waybillBatchConfirmCollectionDetailParamList = this.rightTableData.map(item => {
        let obj = {
          waybillId: item.waybillId,
          expenseType: item.expenseType,
          waybillDeliveryType: item.waybillDeliveryType,
          logisticsId: item.logisticsId,
          waybillReceivePaymentId: item.waybillReceivePaymentId
        }
        return obj
      })
      ReceiptFromStaffAjax.SureRecript(receiptParams).then(res => {
        this.receiptConfirmVisible = false
        if (res.code === 200) {
          this.queryList('searchBtn')
          this.rightTableData = []
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.receiptfrom-be-born-with {
  .search-con {
    .el-form-item__label {
      width: 70px !important;
    }
    .receiveStatus {
      .el-form-item__label {
        width: 110px !important;
      }
    }
    .el-date-editor .el-range-separator {
      width: 10%;
    }
    .selectWidth {
      .el-select {
        width: 140px;
      }
      .el-input__inner {
        width: 140px ;
      }
    }
    .inputWidth {
      .el-input__inner {
        width: 150px ;
        padding-right: 0!important;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../../../style/base.less';
.receiptfrom-be-born-with{
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
      padding: 20px 10px 30px 10px;
      .tip{
        height: 14px;
        .mixin-sc(14px;#333);
        line-height: 16px;
        span{
          .mixin-sc(14px;#333);
        }
      }
    }
    .left-con{
      display: flex;
      flex: 1;
      background: #fff;
      margin-right: 10px;
      .search-con{
        margin-bottom: 20px;
        height: auto;
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
