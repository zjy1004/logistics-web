import { Get, Post, PostFromData } from '@/api/axios.config'

const InwardUserAjax = {
  QueryRoleMenuList (params) {
    // 根据角色类型查询菜单列表（物流公司默认角色1）
    let result = Get('/crm/menu/query/queryLogisticsManageRoleMenuList', params)
    return result
  },
  Insert (params) {
    // 内部用户管理新增
    let result = Post('/crm/internalUser/insert/insertInternalUser', params)
    return result
  },
  Update (params) {
    // 内部用户管理修改
    let result = Post('/crm/internalUser/update/updateInternalUser', params)
    return result
  },
  queryDetail (params) {
    // 内部用户管理详情
    let result = Get('/crm/internalUser/update/updateInternalUserEcho', params)
    return result
  },
  QueryList (params) {
    // 查询内部用户列表
    let result = Post('/crm/internalUser/query/list', params)
    return result
  },
  CheckDetail (params) {
    // 查看详情
    let result = Get('/crm/internalUser/query/seeInternalUserEcho', params)
    return result
  },
  UpdateLogisticsPersonnelStatus (params) {
    // 禁用启用内部用户
    let result = PostFromData('/crm/internalUser/update/updateInternalUserStatus', params)
    return result
  },
  QueryInternalUserRoleList (params) {
    // 内部用户管理查询角色下拉框
    let result = Get('/crm/role/query/queryInternalUserRoleList', params)
    return result
  },
  QuerySuperior (params) {
    // 内部用户管理直属上级下拉数据
    let result = Get('/crm/internalUser/query/selectInternalUserList', params)
    return result
  },
  ValidateUserName (params) {
    // 校验账号是否存在
    let result = Get('/crm/auth/account/valid', params)
    return result
  }
}

export default InwardUserAjax
