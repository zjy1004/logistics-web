import { Post, Get, PostFromData } from '@/api/axios.config'

const ShiftPlanAjax = {
  insertShiftPlan (params) {
    // 新增临时班次
    let result = Post('/crm/shift/run/insert', params)
    return result
  },
  updateShiftPlan (params) {
    // 修改运行班次
    let result = Post('/crm/shift/run/update/updateShiftRun', params)
    return result
  },
  queryList (params) {
    // 班次列表
    let result = Post('/crm/shift/run/query/list', params)
    return result
  },
  queryLineNameList (params) {
    // 线路名称列表
    let result = Get('/crm/line/logistics/all', params)
    return result
  },
  queryCarsList (params) {
    // 查询物流公司下所有在用车辆信息
    let result = Get('/crm/Carmanage/select/selectLogisticsCarsByLogisticsId', params)
    return result
  },
  // queryDriverList (params) {
  //   // 查询物流公司下属所有司机信息
  //   let result = Get('/crm/logisticsPersonnel/query/selectLogisticsDriverByLogisticsId', params)
  //   return result
  // },
  queryDriverList (params) {
    // 查询物流公司下属所有司机信息
    let result = Get('/crm/logisticsPersonnel/query/selectLogisticsDriverByLogisticsId', params)
    return result
  },
  QueryLineSelectByLogisticsId (params) {
    // 查询物流公司下的所有线路下拉选择框（有线路类型）
    let result = PostFromData('/crm/line/queryLineSelectByLogisticsId', params)
    return result
  },
  QueryLogisticsSelectRelationSelf (params) {
    // 查询发起方联营物流公司的所有关联物流公司和本身下拉框选择
    let result = PostFromData('/crm/relationManager/queryLogisticsSelectRelationSelf', params)
    return result
  },
  queryLineSelectByLogisticsIdLineType (params) {
    // 查询发起方联营物流公司的所有关联物流公司和本身下拉框选择
    let result = PostFromData('/crm/line/queryLineSelectByLogisticsIdLineType', params)
    return result
  }
}

export default ShiftPlanAjax
