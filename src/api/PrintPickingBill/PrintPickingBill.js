import { Get, PostFromData } from '@/api/axios.config'

const PrintPickingAjax = {
  QueryList (params) {
    // 打印配货单列表
    let result = Get('/crm/shift/run/delivery/list', params)
    return result
  },
  QueryDeliveryList (params) {
    // 查询配货单列表
    let result = Get('/waybill/delivery/shift/list', params)
    return result
  },
  QueryPrintheaderInfo (params) {
    // 查询配货单表头信息
    let result = Get('/crm/shift/run/delivery/info', params)
    return result
  },
  Departure (params) {
    // 发车
    let result = Get('/crm/shift/run/departure', params)
    return result
  },
  BatchPrintingWaybill (params) {
    // 根据班次IdList获取运单id打印运单箱单数据接口(批量打印运单)
    let result = PostFromData('/crm/waybill/print/getWaybillPrintDataByRunShiftId', params)
    return result
  }
}

export default PrintPickingAjax
