<template>
  <div class="waybill-statistics-list">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="titleName" name="1">
        <div>
          <el-form :inline="true" ref="form" :model="form" label-width="75px">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="下单时间:" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    type="daterange"
                    @change="dateChange"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col v-show="isRevoke" :span="6" :offset="1">
                <el-form-item label="客户:" prop="clientId">
                  <el-select
                    v-model.number="form.clientId"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="searchClient"
                    :loading="loading"
                    clearable
                    placeholder="请选择客户">
                    <el-option
                      v-for="(item,index) in clientIdOptions"
                      :key="index"
                      :label="item.clientName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-show="!isRevoke" :span="6" :offset="1">
                <el-form-item label="线路:" prop="pkLine">
                  <el-select v-model.number="form.pkLine" @change="lineChange" placeholder="请选择线路" clearable filterable>
                    <el-option
                      v-for="item in lineOptions"
                      :key="item.generateKey"
                      :label="item.generateVal"
                      :value="item.generateKey">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-show="!isRevoke" :span="6" :offset="1">
                <el-form-item label="班次:" prop="shiftId">
                  <el-select :disabled="disabledShift" v-model.number="form.shiftId" placeholder="请选择班次" clearable filterable>
                    <el-option
                      v-for="item in shiftOptions"
                      :key="item.shiftId"
                      :label="item.departureTime"
                      :value="item.shiftId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-show="!isRevoke" :span="6" :offset="1">
                <el-form-item label="司机:" prop="driverId">
                  <el-select v-model.number="form.driverId" placeholder="请选择司机" clearable filterable>
                    <el-option
                      v-for="item in driverOptions"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-show="!isRevoke" :span="6" :offset="1">
                <el-form-item label="客户:" prop="clientId">
                  <el-select
                    v-model.number="form.clientId"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="searchClient"
                    :loading="loading"
                    clearable
                    placeholder="请选择客户">
                    <el-option
                      v-for="(item,index) in clientIdOptions"
                      :key="index"
                      :label="item.clientName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="btns">
              <el-button class="btn-main" type="primary" @click="search">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="main-con">
      <!-- 合计 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">合计</div>
      </div>
      <div class="block-con">
        <div v-if="!isRevoke" class="div-item">
          <div class="value">{{countData.statisticsSumVo.deliverGoodsNumber}}</div>
          <div class="label-text">发货单数</div>
        </div>
        <div v-else class="div-item">
          <div class="value">{{countData.statisticsSumVo.returnGoodsNumber}}</div>
          <div class="label-text">退货单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.packageNumber}}</div>
          <div class="label-text">包裹数量</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.receivableTotalAmount}}</div>
          <div class="label-text">应收总金额</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.freightTotalAmount}}</div>
          <div class="label-text">运费总金额</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.collectionTotalAmount}}</div>
          <div class="label-text">代收总金额</div>
        </div>
      </div>
      <!-- 运单 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">运单</div>
      </div>
      <!-- 发货运单 -->
      <div v-if="!isRevoke" class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.waitDeliverGoodsNumber}}</div>
          <div class="label-text">待发货单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.transportationNumber}}</div>
          <div class="label-text">运输中单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.signNumber}}</div>
          <div class="label-text">已签收单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.rejectionNumber}}</div>
          <div class="label-text">已拒收单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.cancelNumber}}</div>
          <div class="label-text">已取消单数</div>
        </div>
      </div>
      <!-- 退货运单 -->
      <div v-else class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.waitPutInStorageNumber}}</div>
          <div class="label-text">待入库单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.waitReturnGoodsNumber}}</div>
          <div class="label-text">待退货单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.completeNumber}}</div>
          <div class="label-text">已完成单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.cancelNumber}}</div>
          <div class="label-text">已取消单数</div>
        </div>
      </div>
      <!-- 金额 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">金额</div>
      </div>
      <!-- 发货运单 -->
      <div v-if="!isRevoke" class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.receivableFreightTotalAmount}}</div>
          <div class="label-text">运费总金额</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.netReceiptsFreightTotalAmount}}</div>
          <div class="label-text">实收运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.noFreightTotalAmount}}</div>
          <div class="label-text">未收运费</div>
        </div>
        <!-- 月结运费 -->
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.monthSettlementTotalAmount}}</div>
          <div class="label-text">月结运费</div>
        </div>
        <!-- 现付运费 -->
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.nowPayFreightTotalAmount}}</div>
          <div class="label-text">现付运费</div>
        </div>
      </div>
      <!-- 发货运单 -->
      <div v-if="!isRevoke" class="block-con last-block">
        <!-- 到付运费 -->
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.toPayFreightTotalAmount}}</div>
          <div class="label-text">到付运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.receivableCollectionTotalAmount}}</div>
          <div class="label-text">代收总金额</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.netReceiptsCollectionTotalAmount}}</div>
          <div class="label-text">实收代收</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.noCollectionTotalAmount}}</div>
          <div class="label-text">未收代收</div>
        </div>
      </div>
      <!-- 退货运单 -->
      <div v-if="isRevoke" class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.receivableFreightTotalAmount}}</div>
          <div class="label-text">运费总金额</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.netReceiptsFreightTotalAmount}}</div>
          <div class="label-text">实收运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.noFreightTotalAmount}}</div>
          <div class="label-text">未收运费</div>
        </div>
        <!-- 月结运费 -->
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.monthSettlementTotalAmount}}</div>
          <div class="label-text">月结运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.receivableCollectionTotalAmount}}</div>
          <div class="label-text">代收总金额</div>
        </div>
      </div>
      <div v-if="isRevoke" class="block-con last-block">
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.netReceiptsCollectionTotalAmount}}</div>
          <div class="label-text">实收代收</div>
        </div>
        <!-- 未收代收 -->
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo.noCollectionTotalAmount}}</div>
          <div class="label-text">未收代收</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WaybillStatisticsAjax from '@/api/WaybillStatistics/WaybillStatistics'
