import { Post, Get, PostFromData } from '@/api/axios.config'

const SiteManageAjax = {
  insertStation (params) {
    // 新增站点
    let result = Post('/crm/Station/insert/insertStation', params)
    return result
  },
  showStationDetails (params) {
    // 查看物流公司站点详情
    let result = PostFromData('/crm/Station/show/StationDetails', params)
    return result
  },
  updateStation (params) {
    // 修改站点
    let result = Post('/crm/Station/update/updateCrmLogisticsStation', params)
    return result
  },
  QueryCrmSiteList (params) {
    // 获取站点管理列表
    let result = Get('/crm/Station/show/stationList', params)
    return result
  },
  QueryAreaList (params) {
    // 获取省市
    let result = Get('/crm/AreaCode/query/list', params)
    return result
  },
  getLogisticsList (params) {
    // 获取物流公司列表
    let result = Get('/crm/logisticsPersonnel/update/getLogisticsList', params)
    return result
  },
  updateCrmLogisticsStationShow (params) {
    // 物流公司站点修改回显
    let result = Get('/crm/Station/update/updateCrmLogisticsStationShow', params)
    return result
  },
  updateStationStatus (params) {
    // 禁用/启用站点
    let result = PostFromData('/crm/Station/update/updateStationStatus', params)
    return result
  }
}

export default SiteManageAjax
