import { Post, Get, PostFromData } from '@/api/axios.config'
const LogisticsCompanyManage = {
  QueryLogisticsCompanyList (params) {
    // 获取物流公司管理列表
    let result = Post('/crm/logisticsCompany/query/list', params)
    return result
  },
  QueryCrmCarList (params) {
    // 获取车辆管理列表
    let result = Get('/crm/Carmanage/show/carList', params)
    return result
  },
  getLogisticsList (params) {
    // 查询物流公司
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  QueryAreaList (params) {
    // 获取省市
    let result = Get('/crm/AreaCode/query/list', params)
    return result
  },
  insertCrmLogistics (params) {
    // 新增物流公司
    let result = Post('/crm/logisticsCompany/insert/insertCrmLogistics', params)
    return result
  },
  queryEditDetail (params) {
    // 物流公司管理修改回显
    let result = Get('/crm/logisticsCompany/update/updateCrmLogisticsEcho', params)
    return result
  },
  updateCrmLogistics (params) {
    // 物流公司管理修改
    let result = Post('/crm/logisticsCompany/update/updateCrmLogistics', params)
    return result
  },
  updateLogisticsStatus (params) {
    // 禁用/启用物流公司状态
    let result = PostFromData('/crm/logisticsCompany/update/updateLogisticsStatus', params)
    return result
  },
  resetPassword (params) {
    // 重置密码
    let result = PostFromData('/crm/auth/password/reset', params)
    return result
  },
  queryRoleMenuList (params) {
    // 根据角色类型查询菜单列表（物流公司默认角色1）
    let result = Get('/crm/menu/query/queryLogisticsManageRoleMenuList', params)
    return result
  },
  deleteFile (params) {
    // 附件管理删除
    let result = Get('/crm/attach/deleteFile', params)
    return result
  },
  ValidateFreightMethod (params) {
    // 物流公司管理修改运费结算方式验证,返回影响的客户信息
    let result = PostFromData('/crm/logisticsCompany/update/updateCrmLogisticsValidateFreightMethod', params)
    return result
  }
}

export default LogisticsCompanyManage