import waybillManageAjax from '@/api/WaybillManage/WaybillManage'
import WaybillApiAjax from '@/api/WaybillManage/WaybillApi'
import { mapGetters } from 'vuex'
export default {
  name: 'WaybillStatisticsList',
  data () {
    return {
      loading: false,
      clientName: '',
      titleName: '发货运单',
      clientIdOptions: [],
      activeNames: ['1'],
      driverOptions: [],
      lineOptions: [],
      shiftOptions: [],
      isRevoke: false,
      disabledShift: true,
      form: {
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        pkLine: '', // 线路
        driverId: '', // 司机
        shiftId: '', // 班次
        clientId: '' // 客户id
      },
      countData: {
        statisticsSumVo: {}, // 合计
        statisticsWaybillVo: {}, // 运单
        statisticsAmountVo: {} // 金额
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'WaybillStatisticsList') {
        if (to.query) {
          this.pageType = to.query.index
          if (this.pageType !== '') {
            if (this.pageType === 'send') { // 发货运单
              this.titleName = '发货运单'
              this.isRevoke = false
            } else if (this.pageType === 'revoke') { // 退货运单
              this.titleName = '退货运单'
              this.isRevoke = true
            }
            this.resetForm()
            this.search()
            this.getClient(this.clientName)
          }
        }
      }
    },
    deep: true
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  created () {
    this.pageType = this.$route.query.index
    if (this.pageType !== '') {
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
      if (this.pageType === 'send') { // 发货运单
        this.titleName = '发货运单'
        this.isRevoke = false
      } else if (this.pageType === 'revoke') { // 退货运单
        this.titleName = '退货运单'
        this.isRevoke = true
      }
      this.search()
    }
    this.init()
  },
  methods: {
    init (type) {
      // this.getClientData()
      this.queryLines()
      this.queryDrivers()
      this.search()
      this.getClient(this.clientName)
    },
    getClient (val) {
      waybillManageAjax.QueryClient({clientName: val}).then(res => {
        if (res.code === 200) {
          this.clientIdOptions = res.data
          this.loading = false
        }
      })
    },
    searchClient (query) {
      if (query !== '') {
        this.loading = true
        this.getClient(query)
      } else {
        this.getClient(this.clientName)
      }
    },
    // getClientData (val) { // 1修理厂2经销商
    //   waybillManageAjax.GetClientData(val).then(res => {
    //     if (res.code === 200) {
    //       let temp = [...res.data[1].concat(res.data[2])]
    //       let hash = {}
    //       let result = temp.reduce((item, next) => {
    //         if (!hash[next.id]) {
    //           hash[next.id] = true
    //           item.push(next)
    //         }
    //         return item
    //       }, [])
    //       this.clientIdOptions = result
    //     }
    //   })
    // },
    // 查询线路
    queryLines () {
      WaybillStatisticsAjax.GetLines().then((response) => {
        if (response.code === 200) {
          this.lineOptions = response.data
        }
      })
    },
    // 查询司机
    queryDrivers () {
      WaybillStatisticsAjax.QueryDrivers().then((response) => {
        if (response.code === 200) {
          this.driverOptions = response.data
        }
      })
    },
    dateChange (val) {
      if (!val) {
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      } else {
        this.form.createTimeStart = val[0]
        this.form.createTimeEnd = val[1]
      }
    },
    lineChange (val) {
      this.form.shiftId = ''
      this.shiftOptions = []
      if (val === '') {
        this.disabledShift = true
        return false
      } else {
        if (this.form.createTimeStart === this.form.createTimeEnd) {
          this.queryShiftByLine(val)
        } else {
          this.$notify({
            message: '只能查询同一天运行班次！',
            type: 'error'
          })
          this.shiftOptions = []
          this.form.shiftId = ''
        }
      }
    },
    // 查询路线下班次
    queryShiftByLine (lineId) {
      WaybillApiAjax.shiftList({lineId: lineId, beginDate: this.form.createTimeStart, endDate: this.form.createTimeEnd}).then((response) => {
        if (response.code === 200) {
          this.disabledShift = false
          this.shiftOptions = response.data
        }
      })
    },
    search () {
      let postData = {
        createTimeStart: this.form.createTimeStart,
        createTimeEnd: this.form.createTimeEnd,
        pkLine: this.form.pkLine,
        clientId: this.form.clientId,
        shiftIdList: this.form.shiftId === '' ? [] : [this.form.shiftId],
        waybillTypeList: []
      }
      if (this.isRevoke) { // 退货运单
        postData.waybillTypeList = [2]
      } else { // 发货运单
        postData.waybillTypeList = [1, 3]
        postData.driverId = this.form.driverId
      }
      WaybillStatisticsAjax.QueryTotalData(postData).then((response) => {
        if (response.code === 200) {
          for (let prop in this.countData) {
            this.countData[prop] = {}
          }
          this.countData.statisticsSumVo = Object.assign({}, response.data.statisticsSumVo)
          this.countData.statisticsWaybillVo = Object.assign({}, response.data.statisticsWaybillVo)
          this.countData.statisticsAmountVo = Object.assign({}, response.data.statisticsAmountVo)
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = [this.formatCurrentDate(), this.formatCurrentDate()]
      this.form.createTimeStart = this.formatCurrentDate()
      this.form.createTimeEnd = this.formatCurrentDate()
    }
  }
}
</script>
<style lang="less">
@import '../../../style/base.less';
.waybill-statistics-list{
  .el-form-item{
    width: 100%!important;
    .el-form-item__label{
      width: 30%!important;
    }
    .el-form-item__content{
      width: 70%!important;
      .el-form--inline .el-select{
        width: 100%!important;
      }
    }
    .el-input__inner{
      width: 100%!important;
      height: 32px!important;
    }
    .el-select{
      width: 100%!important;
    }
  }
  .el-form{
    .el-row{
      margin-bottom: 20px;
    }
  }
  .el-date-editor .el-range-separator{
    width: 10%!important;
  }
  .el-collapse-item__header{
    text-indent: 39px;
    font-size: 16px;
  }
  .btns{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-select .el-input.is-disabled .el-input__inner{
    height: 32px;
  }
}
</style>
<style lang="less" scope>
@import '../../../style/base.less';
.waybill-statistics-list{
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  flex-direction: column;
  .el-collapse{
    width: 100%;
    .el-collapse-item{
      margin: 30px;
    }
  }
  .main-con{
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0px 40px 40px 40px;
    margin: 30px;
    margin-top: 0px;
    background: #fff;
    overflow-y: auto;
    .common-title{
      display: block;
      width: 100%;
      margin-bottom: 22px;
      height: 66px;
      border-bottom: 1px solid #f0f0f0;
      .bg-icon{
        float: left;
        height: 16px;
        width: 3px;
        margin-top: 31px;
        background: #5677fc;
      }
      .text{
        float: left;
        margin-left: 12px;
        width: 40px;
        height: 66px;
        line-height: 80px;
        .mixin-sc(16px; #333)
      }
    }
    .block-con{
      width: 100%;
      min-height: 94px;
      height: auto;
      display: flex;
      flex-direction: row;
      .div-item{
        height: 94px;
        width: 15.6%;
        margin-right: 1%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f7f7f7;
        .value{
          height: 20px;
          .mixin-sc(20px; #333)
        }
        .label-text{
          margin-top: 15px;
          height: 14px;
          .mixin-sc(12px; #666)
        }
      }
      .div-item:hover{
        background: #7e98ff;
        .value{
          color: #fff;
        }
        .label-text{
          color: #fff;
        }
      }
    }
    .last-block{
      margin-top: 10px;
    }
  }
}
</style>
