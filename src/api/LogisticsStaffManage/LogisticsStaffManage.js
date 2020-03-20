import { Get, PostFromData, Post } from '@/api/axios.config'

const LogisticsStaffAjax = {
  GetLogisticsAndAccount (params) {
    // 查询物流公司名称和账户
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  QueryList (params) {
    // 查询物流员工列表
    let result = Post('/crm/logisticsPersonnel/query/list', params)
    return result
  },
  QueryStationAndRoleSelect (params) {
    // 根据物流公司id查询站点和角色
    let result = Get('/crm/logisticsCompany/query/getLogisticsStationRoleList', params)
    return result
  },
  UpdateLogisticsPersonStatus (params) {
    // 禁用/启用物流公司员工状态
    let result = PostFromData('/crm/logisticsPersonnel/update/updateLogisticsPersonnelStatus', params)
    return result
  },
  QueryCarListByLogisticsId (params) {
    // 根据物流公司id查询车辆下拉数据
    let result = Get('/crm/Carmanage/select/selectLogisticsCarsByLogisticsId', params)
    return result
  },
  ValidateUserAccount (params) {
    // 保存前校验登陆账户是否重复
    let result = Post('/crm/Carmanage/select/selectLogisticsCarsByLogisticsId', params)
    return result
  },
  Insert (params) {
    // 新增物流公司员工
    let result = Post('/crm/logisticsPersonnel/insert/insertLogisticsPersonnel', params)
    return result
  },
  Update (params) {
    // 更新物流公司员工
    let result = Post('/crm/logisticsPersonnel/update/updateLogisticsPersonnel', params)
    return result
  },
  QueryDetail (params) {
    // 查询物流员工详情
    let result = Get('/crm/logisticsPersonnel/update/updateLogisticsPersonnelEcho', params)
    return result
  },
  CheckDetail (params) {
    // 物流公司员工管理查看
    let result = Get('/crm/logisticsPersonnel/query/seeLogisticsPersonnel', params)
    return result
  }
}

export default LogisticsStaffAjax
