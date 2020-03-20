<template>
  <div class="route-list">
    <div class="public_card">
      <h3 class="card_header">线路管理</h3>
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="线路名称:" prop="lineName">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" clearable></el-input>
              </el-form-item>
              <!-- <el-form-item label="途径站点:" prop="departureStation">
                <el-input v-model="form.departureStation" placeholder="请输入途径站点" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="归属站点:" prop="departureStation">
                <el-select v-model="form.departureStation" filterable placeholder="请选择归属站点" clearable>
                  <el-option
                    v-for="(item, index) in pkDepartureStationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="线路种类:" prop="lineType">
                <el-select v-model="form.lineType" filterable placeholder="请选择线路种类" clearable>
                  <el-option
                    v-for="(item, index) in pklineTypeOptions"
                    :key="index"
                    :label="item.typeName"
                    :value="item.typeId">
                  </el-option>
                </el-select>
              </el-form-item> -->
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button @click="add">+ 新建线路</el-button>
            <el-button v-if="isAdmin" class="downloadTemplate"><a :href="downloadUrl">下载模板</a></el-button>
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
                min-width="10%"
                prop="lineName"
                label="线路名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="logisticsName"
                label="所属物流公司">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="departureStation"
                label="线路归属站点">
              </el-table-column>
              <!-- <el-table-column
                min-width="20%"
                prop="lineTypeName"
                label="线路种类">
              </el-table-column> -->
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <el-upload
                    ref="upload"
                    class="upload"
                    :action="actionUrl"
                    :auto-upload="autoUpload"
                    accept=".xlsx,.xls"
                    multiple="multiple"
                    :limit="limit"
                    :headers="headers"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-change="fileChange"
                    :on-remove="fileRemove"
                    :data="rowData"
                    :show-file-list="false"
                    :file-list="fileList">
                    <el-button v-if="isAdmin" class="upload-btn" size="small" type="primary" @click="order(scope.row)">上传</el-button>
                  </el-upload>
                  <!-- <a href="javascript:;" type="text" size="small" @click="checkOrder(scope.row)">参考配送顺序</a> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-pagination
            :pageSize=paginationParams.pageSize
            :total=paginationParams.total
            :currentPage=paginationParams.pageNum
            :className="'basicParamPagination'"
            :dom="this.$refs.form"
            :clickSearch="clickSearch"
            @change-page-size="changePageSize"
            @change-page="changePage"
            class="pagination"
          />
          <check-order
            v-if="checkOrderShow"
            :dialogVisible="checkOrderShow"
            :id="lineId"
            @click-cancel-form="checkOrderShow = false"
            @click-sure-form="checkOrderSure"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import LogisticsStaffAjax from '@/api/LogisticsStaffManage/LogisticsStaffManage'
import RouteAjax from '@/api/RouteManage/RouteManage'
import VPagination from '@/components/Pagination/Pagination'
import CheckOrder from './subpage/CheckOrder'
let logisticsId
export default {
  name: 'RouteList',
  data () {
    return {
      clickSearch: false,
      // companyOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        lineName: '',
        departureStation: '',
        lineType: ''
        // logisticsId: '',
        // driver: '',
        // enableFlag: ''
      },
      pklineTypeOptions: [
        {
          typeName: '站点派车',
          typeId: '1'
        },
        {
          typeName: '站点自取',
          typeId: '2'
        }
      ], // 线路种类集合
      pkDepartureStationOptions: [
        {
          typeName: '站点1',
          typeId: '1'
        },
        {
          typeName: '站点2',
          typeId: '2'
        },
        {
          typeName: '站点3',
          typeId: '3'
        }
      ], // 归属站点集合
      tableData: [],
      actionUrl: `${process.env.API_BASE_URL}/waybill/lineDeliveryOrderController/importExcel`,
      autoUpload: true,
      limit: 1,
      fileList: [],
      typeError: false,
      rowData: {
        lineId: ''
      },
      lineId: '',
      checkOrderShow: false,
      downloadUrl: `${process.env.API_BASE_URL}/waybill/lineDeliveryOrderController/downloadExcelTemplate`
    }
  },
  created () {
    this.init()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      logisticsId = JSON.parse(userInfo).logisticsId
    }
  },
  computed: {
    headers () {
      let headers = {}
      let token = sessionStorage.getItem('token')
      if (token) {
        headers['token'] = `${token}`
      }
      return headers
    },
    isAdmin () {
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo.userType === 0) { // 超级管理员
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    init () {
      // this.queryLogisticsList()
      this.queryList()
      this.queryStations()
    },
    // queryLogisticsList () {
    //   LogisticsStaffAjax.GetLogisticsAndAccount().then(response => {
    //     if (response.code === 200) {
    //       this.companyOptions = response.data
    //     }
    //   })
    // },
    queryStations () {
      RouteAjax.QueryStations({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.pkDepartureStationOptions = response.data
        }
      })
    },
    queryList (type) {
      let lineQueryParam = Object.assign({}, this.form)
      lineQueryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      lineQueryParam.pageSize = this.paginationParams.pageSize
      RouteAjax.QueryList(lineQueryParam).then(response => {
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
    changePage (pageSize, pageNumber) {
      this.paginationParams.pageNum = pageNumber
      this.queryList()
    },
    changePageSize (pageSize) {
      this.paginationParams.pageNum = 1
      this.paginationParams.pageSize = pageSize
      this.queryList()
    },
    search () {
      this.queryList('searchBtn')
    },
    edit (row) { // 修改信息
      this.$router.push({name: 'RouteCard', query: { isAdd: false, id: row.id, activeName: 'second' }})
    },
    add () { // 新建线路
      this.$router.push({name: 'RouteCard', query: { isAdd: true, activeName: 'first' }})
    },
    order (row) {
      this.fileList = []
      this.typeError = false
      this.rowData.lineId = row.id
    },
    // 参考配送顺序
    checkOrder (row) {
      this.lineId = row.id
      this.checkOrderShow = true
    },
    checkOrderSure () {
      this.checkOrderShow = false
    },
    fileChange (file, fileList) {
      if (this.typeError) {
        this.fileList = []
        this.typeError = false
      } else {
        this.fileList = fileList
      }
    },
    fileRemove (file, fileList) {
      this.errorMessage = ''
      this.fileList = fileList
    },
    uploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$notify({
          message: '上传成功！',
          type: 'success'
        })
        this.typeError = false
        this.fileList = []
      } else {
        this.$notify({
          message: '上传失败！',
          type: 'error'
        })
        this.typeError = true
        this.fileList = []
      }
    },
    uploadError (err, file, fileList) {
      console.log(err, file, fileList)
      this.$notify({
        message: '上传失败！',
        type: 'error'
      })
      this.typeError = true
      this.fileList = []
    }
  },
  components: {
    VPagination,
    CheckOrder
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.route-list{
  .edit,.upload{
    display: inline-block;
  }
  .upload{
    .el-button{
      span{
        font-size: 14px;
        color: #5677fc;
      }
    }
  }
  .downloadTemplate{
    a{
      font-size: 12px;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.route-list{
  display: flex;
  flex: 1;
  .searchBar{
    -min-height: 130px!important;
  }
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
  .search-btn-con{
    margin-top: 15px!important;
  }
  .edit,.upload-btn{
    display: inline-block;
  }
}
</style>
