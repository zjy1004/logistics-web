<template>
  <el-dialog :before-close="closeDialog" class="check-order" :close-on-click-modal="closeClickModal" :width="width" title="参考配送顺序" :visible.sync="dialogVisibleSelf">
    <div class="table-con">
      <el-table
        :data="orderData"
        style="width: 100%"
        stripe
        height="'100%'"
        border>
        <el-table-column
          min-width="5%"
          prop="serialNumber"
          label="序号">
        </el-table-column>
        <el-table-column
          min-width="10%"
          prop="clientName"
          label="客户名称">
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RouteAjax from '@/api/RouteManage/RouteManage'
export default {
  name: 'CheckOrder',
  props: {
    width: {
      type: String,
      default: '575px'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      dialogVisibleSelf: this.dialogVisible,
      orderData: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      RouteAjax.CheckOrder({lineId: this.id}).then(response => {
        if (response.code === 200) {
          this.orderData = response.data.list
        }
      })
    },
    clickSure () {
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
.check-order{

}

</style>
