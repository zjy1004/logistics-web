import { Post, PostFromData } from '@/api/axios.config'

const ReceiptfromBeBornWithAjax = {
  QueryList (params) {
    // 查询向落地配收款列表
    let result = Post('/waybill/financeManage/queryFinanceCollectLandVoList', params)
    return result
  },
  queryLogisticsOptions (params) {
    // 查询落地配物流公司根据路由起点物流公司id查询路由终点物流公司List下拉框选择
    let result = PostFromData('/crm/logisticsCompany/queryLogisticsLandInfo', params)
    return result
  },
  queryFinanceReconciliationLandVoList (params) {
    // 财务收款向落地配收款对账收款分页列表
    let result = Post('/waybill/financeManage/queryFinanceReconciliationLandVoList', params)
    return result
  }
}

export default ReceiptfromBeBornWithAjax
