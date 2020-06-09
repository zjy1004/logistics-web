<template>
  <div class="monthly-freight">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="收款状态:" prop="receiptStatus">
                <el-select v-model.number="form.receiptStatus" placeholder="请选择收款状态" clearable>
                  <el-option
                    v-for="item in receiptOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="客户名称:" prop="clientName">
                <search-by-name
                  ref="searchCustomerName"
                  :searchType="'all'"
                  :placeholderText="'请输入客户名称'"
                />
              </el-form-item> -->
              <el-form-item label="客户名称:" prop="clientName">
                  <el-input v-model="form.clientName" placeholder="请输入客户名称" clearable></el-input>
                </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
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
              <el-form-item label="结算方式:" prop="settlementMethod">
                <el-select v-model.number="form.settlementMethod" placeholder="请选择结算方式" clearable>
                  <el-option
                    v-for="item in SettlementMethodList"
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
            <el-button class="btn-main" @click="batchSurePay">批量确认收款</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              :summary-method="getSummaries"
              show-summary
              border>
              <el-table-column
                type="selection"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="17%"
                prop="clientName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                min-width="11%"
                prop="receiveReceivableFreight"
                label="运费实收(元)">
              </el-table-column>
              <el-table-column
                min-width="9%"
                prop="settlementMethodName"
                label="结算方式">
              </el-table-column>
              <el-table-column
                min-width="18%"
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
                prop="operateTime"
                label="签收\拒收时间">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillStatusName"
                label="运单状态">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="financeStausName"
                label="收款状态">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="operatePeronString"
                label="收款人">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="operateMoneyTime"
                label="收款时间">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a v-if="scope.row.receiptStatus === 10" class="edit" href="javascript:;" type="text" size="small" @click="surePay(scope.row)">确认收款</a>
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
import MonthlyFreightAjax from '@/api/MonthlyFreight/MonthlyFreight'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'MonthlyFreight',
  data () {
    return {
      receiptOptions: [{id: 10, name: '未收款'}, {id: 3, name: '已收款'}, {id: '', name: '全部'}], // 收款状态 [10] [3] ''
      SettlementMethodList: [{id: 2, name: '月结'}, {id: 4, name: '回付'}, {id: '', name: '全部'}],
      waybillStateList: [{id: 3, name: '已签收'}, {id: 4, name: '已拒签'}], // 列标运单状态集合
      form: {
        receiptStatus: 10, // 收款状态
        clientName: '', // 客户名称
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        waybillNumber: '', // 运单号
        settlementMethod: '' // 结算方式
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName
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
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      MonthlyFreightAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            // item.rowNum = index + 1
            if (item.receiptStatus === 10) {
              item.financeStausName = '未收款'
            } else if (item.receiptStatus === 3) {
              item.financeStausName = '已收款'
            } else {
              item.financeStausName = ''
            }
            if (item.settlementMethod === '2') {
              item.settlementMethodName = '月结'
            } else if (item.settlementMethod === '4') {
              item.settlementMethodName = '回付'
            }
            this.waybillStateList.forEach(stateItem => {
              if (stateItem.id === item.waybillStatus) {
                item.waybillStatusName = stateItem.name
              }
            })
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 查询
    search () {
      // this.form.clientName = this.$refs.searchCustomerName.form.searchName
      this.queryList('searchBtn')
    },
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      // this.$refs.searchCustomerName.form.searchName = ''
      // this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      // this.form.createTimeStart = this.formatCurrentDate()
      // this.form.createTimeEnd = this.formatCurrentDate()
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        } else if (index !== 2) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
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
      })
      return sums
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
    // 批量确认收款
    batchSurePay () {
      if (this.selection.length > 0) {
        let isAllUnFreight = this.selection.every(item => {
          return item.receiptStatus === 10
        })
        if (isAllUnFreight) {
          let propsList = this.selection.map(item => {
            let obj = {
              waybillId: item.waybillId,
              freightPayer: item.freightPayer
            }
            return obj
          })
          this.confirmReceipt(propsList)
        } else {
          this.$notify({
            type: 'error',
            message: '勾选行中存在已收款运单！'
          })
        }
      } else {
        this.$notify({
          type: 'error',
          message: '请勾选收款行！'
        })
      }
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/exportMonth'
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
    // 确认收款
    confirmReceipt (waybillPropsList) {
      // MonthlyFreightAjax.Pay({monthWaybilBatchCollectionParams: waybillPropsList}).then(response => {
      MonthlyFreightAjax.Pay(waybillPropsList).then(response => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            message: '确认收款成功！'
          })
          this.queryList()
        }
      })
    },
    // 行确认收款
    surePay (row) {
      let propsList = [{waybillId: row.waybillId, freightPayer: row.freightPayer}]
      this.confirmReceipt(propsList)
    },
    // 行查看
    check (row) {
      this.$router.push({name: 'FinancWaybillDetail', query: {waybillTitle: '月结运费', waybillId: row.waybillId, from: 'MonthlyFreight', freightPayer: row.freightPayer}})
    }
  }
}
</script>

<style lang="less">
@import '../../../../style/base.less';
.monthly-freight{
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
@import '../../../../style/base.less';
.monthly-freight{
  display: flex;
  flex: 1;
  flex-direction: column;
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
