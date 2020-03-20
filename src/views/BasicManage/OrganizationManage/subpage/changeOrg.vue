<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="orgParam" :model="orgParam" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="名称" prop="orgName">
          <el-input v-model="orgParam.orgName" maxlength="128"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('orgParam')">保存</el-button>
        <el-button @click="clickCancel">返回</el-button>
    </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'DialogForm',
  props: {
    width: {
      type: String,
      default: '40%'
    },
    title: {
      type: String,
      default: '标准弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    editInfo: {
      type: Object,
      default: () => ({})
    },
    typeFlag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      orgParam: {
        orgId: '',
        orgName: '',
        description: '',
        parentId: ''
      },
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    if (this.typeFlag === 'edit') {
      this.orgParam.orgName = this.editInfo.menuName
    }
  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (orgParam) {
      this.$refs[orgParam].validate((valid) => {
        if (valid) {
          if (this.typeFlag === 'add') {
            this.orgParam.orgId = ''
            this.orgParam.parentId = this.editInfo.orgId
            this.$emit('click-sure', this.orgParam, 'add')
          }
          if (this.typeFlag === 'edit') {
            this.orgParam.orgId = this.editInfo.orgId
            this.orgParam.parentId = this.editInfo.parentId
            this.$emit('click-sure', this.orgParam, 'edit')
          }
        }
      })
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
