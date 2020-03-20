import { Get, Post, PostFromData } from '@/api/axios.config'

const DealerAccountAjax = {
  GetIframeUrl (params) {
    // 获取iframe url
    let result = Get('/finance/example/register', params)
    return result
  },
  QueryWithdraw (params) {
    // 获取经销商资金账户提现记录列表
    let result = Post('/finance/api/dealerFinaFlow/queryFlowDealerWithdrawCashList', params)
    return result
  },
  QueryCommission (params) {
    // 获取经销商虚拟账户代收货款列表
    let result = Post('/waybill/client/queryFlowCollectionGoodsIncomeList', params)
    return result
  },
  WithdrawalOperation (params) {
    // 经销商端虚拟账户提现列表
    let result = Post('/waybill/client/all/list', params)
    return result
  },
  withdrawMoney (params) {
    // 按运单批量提现
    let result = PostFromData('/finance/funds/withdraw/waybill', params)
    return result
  },
  updateWaybillFee (params) {
    // 财务管理修改运单运费和货款
    let result = Post('/waybill/financeManage/updateWaybillFee', params)
    return result
  },
  QueryWithdrawDetailPackage (params) {
    // 查询提现明细接口
    let result = Get('/finance/api/withdrawRestController/queryWithdrawDetailPackage', params)
    return result
  },
  QueryWithdrawDetailInventoryList (params) {
    // 提现清单明细列表接口
    let result = Get('/finance/api/withdrawRestController/queryWithdrawDetailInventoryList', params)
    return result
  },
  DealCanWithdraw (params) {
    // 处理可提现接口
    let result = Get('/finance/api/withdrawRestController/dealCanWithdraw', params)
    return result
  },
  QueryNewWalletStatus (params) {
    // 查询用户绑卡状态接口
    let result = Get('/finance/funds/queryNewWalletStatus', params)
    return result
  },
  QueryCardStatus (params) {
    // 查询用户是否可切换银行卡(true可切换false不可切换)
    let result = Get('/finance/funds/queryCardStatus', params)
    return result
  }
}

export default DealerAccountAjax
