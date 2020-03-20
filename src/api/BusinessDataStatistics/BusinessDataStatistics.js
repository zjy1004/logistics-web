import { Post } from '@/api/axios.config'

const BusinessDataStatisticsAjax = {
  QueryClientWaybillList (params) {
    // 获取客户运营参数列表
    let result = Post('/waybill/operateBackground/query/clientWaybill', params)
    return result
  },
  WaybillByOnlinePartQuery (params) {
    // 运营后台-驮付宝运单占比查询
    let result = Post('/crm/clientManageController/clientTypeTotalQuery', params)
    return result
  },
  QueryWaybillByOnlinePartList (params) {
    // 运营后台-驮付宝运单占比查询
    let result = Post('/waybill/operateBackground/query/waybillByOnlinePart', params)
    return result
  },
  QueryReceivableGoodsByOlineList (params) {
    // 运营后台-驮付宝代收货款占比查询
    let result = Post('/waybill/operateBackground/query/receivableGoodsByOline', params)
    return result
  }
}

export default BusinessDataStatisticsAjax
