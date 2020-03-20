<template>
  <div class="table-print-con" ref="print">
    <div v-if="hasHeader" style="width: 860px; height: 50px;">
      <div style="width: 700px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">{{printHeaderInfo.articleNumber}} 发货清单</div>
      <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">日期: {{printHeaderInfo.currentDate}}</div>
    </div>
    <div v-else style="width: 860px; height: 50px;">
      <div style="width: 540px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderRight: none; borderBottom: none; fontSize: 16px; fontWeight: bold;">退货清单</div>
      <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">日期: {{printHeaderInfo.currentDate}}</div>
      <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 50px; lineHeight: 50px; textAlign: center; borderBottom: none; fontSize: 16px; fontWeight: bold;">打印时间: {{printHeaderInfo.currentTime}}</div>
    </div>
    <div v-if="hasHeader" style="width: 860px; height: 40px;">
      <div style="width: 190px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">线路: {{printHeaderInfo.lineName}}</div>
        <div style="width: 200px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">司机: {{printHeaderInfo.driverName}}</div>
        <div style="width: 150px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">电话: {{printHeaderInfo.driverPhone}}</div>
        <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;">打印时间: {{printHeaderInfo.currentTime}}</div>
        <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;">发车时间: {{printHeaderInfo.departureTime}}</div>
    </div>
    <div v-if="hasHeader" style="width: 860px; height: 40px;">
      <div style="width: 540px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="client">客户信息</div>
      <div style="width: 160px; float: left; border-width: 1px;border-color: #aaaaaa; border-style: solid;height: 40px; lineHeight: 40px; textAlign: center; borderRight: none; borderBottom: none;" class="money">应收金额</div>
      <div style="width: 160px; float: left; border-width: 1px; border-color: #aaaaaa; border-style: solid; height: 40px; lineHeight: 40px; textAlign: center; borderBottom: none;" class="other">其他</div>
    </div>
    <div>
      <table class="print-table">
        <thead>
          <tr>
            <th style="width:40px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">序号</th>
            <th style="width:150px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">收货方</th>
            <th style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">货号</th>
            <th style="width:150px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">发货方</th><!-- 运单号变为发货方 -->
            <th style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">联系电话（收货方）</th>
            <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">代收贷款</th>
            <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">运费</th>
            <!-- <th style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">司机应收</th> -->
            <th style="width:160px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">备注</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="index" v-for="(tr, index) in printTableData">
            <td style="width:40px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{ index === (printTableData.length - 1) ? '' : index + 1}}</td>
            <td style="width:150px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receiveClientName}}</td><!-- 收货方 -->
            <td style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.articleNumber}}</td><!-- 货号 -->
            <td style="width:150px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.sendClientName}}</td><!-- 运单号变为发货方 -->
            <td style="width:100px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivePhone}}</td><!-- 联系电话 -->
            <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivableGoods}}</td><!-- 代收货款 -->
            <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.receivableFreight}}</td><!-- 运费 -->
            <!-- <td style="width:80px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.waybillReceivable}}</td> --><!-- 司机应收 -->
            <td style="width:160px;border-width: 1px;border-color: #aaaaaa; border-style: solid; height: 40px; verticalAlign: middle; textAlign: center;">{{tr.remark}}</td><!-- 备注 -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintPicking',
  props: {
    hasHeader: {
      type: Boolean,
      default: true // 默认打印配货单页面
    },
    headerInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      printHeaderInfo: this.headerInfo,
      printTableData: this.tableData
    }
  },
  watch: {
    headerInfo (newVal, oldVal) {
      this.headerInfo = newVal
    },
    tableData (newVal, oldVal) {
      this.printTableData = newVal
    },
    deep: true
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.$print(this.$refs.print)
      })
    }
  }
}
</script>
<style lang="less" scope>
@import '../../../../style/base.less';
.table-print-con{
  display: none;
}

</style>
