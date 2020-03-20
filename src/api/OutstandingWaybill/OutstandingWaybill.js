import { Post, PostFromData } from '@/api/axios.config'
const OutstandingWaybillAjax = {
  QueryList (params) {
    // 驮付宝待结算运单列表
    let result = Post('/waybill/financeManage/queryFinanceWaybillList', params)
    return result
  },
  queryFinanceFeeUpdateWaybill (params) {
    // 财务收款调整运单列表
    let result = Post('/waybill/financeManage/queryFinanceFeeUpdateWaybillList', params)
    return result
  },
  Pay (params) {
    // 确认支付
    let result = PostFromData('/finance/pay/checkout/counter', params)
    return result
  },
  QueryPayResult (params) {
    // 驮付宝待结算运单列表
    let result = PostFromData('/finance/pay/orderQuery', params)
    return result
  }
}
export default OutstandingWaybillAjax
