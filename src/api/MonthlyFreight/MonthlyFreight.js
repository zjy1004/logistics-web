import { Post } from '@/api/axios.config'
const MonthlyFreightAjax = {
  QueryList (params) {
    // 月结运费列表
    let result = Post('/waybill/financeManage/queryFinanceMonthWaybillList', params)
    return result
  },
  Pay (params) {
    // 确认收款
    let result = Post('/waybill/financeManage/monthBatchCollection', params)
    return result
  }
}
export default MonthlyFreightAjax
