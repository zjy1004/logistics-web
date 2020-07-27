<template>
  <div class="receiptfrom-be-born-with-list">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="120px">
              <div class="common-search">
                <el-form-item label="落地配物流:" prop="logisticsIdLand">
                  <el-select v-model.number="form.logisticsIdLand" placeholder="请选择落地配物流" clearable filterable>
                    <el-option
                      v-for="(item, index) in logisticsOptions"
                      :key="index"
                      :label="item.logisticsName"
                      :value="item.logisticsId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="落地配收款状态:" prop="landReceiveStatus">
                  <el-select v-model.number="form.landReceiveStatus" placeholder="请选择落地配收款状态" clearable>
                    <el-option
                      v-for="(item, index) in landReceiveOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="日期:" prop="createTime">
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
              <!-- <el-table-column
                type="selection"
                width="40">
              </el-table-column> -->
              <el-table-column
                min-width="6%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="logisticsNameLand"
                label="落地配物流">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="aggregateAmount"
                label="总计（元）"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="actualFreight"
                label="实收运费（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="actualGoods"
                label="实收货款（元）">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="waybillAmount"
                label="运单总量">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="transitWaybillAmount"
                label="运输中运单">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="signWaybillAmount"
                label="签收运单">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="rejectWaybillAmount"
                label="拒收运单">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="receiptAccount(scope.row)">对账收款</a>
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
import ReceiptfromBeBornWithAjax from '@/api/ReceiptfromBeBornWith/ReceiptfromBeBornWith'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'ReceiptfromBeBornWithList',
  data () {
    return {
      logisticsOptions: [], // 落地配物流下拉
      form: {
        landReceiveStatus: '',
        logisticsId: '', // 物流公司id
        logisticsIdLand: '', // 落地配物流公司id
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      selection: [],
      landReceiveOptions: [
        {name: '全部', id: ''},
        {name: '已收款', id: 1},
        {name: '未收款', id: 2}
      ]
    }
  },
  components: {
    VPagination
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getlogisticsList()
      this.queryList()
    },
    getlogisticsList () { // 物流公司下拉列表
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        let userInfoObj = JSON.parse(userInfo)
        ReceiptfromBeBornWithAjax.queryLogisticsOptions({logisticsId: userInfoObj.logisticsId}).then(response => {
          if (response.code === 200) {
            this.logisticsOptions = response.data
          }
        })
      }
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      ReceiptfromBeBornWithAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          if (response.data.list !== null) {
            this.tableData = response.data.list.map((item, index) => {
              item.rowNum = ++index
              return item
            })
          } else {
            this.tableData = []
          }
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    search () {
      this.queryList('searchBtn')
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
    // 行对账收款
    receiptAccount (row) {
      let option = {
        name: 'ReceiptfromBeBornWith',
        query: {
          logisticsId: row.logisticsIdLand,
          logisticsName: row.logisticsNameLand,
          landReceiveStatus: this.form.landReceiveStatus,
          createTimeStart: this.form.createTimeStart,
          createTimeEnd: this.form.createTimeEnd
        }
      }
      let routes = this.$router.resolve(option)
      window.open(routes.href, '_blank')
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/financeManage/exportFinanceCollectLandVoList'
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
    renderColTip (h, {column, $index}) {
      return (
        <div class="render-col-header">
          <span>{column.label}</span>
          <i class="el-icon-warning">
            <div class="tip-con">总计 = 实收运费 + 实收代收</div>
            <div class="tip-icon"></div>
          </i>
        </div>
      )
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.receiptfrom-be-born-with-list{
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .common-search {
    .el-form-item {
      .el-form-item__label {
        width: 110px !important;
      }
    }
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
.receiptfrom-be-born-with-list{
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
