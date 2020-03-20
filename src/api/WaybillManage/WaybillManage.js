import { Get, Post, PostFromData } from '@/api/axios.config'

const WaybillAjax = {
  GetClientData (params) {
    // 获取客户信息列表数据
    let result = Get('/crm/client/waybill/all', params)
    return result
  },
  QueryWaybillAndShift (params) {
    // 通过客户id查询路线及班次
    let result = Get('/crm/line/waybill/shift/list', params)
    return result
  },
  CreateWayBill (params) {
    // 提交新建运单
    let result = Post('/waybill/create', params)
    return result
  },
  QueryStationListByPkLogistics (params) {
    // 获取发货方服务站下拉数据
    let result = Get('/crm/logisticsCompany/query/selectStationListByPkLogistics', params)
    return result
  },
  QueryReceiveStationListByPkLogistics (params) {
    // 获取收货方服务站下拉数据
    let result = Get('/crm/logisticsCompany/queryAllStationByPkLogistics', params)
    return result
  },
  QueryPrintData (params) {
    // 提交成功获取打印信息
    let result = PostFromData('/crm/waybill/print/carrier/data', params)
    return result
  },
  NewQueryPrintData (params) {
    // 根据运单id获取打印运单箱单数据公共接口
    let result = PostFromData('/crm/waybill/print/getWaybillPrintDataByWaybillId', params)
    return result
  },
  QueryShiftList (params) {
    // 根据线路lineId获取运行班次
    let result = Get('/crm/line/waybill/queryWaybillShiftByLineId', params)
    return result
  },
  QueryWayBillNum (params) {
    // 查询已有运单集合
    let result = Get('/waybill/api/orderWaybillInfo/selectLikeWaybillNumber', params)
    return result
  },
  QueryClientInfoByOrderNumber (params) {
    // 查询订单客户信息
    let result = Get('/waybill/api/orderWaybillInfo/queryOrderClientInfo', params)
    return result
  },
  QueryWaybillInfoByPackageId (params) {
    // 根据箱单id查询运单信息
    let result = Get('/waybill/bbdJoinController/selectCreateWaybillMessageByBbd', params)
    return result
  },
  UpdatePackage (params) {
    // 修改包裹运费
    let result = Post('/waybill/bbdJoinController/updatePackageTransportPrice', params)
    return result
  },
  QueryPackage (params) {
    // 根据订单号查询运费信息
    let result = Get('/waybill/bbdJoinController/selectPackageTransportPrice', params)
    return result
  },
  QueryPrintCheckbox (params) {
    // 查询当前用户打印联复选框信息
    let result = Get('/crm/clientManageController/select/selectAccountPrintMethod', params)
    return result
  },
  UpdatePrintCheckbox (params) {
    // 更新当前用户打印联复选框信息
    let result = Get('/crm/clientManageController/update/updateAccountPrintMethod', params)
    return result
  },
  QueryDetail (params) {
    // 修改运单查询回显
    let result = PostFromData('/waybill/waybillManage/updateWaybillEcho', params)
    return result
  },
  UpdateWaybill (params) {
    // 修改运单
    let result = Post('/waybill/waybillManage/updateWaybill', params)
    return result
  }
}

export default WaybillAjax
