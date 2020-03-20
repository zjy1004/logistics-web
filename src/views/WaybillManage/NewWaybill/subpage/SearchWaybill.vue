<template>
  <el-dialog :before-close="closeFormDialog" class="search-waybill" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="已有运单号:" prop="waybillId">
          <el-select v-model="form.waybillId" @change="selectRow" filterable placeholder="请输入运单号" clearable>
            <el-option
              v-for="(item, index) in waybillOption"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button class="btn-main" @click="clickSure('form')">保存</el-button> -->
      <el-button @click="clickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import WaybillAjax from '@/api/WaybillManage/WaybillManage'
export default {
  name: 'SearchWaybill',
  props: {
    width: {
      type: String,
      default: '400px'
    },
    title: {
      type: String,
      default: '查询运单号'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        waybillId: '' // 运单ID
      },
      waybillOption: [], // 运单号集合
      rules: {
        // carNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.queryWaybillNumList()
  },
  methods: {
    queryWaybillNumList () {
      WaybillAjax.QueryWayBillNum().then(response => {
        if (response.code === 200) {
          this.waybillOption = response.data
        }
      })
    },
    selectRow (value) {
      this.$emit('click-sure', value)
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
