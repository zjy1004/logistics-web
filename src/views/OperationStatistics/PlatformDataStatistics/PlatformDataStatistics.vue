<template>
  <div class="platform-data-statistics">
    <div class="card_main">
      <div class="header-title">
        <div class="h-left">
          <span class="title_line"></span>
          <span class="title">物流商分布</span>
        </div>
        <div class="h-right">
          <span style="font-size: 15px; margin-right: 10px; color: #333">指标:</span>
          <el-select v-model.number="logisticsForm.waybillClassifyFlag" placeholder="请选择指标" @change="targetChange()" filterable>
            <el-option
              v-for="(item, index) in targetOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="margin-right: 20px;"></span>
          <el-date-picker
            style="width: 400px;"
            v-model="logisticsCreateTime"
            type="daterange"
            @change="logisticsDateChange"
            :picker-options="pickerOptions1"
            clearable
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <span style="margin-right: 20px;"></span>
          <el-select v-model.number="logisticsSelectDay" placeholder="请选择天数" @change="logisticsDayChange(logisticsSelectDay)" filterable>
            <el-option
              v-for="(item, index) in logisticsDayOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="logistics_table">
        <!-- 物流商分布饼图 -->
        <div class="t-left">
          <pie-echarts
            :id="'logistics-pie'"
            :dataArr="pieData"
            :seriesNameData="seriesName"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
        <!-- 物流商分布表格 -->
        <div class="t-right">
          <div class="r-table">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="selectionChange"
              border>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="logisticsName"
                label="物流公司">
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="value"
                :label='seriesName'>
              </el-table-column>
              <el-table-column
                min-width="10%"
                prop="percent"
                label="占比">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="statistics">
        <!-- 用户统计 -->
        <div class="header-search">
          <div class="h-left">
          </div>
          <div class="h-right">
            <el-select v-model="flowForm.logisticsId" placeholder="请选择物流公司" clearable filterable>
              <el-option
                v-for="(item, index) in logisticsOptions"
                :key="index"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
            <!-- <el-input v-model="flowForm.logisticsName" placeholder="请输入物流公司(默认所有)" clearable></el-input> -->
            <span style="margin-right: 20px;"></span>
            <el-button class="btn-main" @click="queryUserStatistics(flowForm.logisticsId)">搜索</el-button>
          </div>
        </div>
        <div class="header-title">
          <div class="h-left">
            <span class="title_line"></span>
            <span class="title">用户统计</span>
          </div>
          <div class="h-right">
          </div>
        </div>
        <div class="user-table">
          <div class="u-t-item">
            <div class="i-header">今日新增用户</div>
            <div class="i-content">
              <div class="value-item">
                <div class="number">{{todayAddUserObj.accountApplicationStatusYes}}</div>
                <div class="text">驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{todayAddUserObj.accountApplicationStatusNo}}</div>
                <div class="text">非驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{todayAddUserObj.companyTypeByAgency}}</div>
                <div class="text">经销商</div>
              </div>
              <div class="value-item">
                <div class="number">{{todayAddUserObj.companyTypeByRepairFactory}}</div>
                <div class="text">修理厂</div>
              </div>
            </div>
          </div>
           <div class="u-t-item">
            <div class="i-header">近7天新增用户</div>
            <div class="i-content">
              <div class="value-item">
                <div class="number">{{sevenAddUserObj.accountApplicationStatusYes}}</div>
                <div class="text">驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{sevenAddUserObj.accountApplicationStatusNo}}</div>
                <div class="text">非驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{sevenAddUserObj.companyTypeByAgency}}</div>
                <div class="text">经销商</div>
              </div>
              <div class="value-item">
                <div class="number">{{sevenAddUserObj.companyTypeByRepairFactory}}</div>
                <div class="text">修理厂</div>
              </div>
            </div>
          </div>
           <div class="u-t-item">
            <div class="i-header">近30天新增用户</div>
            <div class="i-content">
              <div class="value-item">
                <div class="number">{{thirtyAddUserObj.accountApplicationStatusYes}}</div>
                <div class="text">驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{thirtyAddUserObj.accountApplicationStatusNo}}</div>
                <div class="text">非驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{thirtyAddUserObj.companyTypeByAgency}}</div>
                <div class="text">经销商</div>
              </div>
              <div class="value-item">
                <div class="number">{{thirtyAddUserObj.companyTypeByRepairFactory}}</div>
                <div class="text">修理厂</div>
              </div>
            </div>
          </div>
           <div class="u-t-item">
            <div class="i-header">累计用户</div>
            <div class="i-content">
              <div class="value-item">
                <div class="number">{{totalAddUserObj.accountApplicationStatusYes}}</div>
                <div class="text">驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{totalAddUserObj.accountApplicationStatusNo}}</div>
                <div class="text">非驮付宝</div>
              </div>
              <div class="value-item">
                <div class="number">{{totalAddUserObj.companyTypeByAgency}}</div>
                <div class="text">经销商</div>
              </div>
              <div class="value-item">
                <div class="number">{{totalAddUserObj.companyTypeByRepairFactory}}</div>
                <div class="text">修理厂</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 财务流水 -->
        <div class="header-title">
          <div class="h-left">
            <span class="title_line"></span>
            <span class="title">财务流水</span>
          </div>
          <div class="h-right">
            <el-date-picker
              style="width: 400px;"
              v-model="flowCreateTime"
              type="daterange"
              @change="flowDateChange"
              :picker-options="pickerOptions2"
              clearable
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <span style="margin-right: 20px;"></span>
            <el-select v-model.number="flowSelectDay" placeholder="请选择天数" @change="flowDayChange(flowSelectDay)" filterable>
              <el-option
                v-for="(item, index) in statisticsDayOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flow-wrap">
          <div class="flow-item2">
            <div class="number">{{(flowObj.receivableGoodsByOnline*1 + flowObj.receivableGoodsByOffline*1).toFixed(2)}}元</div>
            <div class="text">代收货款总金额<span style="color:red"> (GMV)</span></div>
          </div>
          <div class="flow-item2">
            <div class="number">{{(flowObj.freightByOnline*1 + flowObj.freightByOffline*1).toFixed(2)}}元</div>
            <div class="text">运费总金额</div>
          </div>
          <div class="flow-item2">
            <div class="number">{{flowObj.receivableGoodsByOnline}}元</div>
            <div class="text">驮付宝代收货款</div>
          </div>
          <div class="flow-item2">
            <div class="number">{{flowObj.freightByOnline}}元</div>
            <div class="text">驮付宝运费</div>
          </div>
          <div class="flow-item2">
            <div class="number">{{flowObj.receivableGoodsByOffline}}元</div>
            <div class="text">线下代收货款</div>
          </div>
          <div class="flow-item2">
            <div class="number">{{flowObj.freightByOffline}}元</div>
            <div class="text">线下运费</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieEcharts from '@/components/Echarts/PieEcharts'
