import { Get, PostFromData } from '@/api/axios.config'

const CarManageAjax = {
  QueryLogisticsSelectInitiate (params) {
    // 查询所有联营物流公司下拉框选择(归属)
    let result = Get('/crm/relationManager/queryLogisticsSelectInitiate', params)
    return result
  },
  QueryLogisticsSelectRelation (params) {
    // 查询发起方联营物流公司的所有关联物流公司下拉框选择(下游站点物流公司)
    let result = PostFromData('/crm/relationManager/queryLogisticsSelectRelation', params)
    return result
  },
  QueryLogisticsSelectRelationSelf (params) {
    // 查询发起方联营物流公司的所有关联物流公司和本身下拉框选择
    let result = PostFromData('/crm/relationManager/queryLogisticsSelectRelationSelf', params)
    return result
  },
  UpdateLineStatus (params) {
    // 禁用/启用客户自营联营线路状态
    let result = PostFromData('/crm/line/updateLineStatus', params)
    return result
  }
}

export default CarManageAjax
