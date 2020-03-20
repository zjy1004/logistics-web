import { Post, Get, PostFromData } from '@/api/axios.config'
const StatisticsAjax = {
  QueryFlashWaybillStatistics (params) {
    // 闪送运单统计查询
    let result = Post('/flash/flash/waybill/flashWaybillStatisticsDeliver', params)
    return result
  },
  selectFlashDriver (params) {
    // 闪送司机
    let result = Get('/crm/logisticsPersonnel/query/flash/selectFlashDriver', params)
    return result
  },
  queryFlashLogisticsClient (params) {
    // 闪送司机
    let result = PostFromData('/crm/client/waybill/queryFlashLogisticsClient', params)
    return result
  }
}
export default StatisticsAjax
