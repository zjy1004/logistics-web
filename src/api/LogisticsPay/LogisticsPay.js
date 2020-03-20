import { Post, Get } from '@/api/axios.config'

const LogisticsAjax = {
  InsertFinaInfo (params) {
    // 新增财务配置信息
    let result = Post('/crm/api/finaThirdpartDivided/insert/insertFinaThirdpartDivided', params)
    return result
  },
  QueryFinaInfo (params) {
    // 财务分成修改回显
    let result = Get('/crm/api/finaThirdpartDivided/update/updateFinaThirdpartDividedEcho', params)
    return result
  },
  UpdateFinaInfo (params) {
    // 财务分成修改
    let result = Post('/crm/api/finaThirdpartDivided/update/updateFinaThirdpartDivided', params)
    return result
  }
}

export default LogisticsAjax
