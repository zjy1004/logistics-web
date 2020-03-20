<template>
  <div class="receipt-adjust">
    <div class="public_card">
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con-list">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <!-- <div class="common-search"> -->
                <el-form-item label="运单号:" prop="waybillNumber">
                  <el-input v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item label="发货方:" prop="sendClientName">
                  <search-by-name
                    ref="searchSendName"
                    :searchType="'send'"
                    :placeholderText="'请输入发货方名称'"
                  />
                </el-form-item>
                <el-form-item label="收货方:" prop="receiveClientName">
                  <search-by-name
                    ref="searchReceiveName"
                    :searchType="'receive'"
                    :placeholderText="'请输入收货方名称'"
                  />
                </el-form-item> -->
                <el-form-item label="客户名称:" prop="clientName">
                 <el-input :title="form.clientName" v-model="form.clientName" placeholder="请输入客户名称" clearable></el-input>
              </el-form-item>
              <!-- </div> -->
              <!-- <transition name="draw"> -->
                <!-- <div class="box" v-show="showMoreSearch"> -->
                  <el-form-item label="站点:" prop="stationId">
                    <el-select v-model.number="form.stationId" placeholder="请选择站点" clearable>
                      <el-option
                        v-for="item in stationOptions"
                        :key="item.stationId"
                        :label="item.stationName"
                        :value="item.stationId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="线路:" prop="pkLine">
                    <el-select v-model.number="form.pkLine" placeholder="请选择线路" clearable filterable>
                      <el-option
                        v-for="item in lineOptions"
                        :key="item.generateKey"
                        :label="item.generateVal"
                        :value="item.generateKey">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开单日期:" prop="createTime">
                    <el-date-picker
                      style="width: 445px;"
                      v-model="form.createTime"
                      type="daterange"
                      @change="dateChange"
                      :picker-options="pickerOptions"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                <!-- </div> -->
              <!-- </transition> -->
            </el-form>
          </div>
        </div>
        <div class="search-btn-con-list">
          <el-button class="btn-main" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <!-- <div class="toggle-con" @click="showMoreSearch = !showMoreSearch">{{showMoreSearch ? '收起' : '展开'}}</div> -->
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
                min-width="16%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="14%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="14%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receivableGoods"
                label="应收代收(元)">
              </el-table-column>
              <el-table-column label="应收运费(元)">
                <el-table-column
                  min-width="10%"
                  prop="sendReceivableFreight"
                  label="发货方支付">
                </el-table-column>
                <el-table-column
                  min-width="10%"
                  prop="receiveReceivableFreight"
                  label="收货方支付">
                </el-table-column>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="actualGoods"
                label="实收代收(元)"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column prop="actualFreight" label="实收运费(元)"
                :render-header="renderColTip"
              >
                <el-table-column
                  min-width="12%"
                  prop="sendActualFreight"
                  label="发货方支付">
                </el-table-column>
                <el-table-column
                  min-width="12%"
                  prop="receiveActualFreight"
                  label="收货方支付">
                </el-table-column>
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="waybillStatusName"
                label="运单状态">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="changeBalance"
                label="变更差额(元)"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receivableAmount"
                label="实收金额(元)">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
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
    <receipt-adjust-dialog
      ref="receiptAdjust"
      v-if="showReceiptAdjust"
      :dialogVisible=showReceiptAdjust
      :propsObjParent=propsObj
      @click-cancel-form="clickCancel"
      @click-sure-form="clickSure"
      @confirm-sure="sureDialogVisible = true"
    />
    <v-dialog
      v-if="sureDialogVisible"
      title="提示"
      :width="'486px'"
      mainText="运单金额未变更，是否确认更改金额？"
      :closeClickModal="false"
      :dialogVisible="sureDialogVisible"
      @click-cancel="cancel"
      @click-sure="clickConfirm"
    />
  </div>
</template>

