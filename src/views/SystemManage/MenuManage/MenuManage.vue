<template>
  <div class="menu-manage">
    <div class="public_card">
      <!-- <h3 class="card_header">菜单管理</h3> -->
      <div class="card_main">
        <div class="searchBar">
          <div class="form-con">
            <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
              <el-form-item label="菜单名称:" prop="menuName">
                <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="菜单类型:" prop="menuType">
                <el-select v-model="form.menuType" placeholder="请选择菜单类型" clearable>
                  <el-option
                    v-for="item in menuTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上级菜单:" prop="parentMenu">
                <el-select v-model="form.parentMenu" placeholder="请选择上级菜单" clearable>
                  <el-option
                    v-for="item in pkMenuList"
                    :key="item.id"
                    :label="item.menuName"
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
            <el-button @click="add">+ 新建菜单</el-button>
          </div>
          <div class="table-con">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              border>
              <el-table-column
                min-width="10%"
                prop="menuName"
                label="菜单名称">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="menuTypeName"
                label="菜单类型">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="parentMenuName"
                label="上级菜单">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="url"
                label="菜单路径">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <a class="edit" href="javascript:;" type="text" size="small" @click="edit(scope.row)">修改</a>
                  <a href="javascript:;" type="text" size="small" @click="del(scope.row)">删除</a>
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
            title="删除"
            :width="'486px'"
            mainText="您确定删除此菜单？"
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
import MenuManageAjax from '@/api/MenuManage/MenuManage'
import VPagination from '@/components/Pagination/Pagination'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'MenuManage',
  data () {
    return {
      clickSearch: false,
      form: {
        menuName: '',
        menuType: '',
        parentMenu: ''
      },
      menuTypeList: [{id: 1, name: '系统菜单'}, {id: 2, name: '业务菜单'}, {id: 3, name: '按钮'}, {id: 99, name: '管理菜单'}],
      pkMenuList: [],
      paginationParams: {pageSize: 10, total: 0, pageNum: 1},
      tableData: [],
      dialogVisible: false,
      currentRow: {}
    }
  },
  components: {
    VPagination,
    VDialog
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryAllPkMenu()
      this.queryList()
    },
    queryAllPkMenu () {
      MenuManageAjax.QueryPkMenuList().then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.pkMenuList = data
        }
      })
    },
    queryList (type) {
      let lineQueryParam = {}
      lineQueryParam.currentPage = type === 'searchBtn' ? 1 : this.paginationParams.pageNum
      if (type === 'searchBtn') {
        this.clickSearch = true
      }
      lineQueryParam.pageSize = this.paginationParams.pageSize
      lineQueryParam.menuName = this.form.menuName
      lineQueryParam.menuType = this.form.menuType
      lineQueryParam.parentMenu = this.form.parentMenu
      MenuManageAjax.QueryList(lineQueryParam).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list.map(item => {
            this.menuTypeList.forEach(typeItem => {
              if (item.menuType === typeItem.id) {
                item.menuTypeName = typeItem.name
              }
            })
            return item
          })
          this.paginationParams.pageNum = response.data.currentPage
          this.paginationParams.total = response.data.total
        }
      })
    },
    search () {
      this.queryList('searchBtn')
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
    add () {
      this.$router.push({name: 'MenuCard', query: { isAdd: true }})
    },
    edit (row) {
      this.$router.push({name: 'MenuCard', query: { isAdd: false, id: row.id }})
    },
    del (row) {
      this.currentRow = row
      this.dialogVisible = true
    },
    clickSure () {
      MenuManageAjax.Delete({id: this.currentRow.id}).then((response) => {
        if (response.code === 200) {
          this.dialogVisible = false
          this.$notify({
            message: '删除成功！',
            type: 'success'
          })
          this.paginationParams.pageNum = 1
          this.queryList()
        }
      })
    },
    clickCancel () {
      this.currentRow = null
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.menu-manage{
  .search-btn-con{
    margin-top: 15px!important;
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.menu-manage{
  display: flex;
  flex: 1;
  .listHeader{
    height: 32px;
  }
  .search-btn-con{
    margin-top: 15px;
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
}
</style>
