import { Get } from '@/api/axios.config'

const LocationManageAjax = {
  QueryStationLocation (params) {
    // 查询当前站点位置信息
    let result = Get('/crm/locationManage/query/stationLocationInfo', params)
    return result
  },
  QueryDriverPosition (params) {
    // 查询站点下司机位置
    let result = Get('/crm/locationManage/query/driverListByStationId', params)
    return result
  }
}

export default LocationManageAjax
