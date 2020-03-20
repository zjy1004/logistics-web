import { Post, Get } from '@/api/axios.config'
const PaymentHistoryAjax = {
  QueryPaymentHistoryList (params) {
    // 支付记录列表
    let result = Post('/finance/api/finaTransaction/queryFinancePaymentRecordVoList', params)
    return result
  },
  QueryPaymentHistoryDetail (params) {
    // 支付记录列表详情
    let result = Get('/waybill/financeManage/query/FinancePaymentRecordDetails', params)
    return result
  }
}
export default PaymentHistoryAjax
