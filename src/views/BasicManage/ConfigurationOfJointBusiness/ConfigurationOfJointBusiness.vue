<template>
  <div class="joint-operation-list">
    <div class="public_card">
      <!-- <h3 class="card_header">联营业务配置</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="物流公司简称:" prop="logisticsName">
                <el-select v-model="form.logisticsName" placeholder="请选择物流公司" filterable clearable>
                  <el-option
                    v-for="(item, index) in logisticsList"
                    :key="index"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
              </el-form-item>
              <el-form-item label="区域:">
                <el-select v-model="form.provinceName" filterable placeholder="请选择省" @change="changeP(form.provinceName)" clearable>
                  <el-option
                    v-for="(item, index) in areaPList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
                -
                <el-select v-model="form.cityName" filterable placeholder="请选择市" clearable>
                  <el-option
                    v-for="(item, index) in areaCList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
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
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border
              @expand-change="expandRow">
              <el-table-column type="expand">
                <template>
                  <div class="table-con subTable">
                    <el-table
                      :data="subTableData"
                      style="width: 100%"
                      stripe
                      height="'100%'"
                      border>
                      <el-table-column
                        :render-header="add"
                        width="80"
                        prop="rowNum"
                        label="+">
                      <template slot-scope="scope">
                        <el-button class="check" href="javascript:;" type="text" size="small" :disabled="scope.row.Relation" @click="delRow(scope.row)">-</el-button>
                      </template>
                      </el-table-column>
                      <el-table-column
                        width="80"
                        prop="rowNum"
                        label="序号">
                      </el-table-column>
                      <el-table-column
                        min-width="10%"
                        prop="logisticsName"
                        label="物流公司名称">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.logisticsName" placeholder="请选择物流公司" clearable filterable :disabled="scope.row.Relation" @change="changeSubLogistics(scope.row.logisticsName)">
                            <el-option
                              v-for="(item, index) in subLogisticsList"
                              :key="index"
                              :label="item.logisticsName"
                              :value="item.logisticsId">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        min-width="15%"
                        prop="operateAddress"
                        label="所在区域（市）">
                      </el-table-column>
                      <el-table-column
                        min-width="15%"
                        prop="phone"
                        label="联系电话">
                      </el-table-column>
                      <el-table-column
                        min-width="15%"
                        prop="relationStatus"
                        label="联营状态">
                      </el-table-column>
                      <el-table-column
                        fixed="right"
                        label="操作"
                        width="240">
                      <template slot-scope="scope">
                        <a class="check" href="javascript:;" type="text" size="small" v-if="!scope.row.Relation" @click="relation(scope.row)">关联</a>
                        <a class="check" href="javascript:;" type="text" size="small" v-if="scope.row.Relation" @click="cancelRelation(scope.row)">取消关联</a>
                      </template>
                    </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="logisticsName"
                label="物流公司名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="operateAddress"
                label="所在区域（市）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="phone"
                label="联系电话">
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
import RelationManager from '@/api/RelationManager/RelationManager'
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'
import SiteManageAjax from '@/api/SiteManage/SiteManage'

