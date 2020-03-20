<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        border>
        <el-table-column
          min-width="10%"
          prop="waybillNumber"
          label="运单号">
        </el-table-column>
        <el-table-column
          min-width="10%"
          prop="sendClientName"
          label="结款方">
        </el-table-column>
        <el-table-column
          min-width="15%"
          prop="receivableGoods"
          label="货款（元）">
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure">确认</el-button>
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
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      form: {
        waybillNumber: '',
        receiveClientName: '',
        receivableGoods: ''
      },
      rules: {},
      tableData: [],
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    this.tableData = this.editInfoProps
  },
  methods: {
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure () {
      let ids = []
      ids = this.editInfoProps.map(item => {
        return item.waybillId
      })
      this.$emit('click-sure', ids)
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>
