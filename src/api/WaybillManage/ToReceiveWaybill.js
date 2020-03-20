import { Post, PostFromData } from '@/api/axios.config'
const ToReceiveWaybillAjax = {
  QueryList (params) {
    // 待收货运单列表
    let result = Post('/waybill/waybillManage/queryWaitReceiveWaybill', params)
    return result
  },
  Receipt (params) {
    // 确认接货
    let result = PostFromData('waybill/dispatch/waybill/receive', params)
    return result
  },
  Print (params) {
    // 待收货运单列表
    let result = Post('/waybill/print/queryWaitReceiveWaybill/list', params)
    return result
  },
  QueryLogistics (params) {
    // 待收货运单列表
    let result = PostFromData('/crm/relationManager/queryLogisticsSelectRelationSelf', params)
    return result
  }
}
export default ToReceiveWaybillAjax
