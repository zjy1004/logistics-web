<template>
  <div class="shiftPlan public_card">
    <!-- <h3 class="card_header">班次计划管理</h3> -->
    <div class="card_main">
      <div class="searchBar">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
            <el-form-item label="线路名称:" prop="lineId">
              <el-select v-model="form.lineId" filterable placeholder="全部" clearable>
                <el-option
                  v-for="(item, index) in lineNameOptions"
                  :key="index"
                  :label="item.lineName"
                  :value="item.lineId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:">
              <el-date-picker
                @change="changeDate"
                value-format="yyyy-MM-dd"
                v-model="form.businessDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="线路类型:" prop="runStatus">
              <el-select v-model="form.lineType" placeholder="请选择线路类型" clearable>
                <el-option
                  v-for="(item, index) in lineTypeOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运行状态:" prop="runStatus">
              <el-select v-model="form.runStatus" placeholder="请选择状态" clearable>
                <el-option
                  v-for="(item, index) in status"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="search-btn-con">
          <el-button @click="search" class="btn-main">查询</el-button>
        </div>
      </div>
      <div class="public_list">
        <div class="listHeader">
          <el-button @click="creatLine" v-if="creatLineBtnShow">+ 增加临时班次</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          stripe
          border>
          <el-table-column
            prop="lineName"
            label="线路名称"
            >
          </el-table-column>
          <el-table-column
            prop="temporaryDepartureTime"
            label="班次"
            >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="司机"
            >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            >
          </el-table-column>
          <el-table-column
            prop="lineTypeName"
            label="线路类型"
            >
          </el-table-column>
          <el-table-column
            prop="runStatusName"
            label="运行状态"
            >
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a class="edit" href="javascript:;" type="text" size="small" :class="{disabledEdit: !scope.row.editFlag}" @click="edit(scope.row)">修改</a>
            </template>
          </el-table-column>
        </el-table>
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
    <!-- <creat-shift-plan
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :lineNameOptionsArr="lineNameOptions"
      :CarsOptionsArr="CarsOptions"
      :DriversOptionsArr="DriversOptions"
      :editObjProps="editObj"
      :addFlagProps="addFlag"
    /> -->
    <creat-shift-plan
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :lineNameOptionsArr="[]"
      :CarsOptionsArr="CarsOptions"
      :DriversOptionsArr="DriversOptions"
      :editObjProps="editObj"
      :addFlagProps="addFlag"
    />
  </div>
</template>

