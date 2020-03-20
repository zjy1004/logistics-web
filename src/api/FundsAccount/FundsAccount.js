import { Get, Post } from '@/api/axios.config'

const FundsAccountAjax = {
  GetIframeUrl (params) {
    // 获取iframe url
    let result = Get('/finance/register/open', params)
    return result
  },
  QueryWithdraw (params) {
    // 获取物流公司资金账户提现记录列表
    let result = Post('/finance/api/finaFlow/queryFlowLogisticsWithdrawCashList', params)
    return result
  },
  QueryCommission (params) {
    // 获取物流公司虚拟账户佣金收入列表
    let result = Post('/finance/api/finaFlow/queryFlowCommissionIncomeList', params)
    return result
  },
  QueryWayCost (params) {
    // 获取物流公司虚拟账户运费收入列表
    let result = Post('/finance/api/finaFlow/queryFlowFreightIncomeList', params)
    return result
  }
}

export default FundsAccountAjax
