import { Get, Post, PostFromData } from '@/api/axios.config'

const RouteAjax = {
  QueryList (params) {
    // 路线列表
    let result = Post('/crm/line/list', params)
    return result
  },
  Insert (params) {
    // 路线新增
    let result = Post('/crm/line/insert', params)
    return result
  },
  UpdateLine (params) {
    // 路线修改
    let result = Post('/crm/line/shift/update', params)
    return result
  },
  QueryLineList (params) {
    // 查询线路班次司机信息实体（修改或查看使用）
    let result = Get('/crm/line/queryLineShiftByLineId', params)
    return result
  },
  QueryStations (params) {
    // 查询站点下拉数据
    let result = Get('/crm/logisticsCompany/query/selectStationListByPkLogistics', params)
    return result
  },
  QueryDrivers (params) {
    // 查询物流公司下属所有司机信息
    let result = Get('/crm/logisticsPersonnel/query/selectLogisticsDriverByLogisticsId', params)
    return result
  },
  QueryCars (params) {
    // 查询物流公司下属所有车辆
    let result = Get('/crm/Carmanage/select/selectLogisticsCarsByLogisticsId', params)
    return result
  },
  QueryCarsByUser (params) {
    // 查询用户下所有在用车辆
    let result = Get('/crm/Carmanage/select/selectUserCarsByUserId', params)
    return result
  },
  QueryLines (params) {
    // 获取物流公司下所有线路
    let result = Get('/crm/line/logistics/all', params)
    return result
  },
  QueryShiftsByLine (params) {
    // 获取线路下班次列表
    let result = Get('/crm/line/shift/list', params)
    return result
  },
  DeleteLine (params) {
    // 批量删除班次
    let result = PostFromData('/crm/shift/delete', params)
    return result
  },
  validLineName (params) {
    // 校验线路名称是否存在
    let result = PostFromData('/crm/line/validLineName', params)
    return result
  },
  EditRouteName (params) {
    // 修改线路名称
    let result = Get('/crm/line/updateLineName', params)
    return result
  },
  CheckOrder (params) {
    // 参考配送顺序
    let result = Get('/waybill/lineDeliveryOrderController/queryLineDeliveryOrderVoByLineId', params)
    return result
  },
  EnableRouter (params) {
    // 禁用/启用路由
    let result = PostFromData('/crm/line/updateLineStatus', params)
    return result
  }
}

export default RouteAjax
