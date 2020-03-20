<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div class="rejectDialog">
      <!-- <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="发货方:">
          <span>{{editInfo.sendClientName}}</span>
        </el-form-item>
        <el-form-item label="收货方:">
          <span>{{editInfo.receiveClientName}}</span>
        </el-form-item>
        <el-form-item label="运费（元）:" prop="rejectAmount">
          <el-input v-model="form.rejectAmount" maxlength="128" @input="freight"></el-input>
        </el-form-item>
        <el-form-item label="付费方:" prop="rejectPayer">
          <el-select v-model="form.rejectPayer" placeholder="全部" clearable>
            <el-option
              v-for="(item, index) in rejectPayerOption"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
      <div>
        <div v-if="this.editInfo.receiveClientShow">
          <span class="pay-title">修理厂付(￥)：</span>
            <span class="pay-text">
              运费包月客户
            </span>
        </div>
        <el-form-item  v-else label="修理厂付(￥):" prop="receiveReceivableFreight">
          <el-input v-model="form.receiveReceivableFreight" placeholder="请输入运费金额" maxlength="6" @keyup.native="freight1(form.receiveReceivableFreight)"></el-input>
        </el-form-item>
      </div>

        <div>
          <div v-if="this.editInfo.sendClientShow">
            <span class="pay-title">经销商付(￥)：</span>
            <span class="pay-text">
              运费包月客户
            </span>
          </div>
          <el-form-item v-else label="经销商付(￥):" prop="sendReceivableFreight">
          <el-input v-model="form.sendReceivableFreight" placeholder="请输入运费金额" maxlength="6" @keyup.native="freight2(form.sendReceivableFreight)"></el-input>
        </el-form-item>
        </div>

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">保存</el-button>
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
    }
  },
  data () {
    return {
      form: {
        receiveReceivableFreight: '',
        sendReceivableFreight: '',
        waybillId: ''
      },
      rejectPayerOption: [{name: '发货方', id: 1}, {name: '收货方', id: 2}],
      rules: {
        receiveReceivableFreight: [{ required: true, message: '运费金额不能为空', trigger: 'blur' }],
        sendReceivableFreight: [{ required: true, message: '运费金额不能为空', trigger: 'blur' }]
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
      this.form.receiveReceivableFreight = newValue
    },
    freight2 (val) {
      let newValue = val.replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.form.sendReceivableFreight = newValue
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.waybillId = this.editInfo.waybillId
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
  .pay-title {
    font-size: 13px;
    margin-left: 10px;
  }
  .pay-text {
    font-size: 13px;
    margin-left: 20px;
  }
</style>
