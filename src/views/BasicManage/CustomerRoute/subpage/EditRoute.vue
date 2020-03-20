<template>
  <el-dialog :before-close="closeDialog" class="edit-route" :close-on-click-modal="closeClickModal" :width="width" title="修改线路" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="线路" prop="lineName">
          <el-input v-model="form.lineName" maxlength="11" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取消</el-button>
        <el-button class="btn-main" @click="clickSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RouteAjax from '@/api/RouteManage/RouteManage'
export default {
  name: 'EditRoute',
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
    editData: {
      type: Object,
      default () {
        return {
          lineId: '',
          lineName: ''
        }
      }
    }
  },
  data () {
    let validateSelect = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入线路名称！'))
      } else if (this.hasSelect) {
        callback(new Error('该线路已存在！'))
      } else {
        callback()
      }
    }
    return {
      form: {
        lineId: this.editData.lineId,
        lineName: this.editData.lineName
      },
      hasSelect: false,
      rules: {
        lineName: [
          { validator: validateSelect, trigger: 'blur' }
        ]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {

  },
  methods: {
    clickSure () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          RouteAjax.EditRouteName({lineId: this.form.lineId, lineName: this.form.lineName}).then((response) => {
            if (response.code === 200) {
              this.$notify({
                message: '修改线路成功！',
                type: 'success'
              })
              this.$emit('click-sure-form', this.form.lineId, this.form.lineName)
            }
          })
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel-form', 'cancel')
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
.edit-route{

}

</style>
