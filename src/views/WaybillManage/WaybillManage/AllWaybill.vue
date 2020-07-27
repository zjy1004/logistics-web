<template>
  <div class="all-waybill">
    <div class="public_card">
      <!-- <h3 class="card_header">{{waybillTitle}}</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <!-- <el-form-item label="物流公司:" prop="logisticsId">
                <el-select v-model="form.logisticsId" placeholder="请选择物流公司" @change="changeLogistics(form.logisticsId)" clearable>
                  <el-option
                    v-for="(item, index) in logisticsOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>
              <el-form-item label="发货方:" prop="sendClientName">
                <el-input v-model="form.sendClientName" placeholder="请输入发货方" clearable></el-input>
              </el-form-item>
              <el-form-item label="收货方:" prop="receiveClientName">
                <el-input v-model="form.receiveClientName" placeholder="请输入收货方" clearable></el-input>
              </el-form-item>
               <el-form-item label="线路:" prop="pkLine">
                <el-select v-model="form.pkLine" filterable placeholder="请选择线路" @change="changeLine(form.pkLine)" clearable>
                  <el-option
                    v-for="(item, index) in lineNameOptions"
                    :key="index"
                    :label="item.generateVal"
                    :value="item.generateKey">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班次:" prop="shiftRunName">
                <el-input v-model="form.shiftRunName" placeholder="请输入班次" clearable></el-input>
                <!-- <el-time-select
                  style="width:168px;"
                    v-model="form.shiftRunName"
                    :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '18:30'
                  }"
                  placeholder="选择发车班次">
                </el-time-select> -->
                <!-- <el-select v-model.number="form.shiftId" filterable placeholder="请选择班次" clearable>
                  <el-option
                    v-for="(item, index) in ShiftOptions"
                    :key="index"
                    :label="item.departureTime"
                    :value="item.shiftId">
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="站点:" prop="stationId">
                <el-select v-model.number="form.stationId" filterable placeholder="请选择站点" clearable>
                  <el-option
                    v-for="(item, index) in stationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运输状态:" prop="queryStatus" v-if="waybillStatusShow">
                <el-select v-model.number="form.queryStatus" @change="waybillStatusChange" filterable placeholder="请选择运输状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运单配送类型:" prop="waybillDeliveryType" v-if="waybillDeliveryTypeShow">
                <el-select v-model.number="form.waybillDeliveryType" filterable placeholder="请选择运单配送类型" clearable>
                  <el-option
                    v-for="(item, index) in waybillDeliveryTypeListAll"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="receivePhoneShow" label="收货方电话:" prop="receivePhone">
                <el-input v-model="form.receivePhone" placeholder="请输入收货方电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="日期:">
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
          <div class="listHeader">
            <!-- <el-button class="btn-main" @click="batchGoods" v-if="batchGoodsDisabled">批量发货</el-button> -->
            <el-button class="btn-main" @click="bulkGoods" v-if="bulkGoodsDisabled">批量签收</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              stripe
              height="'100%'"
              border>
              <el-table-column
                key="1"
                v-if="checkboxShow"
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                key="2"
                min-width="10%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                key="3"
                value-format="yyyy-MM-dd HH:mm:ss"
                min-width="10%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                key="4"
                min-width="15%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                key="5"
                min-width="15%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                key="6"
                min-width="15%"
                prop="sendStationName"
                label="发货站点">
              </el-table-column>
              <el-table-column
                key="7"
                v-if="lineNameShow"
                min-width="10%"
                prop="lineName"
                label="线路">
              </el-table-column>
              <el-table-column
                key="8"
                v-if="shiftRunNameShow"
                min-width="10%"
                prop="shiftRunName"
                label="班次">
              </el-table-column>
              <el-table-column
              key="9"
                v-if="colShow"
                min-width="10%"
                prop="packageQuantity"
                label="件数">
              </el-table-column>
              <el-table-column
                key="10"
                v-if="colShow"
                min-width="10%"
                prop="receivableGoods"
                label="代收货款（元）">
              </el-table-column>
              <el-table-column
                key="11"
                v-if="colShow"
                min-width="10%"
                prop="receivableFreight"
                label="运费(元）">
              </el-table-column>
              <el-table-column
                key="16"
                v-if="isCloseBillPage"
                min-width="10%"
                prop="rejectFreight"
                label="拒收运费(元）">
              </el-table-column>
              <el-table-column
                key="17"
                v-if="waybillDeliveryTypeShow"
                min-width="10%"
                prop="waybillDeliveryType"
                label="运单配送类型">
              </el-table-column>
              <el-table-column
                key="12"
                v-if="waybillStatusNameShow"
                min-width="10%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <!-- <el-table-column
                key="13"
                v-if="financeStatusNameShow"
                min-width="10%"
                prop="financeStatusName"
                label="财务状态">
              </el-table-column> -->
              <el-table-column
                key="14"
                v-if="waybillTypeNameShow"
                min-width="10%"
                prop="waybillTypeName"
                label="运单类型">
              </el-table-column>
              <el-table-column
                key="15"
                v-if="operateShow"
                fixed="right"
                label="操作"
                width="140">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" v-if="scope.row.checkShow" @click="check(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.signInShow" @click="signIn(scope.row)">签收</a>
                  <a class="edit" href="javascript:;" type="text" size="small" v-if="scope.row.cancelShow" @click="cancel(scope.row)">取消</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="scope.row.signInShow" @click="rejection(scope.row)">拒收</a>
                  <a class="enable" href="javascript:;" type="text" size="small" v-if="waybillTitle === '待发货运单' && scope.row.cancelShow" @click="editWaybill(scope.row)">修改</a>
                  <!-- <a class="enable" href="javascript:;" type="text" size="small" v-if="scope.row.deliverGoodsShow" @click="deliverGoods(scope.row)">发货</a> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
        </div>
      </div>
    </div>
    <reject-dialog
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :editInfo="editInfoObj"
      />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import RejectDialog from './subpage/RejectDialog'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      clickSearch: false,
      dateValue: '', // 选择范围日期
      dialogVisible: false, // 拒收弹窗
      dialogWidth: '', // 拒收弹窗宽度
      dialogTitle: '', // 拒收弹窗标题
      editInfoObj: {}, // 拒收信息
      cancelShow: false, // 取消按钮
      waybillStatusShow: false,
      waybillTitle: '',
      bulkGoodsDisabled: false,
      batchGoodsDisabled: false,
      waybillStatusNameShow: true,
      financeStatusNameShow: true,
      operateShow: true,
      receivePhoneShow: false,
      waybillTypeNameShow: false,
      colShow: true,
      lineNameShow: true,
      shiftRunNameShow: true,
      checkboxShow: true,
      isCloseBillPage: false,
      waybillDeliveryTypeShow: true, // 是否显示运单配送类型
      form: {
        receivePhone: '',
        stationId: '', // 站点
        // logisticsId: '', // 物流公司
        waybillNumber: '', // 运单号
        sendClientName: '', // 发货方
        receiveClientName: '', // 收货方
        pkLine: '', // 线路
        shiftRunName: '', // 班次
        queryStatus: '', // 运单状态
        waybillDeliveryType: '', // 运单配送类型
        createTimeStart: '', // 创建时间起
        createTimeEnd: '', // 创建时间止
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      companyOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [
        // {id: 1, name: '待发货'},
        // {id: 2, name: '运输中'},
        // {id: 3, name: '已签收'},
        // {id: 4, name: '已拒签'},
        // {id: 6, name: '已取消'}
        {id: 11, name: '待装车'},
        {id: 1, name: '已装车'},
        {id: 2, name: '运输中'},
        {id: 3, name: '已签收'},
        {id: 4, name: '已拒签'},
        {id: 6, name: '已取消'}
        // {id: 5, name: '已完成'}
      ],
      waybillDeliveryTypeListAll: [
        {id: 1, name: '城配运单'},
        {id: 2, name: '自营调度运单'},
        {id: 3, name: '联营调度运单'}
      ], // 运单配送类型
      tableData: [],
      lineNameOptions: [], // 线路列表
      // logisticsOptions: [], // 物流公司列表
      stationOptions: [], // 站点列表
      // ShiftOptions: [], // 线路列表
      multipleSelection: []
    }
  },
  watch: {
    $route (newVal, oldVal) {
      let flag = newVal.query.index
      this.whichPage(flag, 'query')
    },
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
  created () {
    let flag = this.$route.query.index
    this.whichPage(flag, 'query')
    this.queryLineNameList()
    // this.queryLogisticsList()
    this.getStationList()
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  methods: {
    whichPage (flag, type) {
      if (flag === '0') {
        this.waybillStatusShow = true
        if (type === 'query') {
          this.form.queryStatus = ''
        }
        this.dateValue = [this.formatCurrentDate(), this.formatCurrentDate()]
        this.form.createTimeStart = this.formatCurrentDate()
        this.form.createTimeEnd = this.formatCurrentDate()
        this.form.currentPage = 1
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = ''
        this.form.waybillDeliveryType = ''
        this.waybillTitle = '全部运单'
        this.bulkGoodsDisabled = false
        this.batchGoodsDisabled = false
        this.colShow = true
        this.checkboxShow = false
        this.waybillStatusNameShow = true
        this.financeStatusNameShow = true
        this.waybillTypeNameShow = false
        this.shiftRunNameShow = true
        this.lineNameShow = true
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = true
        this.receivePhoneShow = false
        this.queryAllList(this.form)
      }
      if (flag === '1') {
        this.dateValue = ''
        this.waybillStatusShow = false
        this.form.currentPage = 1
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = 7
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.waybillDeliveryType = ''
        this.waybillTitle = '待发货运单'
        this.batchGoodsDisabled = true
        this.bulkGoodsDisabled = false
        this.colShow = false
        this.checkboxShow = true
        this.waybillStatusNameShow = true
        this.financeStatusNameShow = true
        this.waybillTypeNameShow = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = true
        this.receivePhoneShow = false

        if (type === 'query') {
          this.form.queryStatus = 7
        }
        this.form.waybillType = 1

        this.queryAllList(this.form)
      }
      if (flag === '2') {
        this.dateValue = ''
        this.waybillStatusShow = false
        this.form.currentPage = 1
        this.waybillTitle = '运输中运单'
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = 2
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.waybillDeliveryType = ''
        this.bulkGoodsDisabled = true
        this.batchGoodsDisabled = false
        this.colShow = true
        this.checkboxShow = true
        this.waybillStatusNameShow = true
        this.financeStatusNameShow = true
        this.waybillTypeNameShow = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = true
        this.receivePhoneShow = true

        if (type === 'query') {
          this.form.queryStatus = 2
        }
        this.form.waybillType = 1

        this.queryAllList(this.form)
      }
      if (flag === '3') {
        this.dateValue = ''
        this.waybillStatusShow = false
        this.form.currentPage = 1
        this.waybillTitle = '已签收运单'
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = 3
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.waybillDeliveryType = ''
        this.bulkGoodsDisabled = false
        this.batchGoodsDisabled = false
        this.colShow = true
        this.checkboxShow = false
        this.waybillStatusNameShow = true
        this.financeStatusNameShow = true
        this.waybillTypeNameShow = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = false
        this.receivePhoneShow = false

        if (type === 'query') {
          this.form.queryStatus = 3
        }
        this.form.waybillType = 1
        this.queryAllList(this.form)
      }
      if (flag === '4') {
        this.dateValue = ''
        this.waybillStatusShow = false
        this.form.currentPage = 1
        this.waybillTitle = '已关闭运单'
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = 8
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.waybillDeliveryType = ''
        this.bulkGoodsDisabled = false
        this.batchGoodsDisabled = false
        this.colShow = true
        this.checkboxShow = false
        this.waybillStatusNameShow = true
        this.financeStatusNameShow = true
        this.waybillTypeNameShow = false
        this.lineNameShow = true
        this.shiftRunNameShow = true
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = false
        this.receivePhoneShow = false

        if (type === 'query') {
          this.form.queryStatus = 8
        }
        this.form.waybillType = 1

        this.queryAllList(this.form)
      }
      if (flag === '5') {
        this.dateValue = ''
        this.waybillStatusShow = false
        this.waybillTitle = '退货运单'
        this.form.currentPage = 1
        this.form.stationId = ''
        this.form.waybillNumber = ''
        this.form.sendClientName = ''
        this.form.receiveClientName = ''
        this.form.pkLine = ''
        this.form.shiftRunName = ''
        this.form.queryStatus = ''
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
        this.form.waybillDeliveryType = ''

        this.bulkGoodsDisabled = false
        this.batchGoodsDisabled = false
        this.colShow = false
        this.checkboxShow = false
        this.waybillStatusNameShow = false
        this.financeStatusNameShow = false
        this.waybillTypeNameShow = true
        this.lineNameShow = false
        this.shiftRunNameShow = false
        this.operateShow = true
        this.isCloseBillPage = false
        this.waybillDeliveryTypeShow = false
        this.receivePhoneShow = false

        if (type === 'query') {
          this.form.queryStatus = 2
        }
        this.form.waybillType = 2
        // this.QueryListByStatus(this.form)
      }
    },
    search () {
      this.clickSearch = true
      let flag = this.$route.query.index
      // this.whichPage(flag)
      if (flag === '0') {
        this.form.currentPage = 1
        this.queryAllList(this.form)
      }
      if (flag === '1') {
        this.form.currentPage = 1
        this.queryAllList(this.form)
      }
      if (flag === '2') {
        this.form.currentPage = 1
        this.queryAllList(this.form)
      }
      if (flag === '3') {
        this.form.currentPage = 1
        this.queryAllList(this.form)
      }
      if (flag === '4') {
        this.form.currentPage = 1
        this.queryAllList(this.form)
      }
      if (flag === '5') {
        this.form.currentPage = 1
        this.form.waybillType = 2
        this.queryAllList(this.form)
      }
    },
    check (row) {
      let pageIndex = this.$route.query.index
      // this.$router.push({name: 'WaybillDetail', query: {waybillTitle: this.waybillTitle, waybillId: row.waybillId, pageIndex: pageIndex}})
      let option = {
        name: 'WaybillDetail',
        query: {
          waybillTitle: this.waybillTitle,
          waybillId: row.waybillId,
          pageIndex: pageIndex
        }
      }
      let routes = this.$router.resolve(option)
      window.open(routes.href, '_blank')
    },
    signIn (row) { // 签收
      this.Signing({waybillIdList: row.waybillId})
    },
    cancel (row) { // 取消
      this.Cancel({waybillId: row.waybillId})
    },
    rejection (row) { // 拒收
      WaybillApiAjax.QueryFreightSettlementMethodByWaybillId({waybillId: row.waybillId}).then(res => {
        if (res.code === 200) {
          if (res.data.receiveFreightSettlementMethod === '3') {
            this.editInfoObj.receiveClientShow = true
          } else {
            this.editInfoObj.receiveClientShow = false
          }
          if (res.data.sendFreightSettlementMethod === '3') {
            this.editInfoObj.sendClientShow = true
          } else {
            this.editInfoObj.sendClientShow = false
          }
          this.editInfoObj.waybillId = row.waybillId
          this.editInfoObj.sendClientName = row.sendClientName
          this.editInfoObj.receiveClientName = row.receiveClientName
          this.dialogTitle = '确认是否拒收'
          this.dialogWidth = '486px'
          this.dialogVisible = true
        }
      })
    },
    editWaybill (row) {
      this.$router.push({name: 'EditWaybill', query: {waybillId: row.waybillId}})
    },
    clickDialogSure (val) {
      this.Reject(val)
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    deliverGoods (row) { // 发货
      this.Transport({waybillIdList: row.waybillId})
    },
    batchGoods () { // 批量发货
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要发货的行!'
        })
      } else {
        let obj = {}
        obj.waybillIdList = this.multipleSelection.map(item => {
          return item.waybillId
        })
        this.Transport(obj)
      }
    },
    bulkGoods () {
      if (this.multipleSelection < 1) { // 批量签收
        this.$notify({
          type: 'error',
          message: '请您选择要签收的行!'
        })
      } else {
        let flag = this.multipleSelection.every(i => {
          return i.signFlag
        })
        console.log(flag)
        if (flag) {
          let obj = {}
          obj.waybillIdList = this.multipleSelection.map(item => {
            return item.waybillId
          })
          this.Signing(obj)
        } else {
          this.$notify({
            type: 'error',
            message: '存在不可签收的运单，请重新选择!'
          })
        }
      }
    },
    changeLogistics (val) {
      this.getStationList({logisticsIdL: val})
    },
    changePage (pageSize, pageNumber) {
      this.form.pageSize = pageSize
      this.form.currentPage = pageNumber
      // let flag = this.$route.query.index
      // if (flag === '0') {
      //   this.queryAllList(this.form)
      // } else {
      //   this.QueryListByStatus(this.form)
      // }
      this.queryAllList(this.form)
    },
    changePageSize (pageSize) {
      this.form.pageSize = pageSize
      this.form.currentPage = 1
      // let flag = this.$route.query.index
      // if (flag === '0') {
      //   this.queryAllList(this.form)
      // } else {
      //   this.QueryListByStatus(this.form)
      // }
      this.queryAllList(this.form)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeLine (val) {
      // this.shiftList({lineId: val, beginDate: this.form.createTimeStart, endDate: this.form.createTimeEnd})
    },
    waybillStatusChange (val) {
      this.form.queryStatus = val
      // if (val === 1) {
      //   this.waybillTitle = '待发货运单'
      // }
      if (val === 2) {
        this.waybillTitle = '运输中运单'
      }
      if (val === 3) {
        this.waybillTitle = '已签收运单'
      }
      if (val === 4) {
        this.waybillTitle = '已关闭运单'
      }
    },
    queryAllList (val) { // 全部运单列表
      WaybillApiAjax.AllList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            if (item.waybillStatus === 11) {
              item.waybillStatusName = '待装车'
              item.checkShow = true
              item.signInShow = false // 签收
              item.rejectionShow = false // 拒签
              if (item.cancelFlag) {
                item.cancelShow = true // 取消
              }
            }
            if (item.waybillStatus === 1) {
              item.waybillStatusName = '已装车'
              item.checkShow = true
              item.signInShow = false
              item.rejectionShow = false
              if (item.cancelFlag) {
                item.cancelShow = true // 取消
              }
              item.deliverGoodsShow = true
            }
            if (item.waybillStatus === 2) {
              item.waybillStatusName = '运输中'
              item.checkShow = true
              if (item.signFlag) {
                item.signInShow = true
              }
              item.rejectionShow = true
              item.cancelShow = false
              item.deliverGoodsShow = false
            }
            if (item.waybillStatus === 3) {
              item.waybillStatusName = '已签收'
              item.checkShow = true
              item.signInShow = false
              item.rejectionShow = false
              item.cancelShow = false
              item.deliverGoodsShow = false
            }
            if (item.waybillStatus === 4) {
              item.waybillStatusName = '已拒签'
              item.checkShow = true
              item.signInShow = false
              item.rejectionShow = false
              item.cancelShow = false
              item.deliverGoodsShow = false
            }
            if (item.waybillStatus === 5) {
              item.waybillStatusName = '已完成'
              item.checkShow = true
              item.signInShow = false
              item.rejectionShow = false
              item.cancelShow = false
              item.deliverGoodsShow = false
            }
            if (item.waybillStatus === 6) {
              item.waybillStatusName = '已取消'
              item.checkShow = true
              item.signInShow = false
              item.rejectionShow = false
              item.cancelShow = false
              item.deliverGoodsShow = false
            }
            if (item.financeStatus === 1) {
              item.financeStatusName = '待收款'
            }
            if (item.financeStatus === 2) {
              item.financeStatusName = '待结算'
            }
            if (item.financeStatus === 3) {
              item.financeStatusName = '已完成'
            }
            if (item.financeStatus === 4) {
              item.financeStatusName = '待支付'
            }
            if (item.waybillStatus === null) {
              if (item.waybillType === 2) {
                item.checkShow = true
                item.signInShow = false
                item.rejectionShow = false
                item.cancelShow = false
                item.deliverGoodsShow = false
                item.waybillTypeName = '退货运单'
              }
            }
            if (item.waybillDeliveryType === 1) {
              item.waybillDeliveryType = '城配运单'
            }
            if (item.waybillDeliveryType === 2) {
              item.waybillDeliveryType = '自营调度运单'
            }
            if (item.waybillDeliveryType === 3) {
              item.waybillDeliveryType = '联营调度运单'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.form.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    // QueryListByStatus (val) { // 运单列表
    //   WaybillApiAjax.QueryListByStatus(val).then(res => {
    //     if (res.code === 200) {
    //       this.tableData = res.data.list.map(item => {
    //         if (item.waybillStatus === 1) {
    //           item.waybillStatusName = '待发货'
    //           item.checkShow = true
    //           item.signInShow = false
    //           item.rejectionShow = false
    //           item.cancelShow = true
    //           item.deliverGoodsShow = true
    //         }
    //         if (item.waybillStatus === 2) {
    //           item.waybillStatusName = '运输中'
    //           item.checkShow = true
    //           item.signInShow = true
    //           item.rejectionShow = true
    //           item.cancelShow = false
    //           item.deliverGoodsShow = false
    //         }
    //         if (item.waybillStatus === 3) {
    //           item.waybillStatusName = '已签收'
    //           item.checkShow = true
    //           item.signInShow = false
    //           item.rejectionShow = false
    //           item.cancelShow = false
    //           item.deliverGoodsShow = false
    //         }
    //         if (item.waybillStatus === 4) {
    //           item.waybillStatusName = '已拒签'
    //           item.checkShow = true
    //           item.signInShow = false
    //           item.rejectionShow = false
    //           item.cancelShow = false
    //           item.deliverGoodsShow = false
    //         }
    //         if (item.waybillStatus === 5) {
    //           item.waybillStatusName = '已完成'
    //           item.checkShow = true
    //           item.signInShow = false
    //           item.rejectionShow = false
    //           item.cancelShow = false
    //           item.deliverGoodsShow = false
    //         }
    //         if (item.waybillStatus === 6) {
    //           item.waybillStatusName = '已取消'
    //           item.checkShow = true
    //           item.signInShow = false
    //           item.rejectionShow = false
    //           item.cancelShow = false
    //           item.deliverGoodsShow = false
    //         }
    //         if (item.financeStatus === 1) {
    //           item.financeStatusName = '待收款'
    //         }
    //         if (item.financeStatus === 2) {
    //           item.financeStatusName = '待结算'
    //         }
    //         if (item.financeStatus === 3) {
    //           item.financeStatusName = '已完成'
    //         }
    //         if (item.financeStatus === 4) {
    //           item.financeStatusName = '待支付'
    //         }
    //         if (item.waybillStatus === null) {
    //           if (item.waybillType === 2) {
    //             item.checkShow = true
    //             item.waybillTypeName = '退货运单'
    //           }
    //         }
    //         return item
    //       })
    //       this.paginationParams.pageNum = res.data.currentPage
    //       this.form.currentPage = res.data.currentPage
    //       this.paginationParams.total = res.data.total
    //     }
    //   })
    // },
    queryLineNameList (val) { // 线路列表
      ShiftPlanAjax.queryLineNameList(val).then(res => {
        if (res.code === 200) {
          this.lineNameOptions = res.data
        }
      })
    },
    // shiftList (val) { // 班次列表
    //   WaybillApiAjax.shiftList(val).then(res => {
    //     if (res.code === 200) {
    //       this.ShiftOptions = res.data
    //     }
    //   })
    // },
    queryLogisticsList (val) { // 物流公司列表
      WaybillApiAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsOptions = res.data
        }
      })
    },
    getStationList (val) { // 物流公司下站点列表
      WaybillApiAjax.getStationList(val).then(res => {
        if (res.code === 200) {
          this.stationOptions = res.data
        }
      })
    },
    Signing (val) { // 签收
      WaybillApiAjax.Signing(val).then(res => {
        if (res.code === 200) {
          // let flag = this.$route.query.index
          // if (flag === '0') {
          //   this.queryAllList(this.form)
          // } else {
          //   this.QueryListByStatus(this.form)
          // }
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '签收成功！'
          })
        }
      })
    },
    Cancel (val) { // 取消运单
      WaybillApiAjax.Cancel(val).then(res => {
        if (res.code === 200) {
          // let flag = this.$route.query.index
          // if (flag === '0') {
          //   this.queryAllList(this.form)
          // } else {
          //   this.QueryListByStatus(this.form)
          // }
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '取消成功！'
          })
        }
      })
    },
    Reject (val) { // 拒收
      WaybillApiAjax.Reject(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          // let flag = this.$route.query.index
          // if (flag === '0') {
          //   this.queryAllList(this.form)
          // } else {
          //   this.QueryListByStatus(this.form)
          // }
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '拒收成功！'
          })
        }
      })
    },
    Transport (val) { // 发货
      WaybillApiAjax.Transport(val).then(res => {
        if (res.code === 200) {
          // let flag = this.$route.query.index
          // if (flag === '0') {
          //   this.queryAllList(this.form)
          // } else {
          //   this.QueryListByStatus(this.form)
          // }
          this.queryAllList(this.form)
          this.$notify({
            type: 'success',
            message: '发货成功！'
          })
        }
      })
    }

  },
  components: {
    VPagination,
    RejectDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.all-waybill{
  display: flex;
  flex: 1;
  //min-height: 768px;
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
