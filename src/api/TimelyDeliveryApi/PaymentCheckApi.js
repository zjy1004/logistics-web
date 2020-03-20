import { Post } from '@/api/axios.config'
const PaymentCheckAjax = {
  QueryList (params) {
    // 货款核对列表查询
    let result = Post('/flash/flash/query/paymentCheck', params)
    return result
  }
}
export default PaymentCheckAjax
