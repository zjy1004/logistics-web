import { PostFromData, Get, Post } from '@/api/axios.config'

const JoinRouterConfigAjax = {
  QueryLogisticsSelectInitiate (params) {
    // 查询所有联营物流公司下拉框选择(归属)
    let result = Get('/crm/relationManager/queryLogisticsSelectInitiate', params)
    return result
  },
  QueryLogisticsSelectRelation (params) {
    // 查询发起方联营物流公司的所有关联物流公司下拉框选择
    let result = PostFromData('/crm/relationManager/queryLogisticsSelectRelation', params)
    return result
  },
  QueryList (params) {
    // 联营路由配置列表
    let result = Post('/crm/routerConfig/query/union/route/list', params)
    return result
  },
  QueryStationByLineId (params) {
    // 根据线路id获取目的地站点(联营)
    let result = PostFromData('/crm/routerConfig/query/logistics/down/station', params)
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

export default JoinRouterConfigAjax
