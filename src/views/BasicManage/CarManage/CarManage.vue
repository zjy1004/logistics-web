<template>
  <div class="carManage public_card">
    <!-- <h3 class="card_header">车辆管理</h3> -->
    <div class="card_main">
      <div class="searchBar">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="100px">
            <!-- <el-form-item label="所属物流公司:" prop="logisticsName">
              <el-input v-model="form.logisticsName" placeholder="请输入物流公司"></el-input>
            </el-form-item> -->
            <el-form-item label="车牌号:" prop="carNumber">
              <el-input v-model="form.carNumber" placeholder="请输入车牌号" clearable></el-input>
            </el-form-item>
            <el-form-item label="车辆类型:" prop="carType">
              <el-select v-model="form.carType" filterable placeholder="全部" clearable>
                <el-option
                  v-for="(item, index) in carTypeOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="carStatus">
              <el-select v-model="form.carStatus" placeholder="全部" clearable>
                <el-option
                  v-for="(item, index) in options"
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
          <el-button @click="creatCar">+ 新建车辆</el-button>
        </div>
        <div class="table-con">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="'100%'"
          stripe
          border>
          <el-table-column
            prop="rowNum"
            label="序号"
            >
          </el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            >
          </el-table-column>
          <el-table-column
            prop="carStatusName"
            label="状态"
            >
          </el-table-column>
          <!-- <el-table-column
            prop="logisticsName"
            label="所属物流公司"
            >
          </el-table-column> -->
          <el-table-column
            prop="driverName"
            label="司机姓名"
            >
          </el-table-column>
          <el-table-column
            prop="carTypeName"
            label="车辆类型"
            >
          </el-table-column>
          <el-table-column
            prop="createPerson"
            label="创建员"
            >
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
              <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.carStatus ? '启用': '禁用'}}</a>
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
    <car-info
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :logisticsListArr="logisticsList"
      :editInfo="editInfoObj"
      :typeFlag="typeFlagStr"
    />
  </div>
</template>

<script>
import CarInfo from './subpage/CarInfo'
import CarManageAjax from '@/api/CarManage/CarManage'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'CarManage',
  data () {
    return {
      clickSearch: false,
      dialogVisible: false,
      querySchema: {
        // logisticsName: '', // 物流公司名称
        carNumber: '', // 车牌号
        carType: '', // 车辆类型
        carStatus: '', // 车辆状态
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      options: [{name: '启用', id: 0}, {name: '禁用', id: 1}],
      carTypeOptions: [
        {
          id: 1,
          name: '小型面包车'
        },
        {
          id: 2,
          name: '金杯'
        },
        {
          id: 3,
          name: '厢式货车'
        },
        {
          id: 4,
          name: '其他'
        }
      ],
      form: {
        // logisticsName: '', // 物流公司名称
        carNumber: '', // 车牌号
        carType: '', // 车辆类型
        carStatus: '' // 车辆状态
      },
      tableData: [],
      logisticsList: [], // 物流公司
      editInfoObj: {}, // 编辑信息
      typeFlagStr: '' // 当前弹框信息
    }
  },
  created () {
    this.QueryCrmCarList(this.querySchema)
    this.QueryLogisticsList()
  },
  methods: {
    search () {
      // this.querySchema.logisticsName = this.form.logisticsName
      this.clickSearch = true
      this.querySchema.carNumber = this.form.carNumber
      this.querySchema.carType = this.form.carType
      this.querySchema.carStatus = this.form.carStatus
      this.querySchema.currentPage = 1
      this.QueryCrmCarList(this.querySchema)
    },
    creatCar () {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '车辆信息'
      this.dialogWidth = '486px'
      this.typeFlagStr = 'add'
    },
    edit (val) {
      this.editInfoObj = val
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '车辆信息'
      this.dialogWidth = '486px'
      this.typeFlagStr = 'update'
    },
    enable (val) {
      let obj = {}
      obj.id = val.id
      if (val.carStatus) {
        obj.status = 0
      } else {
        obj.status = 1
      }
      this.updateCarStatus(obj)
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      if (flag === 'update') {
        this.updateCrmCar(val)
      }
      if (flag === 'add') {
        this.InsertCrmCar(val)
      }
    },
    changePageSize (pageSize) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = '1'
      this.QueryCrmCarList(this.querySchema)
    },
    changePage (pageSize, pageNum) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = pageNum
      this.QueryCrmCarList(this.querySchema)
    },
    QueryCrmCarList (val) { // 车辆管理列表
      CarManageAjax.QueryCrmCarList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1
            if (item.carStatus === 0) {
              item.carStatusName = '启用'
            }
            if (item.carStatus === 1) {
              item.carStatusName = '禁用'
            }
            if (item.carType === '1') {
              item.carTypeName = '小型面包车'
            }
            if (item.carType === '2') {
              item.carTypeName = '金杯'
            }
            if (item.carType === '3') {
              item.carTypeName = '厢式货车'
            }
            if (item.carType === '4') {
              item.carTypeName = '其他'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    QueryLogisticsList (val) { // 物流公司列表
      CarManageAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    InsertCrmCar (val) { // 新增车辆
      CarManageAjax.InsertCrmCar(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.QueryCrmCarList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
        }
      })
    },
    updateCrmCar (val) { // 新增车辆
      CarManageAjax.updateCrmCar(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.QueryCrmCarList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    },
    updateCarStatus (val) { // 禁用/启用车辆
      CarManageAjax.updateCarStatus(val).then(res => {
        if (res.code === 200) {
          this.QueryCrmCarList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
      })
    }
  },
  components: {
    CarInfo,
    VPagination
  }
}
</script>
<style lang="less">
.carManage {
 .search-btn-con{
  margin-top: 15px !important;
}
}
</style>

<style lang="less" scoped>
.carManage {
  display: flex;
  flex: 1;
  .public_list{
    display: flex;
    flex: 1;
    flex-direction: column;
  .table-con {
    display: flex;
    flex: 1;
  }
  }
  .pagination {
    margin: 10px 0;
  }
}
</style>
