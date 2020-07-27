<template>
  <div class="settlement-for-customersList">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <div class="common-search">
                <!-- <el-form-item label="客户名称:" prop="sendClient">
                  <el-select v-model.number="form.sendClient" placeholder="请选择客户名称" clearable filterable>
                    <el-option
                      v-for="(item, index) in clientIdOptions"
                      :key="index"
                      :label="item.sendClientName"
                      :value="item.sendClientId">
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="客户名称:" prop="clientName">
                  <el-input v-model="form.clientName" placeholder="请输入客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="发货方电话:" prop="sendClientPhone">
                <el-input v-model="form.sendClientPhone" placeholder="请输入发货方电话" clearable></el-input>
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
              </div>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
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
              <el-table-column
                min-width="6%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="sendClientName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="totalAmount"
                label="总单量">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="settleTheTotal"
                label="未结算货款（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="totalPaidAmount"
                label="可结算货款（元）">
              </el-table-column>
              <!--<el-table-column
                min-width="15%"
                prop="settlementStatus"
                label="结算状态">
              </el-table-column>-->
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="receiptAccount(scope.row)">对账结算</a>
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
import SettlementForCustomersAjax from '@/api/SettlementForCustomers/SettlementForCustomers'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'SettlementForCustomersList',
  data () {
    return {
      // clientIdOptions: [], // 客户
      form: {
        createTime: '',
        clientName: '', // 客户名称
        sendClient: '', // 客户名称
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        sendClientPhone: ''
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
    VPagination
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
      this.queryLineNameList()
      // this.GetClientData()
    },
    check (row) {
      this.$router.push({name: 'UnSettlementForCustomersList', query: {title: row.sendClientName, sendClient: row.sendClient, searchDate: this.form.createTime}})
    },
    queryLineNameList (val) { // 线路列表
      ShiftPlanAjax.queryLineNameList(val).then(res => {
        if (res.code === 200) {
          this.lineNameOptions = res.data
        }
      })
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      SettlementForCustomersAjax.QueryList(queryParam).then(response => {
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
    // GetClientData (val) { // 1修理厂2经销商
    //   SettlementForCustomersAjax.QuerySendClientList(val).then(res => {
    //     if (res.code === 200) {
    //       // this.receiveClientNameOptions = res.data[1]
    //       // this.sendClientNameOptions = res.data[2]
    //       this.clientIdOptions = res.data
    //     }
    //   })
    // },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.sendClient = ''
      this.form.clientName = ''
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
    // 行对账结算
    receiptAccount (row) {
      // this.$router.push({name: 'SettlementForCustomersPage', query: {sendClient: row.sendClient, sendClientName: row.sendClientName, searchDate: this.form.createTime}})
      let routes = this.$router.resolve({name: 'SettlementForCustomersPage', query: {sendClient: row.sendClient, sendClientName: row.sendClientName, searchDate: this.form.createTime}})
      window.open(routes.href, '_blank')
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      // let waybillIdList = this.selection.map(item => {
      //   return item.waybillId
      // }).join(',')
      // this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/queryShowSettlementListExport'
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
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.settlement-for-customersList{
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
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
    justify-content: center;
    .el-icon-warning{
      position: relative;
      font-size: 16px;
      text-indent: 0px;
      cursor: pointer;
      color: #747484;
      margin-left: 3px;
      .tip-con{
        display: none;
        position: absolute;
        z-index: 1;
        padding: 3px 5px;
        top: -60px;
        left: -70px;
        width: 170px;
        height: 50px;
        line-height: 15px;
        text-align: left;
        // overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 5px;
        padding: 0px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-warning:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .el-table{
    overflow: visible;
    .el-table__header-wrapper, .el-table__footer-wrapper{
      overflow: visible;
    }
    th{
      overflow: visible;
      text-align: center;
      .cell{
        overflow: visible;
      }
      div.tip-con{
        white-space: normal;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.settlement-for-customersList{
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
  .search-btn-con{
    margin-top: 15px!important;
  }
}
</style>
