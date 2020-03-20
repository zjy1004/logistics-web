import { Post, Get, PostFromData } from '@/api/axios.config'
const TimelyWaybillManageAjax = {
  QueryList (params) {
    // 闪送运单管理列表
    let result = Post('/flash/flash/waybill/waybillManage/flash', params)
    return result
  },
  Reject (params) {
    // 闪送运单拒收
    let result = PostFromData('/flash/flash/waybill/flash/reject', params)
    return result
  },
  Signing (params) {
    // 闪送运单签收(批量)
    let result = PostFromData('/flash/flash/waybill/flash/signing', params)
    return result
  },
  Cancel (params) {
    // 取消闪送运单
    let result = Get('/flash/flash/waybill/flash/cancel', params)
    return result
  },
  QueryWaybillInfo (params) {
    // 查询闪送运单详情
    let result = PostFromData('/flash/flash/waybill/info', params)
    return result
  },
  QueryDriverList (params) {
    // 司机列表查询
    let result = Get('/crm/logisticsPersonnel/query/flash/selectFlashDriver', params)
    return result
  }
}
export default TimelyWaybillManageAjax
