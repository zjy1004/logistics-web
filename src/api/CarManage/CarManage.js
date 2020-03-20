import { Get, PostFromData } from '@/api/axios.config'

const CarManageAjax = {
  InsertCrmCar (params) {
    // 新增车辆
    let result = PostFromData('/crm/Carmanage/insert/insertCrmCar', params)
    return result
  },
  updateCrmCar (params) {
    // 修改车辆
    let result = PostFromData('/crm/Carmanage/update/updateCrmCar', params)
    return result
  },
  QueryCrmCarList (params) {
    // 获取车辆管理列表
    let result = Get('/crm/Carmanage/show/carList', params)
    return result
  },
  getLogisticsList (params) {
    // 获取物流公司列表
    let result = Get('/crm/logisticsCompany/query/getLogisticsList', params)
    return result
  },
  updateCarStatus (params) {
    // 禁用/启用车辆
    let result = PostFromData('/crm/Carmanage/update/updateCarStatus', params)
    return result
  }
}

export default CarManageAjax
