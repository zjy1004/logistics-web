<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label=" " prop="checkList">
          <el-checkbox-group v-model="form.checkList">
            <el-checkbox label='打印运单'></el-checkbox>
            <el-checkbox label='打印箱单'></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure()">确认</el-button>
        <el-button @click="clickCancel">取消</el-button>
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
    editInfoProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: {
        checkList: ['打印箱单']
      },
      rules: {},
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {

  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$emit('click-sure', this.editInfoProps, this.form)
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
