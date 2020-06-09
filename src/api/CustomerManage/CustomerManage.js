import { Post, PostFromData, Get } from '@/api/axios.config'

const CustomerManageAjax = {
  insertClientManage (params) {
    // 客户管理新增
    let result = Post('/crm/clientManageController/insert/insertClientManage', params)
    return result
  },
  updateClientManage (params) {
    // 客户管理修改
    let result = Post('/crm/clientManageController/update/updateClientManage', params)
    return result
  },
  addRelevance (params) {
    // 账户信息关联
    let result = Post('/crm/clientManageController/insert/insertClientAccountManage', params)
    return result
  },
  newAndRelevance (params) {
    // 新建并关联
    let result = Post('/crm/clientManageController/insert/createAndInsertClientAccountManage', params)
    return result
  },
  removeRelevance (params) {
    // 解除关联
    let result = Post('/crm/clientManageController/delete/clientAccountManage', params)
    return result
  },
  ResetPwd (params) {
    // 重置密码
    let result = PostFromData('/crm/auth/password/reset/byaccount', params)
    return result
  },
  getRelevanceList (params) {
    // 账户信息列表
    let result = Get('/crm/clientManageController/select/clientAccountManage', params)
    return result
  },
  setOrCancelFundsAccount (params) {
    // 设置/取消资金账户
    let result = Post('/crm/clientManageController/confirm/cancelFundAccount', params)
    return result
  },
  showClientDetails (params) {
    // 客户管理查看
    let result = PostFromData('/crm/clientManageController/query/seeClientManage', params)
    return result
  },
  updateClientDetailsShow (params) {
    // 客户管理修改回显
    let result = Get('/crm/clientManageController/update/updateClientManageEcho', params)
    return result
  },
  queryClientList (params) {
    // 获取客户管理列表
    let result = Post('/crm/clientManageController/query/list', params)
    return result
  },
  updateClientManageStatus (params) {
    // 禁用/启用客户管理状态
    let result = PostFromData('/crm/clientManageController/update/updateClientManageStatus', params)
    return result
  },
  getLogisticsStationList (params) {
    // 查询物流公司、站点下拉框信息
    let result = Get('/crm/logisticsCompany/query/getLogisticsStationList', params)
    return result
  },
  getLogisticsList (params) {
    // 查询物流公司
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  getPkLogistics (params) {
    // 查询物流公司下所有站点
    let result = Get('/crm/logisticsCompany/query/selectStationListByPkLogistics', params)
    return result
  },
  QueryNotPerfectNum (params) {
    // 根据物流公司id查询信息未完善客户数量
    let result = Get('/crm/clientManageController/selectPerfectFlagNoClientSizeByLogisticsId', params)
    return result
  },
  updateClientManageOnline (params) {
    // 开通关闭在线支付状态
    let result = PostFromData('/crm/clientManageController/update/updateClientManageAccountApplicationStatus', params)
    return result
  },
  queryLineListByStationId (params) {
    // 根据站点stationId所有线路信息
    let result = Get('/crm/line/queryLineListByStationId', params)
    return result
  },
  queryClientLineListByStationId (params) {
    // 客户管理查询站点下所有客户线路
    let result = Get('/crm/line/queryClientLineListByStationId', params)
    return result
  }
}

export default CustomerManageAjax
