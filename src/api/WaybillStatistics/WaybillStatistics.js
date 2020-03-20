import { Get, Post } from '@/api/axios.config'

const WaybillStatisticsAjax = {
  GetLines (params) {
    // 获取物流公司下所有线路
    let result = Get('/crm/line/logistics/all', params)
    return result
  },
  QueryDrivers (params) {
    // 查询物流公司下属所有司机信息
    let result = Get('/crm/logisticsPersonnel/query/selectLogisticsDriverByLogisticsId', params)
    return result
  },
  QueryShiftByLine (params) {
    // 根据线路lineId获取运行班次
    let result = Get('/crm/line/waybill/queryWaybillShiftByLineId', params)
    return result
  },
  QueryTotalData (params) {
    // 运单统计发货运单和退货运单数据
    let result = Post('/waybill/waybillManage/waybillStatisticsDeliverReturnData', params)
    return result
  }
}

export default WaybillStatisticsAjax
