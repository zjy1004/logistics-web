import { Get, Post, PostFromData } from '@/api/axios.config'

const MenuManageAjax = {
  QueryList (params) {
    // 获取菜单列表
    let result = Post('/crm/menu/query/MenuManageList', params)
    return result
  },
  QueryPkMenuList (params) {
    // 查询所有系统菜单(所有上级菜单)
    let result = Get('/crm/menu/query/querySystemMenu', params)
    return result
  },
  Insert (params) {
    // 新增菜单
    let result = PostFromData('/crm/menu/insert/insertPartMenu', params)
    return result
  },
  Update (params) {
    // 修改菜单
    let result = PostFromData('/crm/menu/update/partMenu', params)
    return result
  },
  Delete (params) {
    // 删除菜单
    let result = PostFromData('/crm/menu/delete/deletePartMenu', params)
    return result
  },
  QueryDetail (params) {
    // 菜单详情
    let result = Get('/crm/menu/query/partOneMenu', params)
    return result
  }
}

export default MenuManageAjax
