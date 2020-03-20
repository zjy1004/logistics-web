import { Post, Get } from '@/api/axios.config'
const OrganizationManage = {
  insertOrg (params) {
    // 组织管理新增
    let result = Post('/crm/organization/insert/insertOrg', params)
    return result
  },
  queryOrgTreeList (params) {
    // 获取组织管理ztree列表
    let result = Get('/crm/organization/query/treeList', params)
    return result
  },
  updateOrg (params) {
    // 组织管理修改
    let result = Post('/crm/organization/update/updateOrg', params)
    return result
  }

}
export default OrganizationManage
