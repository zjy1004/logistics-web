<template>
  <div class="route-list">
    <div class="public_card">
      <!-- <h3 class="card_header">自营路由配置</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="上游起点:" prop="pkStationStartName">
                <el-input v-model="form.pkStationStartName" placeholder="请输入路由起点" clearable></el-input>
              </el-form-item>
              <el-form-item label="下游终点:" prop="pkStationEndName">
                <el-input v-model="form.pkStationEndName" placeholder="请输入下游终点" clearable></el-input>
              </el-form-item>
              <el-form-item label="线路状态:">
                <el-select v-model="form.enableFlag" placeholder="请选择线路状态" clearable>
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
            <el-button class="btn-main" @click="search">查询</el-button>
          </div>
        </div>
        <div class="public_list">
          <div class="listHeader">
            <el-button @click="add">+ 新建路由</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="3%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="routerName"
                label="路由线路名称">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="pkStationStart"
                label="上游起点">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="pkStationEnd"
                label="下游终点">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="enableFlag"
                label="线路状态">
                <template slot-scope="scope">
                  <span>{{scope.row.enableFlag === 0 ? '启用' : '禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="enAble(scope.row)">{{scope.row.enableFlag === 0 ? '禁用' : '启用'}}</a>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouterConfigAjax from '@/api/RouterConfig/RouterConfig'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'SelfRouteList',
  data () {
    return {
      clickSearch: false, // 查询判断
      tableData: [], // 表格数据集合
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      status: [{id: '', name: '全部'}, {id: 0, name: '启用'}, {id: 1, name: '禁用'}],
      form: {
        pkStationStartName: '', // 上游起点
        pkStationEndName: '', // 下游终点
        enableFlag: '' // 路由禁用状态
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList (type) { // 获取列表数据
      let lineQueryParam = Object.assign({}, this.form)
      lineQueryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      lineQueryParam.pageSize = this.paginationParams.pageSize
      RouterConfigAjax.QueryList(lineQueryParam).then(response => {
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
    search () { // 查询
      this.queryList('searchBtn')
    },
    add () { // 新建路由
      this.$router.push({name: 'CreatSelfRoute', query: { isAdd: true, activeName: 'first' }})
    },
    enAble (row) { // 禁用
      RouterConfigAjax.EnableRouter({id: row.id, enableFlag: row.enableFlag === 0 ? 1 : 0}).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '保存成功！',
            type: 'success'
          })
          this.queryList()
        }
      })
    }
  },
  components: {
    VPagination
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
