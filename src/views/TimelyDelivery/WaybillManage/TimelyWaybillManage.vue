<template>
  <div class="timelyWaybillManage">
    <div class="public_card">
      <!-- <h3 class="card_header">待接收运单</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="发货方名称:" prop="sendClientName">
                <el-input v-model="form.sendClientName" placeholder="请输入发货方名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="发货方电话:" prop="sendClientPhone">
                <el-input v-model="form.sendClientPhone" placeholder="请输入发货方电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="收货方名称:" prop="receiveClientName">
                <el-input v-model="form.receiveClientName" placeholder="请输入收货方名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="员工:">
                <el-select v-model="form.driver" placeholder="请选择员工" clearable>
                  <el-option
                    v-for="(item, index) in driverOption"
                    :key="index"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运单号:" prop="waybillNumber">
                <el-input :title="form.waybillNumber" v-model="form.waybillNumber" placeholder="请输入运单号" clearable></el-input>
              </el-form-item>
              <el-form-item label="运输状态:">
                <el-select v-model="form.waybillStatus" placeholder="请选择运输状态" clearable>
                  <el-option
                    v-for="(item, index) in transportOption"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
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
                width="60">
              </el-table-column> -->
              <el-table-column
                width="60"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="sendClientName"
                label="发货方">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="sendClientPhone"
                label="发货方电话">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="receiveClientName"
                label="收货方">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="collectorName"
                label="揽收">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="senderName"
                label="派送">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="waybillNumber"
                label="运单号">
              </el-table-column>
              <el-table-column
                min-width="12%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="receivableGoods"
                label="代收货款">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="freight"
                label="运费">
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <a href="javascript:;" type="text" size="small" @click="check(scope.row)">查看</a>
                  <a href="javascript:;" type="text" size="small" v-if="scope.row.waybillStatus === 20" @click="Signing(scope.row)">签收</a>
                  <a href="javascript:;" type="text" size="small" v-if="scope.row.waybillStatus === 20" @click="rejection(scope.row)">拒收</a>
                  <a href="javascript:;" type="text" size="small" v-if="scope.row.waybillStatus === 20 || scope.row.waybillStatus === 10" @click="Cancel(scope.row)">取消</a>
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
          <reject-dialog
            v-if="dialogVisible"
            :title='dialogTitle'
            :width='dialogWidth'
            :dialogVisible="dialogVisible"
            @click-cancel="clickDialogCancel"
            @click-sure="clickDialogSure"
            :rejectInfo="rejectInfoObj"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import TimelyWaybillAjax from '@/api/TimelyDeliveryApi/TimelyWaybillManageApi'
import FreightCheckAjax from '@/api/TimelyDeliveryApi/FreightCheckApi'

import RejectDialog from './subpage/RejectDialog'
import SearchByName from '@/components/SearchByName/SearchByName'
import { mapGetters } from 'vuex'
export default {
  name: 'TimelyWaybillManage',
  data () {
    return {
      dialogVisible: false,
      dialogWidth: '', // 拒收弹窗宽度
      dialogTitle: '', // 拒收弹窗标题
      rejectInfoObj: {}, // 拒收信息
      driverOption: [{id: 1, name: '司机1'}, {id: 2, name: '司机2'}], // 司机下拉
      transportOption: [ // 类型下拉
        {id: '', name: '全部'},
        {id: 10, name: '待指派'},
        {id: 20, name: '运输中'},
        {id: 30, name: '已签收'},
        {id: 40, name: '已拒签'},
        {id: 50, name: '已取消'}
      ],
      form: {
        sendClientName: '', // 发货方名称
        sendClientPhone: '', // 发货方电话
        receiveClientName: '', // 收货方名称
        driver: '', // 司机Id
        waybillNumber: '', // 运单号
        waybillStatus: '', // 运输类型
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '' // 开单时间
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      clickSearch: false,
      tableData: [
      ],
      selection: []
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  components: {
    VPagination,
    SearchByName,
    RejectDialog
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
      this.queryDriverList()
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      TimelyWaybillAjax.QueryList(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.waybillStatus === 10) {
              item.waybillStatusName = '待指派'
            } else if (item.waybillStatus === 20) {
              item.waybillStatusName = '运输中'
            } else if (item.waybillStatus === 30) {
              item.waybillStatusName = '已签收'
            } else if (item.waybillStatus === 40) {
              item.waybillStatusName = '已拒签'
            } else if (item.waybillStatus === 50) {
              item.waybillStatusName = '已取消'
            } else {
              item.waybillStatusName = ''
            }
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    queryDriverList () { // 获取司机下拉
      FreightCheckAjax.QueryStaffList().then(res => {
        if (res.code === 200) {
          this.driverOption = res.data
        }
      })
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    // 重置
    resetForm () {
      this.$refs.form.resetFields()
      this.form.sendClientName = ''
      this.form.sendClientPhone = ''
      this.form.receiveClientName = ''
      this.form.driverId = ''
      this.form.waybillNumber = ''
      this.form.waybillStatus = ''
      this.form.createTime = ''
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
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
    // 导出excel
    exportExcel () {
      let exportParams = {}
      let waybillIdList = this.selection.map(item => {
        return item.waybillId
      }).join(',')
      this.form.waybillIdList = waybillIdList
      exportParams.queryParams = this.form
      exportParams.url = '/flash/flash/waybill/waybillManageFlashExports'
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
    rejection (row) { // 拒收
      this.dialogVisible = true
      this.dialogTitle = '拒收'
      this.dialogWidth = '486px'
      this.rejectInfoObj.flashWaybillId = row.flashWaybillId
      this.rejectInfoObj.subsidyFreight = row.subsidyFreight
    },
    clickDialogSure (val) {
      this.dialogVisible = false
      this.Reject(val)
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    Signing (row) { // 签收
      let flashWaybillIdList = []
      flashWaybillIdList.push(row.flashWaybillId)
      TimelyWaybillAjax.Signing({flashWaybillIdList}).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '签收成功！'
          })
          this.queryList(this.form)
        }
      })
    },
    Cancel (row) { // 取消运单
      TimelyWaybillAjax.Cancel({flashWaybillId: row.flashWaybillId}).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '取消成功！'
          })
          this.queryList(this.form)
        }
      })
    },
    Reject (val) { // 拒收
      TimelyWaybillAjax.Reject(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.queryList(this.form)
          this.$notify({
            type: 'success',
            message: '拒收成功！'
          })
        } else {
          this.dialogVisible = false
        }
      })
    },
    // 行查看
    check (row) {
      this.$router.push({name: 'TimelyWaybillDetail', query: {waybillTitle: '运单管理', waybillId: row.flashWaybillId, from: 'TimelyWaybillManage'}})
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.timelyWaybillManage{
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
@import '../../../style/base.less';
.timelyWaybillManage{
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
