<template>
  <div class="dealer-account">
    <!-- <div v-if="hasRegister" class="title-con">资金账户</div> -->
    <account-and-bank
      :parentPage="'dealer'"
      @query-account-success="queryAcountSuccess"
      v-if="hasRegister"
    />
    <!-- 经销商端 -->
    <!-- 申请开通 -->
    <registration-clause v-if="!hasRegister && !goToRegisterFlag" @go-to-tegister = 'goToRegister' :isReadRegister='isReadRegister'/>
    <!-- <iframe v-if="goToRegisterFlag && !hasRegister" :src="iframeSrc"></iframe> -->
    <register-logistics-pay v-if="goToRegisterFlag && !hasRegister" @regist-success = 'registSuccess'/>
    <!-- 资金账户 -->
    <div v-if="hasRegister" class="my-account">
      <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="提现记录" name="first">
          <div class="search-con">
            <el-form :inline="true" ref="withdrawDepositForm" :model="withdrawDepositForm" class="demo-form-inline" label-width="95px">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="处理状态:" prop="dealStatus">
                    <el-select v-model="withdrawDepositForm.dealStatus" placeholder="请选择处理状态" clearable>
                      <el-option
                        v-for="item in stateList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="date-item" label="提现发起时间:" prop="time">
                    <el-date-picker
                      v-model="withdrawDepositForm.time"
                      type="daterange"
                      @change="withdrawDepositDateChange"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="date-item" label="提现成功时间:" prop="time1">
                    <el-date-picker
                      v-model="withdrawDepositForm.time1"
                      type="daterange"
                      @change="depositDateChange"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :offset="1">
                  <el-form-item class="date-item">
                    <el-button @click="search('1')">搜索</el-button>
                  </el-form-item>
                </el-col>
                <el-col class="export-con" :span="4" :offset="0">
                  <el-button class="btn-main" @click="exportExcel('1')">导出</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- <div class="btns-con">
            <el-button @click="exportExcel('1')">导出</el-button>
          </div> -->
          <!-- 提现记录表格 -->
          <div class="table-con">
            <el-table
              :data="withdrawDepositTableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="withdrawSelectionChange"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="5%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="10%"
                label="操作">
                <template slot-scope="scope">
                  <a class="check" href="javascript:;" type="text" size="small" @click="check(scope.row)">查看明细</a>
                </template>
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="withdrawCashTime"
                label="提现发起时间">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="withdrawCashAmount"
                label="提现金额（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="formalityFee"
                label="手续费用（元）"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="actualArrivalAmount"
                label="实际到账金额（元）"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="dealStatusName"
                label="处理状态"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="20%"
                prop="bankPaymentTime"
                label="提现成功时间">
              </el-table-column>
            </el-table>
          </div>
          <div class="bottom-con">
            <div class="total"></div>
            <!-- <div class="total">总金额：{{withdrawTotalFrontShow || 0}}元</div> -->
            <v-pagination
              :pageSize=withdrawPagination.pageSize
              :total=withdrawPagination.total
              :currentPage=withdrawPagination.pageNum
              :dom="this.$refs.withdrawDepositForm"
              :clickSearch="withdrawClickSearch"
              @change-page-size="withdrawChangePageSize"
              @change-page="withdrawChangePage"
              class="pagination"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="代收货款信息查询" name="second">
          <div class="search-con">
            <el-form :inline="true" ref="commissionForm" :model="commissionForm" class="demo-form-inline" label-width="95px">
              <el-row>
                <el-col :span="7">
                  <el-form-item class="date-item" label="开单日期:" prop="time">
                    <el-date-picker
                      v-model="commissionForm.time"
                      type="daterange"
                      @change="commissionFormDateChange"
                      clearable
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="支付方式:" prop="paymentMethod">
                    <el-select v-model="commissionForm.paymentMethod" placeholder="请选择支付方式">
                      <el-option
                        v-for="item in paymentMethodList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="提现状态:" prop="withdrawStatus">
                    <el-select v-model="commissionForm.withdrawStatus" placeholder="请选择提现状态">
                      <el-option
                        v-for="item in withdrawStatusList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="运单号:" prop="waybillNumber">
                    <el-input v-model="commissionForm.waybillNumber" placeholder="请输入运单号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" :offset="1">
                  <el-form-item class="date-item">
                    <el-button @click="search('2')">搜索</el-button>
                  </el-form-item>
                </el-col>
                <el-col class="export-con" :span="1" :offset="1">
                  <el-button class="btn-main" @click="exportExcel('2')">导出</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- <div class="btns-con">
            <el-button @click="exportExcel('2')">导出</el-button>
          </div> -->
          <!-- 代收货款流水表格 -->
          <div class="table-con">
            <el-table
              :data="commissionTableData"
              style="width: 100%"
              stripe
              height="'100%'"
              @selection-change="commissionSelectionChange"
              border>
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="6%"
                prop="rowNum"
                label="序号">
              </el-table-column>
              <el-table-column
                min-width="18%"
                prop="createTime"
                label="开单日期">
              </el-table-column>
              <el-table-column
                min-width="18%"
                prop="receivableGoodsAmount"
                label="代收货款金额（元）">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="poundageFeeRate"
                label="手续费率（%）"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="15%"
                prop="poundageFee"
                label="手续费用（元）"
                :render-header="renderColTip">
              </el-table-column>
              <el-table-column
                min-width="18%"
                prop="actualGoodsAmount"
                label="实收货款金额（元）"
                :render-header="renderColTip">
              </el-table-column>
              <!-- <el-table-column
                min-width="13%"
                prop="waybillStatusName"
                label="运输状态">
              </el-table-column> -->
              <el-table-column
                min-width="11%"
                prop="paymentMethodName"
                label="支付方式"
                :render-header="renderColTip">
              </el-table-column>
              <!-- <el-table-column
                min-width="15%"
                prop="settlementStatusName"
                label="结算状态">
              </el-table-column> -->
              <el-table-column
                min-width="11%"
                prop="withdrawStatusName"
                label="提现状态">
              </el-table-column>
              <el-table-column
                min-width="22%"
                prop="waybillNumber"
                label="运单">
                <template slot-scope="scope">
                  <router-link tag="a" target="_blank" :to="{name:'DistributorWaybillManageDetail', query:{waybillId: scope.row.waybillId}}">{{scope.row.waybillNumber}}</router-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="bottom-con">
            <div class="total"></div>
            <!-- <div class="total">总金额：{{commissionTotalShow || 0}}元</div> -->
            <v-pagination
              :pageSize=commissionPagination.pageSize
              :total=commissionPagination.total
              :currentPage=commissionPagination.pageNum
              :dom="this.$refs.commissionForm"
              :clickSearch="commissionClickSearch"
              @change-page-size="commissionChangePageSize"
              @change-page="commissionChangePage"
              class="pagination"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <v-dialog
      v-if="isFirstRegistSuccess"
      title="提示"
      :width="'486px'"
      mainText="注册成功，是否添加提现银行卡？"
      :closeClickModal="false"
      :cancelBtn="'再等等'"
      :sureBtn="'去绑卡'"
      :dialogVisible="isFirstRegistSuccess"
      @click-cancel="isFirstRegistSuccess = false"
      @click-sure="firstReSuccess"
    />
    <bind-success-dialog
      v-if="showBindSuccess"
      :dialogVisible="showBindSuccess"
      @click-cancel="showBindSuccess = false"
      @click-sure="goWithdraw"
    />
    <v-dialog
      v-if="authenticationDialogShow"
      title="提示"
      :width="'486px'"
      mainText="为提升您账户的资金安全及到账时效，驮付宝即将与平安银行进一步合作，升级资金通道，请您按照系统提示步骤进行资金账户升级，感谢您的谅解与配合！"
      :closeClickModal="false"
      :sureBtn="'确定'"
      :dialogVisible="authenticationDialogShow"
      :showCancel="false"
      @click-sure="nextMethods"
      :closeShow='false'
      :closeByEsc="false"
    />
    <authenticationDialog
      v-if="dialogFormVisible"
      :closeClickModal="false"
      :dialogFormVisible = dialogFormVisible
      @click-cancel="dialogFormVisible = false"
      @shouldCloseDIalog="willCloseDialog"
      :formInfo = formProps
    />
  </div>
