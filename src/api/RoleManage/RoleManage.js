import { Post, Get, PostFromData } from '@/api/axios.config'
const RoleManage = {
  insertCrmRole (params) {
    // 新增角色
    let result = Post('/crm/role/insert/insertCrmRole', params)
    return result
  },
  queryRoleList (params) {
    // 获取角色列表
    let result = Post('/crm/role/query/list', params)
    return result
  },
  updateCrmRole (params) {
    // 修改保存角色
    let result = Post('/crm/role/update/updateCrmRole', params)
    return result
  },
  updateCrmRoleEcho (params) {
    // 修改回显角色
    let result = Get('/crm/role/update/updateCrmRoleEcho', params)
    return result
  },
  validRoleName (params) {
    // 校验角色名称是否存在
    let result = PostFromData('/crm/role/validLineName', params)
    return result
  },
  updateRoleStatus (params) {
    // 禁用/启用角色
    let result = PostFromData('/crm/role/update/updateRoleStatus', params)
    return result
  },
  queryBusinessMenuList (params) {
    // 根据业务菜单类型查询菜单列表（角色管理）
    let result = Get('/crm/menu/query/queryBusinessMenuList', params)
    return result
  },
  QueryRoleTypeSelect (params) {
    // 角色管理查询角色类型下拉框
    let result = Get('/crm/role/query/queryRoleTypeList', params)
    return result
  },
  QueryRolePosition (params) {
    // 角色职务下拉框
    let result = Get('/crm/role/queryRolePositionList', params)
    return result
  }

}
export default RoleManage