export default {
  name: 'ConfigurationOfJointBusiness',
  data () {
    return {
      clickSearch: false,
      logisticsList: [],
      subLogisticsList: [],
      companyOptions: [],
      areaPList: [],
      areaCList: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      form: {
        'cityName': '',
        'logisticsName': '',
        'logisticsStatus': '',
        'phone': '',
        'provinceName': ''
      },
      tableData: [],
      tableDataAll: [],
      subTableData: [],
      multipleSelection: [],
      querySchema: {
        'cityName': '',
        'logisticsName': '',
        'logisticsStatus': '',
        'phone': '',
        'provinceName': '',
        currentPage: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      saveParam: {
        pkLogisticsInitiate: '', // 发起物流公司
        pkLogisticsRelation: '', // 关联物流公司
        relationStatus: '' // 关联状态
      }
    }
  },
  created () {
    this.QueryList(this.querySchema)
    this.QueryLogisticsList()
    this.QueryAllList()
    let obj = {}
    obj.areaParentCode = 0
    this.QueryAreaList(obj, 'province')
  },
  computed: {
    provinceCode () {
      return this.form.provinceName
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.areaPList.forEach(item => {
          if (this.form.cityName !== item) {
            this.form.cityName = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    }
  },
  methods: {
    changeP (val) {
      let obj = {}
      obj.areaParentCode = val
      this.QueryAreaList(obj, 'city')
    },
    add (h, {column, $index}) {
      console.log(h, {column, $index})
      return (
        h('div', {class: 'none',
          on: {click: () => {
            let flag = false
            this.subTableData.forEach((item, index) => {
              if (!item.Relation) {
                flag = true
              } else {
                flag = false
              }
            })
            if (flag) {
              this.$notify({
                type: 'error',
                message: '已存在未关联行，请勿重复增加！'
              })
              return
            }
            let obj = {
              logisticsName: '',
              operateAddress: '',
              phone: '',
              relationStatus: '',
              Relation: false
            }
            this.subTableData.push(obj)
          }}}, '+')
      )
    },
    relation (val) {
      if (val.logisticsName === '') {
        this.$notify({
          type: 'error',
          message: '请选择需要关联的物流公司！'
        })
      } else {
        this.saveParam.pkLogisticsRelation = val.logisticsName
        this.saveParam.relationStatus = 0
        RelationManager.InsertRelationLogistics(this.saveParam).then(res => {
          if (res.code === 200) {
            this.GetRelationLogisticsList({logisticsId: this.saveParam.pkLogisticsInitiate})
            this.QueryGetLogisticsList({logisticsId: this.saveParam.pkLogisticsInitiate})
            this.$notify({
              type: 'success',
              message: '物流公司关联成功！'
            })
          }
        })
      }
    },
    cancelRelation (val) {
      this.tableDataAll.forEach(item => {
        if (val.logisticsName === item.logisticsName) {
          this.saveParam.pkLogisticsRelation = item.id
        }
      })
      let obj = {
        initiateLogisticsId: '', // 发起物流
        relationLogisticsId: '' // 关联物流
      }
      obj.initiateLogisticsId = this.saveParam.pkLogisticsInitiate
      obj.relationLogisticsId = this.saveParam.pkLogisticsRelation
      RelationManager.QueryValidateJointLine(obj).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.$notify({
              type: 'error',
              message: '已经存在联营线路，取消关联失败！'
            })
          } else {
            this.saveParam.relationStatus = 1
            RelationManager.UpdateRelationLogistics(this.saveParam).then(res => {
              if (res.code === 200) {
                this.GetRelationLogisticsList({logisticsId: this.saveParam.pkLogisticsInitiate})
                this.QueryGetLogisticsList({logisticsId: this.saveParam.pkLogisticsInitiate})
                this.$notify({
                  type: 'success',
                  message: '物流公司取消关联成功！'
                })
              }
            })
          }
        }
      })
    },
    expandRow (row, expandedRows) {
      console.log(row, expandedRows)
      this.saveParam.pkLogisticsInitiate = row.id
      this.QueryGetLogisticsList({logisticsId: row.id})
      this.GetRelationLogisticsList({logisticsId: row.id})
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
    },
    delRow (val) {
      this.subTableData = this.subTableData.filter(item =>
        item.logisticsName !== val.logisticsName
      )
    },
    changeSubLogistics (val) {
      this.tableDataAll.forEach(item => {
        if (val === item.id) {
          if (item.relationStatus === 0) {
            item.relationStatus = '已关联'
          }
          if (item.relationStatus === 1) {
            item.relationStatus = '未关联'
          }
          this.subTableData.forEach((subItem, index) => {
            if (val === subItem.logisticsName) {
              subItem.operateAddress = item.operateAddress
              subItem.phone = item.phone
              subItem.relationStatus = item.relationStatus
            }
          })
        }
      })
    },
    changePage (pageSize, pageNumber) {
      this.querySchema.currentPage = pageNumber
      this.querySchema.pageSize = pageSize
      this.QueryList(this.querySchema)
    },
    changePageSize (pageSize) {
      this.querySchema.currentPage = 1
      this.querySchema.pageSize = pageSize
      this.QueryList(this.querySchema)
    },
    search () {
      this.clickSearch = true
      this.querySchema.logisticsName = this.form.logisticsName
      this.querySchema.cityName = this.form.cityName
      this.querySchema.provinceName = this.form.provinceName
      this.querySchema.logisticsStatus = this.form.logisticsStatus
      this.querySchema.phone = this.form.phone
      this.querySchema.currentPage = 1
      this.QueryList(this.querySchema)
    },
    QueryList (val) { // 获取物流公司管理列表
      RelationManager.QueryRelationList(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map((item, index) => {
            item.rowNum = index + 1

            return item
          })
          this.paginationParams.pageNum = res.data.currentPage
          this.querySchema.currentPage = res.data.currentPage
          this.paginationParams.total = res.data.total
        }
      })
    },
    QueryAllList (val) { // 获取全部物流公司管理列表
      RelationManager.QueryAllList(val).then(res => {
        if (res.code === 200) {
          this.tableDataAll = res.data.list
        }
      })
    },
    QueryLogisticsList (val) { // 物流公司列表
      LogisticsCompanyManage.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    QueryGetLogisticsList (val) { // 物流公司列表(子表)
      RelationManager.QueryGetLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.subLogisticsList = res.data
        }
      })
    },
    GetRelationLogisticsList (val) { // 发起物流关联的物流公司列表（子表）
      RelationManager.GetRelationLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.subTableData = res.data.list.map((item, index) => {
            if (item.relationStatus === 0) {
              item.relationStatus = '已关联'
            }
            if (item.relationStatus === 1) {
              item.relationStatus = '未关联'
            }
            item.rowNum = index + 1
            item.Relation = true
            return item
          })
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
.joint-operation-list{
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
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
}
</style>

<style lang="less">
.joint-operation-list {
  .subTable {
    .el-table__body-wrapper {
      overflow: auto!important;
      height: auto!important;
    }
  }
  .none {
    cursor: pointer;
  }
}
</style>
