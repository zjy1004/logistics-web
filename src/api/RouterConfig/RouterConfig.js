import { PostFromData, Get, Post } from '@/api/axios.config'

const RouterConfigAjax = {
  QueryList (params) {
    // 自营路由配置列表
    let result = Post('/crm/routerConfig/self/route/list', params)
    return result
  },
  QueryStationByLineId (params) {
    // 根据线路id获取目的地站点(自营)
    let result = PostFromData('/crm/routerConfig/query/destination/station', params)
    return result
  },
  QueryLineListByStationId (params) {
    // 查询站点下所有线路
    let result = PostFromData('/crm/routerConfig/query/line/name/list', params)
    return result
  },
  GetLogisticsList (params) {
    // 查询物流公司下拉框信息
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  SelectStationListByPkLogistics (params) {
    // 查询物流公司下所有站点
    let result = Get('/crm/logisticsCompany/query/selectStationListByPkLogistics', params)
    return result
  },
  Insert (params) {
    // 新增物流路由信息
    let result = Post('/crm/routerConfig/insert/logistics/route', params)
    return result
  },
  EnableRouter (params) {
    // 禁用/启用路由
    let result = PostFromData('/crm/routerConfig/update/updateRouteStatus', params)
    return result
  }
}

export default RouterConfigAjax
