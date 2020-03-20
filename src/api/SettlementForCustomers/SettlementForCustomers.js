import { Post, Get } from '@/api/axios.config'
const SettlementForCustomersAjax = {
  QueryList (params) {
    // 获取待结算客户列表
    let result = Post('/waybill/financeManage/show/settlement/client/list', params)
    return result
  },
  QuerySettlementOperationList (params) {
    // 待结算客户对账结算列表
    let result = Post('/waybill/financeManage/show/reconciliation/client/list', params)
    return result
  },
  QueryCheckList (params) {
    // 待结算客户对账结算查看列表
    let result = Post('/waybill/financeManage/show/reconciliation/client/check/list', params)
    return result
  },
  QuerySendClientList (params) {
    // 获取待结算客户列表针对搜索框写的
    let result = Get('/waybill/financeManage/query/settlement/client/list', params)
    return result
  }
}
export default SettlementForCustomersAjax
