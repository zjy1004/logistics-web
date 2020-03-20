import { Post, Get, PostFromData } from '@/api/axios.config'
const RelationManager = {
  QueryRelationList (params) {
    // 查询物流联营关系列表
    let result = Post('/crm/relationManager/query/list', params)
    return result
  },
  QueryAllList (params) {
    // 查询全部物流公司
    let result = Get('/crm/relationManager/query/allList', params)
    return result
  },
  QueryGetLogisticsList (params) {
    // 查询物流下拉列表
    let result = Get('/crm/relationManager/query/getDownLogisticsList', params)
    return result
  },
  GetRelationLogisticsList (params) {
    // 查询发起物流关联的物流公司的列表
    let result = Get('/crm/relationManager/query/getRelationLogisticsList', params)
    return result
  },
  InsertRelationLogistics (params) {
    // 新增联营业务配置关联物流公司
    let result = PostFromData('/crm/relationManager/insert/insertRelationLogistics', params)
    return result
  },
  UpdateRelationLogistics (params) {
    // 联营业务配置取消关联物流公司
    let result = PostFromData('/crm/relationManager/update/updateRelationLogistics', params)
    return result
  },
  QueryValidateJointLine (params) {
    // 验证两个物流公司是否有在启用的联营线路1表示为true,0表示为false
    let result = PostFromData('/crm/line/validateJointLine', params)
    return result
  }
}

export default RelationManager
