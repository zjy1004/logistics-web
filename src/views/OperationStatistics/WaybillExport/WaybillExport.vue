<template>
  <div class="waybill-export">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <div class="common-search">
                <el-form-item label="物流公司:" prop="sendClient">
                  <el-select v-model="form.logisticsId" placeholder="请选择物流公司" clearable filterable>
                    <el-option
                      v-for="(item, index) in logisticsOptions"
                      :key="index"
                      :label="item.logisticsName"
                      :value="item.logisticsId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发货方名称:" prop="sendClientName">
                  <el-input v-model="form.sendClientName" placeholder="请输入发货方名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="收货方名称:" prop="receiveClientName">
                  <el-input v-model="form.receiveClientName" placeholder="请输入收货方名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="开单日期:" prop="createTime">
                  <el-date-picker
                    style="width: 445px;"
                    v-model="form.createTime"
                    type="daterange"
                    @change="dateChange"
                    clearable
                    :picker-options="pickerOptions"
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
              border>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="logisticsName"
                label="物流公司名称">
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
                label="货款">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="freight"
                label="运费">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillType"
                label="运单类型">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillClassify"
                label="是否驮付宝">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="createTime"
                label="开单时间">
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
import OperationStatisticsAjax from '@/api/OperationStatistics/OperationStatistics'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import Enums from '@/components/BaseFn/Enums'
import { mapGetters } from 'vuex'

import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'WaybillExport',
  data () {
    return {
      clientIdOptions: [], // 客户
      minCreateTime: '',
      maxCreateTime: '',
      form: {
        logisticsId: '',
        sendClientName: '',
        receiveClientName: '',
        createTime: '',
        minCreateTime: '', // 开始时间
        maxCreateTime: '' // 截止时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [],
      logisticsOptions: [],
      pickerOptions: {
        disabledDate: this.disabledDate,
        onPick: this.onPick
      }
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
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.minCreateTime = this.formatCurrentDate()
      this.form.maxCreateTime = this.formatCurrentDate()
      this.queryLogisticsList()
      this.queryList()
    },
    onPick (times) {
      if (times.minDate) {
        this.minCreateTime = times.minDate
      } else if (times.maxDate) {
        this.maxCreateTime = times.maxDate
      }
    },
    disabledDate (time) {
      if (this.minCreateTime) {
        return time.getTime() < (new Date(this.minCreateTime).getTime()) || time.getTime() > (new Date(this.minCreateTime).getTime() + Enums.DURING_TIME)
      } else if (this.maxCreateTime) {
        return time.getTime() > (new Date(this.maxCreateTime).getTime()) || time.getTime() < (new Date(this.maxCreateTime).getTime() - Enums.DURING_TIME)
      } else {
        return false
      }
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      OperationStatisticsAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            if (item.waybillType === 1) {
              item.waybillType = '新运单'
            }
            if (item.waybillType === 2) {
              item.waybillType = '退货运单'
            }
            if (item.waybillType === 3) {
              item.waybillType = '补录运单'
            }
            if (item.waybillType === 4) {
              item.waybillType = '拒收退货运单'
            }
            if (item.waybillClassify === '1') {
              item.waybillClassify = '普通运单'
            }
            if (item.waybillClassify === '2') {
              item.waybillClassify = '驮付宝运单'
            }
            item.rowNum = index + 1
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    dateChange (val) {
      if (!val) {
        // this.minCreateTime = ''
        // this.maxCreateTime = ''
        this.form.minCreateTime = ''
        this.form.maxCreateTime = ''
        this.form.createTime = ''
      } else {
        this.minCreateTime = ''
        this.maxCreateTime = ''
        this.form.minCreateTime = val[0]
        this.form.maxCreateTime = val[1]
      }
    },
    // 导出excel
    exportExcel () {
      let exportParams = {}
      exportParams.queryParams = this.form
      exportParams.url = '/waybill/operateBackground/query/waybillListExport'
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
    queryLogisticsList (val) { // 物流公司列表
      WaybillApiAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsOptions = res.data
        }
      })
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  }
}
</script>

<style lang="less" scoped>
.waybill-export {
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
