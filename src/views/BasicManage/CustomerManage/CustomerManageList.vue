<template>
  <div class="customer-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">客户管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="服务物流公司:" prop="pkLogistics" v-if="isAdmin">
                <el-select v-model="form.pkLogistics" filterable placeholder="请选择服务物流公司" clearable @change="changeLogistics(form.pkLogistics)">
                  <el-option
                    v-for="(item, index) in pkLogisticsOptions"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户名称:" prop="clientName">
                <el-input v-model="form.clientName" placeholder="请输入客户名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="客户角色:" prop="clientType">
                <el-select v-model="form.clientType" filterable placeholder="请选择客户角色" clearable>
                  <el-option
                    v-for="(item, index) in clientTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服务站点:" prop="pkStation">
                <el-select v-model="form.pkStation" @change="stationChange" filterable placeholder="请选择服务站点" clearable>
                  <el-option
                    v-for="(item, index) in pkStationOptions"
                    :key="index"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="配送线路:" prop="pkLine">
                <el-select v-model="form.pkLine" placeholder="请选择配送线路" clearable>
                  <el-option
                    v-for="(item, index) in pkLineOptions"
                    :key="index"
                    :label="item.lineName"
                    :value="item.lineId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="状态:" prop="clientStatus">
                <el-select v-model.number="form.clientStatus" placeholder="请选择状态" clearable>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结算方式:" prop="freightSettlementMethod">
                <el-select v-model.number="form.freightSettlementMethod" placeholder="请选择结算方式" clearable>
                  <el-option
                    v-for="(item, index) in freightSettlementMethodOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户位置:">
                <el-select v-model.number="form.provinceCode" filterable placeholder="请选择省" @change="changeProvince(form.provinceCode)" clearable>
                  <el-option
                    v-for="(item, index) in areaPList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
                -
                <el-select v-model.number="form.cityCode" filterable placeholder="请选择市" @change="changeCity(form.cityCode)" clearable>
                  <el-option
                    v-for="(item, index) in areaCList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
                -
                <el-select v-model.number="form.areaCode" filterable placeholder="请选择区/县" clearable>
                  <el-option
                    v-for="(item, index) in areaQList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="资金帐户:" prop="">
                <el-select v-model.number="form.isOpen" placeholder="请选择资金账户状态" clearable>
                  <el-option
                    v-for="(item, index) in registerStateOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-con">
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button @click="add" v-if="!isAdmin">+ 新建客户</el-button>
            <el-button @click="disableRow" v-if="!isAdmin">禁用</el-button>
            <el-button v-if="false" class="downloadTemplate"><a :href="downloadUrl">下载模板</a></el-button>
            <el-button class="downloadTemplate" @click="exportExcel" v-if="!isAdmin">导出</el-button>
            <el-upload
              v-if="false"
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
              :show-file-list="false"
              :file-list="fileList">
              <el-button class="upload-btn" size="small" @click="order(scope.row)">上传</el-button>
            </el-upload>
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
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="编号">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.rowNum}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="clientName"
                label="客户名称">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.clientName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="phone"
                label="联系电话">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.phone}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="clientTypeName"
                label="角色">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.clientTypeName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showAreaAndLogistics"
                min-width="20%"
                prop="addressStr"
                label="所在区域">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.addressStr}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showAreaAndLogistics"
                min-width="20%"
                prop="logisticsName"
                label="服务物流公司">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.logisticsName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="stationName"
                label="服务站点">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.stationName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="stationName"
                label="配送线路">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.lineName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="8%"
                prop="freightSettlementMethod"
                label="结算方式">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.freightSettlementMethod}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="clientStatusName"
                label="状态">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.clientStatusName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="isOpenText"
                label="资金账户">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.isOpenText}}</span>
                </template>
              </el-table-column>
              <el-table-column
                min-width="7%"
                prop="accounts"
                label="关联账号">
                <template slot-scope="scope">
                  <span :class="{'noPerfectCol': scope.row.perfectFlag === 1}">{{scope.row.accounts}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="queryDetail(scope.row)">查看</a>
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改信息</a>
                  <a class="enable" href="javascript:;" type="text" size="small" @click="enable(scope.row)">{{scope.row.clientStatus ? '启用': '禁用'}}</a>
                  <el-button :disabled="scope.row.isOpen === 1" type="text" @click="closeOnlinePay(scope.row)">关闭驮付宝</el-button>
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
    <v-dialog
      v-if="closeOnlinePayShow"
      title="提示"
      :width="'486px'"
      :closeShow="false"
      mainText="你正在进行关闭驮付宝操作，关闭后该客户运单不再使用驮付宝线上清分结算，是否确定操作?"
      :closeClickModal="false"
      :dialogVisible="closeOnlinePayShow"
      @click-cancel="clickCancel('closeOnlinePayShow')"
      @click-sure="clickSure('closeOnlinePayShow')"
    />
  </div>
</template>

<script>
import VPagination from '@/components/Pagination/Pagination'
import CustomerManageAjax from '@/api/CustomerManage/CustomerManage'
import SiteManageAjax from '@/api/SiteManage/SiteManage'
import VDialog from '@/components/Dialog/Dialog'
export default {
  data () {
    return {
      closeOnlinePayShow: false,
      closeParam: {},
      clickSearch: false,
      showAreaAndLogistics: false,
      form: {
        clientName: '', // 客户名称
        phone: '', // 联系电话
        clientType: '', // 客户类型(角色)
        pkLogistics: '', // 物流公司id
        pkStation: '', // 所属站点id
        pkLine: '', // 线路id
        provinceCode: '', // 省
        cityCode: '', // 市
        areaCode: '', // 区
        clientStatus: '', // 状态
        freightSettlementMethod: '', // 运费结算方式
        isOpen: ''
      },
      querySchema: {
        freightSettlementMethod: '', // 运费结算方式
        clientName: '', // 客户名称
        phone: '', // 联系电话
        clientType: '', // 客户类型(角色)
        pkLogistics: '', // 物流公司id
        pkStation: '', // 所属站点id
        provinceCode: '', // 省
        cityCode: '', // 市
        areaCode: '', // 区
        clientStatus: '', // 状态
        currentPage: 1, // 当前页
        pageSize: 10, // 每页条数
        isOpen: ''
      },
      clientTypeOptions: [
        {id: 1, name: '修理厂'},
        {id: 2, name: '经销商'}
      ],
      freightSettlementMethodOptions: [
        {id: 1, name: '现结'},
        {id: 2, name: '月结'},
        {id: 3, name: '包月'}
      ],
      registerStateOptions: [
        {id: '', name: '全部'},
        {id: 0, name: '已开通'},
        {id: 1, name: '未开通'}
      ],
      areaPList: [],
      areaCList: [],
      areaQList: [],
      companyOptions: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      multipleSelection: [],
      tableData: [],
      pkLogisticsOptions: [],
      pkStationOptions: [],
      pkLineOptions: [],
      downloadUrl: `${process.env.API_BASE_URL}/crm/clientManageController/downloadExcelTemplate`,
      actionUrl: `${process.env.API_BASE_URL}/crm/clientManageController/importExcel`,
      autoUpload: true,
      limit: 1,
      fileList: [],
      typeError: false
    }
  },
  components: {
    VDialog,
    VPagination
  },
  created () {
    this.getUserType()
    this.getLogisticsList()
    this.getPkLogistics()
    this.queryClientList(this.querySchema)
    let obj = {}
    obj.areaParentCode = 0
    this.QueryAreaList(obj, 'province')
  },
  computed: {
    provinceCode () {
      return this.form.provinceCode
    },
    cityCode () {
      return this.form.cityCode
    },
    headers () {
      let headers = {}
      let token = sessionStorage.getItem('token')
      if (token) {
        headers['token'] = `${token}`
      }
      return headers
    },
    isAdmin () {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo.userType === 0) { // 超级管理员
        return true
      } else {
        return false
      }
    },
    exportUrl () {
      let selectIds = this.multipleSelection.map(item => {
        return item.clientId
      }).join(',')
      return `${process.env.API_BASE_URL}/crm/clientManageController/exportExcel?token=${sessionStorage.getItem('token')}&clientIdList=${selectIds}`
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.areaPList.forEach(item => {
          if (this.form.cityCode !== item) {
            this.form.cityCode = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.areaCList.forEach(item => {
          if (this.form.areaCode !== item) {
            this.form.areaCode = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'area')
      }
    }
  },
  methods: {
    clickCancel (flag) { // 弹框取消
      if (flag === 'closeOnlinePayShow') {
        this.closeOnlinePayShow = false
      }
    },
    clickSure (flag) { // 弹框确定
      if (flag === 'closeOnlinePayShow') {
        this.closeOnlinePayAjax(this.closeParam)
      }
    },
    getUserType () {
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        let userInfoObj = JSON.parse(userInfo)
        if (userInfoObj.companyType === 3) { // 运营登录显示所在区域和服务物流公司列
          this.showAreaAndLogistics = true
        }
      }
    },
    // 站点变化查线路
    stationChange (val) {
      CustomerManageAjax.queryClientLineListByStationId({stationId: val}).then(res => {
        if (res.code === 200) {
          this.form.pkLine = ''
          this.pkLineOptions = res.data
        }
      })
    },
    changeLogistics (val) { // 物流公司管理员（选择物流公司站点的变化）
      this.form.pkStation = ''
      this.getPkLogistics({logisticsId: val})
    },
    search () {
      this.clickSearch = true
      this.querySchema.clientName = this.form.clientName
      this.querySchema.phone = this.form.phone
      this.querySchema.clientType = this.form.clientType
      this.querySchema.pkLogistics = this.form.pkLogistics
      this.querySchema.pkStation = this.form.pkStation
      this.querySchema.pkLine = this.form.pkLine
      this.querySchema.provinceCode = this.form.provinceCode
      this.querySchema.cityCode = this.form.cityCode
      this.querySchema.areaCode = this.form.areaCode
      this.querySchema.clientStatus = this.form.clientStatus
      this.querySchema.freightSettlementMethod = this.form.freightSettlementMethod
      this.querySchema.isOpen = this.form.isOpen
      this.querySchema.currentPage = 1
      this.queryClientList(this.querySchema)
    },
    add () {
      this.$router.push({path: '/basic-manage/creat-customer', query: {type: 'add', clientType: ''}})
    },
    edit (val) {
      this.$router.push({path: '/basic-manage/creat-customer', query: {id: val.clientId, type: 'edit', clientType: val.clientType}})
    },
    queryDetail (val) {
      this.$router.push({path: '/basic-manage/creat-customer', query: {id: val.clientId, type: 'check', clientType: val.clientType}})
    },
    enable (row) {
      let obj = {}
      obj.clientIdList = row.clientId
      if (row.clientStatus === 1) {
        obj.clientStatus = 0
      } else {
        obj.clientStatus = 1
      }
      this.updateClientManageStatus(obj)
    },
    closeOnlinePay (row) { // 关闭驮付宝
      this.closeParam = {
        clientId: row.clientId,
        currentClearingFunds: row.currentClearingFunds,
        fundsAccountFlag: 2
      }
      this.closeOnlinePayShow = true
    },
    closeOnlinePayAjax (val) { // 关闭驮付宝请求
      CustomerManageAjax.setOrCancelFundsAccount(val).then(res => {
        if (res.code === 200) {
          this.closeOnlinePayShow = false
          this.$notify({
            type: 'success',
            message: '关闭成功'
          })
          this.queryClientList(this.querySchema)
        }
      })
    },
    disableRow () {
      if (this.multipleSelection < 1) {
        this.$notify({
          type: 'error',
          message: '请您选择要禁用的行!'
        })
      } else {
        let obj = {}
        obj.clientIdList = this.multipleSelection.map(item => {
          return item.clientId
        })
        obj.clientStatus = 1
        this.updateClientManageStatus(obj)
      }
    },
    changePage (pageSize, pageNumber) {
      this.querySchema.pageSize = pageSize
      this.querySchema.currentPage = pageNumber
      this.queryClientList(this.querySchema)
    },
    changePageSize (pageSize) {
      this.querySchema.pageSize = pageSize
      this.queryClientList(this.querySchema)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeProvince (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'city')
    },
    changeCity (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'area')
    },
    queryClientList (val) { // 获取站点管理列表
      CustomerManageAjax.queryClientList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1
            // if (item.onlinePaySwith === 0 && item.accountApplicationStatus >= 3) { // 已开通已注册
            //   item.accountOpenAndRegisterStatus = '已开通已注册'
            // } else if (item.onlinePaySwith === 0 && (item.accountApplicationStatus < 3 || item.accountApplicationStatus === null)) {
            //   item.accountOpenAndRegisterStatus = '已开通未注册'
            // } else if (item.onlinePaySwith === 1 && (item.accountApplicationStatus < 3 || item.accountApplicationStatus === null)) {
            //   item.accountOpenAndRegisterStatus = '未开通未注册'
            // } else if (item.onlinePaySwith === 1 && item.accountApplicationStatus >= 3) {
            //   item.accountOpenAndRegisterStatus = '未开通已注册'
            // }
            if (item.isOpen === 0) {
              item.isOpenText = '已开通'
            } else {
              item.isOpenText = '未开通'
            }
            if (item.clientStatus === 0) {
              item.clientStatusName = '启用'
            }
            if (item.clientStatus === 1) {
              item.clientStatusName = '禁用'
            }
            if (item.clientType === 1) {
              item.clientTypeName = '修理厂'
            }
            if (item.clientType === 2) {
              item.clientTypeName = '经销商'
            }
            if (item.freightSettlementMethod === 1 || item.freightSettlementMethod === '4') {
              item.freightSettlementMethod = '现结'
            }
            if (item.freightSettlementMethod === 2) {
              item.freightSettlementMethod = '月结'
            }
            if (item.freightSettlementMethod === 3) {
              item.freightSettlementMethod = '包月'
            }
            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    QueryAreaList (val, flag) { // 省市
      SiteManageAjax.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaCList = res.data
          }
          if (flag === 'area') {
            this.areaQList = res.data
          }
        }
      })
    },
    updateClientManageStatus (val) { // 禁用/启用站点
      CustomerManageAjax.updateClientManageStatus(val).then(res => {
        if (res.code === 200) {
          this.queryClientList(this.querySchema)
          this.$notify({
            type: 'success',
            message: '更新成功！'
          })
        }
      })
    },
    getLogisticsList (val) { // 查询物流公司
      CustomerManageAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.pkLogisticsOptions = res.data
        }
      })
    },
    getPkLogistics (val) { // 查询物流公司、站点下拉框信息
      CustomerManageAjax.getPkLogistics(val).then(res => {
        if (res.code === 200) {
          this.pkStationOptions = res.data
        }
      })
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
    },
    exportExcel () {
      window.location.href = this.exportUrl
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.customer-manage{
  .noPerfectCol{
    color: #f00;
  }
  button.el-button.is-disabled, button.el-button.is-disabled:hover, button.el-button.is-disabled:focus{
    color: #bbb!important;
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.customer-manage{
  display: flex;
  flex: 1;
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
  .downloadTemplate{
    a{
      font-size: 12px;
    }
  }
  .upload{
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
