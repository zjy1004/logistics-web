<template>
  <div class="deliveryTask">
    <div class="public_card">
      <div class="card_main">
        <div class="left">
          <AssignTask
            :idProps = ididProps
            @call-back-flag = 'callBackFlag'
          />
        </div>
        <div class="right">
          <div class="search-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="70px">
              <el-row>
                <el-col :span="1">
                  <el-form-item label='' class="date-item">
                    <span class="refreshCss"  @click="search()"></span>
                  </el-form-item>
                </el-col>
                <el-col :span="15">
                  <el-form-item class="date-item" label="开单时间:" prop="time">
                    <el-date-picker
                      style="width: 360px;"
                      v-model="dateValue"
                      type="daterange"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-form-item label=''>
                    <el-input class="inputWidth" v-model="form.driverName" placeholder="运单号/司机" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" :offset="4">
                  <el-form-item class="date-item">
                    <el-button @click="search()">搜索</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="100%"
              border>
              <el-table-column
                min-width="6%"
                prop="rowNum"
                label="序号">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.rowNum}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="waybillNumber"
                label="运单号">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.waybillNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="collectorName"
                label="揽收">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.collectorName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="senderName"
                label="配送">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.senderName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip=true
                min-width="15%"
                prop="sendClientAddress"
                label="发货方地址">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.sendClientAddress}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="sendClientPhone"
                label="发货方电话">
                <template slot-scope="scope">
                  <span :class="{'highColor': currentEditRowId === scope.row.id}">{{scope.row.sendClientPhone}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" :class="{'disabledColor': currentEditRowId === scope.row.id}" type="text" size="small" @click="edit(scope.row)">修改</a>
                  <a class="edit" href="javascript:;" :class="{'disabledColor': currentEditRowId === scope.row.id}" type="text" size="small" @click="cancle(scope.row)">取消</a>
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
          <v-dialog
            v-if="dialogVisible"
            title="取消"
            :width="'486px'"
            mainText="是否确定取消该任务？"
            :closeClickModal="false"
            :dialogVisible="dialogVisible"
            @click-cancel="clickCancel"
            @click-sure="clickSure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import AssignTask from './subpage/AssignTask'
import CreateTasksAjax from '@/api/TimelyDeliveryApi/CreateTasksApi'
import VDialog from '@/components/Dialog/Dialog'

export default {
  name: 'DeliveryTask',
  components: {
    VPagination,
    AssignTask,
    VDialog
  },
  data () {
    return {
      currentEditRowId: '',
      dialogVisible: false,
      cancelId: '',
      ididProps: '',
      tableData: [],
      form: {
        driverName: '',
        startTime: '', // 到账时间起
        endTime: '', // 到账时间止
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      clickSearch: false,
      dateValue: '',
      paginationParams: {pageSize: 10, total: 0, pageNum: 1}

    }
  },
  watch: {
    dateValue (newVal, oldVal) {
      if (!newVal) {
        this.form.startTime = ''
        this.form.endTime = ''
      } else {
        this.form.startTime = newVal[0]
        this.form.endTime = newVal[1]
      }
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    callBackFlag (val) {
      if (val === 'true') { // 指派成功刷新页面
        this.queryList()
        this.ididProps = ''
        this.currentEditRowId = ''
      }
    },
    // 查询
    search () {
      this.queryList('searchBtn')
    },
    queryList (type) {
      let queryParam = Object.assign({}, this.form)
      queryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      queryParam.pageSize = this.paginationParams.pageSize
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      CreateTasksAjax.QueryWaybillSendTask(queryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map((item, index) => {
            item.rowNum = index + 1
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.form.currentPage = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    edit (val) {
      if (this.currentEditRowId === val.id) {
        return false
      }
      this.ididProps = val.id
      this.currentEditRowId = val.id
    },
    cancle (val) {
      if (this.currentEditRowId === val.id) {
        return false
      }
      this.cancelId = val.id
      this.dialogVisible = true
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
    clickSure (val) {
      CreateTasksAjax.CancelSendTask({flashWaybillId: this.cancelId}).then((response) => {
        if (response.code === 200) {
          this.dialogVisible = false
          this.$notify({
            message: '取消成功！',
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    clickCancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.deliveryTask {
  display: flex;
  flex: 1;
  .card_main{
    display: flex;
    flex: 1;
    flex-direction: row;
    background: none;
    .left {
      display: flex;
      padding: 20px 20px;
      flex: 1;
      background: #ffffff;
    }
    .right {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      padding: 20px 20px;
      flex: 1;
      background: #ffffff;
      .refreshCss {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(../../../image/refresh.png);
        background-size: 100% 100%;
        cursor: pointer;
      }
      .search-con{
        margin: 20px 0;
        height: 40px;
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
  .disabledColor{
    color: #aaa!important;
  }
  .highColor{
    color: #f00;
  }
}
</style>
