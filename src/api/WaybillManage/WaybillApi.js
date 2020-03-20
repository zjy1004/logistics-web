import { Get, Post, PostFromData } from '@/api/axios.config'

const WaybillApiAjax = {
  AllList (params) {
    // 全部运单列表
    let result = Post('/waybill/waybillManage/deliverGoodsWaybillQuery', params)
    return result
  },
  FinanceList (params) {
    // 财务运单列表
    let result = Post('/waybill/financeManage/queryFinanceWaybillList', params)
    return result
  },
  FinanceAllList (params) {
    // 财务运单列表(冯磊写的)
    let result = Post('/waybill/financeManage/queryFinanceAllWaybillList', params)
    return result
  },
  FinanceFinishedList (params) {
    // 财务已完结运单列表
    let result = Post('/waybill/financeManage/queryFinishedFinanceWaybillList', params)
    return result
  },
  FinanceReceivableWaybillList (params) {
    // 财务管理待收款运单列表
    let result = Post('/waybill/financeManage/queryFinanceWaitReceivableWaybillList', params)
    return result
  },
  waybillInfo (params) {
    // 查询运单详情
    let result = PostFromData('/waybill/info', params)
    return result
  },
  QueryListByStatus (params) {
    // 根据运单状态查询运单列表
    let result = Post('/waybill/waybillManage/returnGoodsWaybillQuery', params)
    return result
  },
  Receipt (params) {
    // 运单确认收款(批量)
    let result = Post('/waybill/receipt', params)
    return result
  },
  Reject (params) {
    // 运单拒收)
    let result = PostFromData('/waybill/reject', params)
    return result
  },
  Cancel (params) {
    // 取消运单
    let result = Get('/waybill/cancel', params)
    return result
  },
  Settlement (params) {
    // 运单确认结算(批量)
    let result = PostFromData('/waybill/settlement', params)
    return result
  },
  Signing (params) {
    // 运单签收(批量)
    let result = PostFromData('/waybill/signing', params)
    return result
  },
  Transport (params) {
    // 运单发货(批量)
    let result = PostFromData('/waybill/transport', params)
    return result
  },
  shiftList (params) {
    // 获取线路下班次列表
    let result = Get('/crm/shift/run/queryShiftRunListByLineIdBusiDate', params)
    return result
  },
  getLogisticsList (params) {
    // 查询物流公司下拉框信息
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  getStationList (params) {
    // 查询物流公司下站点
    let result = Get('/crm/logisticsCompany/query/selectStationListByPkLogistics', params)
    return result
  },
  getDriversList (params) {
    // 查询物流公司下司机
    let result = Get('/crm/logisticsPersonnel/query/selectLogisticsDriverByLogisticsId', params)
    return result
  },
  exports (params) {
    // 财务管理运单列表Excel导出
    let result = Post('/waybill/financeManage/exports', params)
    return result
  },
  waybillPutInStorageReturnGoodsBatch (params) {
    // 退货运单确认入库9确认退货10(批量)
    let result = PostFromData('/waybill/waybillPutInStorageReturnGoodsBatch', params)
    return result
  },
  waybillPrintInvoiceBatch (params) {
    // 打印配货单状态修改(批量)
    let result = PostFromData('/waybill/waybillPrintInvoiceBatch', params)
    return result
  },
  QueryDealerWaybillList (params) {
    // 全部运单列表(经销商)
    let result = Post('/waybill/waybillManage/queryDealerWaybillList', params)
    return result
  },
  QueryLogisticsPersonnelAll (params) {
    // 查询物流公司下所有员工包括物流公司管理员
    let result = Get('/crm/logisticsPersonnel/queryLogisticsPersonnelAll', params)
    return result
  },
  QueryFreightSettlementMethodByWaybillId (params) {
    // 根据运单id查询收发货方的运费结算方式
    let result = PostFromData('/waybill/FreightSettlementMethodByWaybillId', params)
    return result
  },
  SettlementAndMonthBatchCollection (params) {
    // 运费月结与运单确认结算(批量)
    let result = PostFromData('/waybill/settlementAndMonthBatchCollection', params)
    return result
  }
}

export default WaybillApiAjax
