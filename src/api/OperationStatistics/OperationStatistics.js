import { Post } from '@/api/axios.config'
const OperationStatisticsAjax = {
  QueryList (params) {
    // 获取运单导出列表
    let result = Post('/waybill/operateBackground/query/waybillList', params)
    return result
  },
  QueryLogisticsDistributionList (params) {
    // 获取物流商分布列表
    let result = Post('/waybill/operateBackground/query/platformDataStatisticsList', params)
    return result
  },
  QueryUserStatisticsList (params) {
    // 获取用户统计列表
    let result = Post('/crm/clientManageController/clientStatisticsQuery', params)
    return result
  },
  QueryFlowStatisticsList (params) {
    // 获取流水统计列表
    let result = Post('/waybill/operateBackground/query/financialFlowQuery', params)
    return result
  }
}
export default OperationStatisticsAjax
