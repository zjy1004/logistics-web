<template>
  <div class="distributor-all-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">全部运单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>

              <el-form-item label="班次:" prop="shiftRunName">
                <el-time-select
                  style="width:168px;"
                  v-model="form.shiftRunName"
                    :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '18:30'
                  }"
                  placeholder="请选择发车班次">
                </el-time-select>
              </el-form-item>

              <el-form-item label="收货方:" prop="receiveClient">
                <el-select v-model.number="form.receiveClient" filterable placeholder="请选择收货方" clearable>
                  <el-option
                    v-for="(item, index) in receiveClientNameOptions"
                    :key="index"
                    :label="item.clientName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="运输状态:" prop="waybillStatus">
                <el-select v-model.number="form.waybillStatus" filterable placeholder="请选择运输状态" clearable>
                  <el-option
                    v-for="(item, index) in waybillState"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="运单种类:" prop="waybillClassify">
                <el-select v-model.number="form.waybillClassify" filterable placeholder="请选择运单种类" clearable>
                  <el-option
                    v-for="(item, index) in waybillClassifyList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="代收货款:" prop="receiveGoodsType">
                <el-select v-model.number="form.receiveGoodsType" filterable placeholder="请选择代收货款" clearable>
                  <el-option
                    v-for="(item, index) in receiveGoodsTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- <el-form-item label="支付状态:" prop="paymentStatus">
                <el-select v-model.number="form.paymentStatus" filterable placeholder="请选择支付状态" clearable>
                  <el-option
                    v-for="(item, index) in paymentStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="开单日期:">
                 <el-date-picker
                  style="width: 445px;"
                  v-model="dateValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="10%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="10%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="shiftRunName"
                label="班次">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receivableGoods"
                label="代收金额（元）">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillClassify"
                label="运单种类">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <!-- <el-table-column
                min-width="10%"
                prop="paymentStatus"
                label="支付状态">
              </el-table-column> -->
              <el-table-column
                fixed="right"
                label="操作"
                width="140">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
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
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import waybillManageAjax from '@/api/WaybillManage/WaybillManage'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      dateValue: '', // 选择范围日期
      waybillId: [], // 当前行主键ID
      form: {
        waybillNumber: '', // 运单号
        receiveClient: '', // 收货方
        shiftRunName: '', // 班次
        waybillStatus: '', // 运单状态
        createTimeStart: '', // 创建时间起
        createTimeEnd: '', // 创建时间止
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      waybillState: [
        {id: 11, name: '待装车'},
        {id: 1, name: '已装车'},
        {id: 2, name: '运输中'},
        {id: 3, name: '已签收'},
        {id: 4, name: '已拒签'},
        {id: 6, name: '已取消'}
      ],
      waybillClassifyList: [
        {id: 1, name: '普通运单'},
        {id: 2, name: '驮付宝运单'}
      ],
      receiveGoodsTypeList: [
        {id: 1, name: '有代收'},
        {id: 2, name: '无代收'}
      ],
      paymentStatusList: [
        {id: 1, name: '待支付'},
        {id: 2, name: '已支付'},
        {id: 3, name: '支付关闭'}
      ],
      tableData: [],
      receiveClientNameOptions: [], // 收货方
      clickSearch: false
    }
  },
  watch: {
    dateValue (newVal, oldVal) {
      if (newVal === null) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = newVal[0]
        this.form.createTimeEnd = newVal[1]
      }
    }
  },
  computed: {
    ...mapGetters(['formatDate'])
  },
  created () {
    this.whichPage()
    this.GetClientData()
  },
  methods: {
    whichPage () {
      this.queryAllList(this.form)
    },
    search () {
      this.clickSearch = true
      if (this.form.createTimeStart) {
        this.form.createTimeStart = this.formatDate(this.form.createTimeStart)
      }
      if (this.form.createTimeEnd) {
        this.form.createTimeEnd = this.formatDate(this.form.createTimeEnd)
      }
      this.form.currentPage = 1
      this.queryAllList(this.form)
    },
    check (row) {
      this.$router.push({name: 'DistributorWaybillManageDetail', query: {waybillId: row.waybillId}})
    },
    changePage (pageSize, pageNumber) {
      this.form.pageSize = pageSize
      this.form.currentPage = pageNumber
      this.queryAllList(this.form)
    },
    changePageSize (pageSize) {
      this.form.pageSize = pageSize
      this.form.currentPage = 1
      this.queryAllList(this.form)
    },
    queryAllList (val) { // 全部运单列表
    // QueryDealerWaybillList
      WaybillApiAjax.QueryDealerWaybillList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            if (item.waybillStatus === 11) {
              item.waybillStatusName = '待装车'
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '已装车'
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
            if (item.waybillStatus === 6) {
              item.waybillStatusName = '已取消'
            }
            if (item.waybillStatus === 9) {
              item.waybillStatusName = '待入库'
            }
            if (item.waybillStatus === 10) {
              item.waybillStatusName = '待退货'
            }
            if (item.waybillClassify === 1) {
              item.waybillClassify = '普通运单'
            }
            if (item.waybillClassify === 2) {
              item.waybillClassify = '驮付宝运单'
            }
            if (item.paymentStatus === 1) {
              item.paymentStatus = '待支付'
            }
            if (item.paymentStatus === 2) {
              item.paymentStatus = '已支付'
            }
            if (item.paymentStatus === 3) {
              item.paymentStatus = '支付关闭'
            }

            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    GetClientData (val) { // 1修理厂2经销商
      waybillManageAjax.GetClientData(val).then(res => {
        if (res.code === 200) {
          this.receiveClientNameOptions = res.data[1]
        }
      })
    }

  },
  components: {
    VPagination
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.distributor-all-waybill{
  display: flex;
  flex: 1;
  min-height: 768px;
  overflow: auto;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
    .table-con{
      display: flex;
      flex: 1;
    }
  }
  .pagination{
    margin: 10px 0;
    height: 28px;
  }

}
</style>
