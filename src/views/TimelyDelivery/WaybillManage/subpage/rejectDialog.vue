<template>
  <el-dialog
    :before-close="closeFormDialog"
    class="form-dialog reject-dialog"
    :close-on-click-modal="closeClickModal"
    :width="width"
    :title="title"
    center
    :visible.sync="dialogVisibleSelf">
    <div class="rejectDialog">
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <div>
          <el-form-item label="发货方付(￥):" prop="sendReceivableFreight">
            <el-input v-model="form.sendReceivableFreight" placeholder="请输入运费金额" maxlength="6" @keyup.native="freight1(form.sendReceivableFreight)"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="收货方付(￥):" prop="receiveReceivableFreight">
            <el-input v-model="form.receiveReceivableFreight" placeholder="请输入运费金额" maxlength="6" @keyup.native="freight2(form.receiveReceivableFreight)"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="补贴(￥):" prop="subsidyFreight">
            <el-input v-model="form.subsidyFreight" :disabled="rejectInfo.subsidyFreight === 0" placeholder="请输入补贴金额" maxlength="6" @keyup.native="freight3(form.subsidyFreight)"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="128"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">保存</el-button>
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
    rejectInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    let validateSubsidyFreight = (rule, value, callback) => {
      let subsidyFreight = this.rejectInfo.subsidyFreight
      if (subsidyFreight !== 0) {
        if (value === '') {
          callback(new Error('补贴金额不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        receiveReceivableFreight: '', // 收货方
        sendReceivableFreight: '', // 发货方
        subsidyFreight: '', // 补贴
        remark: '', // 备注
        flashWaybillId: this.rejectInfo.flashWaybillId // 运单id
      },
      rules: {
        receiveReceivableFreight: [{ required: true, message: '运费金额不能为空', trigger: 'blur' }],
        sendReceivableFreight: [{ required: true, message: '运费金额不能为空', trigger: 'blur' }],
        subsidyFreight: [{ validator: validateSubsidyFreight, trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
  },
  watch: {

  },
  methods: {
    freight1 (val) {
      let newValue = val.replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.form.sendReceivableFreight = newValue
    },
    freight2 (val) {
      let newValue = val.replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.form.receiveReceivableFreight = newValue
    },
    freight3 (val) {
      let newValue = val.replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.form.subsidyFreight = newValue
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.flashWaybillId = this.rejectInfo.flashWaybillId
          this.$emit('click-sure', this.form)
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

<style lang="less">
.reject-dialog{
  .el-textarea__inner {
    width: 246px;
    height: 70px;
  }
  .pay-title {
    font-size: 13px;
    margin-left: 10px;
  }
  .pay-text {
    font-size: 13px;
    margin-left: 20px;
  }
}
</style>