</template>

<script>
import AccountAndBank from '../FundsAccount/subpage/AccountAndBank'
import RegistrationClause from './subpage/RegistrationClause'
import FundsAccountAjax from '@/api/FundsAccount/FundsAccount'
import DealerAccountAjax from '@/api/DealerAccount/DealerAccount'
import VPagination from '@/components/Pagination/Pagination'
import CommonAxios from '@/api/Common/CommonAxios'
import RegisterLogisticsPay from '@/views/ServiceCenter/RegisterLogisticsPay/RegisterLogisticsPay'
import RegisterLogisticsPayAndBindingCard from '@/api/RegisterLogisticsPayAndBindingCard/RegisterLogisticsPayAndBindingCard'
import VDialog from '@/components/Dialog/Dialog'
import BindSuccessDialog from '../RegisterLogisticsPay/BindSuccessDialog'
import AuthenticationDialog from './subpage/Authentication'
export default {
  name: 'DealerAccount',
  data () {
    return {
      formProps: {}, // 传给切换新钱包弹窗
      authenticationDialogShow: false,
      dialogFormVisible: false,
      showBindSuccess: false,
      isFirstRegistSuccess: false,
      goToRegisterFlag: false, // 是否跳转至注册页
      isReadRegister: true, // 是否阅读协议
      hasRegister: true,
      iframeSrc: '',
      activeName: 'first',
      withdrawDepositForm: { // 提现记录查询表单
        dealStatus: '',
        time: '', // 申请提现时间
        withdrawCashTimeStart: '', // 申请提现时间起
        withdrawCashTimeEnd: '', // 申请提现时间止
        time1: '', // 银行处理时间
        bankPaymentTimeStart: '', // 银行处理时间起
        bankPaymentTimeEnd: '' // 银行处理时间止
      },
      // stateList: [{id: '', name: '全部'}, {id: 2, name: '已打款'}, {id: 1, name: '处理中'}], // 提现记录处理状态
      stateList: [{id: '', name: '全部'}, {id: 1, name: '处理中'}, {id: 2, name: '成功'}, {id: 3, name: '失败'}], // 提现记录处理状态
      withdrawDepositTableData: [], // 提现记录表数据
      withdrawSelection: [],
      // withdrawTotal: '',
      withdrawPagination: {pageSize: 10, total: 0, pageNum: 1}, // 提现记录分页
      withdrawClickSearch: false,
      /* ------------------------------------------------------------------------------------------------------- */
      commissionForm: { // 代收货款流水查询表单
        time: '', // 到账时间
        paymentMethod: '', // 支付方式
        createTimeStart: '', // 开单日期起
        createTimeEnd: '', // 开单日期止
        // waybillStatus: '', // 运单状态
        withdrawStatus: '', // 提现状态
        waybillNumber: '' // 运单号
      },
      // wayBillStateList: [{id: 1, name: '待签收'}, {id: 2, name: '已签收'}], // 代收货款流水-运单状态
      paymentMethodList: [{id: '', name: '全部'}, {id: 4, name: '在线支付'}, {id: 5, name: '物流公司代付'}], // 代收货款流水-支付方式
      withdrawStatusList: [{id: '', name: '全部'}, {id: 5, name: '未提现'}, {id: 4, name: '已提现'}], // 代收货款流水-提现状态
      commissionTableData: [], // 代收货款流水
      commissionSelection: [],
      // commissionTotal: '',
      commissionPagination: {pageSize: 10, total: 0, pageNum: 1}, // 代收货款流水分页
      commissionClickSearch: false
    }
  },
  components: {
    AccountAndBank,
    VPagination,
    RegistrationClause,
    RegisterLogisticsPay,
    VDialog,
    BindSuccessDialog,
    AuthenticationDialog
  },
  computed: {
    // 物流公司提现总金额(提现合计)
    // withdrawTotalFrontShow () {
    //   if (this.withdrawSelection.length < 1) {
    //     return this.withdrawTotal
    //   } else {
    //     return this.withdrawSelection.reduce((pre, next, index, array) => {
    //       return Number(pre) + Number(next.withdrawCashAmount)
    //     }, 0).toFixed(2)
    //   }
    // },
    // 物流公司佣金总金额(分成收入合计)
    // commissionTotalShow () {
    //   if (this.commissionSelection.length < 1) {
    //     return this.commissionTotal
    //   } else {
    //     return this.commissionSelection.reduce((pre, next, index, array) => {
    //       return Number(pre) + Number(next.actualGoodsAmount)
    //     }, 0).toFixed(2)
    //   }
    // }
  },
  created () {
    this.init()
  },
  methods: {
    willCloseDialog (flag) {
      if (flag) {
        this.dialogFormVisible = false
      }
    },
    nextMethods () {
      this.authenticationDialogShow = false
      this.dialogFormVisible = true
    },
    // 查询当前账号钱包状态，看是否需要切换钱包
    queryStatus () {
      DealerAccountAjax.QueryNewWalletStatus().then(response => {
        if (response.code === 200) {
          if (response.data) {
            this.formProps = response.data
            if (response.data.status === 1) {
              this.authenticationDialogShow = true
            }
          }
        }
      })
    },
    // 绑卡成功模态框点击去提现
    goWithdraw () {
      let userInfo = sessionStorage.getItem('userInfo')
      let companyType = JSON.parse(userInfo).companyType
      if (companyType === 2) { // 经销商
        this.$router.push({name: 'WithdrawalOperation'})
      } else {
        this.showBindSuccess = false
      }
    },
    // 注册成功回调
    registSuccess () {
      this.hasRegister = true
      this.isFirstRegistSuccess = true
    },
    // 模态框去绑卡
    firstReSuccess () {
      this.$router.push({name: 'BindingCard'})
    },
    goToRegister (val) {
      if (val === 'true') {
        this.goToRegisterFlag = true
      } else {
        this.hasRegister = true
      }
    },
    init () {
      if (this.$route.query && this.$route.query.bindBankSuccess) { // 刚绑卡成功跳转到资金账户的
        this.showBindSuccess = true
      }
      this.queryState()
      this.queryStatus()
    },
    renderColTip (h, {column, $index}) {
      let colProp = column.property
      let colTipText = ''
      switch (colProp) {
        case 'formalityFee': // 手续费用
          colTipText = '该笔提现向银行通道支付的手续费用'
          break
        case 'actualArrivalAmount': // 实际到账金额
          colTipText = '扣除通道手续费后，实际到银行卡金额'
          break
        case 'dealStatusName': // 处理状态
          colTipText = '银行对该笔提现目前的处理状态'
          break
        case 'poundageFeeRate': // 手续费率
          colTipText = '驮付宝服务使用手续费率'
          break
        case 'poundageFee': // 手续费用
          colTipText = '使用驮付宝服务产生的手续费用'
          break
        case 'actualGoodsAmount': // 实收货款金额
          colTipText = '扣除驮付宝使用手续费后实际到账的代收货款金额'
          break
        case 'paymentMethodName': // 支付方式
          colTipText = '该笔代收货款修理厂选择的支付方式'
          break
        default:
          break
      }
      return (
        <div class="render-col-header">
          <span>{column.label}</span>
          <i class="el-icon-warning">
            <div class="tip-con">{colTipText}</div>
            <div class="tip-icon"></div>
          </i>
        </div>
      )
    },
    check (val) {
      this.$router.push({name: 'WithdrawalDetail', query: {transactionId: val.transactionId}})
    },
    // 查询用户状态
    // queryState () {
    //   CommonAxios.QueryUserState().then((response) => {
    //     if (response.code === 200) {
    //       let {data} = response
    //       sessionStorage.setItem('registerStatus', response.data)
    //       if (data === 1 || data === 2) {
    //         this.hasRegister = false
    //         // this.queryUrl()
    //       } else if (data === 3) {
    //         CommonAxios.queryFlagByUserIdProtocolType({protocolType: 2}).then((response) => { // 判断已注册驮付宝用户是否已读协议
    //           if (response.code === 200) {
    //             if (response.result) {
    //               this.hasRegister = true
    //             } else {
    //               this.isReadRegister = false
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    queryState () {
      RegisterLogisticsPayAndBindingCard.QueryFundAccountRegisterStatus().then((response) => {
        if (response.code === 200) {
          let {data} = response
          sessionStorage.setItem('registerStatus', response.data)
          if (data === 1) {
            this.hasRegister = false
            // this.queryUrl()
          } else if (data === 0) {
            CommonAxios.queryFlagByUserIdProtocolType({protocolType: 2}).then((response) => { // 判断已注册驮付宝用户是否已读协议
              if (response.code === 200) {
                if (response.result) {
                  this.hasRegister = true
                } else {
                  this.isReadRegister = false
                }
              }
            })
          }
        }
      })
    },
    // 查询账户信息完成回调
    queryAcountSuccess () {
      this.dealCanWithdraw()
    },
    // 处理可提现接口
    dealCanWithdraw () {
      DealerAccountAjax.DealCanWithdraw().then(response => {
        if (response.code === 200) {
          this.quertyTabList()
        }
      })
    },
    // 查询页签列表数据
    quertyTabList () {
      this.queryWithdrawList()
      this.queryCommissionList()
    },
    queryUrl () {
      FundsAccountAjax.GetIframeUrl().then(response => {
        if (response.code === 200) {
          if (response.data) {
            this.iframeSrc = response.data
          }
        }
      })
    },
    handleClick (val) {
      if (val.name === 'first') { // 提现记录
        this.queryWithdrawList('searchBtn')
      } else if (val.name === 'second') { // 佣金收入
        this.queryCommissionList('searchBtn')
      }
    },
    // 提现记录复选框改变
    withdrawSelectionChange (val) {
      this.withdrawSelection = val
    },
    // 佣金收入复选框改变
    commissionSelectionChange (val) {
      this.commissionSelection = val
    },
    // 提现记录申请提现时间变化
    withdrawDepositDateChange (val) {
      if (!val) {
        this.withdrawDepositForm.withdrawCashTimeStart = ''
        this.withdrawDepositForm.withdrawCashTimeEnd = ''
      } else {
        this.withdrawDepositForm.withdrawCashTimeStart = val[0]
        this.withdrawDepositForm.withdrawCashTimeEnd = val[1]
      }
    },
    // 提现记录银行处理时间
    depositDateChange (val) {
      if (!val) {
        this.withdrawDepositForm.bankPaymentTimeStart = ''
        this.withdrawDepositForm.bankPaymentTimeEnd = ''
      } else {
        this.withdrawDepositForm.bankPaymentTimeStart = val[0]
        this.withdrawDepositForm.bankPaymentTimeEnd = val[1]
      }
    },
    // 佣金收入到账时间改变
    commissionFormDateChange (val) {
      if (!val) {
        this.commissionForm.createTimeStart = ''
        this.commissionForm.createTimeEnd = ''
      } else {
        this.commissionForm.createTimeStart = val[0]
        this.commissionForm.createTimeEnd = val[1]
      }
    },
    // 提现记录每页条数改变
    withdrawChangePageSize (pageSize) {
      this.withdrawPagination.pageNum = 1
      this.withdrawPagination.pageSize = pageSize
      this.queryWithdrawList()
    },
    // 提现记录页数改变
    withdrawChangePage (pageSize, pageNumber) {
      this.withdrawPagination.pageNum = pageNumber
      this.queryWithdrawList()
    },
    // 佣金收入每页条数改变
    commissionChangePageSize (pageSize) {
      this.commissionPagination.pageNum = 1
      this.commissionPagination.pageSize = pageSize
      this.queryCommissionList()
    },
    // 佣金收入页数改变
    commissionChangePage (pageSize, pageNumber) {
      this.commissionPagination.pageNum = pageNumber
      this.queryCommissionList()
    },
    // 查询
    search (type) {
      if (type === '1') { // 经销商提现记录
        this.queryWithdrawList('searchBtn')
      } else {
        this.queryCommissionList('searchBtn')
      }
    },
    // 查询提现记录列表
    queryWithdrawList (type) {
      let params = {...this.withdrawDepositForm}
      params.currentPage = type === 'searchBtn' ? 1 : this.withdrawPagination.pageNum
      params.pageSize = this.withdrawPagination.pageSize
      if (type === 'searchBtn') {
        this.withdrawClickSearch = true
      }
      if (params.transactionIdList !== undefined) {
        params.transactionIdList = []
      }
      DealerAccountAjax.QueryWithdraw(params).then(response => {
        if (response.code === 200) {
          let {data} = response
          this.withdrawDepositTableData = data.list.map((item, index) => {
            item.rowNum = ++index
            this.stateList.forEach(stateItem => {
              if (item.dealStatus === stateItem.id) item.dealStatusName = stateItem.name
            })
            return item
          })
          // this.withdrawTotal = response.totalAmount
          this.withdrawPagination.currentPage = data.currentPage
          this.withdrawPagination.pageSize = data.pageSize
          this.withdrawPagination.total = data.total
        }
      })
    },
    // 查询代收货款流水列表
    queryCommissionList (type) {
      let params = {...this.commissionForm}
      params.currentPage = type === 'searchBtn' ? 1 : this.commissionPagination.pageNum
      params.pageSize = this.commissionPagination.pageSize
      if (type === 'searchBtn') {
        this.commissionClickSearch = true
      }
      if (params.waybillIdList !== undefined) {
        params.waybillIdList = []
      }
      DealerAccountAjax.QueryCommission(params).then(response => {
        if (response.code === 200) {
          let {data} = response
          this.commissionTableData = data.list.map((item, index) => {
            item.rowNum = ++index
            this.stateList.forEach(stateItem => {
              if (item.dealStatus === stateItem.id) item.dealStatusName = stateItem.name
            })
            this.paymentMethodList.forEach(paymentItem => {
              if (paymentItem.id === item.paymentMethod) {
                item.paymentMethodName = paymentItem.name
              }
            })
            item.withdrawStatusName = item.withdrawStatus === 4 ? '已提现' : '未提现'
            return item
          })
          // this.commissionTotal = response.totalAmount
          this.commissionPagination.currentPage = data.currentPage
          this.commissionPagination.pageSize = data.pageSize
          this.commissionPagination.total = data.total
        }
      })
    },
    // swichWayState (state) {
    //   switch (state) {
    //     case 1:
    //       return '待发货'
    //     case 2:
    //       return '运输中'
    //     case 3:
    //       return '已签收'
    //     case 4:
    //       return '已拒签'
    //     case 5:
    //       return '已完成'
    //     case 6:
    //       return '已取消'
    //     case 9:
    //       return '待入库'
    //     case 10:
    //       return '待退货'
    //   }
    // },
    // 导出
    exportExcel (type) {
      let exportParams = {}
      if (type === '1') { // 经销商提现记录导出
        let transactionIdList = this.withdrawSelection.map(item => {
          return item.transactionId
        }).join(',')
        this.withdrawDepositForm.transactionIdList = transactionIdList
        exportParams.queryParams = this.withdrawDepositForm
        exportParams.url = '/finance/poi/easyPoiExportController/exportFlowDealerWithdrawCashList'
        this.exportList(exportParams)
      } else if (type === '2') { // 经销商代收货款流水导出
        let waybillIdList = this.commissionSelection.map(item => {
          return item.waybillId
        }).join(',')
        this.commissionForm.waybillIdList = waybillIdList
        exportParams.queryParams = this.commissionForm
        exportParams.url = '/waybill/client/exportFlowCollectionGoodsIncomeList'
        this.exportList(exportParams)
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.dealer-account{
  .default-tabs{
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
    #pane-second{
      .el-form-item{
        width: 100%!important;
        .el-form-item__label{
          width: 35%!important;
        }
        .el-form-item__content{
          width: 65%!important;
          .el-form--inline .el-select{
            width: 100%!important;
          }
        }
        .el-input__inner{
          width: 100%!important;
          height: 32px!important;
        }
        .el-select{
          width: 90%!important;
        }
      }
      .el-form-item.date-item{
        .el-form-item__label{
          width: 27%!important;
        }
        .el-form-item__content{
          width: 73%!important;
          .el-form--inline .el-select{
            width: 100%!important;
          }
        }
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
  .el-tabs__content{
    display: flex;
    flex: 1;
    flex-direction: column;
    .el-tab-pane{
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  }
  .export-con{
    display: flex;
    justify-content: flex-end;
  }
  .render-col-header{
    align-items: center;
    padding: 0px;
    display: flex;
    overflow: visible;
    justify-content: center;
    .el-icon-warning{
      position: relative;
      font-size: 16px;
      text-indent: 0px;
      cursor: pointer;
      color: #747484;
      margin-left: 3px;
      .tip-con{
        display: none;
        position: absolute;
        z-index: 1;
        padding: 3px 5px;
        top: -60px;
        left: -70px;
        width: 170px;
        height: 50px;
        line-height: 15px;
        text-align: left;
        // overflow: hidden;
        background: #333;
        border-radius: 5px;
        color: #fff;
      }
      .tip-icon{
        display: none;
        position: absolute;
        top: -10px;
        left: 5px;
        padding: 0px;
        .minxin-triangles(4px;4px;#333;transparent;transparent;transparent)
      }
    }
    .el-icon-warning:hover{
      color: #4689f2;
      .tip-con,.tip-icon{
        display: block;
      }
    }
  }
  .el-table{
    overflow: visible;
    .el-table__header-wrapper, .el-table__footer-wrapper{
      overflow: visible;
    }
    th{
      overflow: visible;
      text-align: center;
      .cell{
        overflow: visible;
      }
      div.tip-con{
        white-space: normal;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.dealer-account{
  display: flex;
  flex: 1;
  margin: 25px 30px 20px 30px;
  flex-direction: column;
  overflow: hidden;
  .title-con{
    .mixin-sc(16px;#333);
    font-weight: bold;
    margin: 4px 0 26px 8px;
    height: 16px;
  }
  iframe{
    display: flex;
    flex: 1;
  }
  .my-account{
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #fff;
    .default-tabs{
      margin: 20px 40px 0px 40px;
      .search-con{
        width: 100%;
        height: 40px;
        margin-top: 30px;
        margin-left: 0px;
        margin-bottom: 30px;
      }
      .btns-con{
        height: 34px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .table-con{
        display: flex;
        flex: 1;
      }
      .bottom-con{
        height: 28px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 10px 0;
        .total{
          flex-grow: 1;
        }
        .pagination{
          flex-grow: 9;
          height: 28px;
        }
      }
    }
  }
}
</style>
