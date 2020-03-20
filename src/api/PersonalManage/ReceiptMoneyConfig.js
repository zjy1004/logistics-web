import { Post, Get } from '@/api/axios.config'

const ReceiptMoneyConfig = {
  updateReceiptMoneyConfig (params) {
    // 物流公司分成配置修改
    let result = Post('/crm/logisticsDivided/insert/insertLogisticsDivided', params)
    return result
  },
  queryReceiptMoneyConfig (params) {
    // 内部用户管理修改回显
    let result = Get('/crm/logisticsDivided/update/updateLogisticsDivided', params)
    return result
  }
}

export default ReceiptMoneyConfig