<script>
import creatShiftPlan from './subpage/creatShiftPlan'
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'
import VPagination from '@/components/Pagination/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'shiftPlan',
  data () {
    return {
      clickSearch: false,
      creatLineBtnShow: true,
      status: [{id: 0, name: '未运行'}, {id: 1, name: '已运行'}],
      dialogVisible: false,
      querySchema: {
        lineId: '', // 线路名称
        businessDate: '', // 班次日期
        currentPage: 1, // 当前页
        pageSize: 10, // 每页条数
        runStatus: ''
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        lineId: '', // 线路名称
        businessDate: '', // 班次日期
        runStatus: '',
        lineType: '' // 线路类型
      },
      tableData: [],
      lineNameOptions: [], // 线路列表
      CarsOptions: [], // 汽车列表
      DriversOptions: [], // 司机列表
      logisticsList: [], // 物流公司
      editObj: {}, // 修改传子
      addFlag: '', // 新增修改标识
      lineTypeOptions: [
        {id: 1, name: '站点派车（客户线路）'},
        {id: 3, name: '自营同城调度线路'},
        {id: 4, name: '自营城际调度线路'},
        {id: 5, name: '联营同城调度线路'},
        {id: 6, name: '联营城际调度线路'}
      ]
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate']),
    ...mapGetters(['formatDate'])
  },
  created () {
    this.form.businessDate = this.formatCurrentDate()
    this.querySchema.businessDate = this.formatCurrentDate()
    // this.queryLineNameList()
    this.queryCarsList()
    // this.queryDriverList('1')
    this.queryList(this.querySchema)
    let logisticsId = JSON.parse(sessionStorage.getItem('userInfo')).logisticsId
    this.QueryLineSelectByLogisticsId({logisticsId: logisticsId})
  },
  methods: {
    changeDate () {
      let nowDate = new Date(this.formatDate(new Date())).getTime()
      let businessDate = new Date(this.form.businessDate).getTime()
      if (businessDate !== nowDate) {
        this.creatLineBtnShow = false
      } else {
        this.creatLineBtnShow = true
      }
    },
    search () {
      this.clickSearch = true
      this.querySchema.lineId = this.form.lineId
      this.querySchema.businessDate = this.form.businessDate
      this.querySchema.currentPage = 1
      this.querySchema.lineType = this.form.lineType
      this.queryList(this.querySchema)
    },
    edit (row) {
      if (!row.editFlag) {
        return
      }
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '修改班次信息'
      this.dialogWidth = '486px'
      this.editObj = row
      this.addFlag = 'edit'
    },
    creatLine () {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '增加临时班次'
      this.dialogWidth = '486px'
      this.addFlag = 'add'
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      if (flag === 'add') {
        this.insertShiftPlan(val)
      }
      if (flag === 'edit') {
        this.updateShiftPlan(val)
      }
    },
    changePageSize (pageSize) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = '1'
      this.queryList(this.querySchema)
    },
    changePage (pageSize, pageNum) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = pageNum
      this.queryList(this.querySchema)
    },
    // queryLineNameList (val) { // 线路列表
    //   ShiftPlanAjax.queryLineNameList(val).then(res => {
    //     if (res.code === 200) {
    //       this.lineNameOptions = res.data
    //     }
    //   })
    // },
    QueryLineSelectByLogisticsId (val) { // 查询物流公司下的所有线路下拉选择框（有线路类型）
      ShiftPlanAjax.QueryLineSelectByLogisticsId(val).then(res => {
        if (res.code === 200) {
          this.lineNameOptions = res.data
        }
      })
    },
    queryCarsList (val) { // 车辆列表
      ShiftPlanAjax.queryCarsList(val).then(res => {
        if (res.code === 200) {
          this.CarsOptions = res.data
        }
      })
    },
    queryDriverList (val) { // 司机列表
      ShiftPlanAjax.queryDriverList({lineType: val}).then(res => {
        if (res.code === 200) {
          this.DriversOptions = res.data
        }
      })
    },
    insertShiftPlan (val) { // 新增列表
      ShiftPlanAjax.insertShiftPlan(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
          this.queryList(this.querySchema)
        }
      })
    },
    updateShiftPlan (val) { // 修改列表
      ShiftPlanAjax.updateShiftPlan(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
          this.queryList(this.querySchema)
        }
      })
    },
    queryList (val) { // 班次计划列表
      val.runStatus = this.form.runStatus
      ShiftPlanAjax.queryList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            if (item.temporaryFlag === 1) {
              item.temporaryDepartureTime = item.departureTime + '（临时）'
            } else {
              item.temporaryDepartureTime = item.departureTime
            }
            if (item.runStatus === '0') {
              item.runStatusName = '未运行'
            }
            if (item.runStatus === '1') {
              item.runStatusName = '已运行'
            }
            if (item.lineType === 1) {
              item.lineTypeName = '站点派车（客户线路）'
            }
            if (item.lineType === 3) {
              item.lineTypeName = '自营同城调度线路'
            }
            if (item.lineType === 4) {
              item.lineTypeName = '自营城际调度线路'
            }
            if (item.lineType === 5) {
              item.lineTypeName = '联营同城调度线路'
            }
            if (item.lineType === 6) {
              item.lineTypeName = '联营城际调度线路'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    }
  },
  components: {
    creatShiftPlan,
    VPagination
  }
}
</script>
<style lang="less">
.shiftPlan {
  .el-date-editor {
    width: 168px !important;
}
 .search-btn-con{
  margin-top: 15px !important;
}
.disabledEdit{
  color: #E6E6E6;
}
.disabledEdit:hover {
  color: #E6E6E6 !important;
  text-decoration: none;
}
}
</style>

<style lang="less" scoped>
.shiftPlan {
  display: flex;
  flex: 1;
    .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
  .pagination {
    margin: 10px 0;
  }
  }
}
</style>
