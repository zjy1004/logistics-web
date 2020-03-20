<template>
  <el-dialog :before-close="closeDialog" class="choose-depart-dialog" :close-on-click-modal="closeClickModal" :width="width" title="部门职位" :visible.sync="dialogVisibleSelf">
    <div>
      <div class="depart">
        <div class="label">部门:</div>
        <div class="treeCon">
          <el-tree
            ref="departTree"
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            :show-checkbox="false"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @node-click="handleNodeClick">
          </el-tree>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">保存</el-button>
      <el-button @click="clickCancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import OrganizationManage from '@/api/OrganizationManage/OrganizationManage'
export default {
  name: 'ChooseDepart',
  props: {
    width: {
      type: String,
      default: '475px'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default () {
        return {
          orgId: '',
          orgName: ''
        }
      }
    }
  },
  data () {
    return {
      dialogVisibleSelf: this.dialogVisible,
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      },
      treeData: [],
      currentDepart: {id: '', name: ''}
    }
  },
  created () {
    if (this.rowData.orgId !== '') {
      this.init('detail')
      this.currentDepart.id = this.rowData.orgId
      this.currentDepart.name = this.rowData.orgName
    } else {
      this.init()
    }
  },
  methods: {
    init (type) {
      this.queryDepartTree(type)
    },
    queryDepartTree (type) {
      OrganizationManage.queryOrgTreeList().then((response) => {
        if (response.code === 200) {
          this.treeData = response.data.list
          if (type === 'detail') {
            this.$nextTick(() => {
              this.$refs.departTree.setCurrentKey(this.rowData.orgId)
            })
          }
        }
      })
    },
    handleNodeClick (data) {
      this.currentDepart.id = data.id
      this.currentDepart.name = data.menuName
    },
    clickCancel () {
      this.$emit('click-cancel-form', 'cancel')
    },
    clickSure () {
      if (this.currentDepart.id !== '') {
        this.$emit('click-sure-form', this.currentDepart)
      }
    },
    closeDialog (done) {
      this.$emit('click-cancel-form', 'cancel')
      done()
    }
  }
}
</script>
<style lang="less" scope>
@import '../../../../style/base.less';
.choose-depart-dialog{
  .el-dialog__body{
    padding: 20px 34px 0px 30px;
    .depart{
      display: flex;
      .label{
        width: 40px;
        margin-left: 10px;
        font-size: 13px;
      }
      .treeCon{
        display: flex;
        flex: 1;
      }
    }
    .el-form{
      width: 100%;
      margin: 0 auto;
      .el-form-item{
        margin-bottom: 10px;
        .el-form-item__content{
          margin-left: 90px;
          .el-input{
            input{
              height: 34px!important;
            }
          }
          .el-input.is-disabled{
            .el-input__inner{
              color: #555!important;
            }
          }
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
  .el-dialog__footer{
    padding-bottom: 24.5px;
    button{
      width: 54px;
      height: 34px;
    }
  }
}

</style>