<script>
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import OutstandingWaybillAjax from '@/api/OutstandingWaybill/OutstandingWaybill'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import VPagination from '@/components/Pagination/Pagination'
import SearchByName from '@/components/SearchByName/SearchByName'
import VDialog from '@/components/Dialog/Dialog'
import ReceiptAdjustDialog from './subpage/ReceiptAdjustDialog'
import { mapGetters } from 'vuex'
import Enums from '@/components/BaseFn/Enums'
export default {
  name: 'ReceiptAdjust',
  data () {
    return {
      showMoreSearch: false,
      showReceiptAdjust: false,
      sureDialogVisible: false,
      stationOptions: [], // 站点下拉数据
      lineOptions: [], // 线路下拉数据
      form: {
        waybillNumber: '', // 运单号
        clientName: '', // 客户名称
        // sendClientName: '', // 发货方名称
        // receiveClientName: '', // 收货方名称
        stationId: '', // 站点
        pkLine: '', // 线路
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      pickerOptions: {
        disabledDate: this.disabledDate,
        onPick: this.onPick
      },
      minCreateTime: '',
      maxCreateTime: '',
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      waybillStatusList: [{id: 11, name: '待装车'}, {id: 1, name: '已装车'}, {id: 2, name: '运输中'}, {id: 3, name: '已签收'}, {id: 4, name: '已拒签'}, {id: 5, name: '已完成'}, {id: 6, name: '已取消'}, {id: 9, name: '待入库'}, {id: 10, name: '待退货'}], // 运单状态
      tableData: [],
      propsObj: {} // 修改代收货款、运费弹窗数据
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName,
    ReceiptAdjustDialog,
    VDialog
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
      this.queryList()
      this.getStationList()
      this.queryLineNameList()
    },
    // 查询线路下拉数据
    queryLineNameList (val) { // 线路列表
      ShiftPlanAjax.queryLineNameList(val).then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
        }
      })
    },
    // 查询站点下拉数据
    getStationList (val) { // 物流公司下站点列表
      WaybillApiAjax.getStationList(val).then(res => {
        if (res.code === 200) {
          this.stationOptions = res.data
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
      OutstandingWaybillAjax.queryFinanceFeeUpdateWaybill(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            this.waybillStatusList.forEach(statusItem => {
              if (statusItem.id === item.waybillStatus) {
                item.waybillStatusName = statusItem.name
              }
            })
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    clickConfirm () {
      this.$refs.receiptAdjust.saveFn()
      this.sureDialogVisible = false
    },
    cancel () {
      this.sureDialogVisible = false
    },
    search () {
      // this.form.sendClientName = this.$refs.searchSendName.form.searchName
      // this.form.receiveClientName = this.$refs.searchReceiveName.form.searchName
      this.queryList('searchBtn')
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.clientName = ''
      // this.$refs.searchSendName.form.searchName = ''
      // this.$refs.searchReceiveName.form.searchName = ''
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.createTime = ''
      } else {
        this.minCreateTime = ''
        this.maxCreateTime = ''
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
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
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    // 行修改
    edit (row) {
      this.propsObj = row
      this.showReceiptAdjust = true
    },
    // 确认修改
    clickSure () {
      this.showReceiptAdjust = false
      this.queryList()
    },
    clickCancel () {
      this.showReceiptAdjust = false
    },
    renderColTip (h, {column, $index}) {
      let colProp = column.property
      let colTipText = ''
      switch (colProp) {
        case 'actualGoods': // 实收代收
          colTipText = '实际收取货款，为收款调整后的金额'
          break
        case 'actualFreight': // 实收运费
          colTipText = '实际收取运费，为收款调整后的金额'
          break
        case 'changeBalance': // 变更差额
          colTipText = '变更差额=实收运费+实收代收-应收运费-应收代收'
          break
        default:
          break
      }
      return (
        <div class="render-col-header">
          <span>{column.label}</span>
          <i class="el-icon-warning">
            <div class="tip-con">{colTipText}</div>
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
.receipt-adjust{
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
  .box{
    width: 100%;
  }
  .draw-enter-active, .draw-leave-active {
    transition: all .1s ease;
  }
  .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
    white-space: normal!important;
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
  .el-table .cell span{
    line-height: 20px;
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
.receipt-adjust{
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
      min-height: 160px;
    }
    .pagination{
      margin: 10px 0;
      height: 28px;
    }
  }
}
</style>
