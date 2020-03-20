<template>
  <div class="look-proprietary-line">
    <div class="public_card">
      <h3 class="card_header">自营线路</h3>
      <div class="card_main">
        <div class="card-header">
          <div class="c-h-item"><span class="left">*</span><span class="center">线路名称:</span><span class="right">{{queryLineShiftData.lineName}}</span></div>
          <div class="c-h-item"><span class="left">*</span><span class="center">上游站点:</span><span class="right">{{queryLineShiftData.departureStationName}}</span></div>
          <div class="c-h-item"><span class="left">*</span><span class="center">下游站点:</span><span class="right">{{queryLineShiftData.destinationStationName}}</span></div>
          <div class="c-h-item"><span class="left">*</span><span class="center">配送范围:</span><span class="right">{{queryLineShiftData.lineType === 3 ? '自营同城调度' : '自营城际调度'}}</span></div>
        </div>
        <div class="table-con">
          <el-table
            :data="queryLineShiftData.tableData"
            style="width: 100%"
            stripe
            height="'100%'"
            border>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              min-width="3%"
              prop="serialNumber"
              label="序号">
            </el-table-column>
            <el-table-column
              min-width="10%"
              prop="departureTime"
              label="发车时间">
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="driverName"
              label="司机">
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom-btns">
          <el-button class="btn-main" @click="goback()">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
export default {
  name: 'LookProprietaryLine',
  data () {
    return {
      id: '',
      tableData: [],
      queryLineShiftData: {
        lineName: '',
        departureStationName: '',
        tableData: []
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.QueryLineShift(this.id)
    } else {
      this.id = ''
    }
  },
  methods: {
    QueryLineShift (val) {
      CustomerRouteAjax.QueryLineList({lineId: val}).then(response => {
        if (response.code === 200) {
          this.queryLineShiftData = response.data.list[0]
          this.queryLineShiftData.tableData = response.data.list[0].lineShiftListVoList
        }
      })
    },
    goback () {
      this.$router.push({name: 'ProprietaryLineList'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.look-proprietary-line{
  display: flex;
  flex: 1;
  .card_main{
    padding: 30px 40px;
    .card-header {
      width: 100%;
      height: 50px;
      display: flex;
      .c-h-item {
        height: 50px;
        width: 270px;
        line-height: 50px;
        margin-right: 50px;
        span {
          font-size: 14px;
        }
        .left {
          color: red;
        }
        .center {
          margin-right: 20px;
        }
      }
    }
    .el-form{
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .btns{
        height: 32px;
        margin-bottom: 15px;
        .title {
          margin-left: 30px;
          font-size: 13px;
        }
      }
      .table-con{
        display: flex;
        flex: 1;
        margin-top: 20px;
        i {
          font-size: 18px;
        }
        .driverWrap {
          margin-top: 2px;
        }
      }
      .bottom-btns{
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
  }
}
</style>
