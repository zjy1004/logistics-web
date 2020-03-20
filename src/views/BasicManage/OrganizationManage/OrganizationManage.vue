<template>
  <div class="OrganizationManage public_card">
    <!-- <h3 class="card_header">组织管理</h3> -->
    <div class="card_main">
      <div class="card_con">
              <div class="card_btn">
        <div class="search-btn-con">
        <el-button class="btn-main" @click="addNode">添加子节点</el-button>
        <el-button class="btn-main" @click="editNode" :disabled="editBtnDisabled">修改</el-button>
        </div>
      </div>
        <div class="roleInfo info">
            <el-tree
              :data="treeData"
              default-expand-all
              node-key="id"
              :ref="'tree'"
              highlight-current
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              :props="defaultProps">
            </el-tree>
        </div>
      </div>
    </div>
    <change-org
      v-if="dialogVisible"
      :title='dialogTitle'
      :width='dialogWidth'
      :dialogVisible="dialogVisible"
      @click-cancel="clickDialogCancel"
      @click-sure="clickDialogSure"
      :editInfo="editInfoObj"
      :typeFlag="typeFlagStr"
    />
  </div>
</template>

<script>
import OrganizationManageAjax from '@/api/OrganizationManage/OrganizationManage'
import changeOrg from './subpage/changeOrg'
export default {
  data () {
    return {
      dialogVisible: false,
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      },
      treeData: [],
      editInfoObj: {
        orgId: '',
        parentId: '',
        menuName: ''
      },
      editBtnDisabled: false
    }
  },
  created () {
    this.queryOrgTreeList()
  },
  methods: {
    handleNodeClick (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      if (data.parentId === 0) {
        this.editBtnDisabled = true
      } else {
        this.editBtnDisabled = false
      }
      this.editInfoObj.orgId = data.id
      this.editInfoObj.parentId = data.parentId
      this.editInfoObj.menuName = data.menuName
    },
    editNode () {
      if (this.editInfoObj.orgId) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '修改'
        this.dialogWidth = '486px'
        this.typeFlagStr = 'edit'
      } else {
        this.$notify({
          type: 'error',
          message: '请选择组织节点！'
        })
      }
    },
    addNode () {
      if (this.editInfoObj.orgId) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '添加子节点'
        this.dialogWidth = '486px'
        this.typeFlagStr = 'add'
      } else {
        this.$notify({
          type: 'error',
          message: '请选择组织节点！'
        })
      }
    },
    clickDialogCancel () {
      this.dialogVisible = false
    },
    clickDialogSure (val, flag) {
      if (flag === 'add') {
        this.insertOrg(val)
      }
      if (flag === 'edit') {
        this.updateOrg(val)
      }
    },
    queryOrgTreeList (val) { // 组织树
      OrganizationManageAjax.queryOrgTreeList(val).then(res => {
        if (res.code === 200) {
          this.treeData = res.data.list
        }
      })
    },
    insertOrg (val) { // 新增
      OrganizationManageAjax.insertOrg(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.queryOrgTreeList()
        }
      })
    },
    updateOrg (val) { // 修改
      OrganizationManageAjax.updateOrg(val).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.queryOrgTreeList()
        }
      })
    }
  },
  components: {
    changeOrg
  }
}
</script>

<style lang="less">
.OrganizationManage {
  .addressDetail .el-input__inner {
     width: 605px !important;
  }
}
</style>

<style lang="less" scoped>
.OrganizationManage {
  .info {
    margin-bottom: 30px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
