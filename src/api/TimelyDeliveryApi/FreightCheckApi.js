import { Post, Get } from '@/api/axios.config'
const FreightCheckAjax = {
  QueryFreightCheckList (params) {
    // 运费核对列表
    let result = Post('/flash/flash/waybill/freight/check', params)
    return result
  },
  Receipt (params) {
    // 闪送运单确认收款(批量)
    let result = Post('/flash/flash/waybill/flash/receipt', params)
    return result
  },
  QueryStaffList (params) {
    // 闪送运单确认收款(批量)
    let result = Get('crm/logisticsPersonnel/queryLogisticsPersonnelAll', params)
    return result
  }
}
export default FreightCheckAjax
