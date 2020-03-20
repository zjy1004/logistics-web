import { Post, Get } from '@/api/axios.config'
const ReceiptFromStaffAjax = {
  QueryList (params) {
    // 向员工收款
    let result = Post('/waybill/api/employees/queryFinanceCollectionEmployList', params)
    return result
  },
  QueryFinanceReconciliationLandVoList (params) {
    // 财务收款向员工收款对账收款分页列表
    let result = Post('/waybill/api/employees/queryFinanceCollectionReceiptList', params)
    return result
  },
  QueryReceiver (params) {
    // 查询物流公司下所有员工包括物流公司管理员
    let result = Get('/crm/logisticsPersonnel/queryLogisticsPersonnelByDefaultRole', params)
    return result
  },
  SureRecript (params) {
    // 向1员工或2落地配运单确认收款(批量)
    let result = Post('/waybill/confirmCollectionToEmployeeOrLand', params)
    return result
  },
  QueryStation (params) {
    // 查询物流公司下所有员工包括物流公司管理员
    let result = Get('/crm/Station/queryReceiveStation', params)
    return result
  }
}
export default ReceiptFromStaffAjax
