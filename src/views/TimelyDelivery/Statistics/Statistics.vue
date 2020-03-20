<template>
  <div class="waybill-statistics-list">
    <div class="search-con">
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
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="员工:" prop="driver">
              <el-select v-model="form.driver" placeholder="请选择员工" clearable filterable>
                <el-option
                  v-for="item in driverOptions"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="客户名称:" prop="clientName">
              <el-select v-model="form.clientName" placeholder="请选择配件商/修理厂" clearable filterable>
                <el-option
                  v-for="item in clientOptions"
                  :key="item.id"
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
    <div class="main-con">
      <!-- 运单 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">运单</div>
      </div>
      <div class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.deliverGoodsNumber || 0}}</div>
          <div class="label-text">发货单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.signingGoodsNumber || 0}}</div>
          <div class="label-text">签收单数</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.rejectionGoodsNumber || 0}}</div>
          <div class="label-text">拒收单量</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsSumVo.cancelNumber || 0}}</div>
          <div class="label-text">取消单量</div>
        </div>
      </div>
      <!-- 运费 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">运费</div>
      </div>
      <div class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.freightTotalAmount || 0}}</div>
          <div class="label-text">运费总金额</div>
        </div>
        <!-- <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.senderFreightTotalAmount || 0}}</div>
          <div class="label-text">发货方付运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.receiveFreightTotalAmount || 0}}</div>
          <div class="label-text">收货方付运费</div>
        </div>
        <div class="div-item">
          <div class="value">{{countData.statisticsWaybillVo.subsidyFreight || 0}}</div>
          <div class="label-text">补贴</div>
        </div> -->
      </div>
      <!-- 代收 -->
      <div class="common-title">
        <div class="bg-icon"></div>
        <div class="text">代收</div>
      </div>
      <div class="block-con">
        <div class="div-item">
          <div class="value">{{countData.statisticsAmountVo || 0}}</div>
          <div class="label-text">代收总金额</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticsAjax from '@/api/TimelyDeliveryApi/Statistics'
import FreightCheckAjax from '@/api/TimelyDeliveryApi/FreightCheckApi'

import { mapGetters } from 'vuex'
import Enums from '@/components/BaseFn/Enums'

export default {
  name: 'WaybillStatisticsList',
  data () {
    return {
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      driverOptions: [], // 司机下拉
      clientOptions: [], // 客户下拉
      form: {
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 截止时间
        createTime: '', // 开单时间
        driver: '', // 司机
        clientName: '' // 客户
      },
      countData: {
        statisticsSumVo: {}, // 运单
        statisticsWaybillVo: {}, // 运费
        statisticsAmountVo: '' // 代收
      }
    }
  },
  computed: {
    ...mapGetters(['formatCurrentDate'])
  },
  created () {
    this.init()
  },
  methods: {
    disabledDate (time) {
      return time.getTime() > Date.now() || time.getTime() < (new Date(this.getDateStr(0)).getTime() - Enums.DURING_TIME)
    },
    init (type) {
      this.search()
      this.searchDriver()
      this.queryFlashLogisticsClient()
      this.form.createTime = [this.getDateStr(-30), this.getDateStr(0)]
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
    search () {
      StatisticsAjax.QueryFlashWaybillStatistics(this.form).then((response) => {
        if (response.code === 200) {
          for (let prop in this.countData) {
            this.countData[prop] = {}
          }
          this.countData.statisticsSumVo = Object.assign({}, response.data.flashStatisticsWaybillVo)
          this.countData.statisticsWaybillVo = Object.assign({}, response.data.flashStatisticsFreightVo)
          this.countData.statisticsAmountVo = response.data.flashStatisticsReceivableVo
        }
      })
    },
    searchDriver () {
      FreightCheckAjax.QueryStaffList().then((response) => {
        if (response.code === 200) {
          this.driverOptions = response.data
        }
      })
    },
    queryFlashLogisticsClient () {
      StatisticsAjax.queryFlashLogisticsClient({clientType: ''}).then((response) => {
        if (response.code === 200) {
          this.clientOptions = response.data
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
      this.form.createTime = [this.getDateStr(-30), this.getDateStr(0)]
      this.form.createTimeStart = this.getDateStr(-30)
      this.form.createTimeEnd = this.getDateStr(0)
    }
  }
}
</script>
<style lang="less">
@import '../../../style/base.less';
.waybill-statistics-list{
  .search-con{
    background: #fff;
    margin: 20px 30px;
  }
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
    margin: 15px auto;
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