import Enums from '@/components/BaseFn/Enums'
import OperationStatisticsAjax from '@/api/OperationStatistics/OperationStatistics'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import { getDay } from '@/tools/tools'
import VPagination from '@/components/Pagination/Pagination'
export default {
  name: 'PlatformDataStatistics',
  data () {
    return {
      logisticsCreateTime: '',
      flowCreateTime: '',
      logisticsSelectDay: -7,
      flowSelectDay: -7,
      seriesName: '运单量',
      logisticsForm: {
        waybillClassifyFlag: 4, // 指标id
        minCreateTime: '', // 开始时间
        maxCreateTime: '' // 截止时间
      },
      flowForm: {
        logisticsId: '', // 物流公司id
        minCreateTime: '', // 开始时间
        maxCreateTime: '' // 截止时间
      },
      tableData: [],
      pieData: [ // 饼图Data
        {}
      ],
      targetOptions: [ // 指标下拉
        {id: 4, name: '运单量'},
        {id: 2, name: '驮付宝应收'},
        {id: 1, name: '线下应收'},
        {id: 3, name: '总应收'}
      ],
      selection: [],
      logisticsDayOptions: [ // 物流商分布时间下拉
        {id: 0, name: '全部'},
        {id: -7, name: '近七天'},
        {id: -30, name: '近30天'}
      ],
      statisticsDayOptions: [ // 流水时间下拉
        {id: 0, name: '全部'},
        {id: -7, name: '近七天'},
        {id: -30, name: '近30天'}
      ],
      logisticsOptions: [], // 物流公司下拉
      todayAddUserObj: {}, // 今日新增用户
      sevenAddUserObj: {}, // 近7日
      thirtyAddUserObj: {}, // 近30天
      totalAddUserObj: {}, // 累计
      flowObj: {}, // 财务流水
      pickerOptions1: {
        disabledDate: this.disabledDate1,
        onPick: this.onPick1
      },
      pickerOptions2: {
        disabledDate: this.disabledDate2,
        onPick: this.onPick2
      },
      minCreateTime1: '',
      maxCreateTime1: '',
      minCreateTime2: '',
      maxCreateTime2: ''
    }
  },
  computed: {
    waybillClassifyFlag () {
      return this.logisticsForm.waybillClassifyFlag
    }
  },
  components: {
    VPagination,
    PieEcharts
  },
  watch: {
    waybillClassifyFlag (newVal, oldVal) {
      switch (newVal) {
        case 4:
          this.seriesName = '运单量'
          break
        case 2:
          this.seriesName = '驮付宝应收'
          break
        case 1:
          this.seriesName = '线下应收'
          break
        case 3:
          this.seriesName = '总应收'
          break
        default:
          break
      }
    }
  },
  created () {
    this.logisticsForm.minCreateTime = getDay(-7)
    this.logisticsForm.maxCreateTime = getDay(0)
    this.flowForm.minCreateTime = getDay(-7)
    this.flowForm.maxCreateTime = getDay(0)
    this.init()
  },
  methods: {
    init () {
      this.queryLogisticsDistribution(this.logisticsForm)
      this.queryUserStatistics()
      this.queryFinancialFlow(this.flowForm)
      this.queryLogistics()
    },
    onPick1 (times) {
      if (times.minDate) {
        this.minCreateTime1 = times.minDate
      } else if (times.maxDate) {
        this.maxCreateTime1 = times.maxDate
      }
    },
    disabledDate1 (time) {
      if (this.minCreateTime1) {
        return time.getTime() < (new Date(this.minCreateTime1).getTime()) || time.getTime() > (new Date(this.minCreateTime1).getTime() + Enums.DURING_TIME)
      } else if (this.maxCreateTime1) {
        return time.getTime() > (new Date(this.maxCreateTime1).getTime()) || time.getTime() < (new Date(this.maxCreateTime1).getTime() - Enums.DURING_TIME)
      } else {
        return false
      }
    },
    onPick2 (times) {
      if (times.minDate) {
        this.minCreateTime2 = times.minDate
      } else if (times.maxDate) {
        this.maxCreateTime2 = times.maxDate
      }
    },
    disabledDate2 (time) {
      if (this.minCreateTime2) {
        return time.getTime() < (new Date(this.minCreateTime2).getTime()) || time.getTime() > (new Date(this.minCreateTime2).getTime() + Enums.DURING_TIME)
      } else if (this.maxCreateTime2) {
        return time.getTime() > (new Date(this.maxCreateTime2).getTime()) || time.getTime() < (new Date(this.maxCreateTime2).getTime() - Enums.DURING_TIME)
      } else {
        return false
      }
    },
    targetChange () { // 指标下拉变化
      this.queryLogisticsDistribution(this.logisticsForm)
    },
    logisticsDateChange (val) { // 物流商分布日期变化
      if (!val) {
        this.logisticsForm.minCreateTime = ''
        this.logisticsForm.maxCreateTime = ''
        this.logisticsCreateTime = ''
      } else {
        this.logisticsSelectDay = ''
        this.minCreateTime1 = ''
        this.maxCreateTime1 = ''
        this.logisticsForm.minCreateTime = val[0]
        this.logisticsForm.maxCreateTime = val[1]
        this.queryLogisticsDistribution(this.logisticsForm)
      }
    },
    flowDateChange (val) { // 财务流水日期变化
      if (!val) {
        this.flowForm.minCreateTime = ''
        this.flowForm.maxCreateTime = ''
        this.flowCreateTime = ''
      } else {
        this.flowSelectDay = ''
        this.minCreateTime2 = ''
        this.maxCreateTime2 = ''
        this.flowForm.minCreateTime = val[0]
        this.flowForm.maxCreateTime = val[1]
        this.queryFinancialFlow(this.flowForm)
      }
    },
    logisticsDayChange (day) { // 物流分布时间下拉变化
      if (day === 0) {
        this.logisticsForm.minCreateTime = ''
        this.logisticsForm.maxCreateTime = ''
        this.logisticsCreateTime = ''
        this.queryLogisticsDistribution(this.logisticsForm)
      } else {
        this.logisticsForm.minCreateTime = getDay(day)
        this.logisticsForm.maxCreateTime = getDay(0)
        this.logisticsCreateTime = ''
        this.queryLogisticsDistribution(this.logisticsForm)
      }
    },
    flowDayChange (day) { // 财务流水时间下拉变化
      if (day === 0) {
        this.flowForm.minCreateTime = ''
        this.flowForm.maxCreateTime = ''
        this.flowCreateTime = ''
        this.queryFinancialFlow(this.flowForm)
      } else {
        this.flowForm.minCreateTime = getDay(day)
        this.flowForm.maxCreateTime = getDay(0)
        this.flowCreateTime = ''
        this.queryFinancialFlow(this.flowForm)
      }
    },
    queryLogisticsDistribution (val) { // 查询物流商分布list
      OperationStatisticsAjax.QueryLogisticsDistributionList(val).then(res => {
        if (res.code === 200) {
          let totalValue = res.data.reduce((pre, next, index, array) => {
            return pre + Number(next.value)
          }, 0)
          this.tableData = res.data.map((item, index) => {
            item.percent = (Number(item.value / totalValue) * 100).toFixed(2) + '%'
            item.rowNum = index + 1
            return item
          })
          this.pieData = res.data.map(item => {
            let obj = {name: '', value: ''}
            obj.name = item.logisticsName
            obj.percent = (Number(item.value / totalValue) * 100).toFixed(2) + '%'
            obj.value = item.value
            return obj
          })
        }
      })
      // console.log(this.pieData)
    },
    queryUserStatistics () { // 用户统计搜索
      OperationStatisticsAjax.QueryUserStatisticsList({logisticsId: this.flowForm.logisticsId}).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.todayAddUserObj = data[0]
          this.sevenAddUserObj = data[1]
          this.thirtyAddUserObj = data[2]
          this.totalAddUserObj = data[3]
          // this.flowForm.minCreateTime = getDay(-7)
          // this.flowForm.maxCreateTime = getDay(0)
          // this.queryFinancialFlow(this.flowForm)
        }
      })
    },
    queryFinancialFlow (val) { // 查询财务流水list
      OperationStatisticsAjax.QueryFlowStatisticsList(val).then(res => {
        if (res.code === 200) {
          this.flowObj = res.data
        }
      })
    },
    queryLogistics (val) { // 物流公司列表
      WaybillApiAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsOptions = res.data
        }
      })
    },
    // 行选中变化
    selectionChange (val) {
      this.selection = val
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.platform-data-statistics {
  display: flex;
  flex: 1;
  -width: 100%;
  -flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  .card_main {
    width: 100%;
    padding: 20px;
    height: 1060px;
    background: #fff;
    -overflow-y: auto;
  }
  .header-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    border-bottom: 1px solid #eee;
    .h-left {
      // width: 100%;
      height: 100%;
      .title {
        display: inline-block;
        color: #333333;
        font-size: 15px;
        margin-left: 7px;
        font-weight: bold;
      }
      .title_line {
        display: inline-block;
        width: 3px;
        height: 13px;
        background-color: #4987fc;
      }
    }
    .h-right {
      height: 50px;
      line-height: 50px;
    }
  }
  .logistics_table {
    width: 100%;
    height: 390px;
    display: flex;
    margin-top: 20px;
    .t-left {
      width: 50%;
      height: 380px;
    }
    .t-right {
      width: 50%;
      height: 380px;
      overflow-y: hidden;
      .r-table {
        height: 100%;
        width: 100%;
      }
    }
  }
  .statistics {
    width: 100%;
    height: 530px;
    padding: 0 20px;
    margin-top: 20px;
    border: 1px solid #ddd;
    .header-search {
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
    }
    .user-table {
      height: 200px;
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      flex: 4;
      border: 1px solid #ddd;
    }
    .u-t-item {
      width: 25%;
      // flex: 1;
      border-right: 1px solid #ddd;
      .i-header {
        height: 50px;
        font-size: 16px;
        text-align: center;
        line-height: 50px;
        background: #eee;
        border-bottom: 1px solid #ddd;
      }
      .i-content {
        height: 150px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 4;
        .value-item {
          width: 25%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .number {
          margin-bottom: 10px;
          font-size: 18px;
          color: #222;
          font-weight: 500;
        }
      }
    }
    .flow-wrap {
      width: 100%;
      height: 150px;
      display: flex;
      margin-top: 10px;
      // padding: 10px 0;
      align-items: center;
      justify-content: space-between;
    }
    .flow-item1 {
      width: 20%;
      height: 130px;
      background: #eee;
      border-radius: 6px;
      display: flex;
      padding: 10px 10px;
      .i-left {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .i-right {
        width: 40%;
        height: 100%;
        border-left: 1px solid #ddd;
      }
      .r-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #ddd;
        width: 100%;
        height: 50%;
      }
      .r-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50%;
      }
      .number {
        margin-bottom: 20px;
        font-size: 18px;
        color: #222;
        font-weight: 500;
      }
      .r-number {
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
    .flow-item2 {
      width: 15%;
      height: 130px;
      background: #eee;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .number {
        margin-bottom: 20px;
        font-size: 18px;
        color: #222;
        font-weight: 500;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.platform-data-statistics {
  .el-select {
    width: 200px;
  }
  .el-input {
    width: 400px;
  }
  .el-table {
    min-height: 370px!important;
  }
}
</style>
