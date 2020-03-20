import {Post, Get} from '@/api/axios.config'

const PersonalManageAjax = {
  updatePsd (params) {
    // 修改密码
    let result = Post('/crm/auth/password/update', params)
    return result
  },
  queryLogistics (params) {
    // 查询物流公司信息
    let result = Get('/crm/logisticsCompany/logistics/info/query', params)
    return result
  },
  queryLogisticsStaff (params) {
    // 获取物流公司员工信息
    let result = Get('/crm/logisticsPersonnel/user/info/query', params)
    return result
  }
}

export default PersonalManageAjax
