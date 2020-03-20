<template>
  <el-dialog :before-close="closeFormDialog" class="edit-freight" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <el-form :inline="true" ref="form">
      <el-form-item label="上门揽收价格:" prop="collect_price">
        <el-input
          v-model="collect_price"
          @input.native="collectPriceChange($event, collect_price)"
          maxlength="6"
          placeholder="请输入上门揽收价格">
        </el-input>
      </el-form-item>
      <el-form-item label="送货上门价格:" prop="delivery_price">
        <el-input
          v-model="delivery_price"
          @input.native="deliveryPriceChange($event, delivery_price)"
          maxlength="6"
          placeholder="请输入送货上门价格">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="table-con">
      <el-table
        :data="orderPackageList"
        height="'100%'"
        border
        style="width: 100%">
        <el-table-column
          min-width="10%"
          prop="rowNum"
          label="序号">
        </el-table-column>
        <el-table-column
          min-width="45%"
          prop="packet_no"
          label="箱单号">
          <template slot-scope="scope">
            <span>{{scope.row.packet_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="25%"
          prop="packet_spec_name"
          label="规格">
          <template slot-scope="scope">
            <span>{{scope.row.packet_spec_name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="25%"
          prop="transport_price"
          class="price-column"
          label="价格">
          <template slot-scope="scope">
            <el-input maxlength="6" class="selfInput" v-model="scope.row.transport_price" @input.native="freightChange($event, scope.row.transport_price, scope.row.packet_no)"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="btn-main" @click="clickSure">保存</el-button>
      <el-button @click="clickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ENUMS from '@/enums/enums'
export default {
  name: 'EditFreight',
  props: {
    width: {
      type: String,
      default: '800px'
    },
    title: {
      type: String,
      default: '修改运费'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    collectPrice: {
      type: String,
      default: ''
    },
    deliveryPrice: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      collect_price: '', // 上门揽收价格
      delivery_price: '', // 送货上门价格
      orderPackageList: [],
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    if (this.collectPrice === '' || this.collectPrice === null) {
      this.collect_price = ''
    } else {
      if (parseInt(this.collectPrice) === parseFloat(this.collectPrice)) {
        this.collect_price = parseInt(this.collectPrice)
      } else {
        this.collect_price = parseFloat(this.collectPrice)
      }
    }
    if (this.deliveryPrice === '' || this.deliveryPrice === null) {
      this.delivery_price = ''
    } else {
      if (parseInt(this.deliveryPrice) === parseFloat(this.deliveryPrice)) {
        this.delivery_price = parseInt(this.deliveryPrice)
      } else {
        this.delivery_price = parseFloat(this.deliveryPrice)
      }
    }
    this.orderPackageList = this.tableData.map((item, index) => {
      item.rowNum = ++index
      if (item.transport_price === '') {
        item.transport_price = ''
      } else {
        if (parseInt(item.transport_price) === parseFloat(item.transport_price)) { // 小数位全是0
          item.transport_price = parseInt(item.transport_price)
        } else {
          item.transport_price = parseFloat(item.transport_price)
        }
      }
      ENUMS.sizeList.forEach(sizeItem => {
        if (item.packet_spec === sizeItem.id || parseInt(item.packet_spec) === parseInt(sizeItem.id)) {
          item.packet_spec_name = sizeItem.name
        }
      })
      return item
    })
  },
  methods: {
    // 编辑上门揽收价格
    collectPriceChange (event, value) {
      let val = value.match(/^\d*(\.?\d{0,2})/g)[0] || null
      this.$nextTick(() => {
        event.target.value = val
        this.collect_price = val
      })
    },
    // 编辑送货上门价格
    deliveryPriceChange (event, value) {
      let val = value.match(/^\d*(\.?\d{0,2})/g)[0] || null
      this.$nextTick(() => {
        event.target.value = val
        this.delivery_price = val
      })
    },
    // 编辑运费列
    freightChange (event, value, packetNo) {
      let val = value.match(/^\d*(\.?\d{0,2})/g)[0] || null
      this.$nextTick(() => {
        event.target.value = val
        this.orderPackageList = this.orderPackageList.map(item => {
          if (item.packet_no === packetNo) {
            item.transport_price = val
          }
          return item
        })
      })
    },
    clickSure () {
      this.$emit('click-sure', this.orderPackageList, this.collect_price, this.delivery_price)
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
<style lang="less" scope>
@import '../../../../style/base.less';
.edit-freight{
  .el-form{
    display: flex;
    flex-direction: row;
    .el-form-item{
      display: flex;
      flex: 1;
      .el-form-item__content{
        .el-input__inner{
          border: 1px solid #eee;
        }
      }
    }
  }
}
</style>
