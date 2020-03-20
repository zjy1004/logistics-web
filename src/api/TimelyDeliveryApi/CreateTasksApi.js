import { PostFromData, Get, Post } from '@/api/axios.config'
const CreateTasksAjax = {
  GetClientData (params) {
    // 获取客户信息列表数据
    let result = PostFromData('/crm/client/waybill/all', params)
    return result
  },
  QueryFlashLogisticsClient (params) {
    // 根据物流公司查询客户信息和地址信息和联系方式
    let result = Get('/crm/client/waybill/all/flash', params)
    return result
  },
  InsertWaybillTask (params) {
    // 任务指派数据插入
    let result = Post('/flash/waybill/insert/WaybillTask', params)
    return result
  },
  QueryWaybillReceiveTask (params) {
    // 揽收任务列表查询
    let result = Post('/flash/waybill/query/WaybillReceiveTask', params)
    return result
  },
  QueryWaybillSendTask (params) {
    // 配送任务列表查询
    let result = Post('/flash/waybill/query/WaybillSendTask', params)
    return result
  },
  QueryWaybillReceiveTaskById (params) {
    // 揽收任务单条查询（回显）
    let result = PostFromData('/flash/waybill/query/WaybillReceiveTaskById', params)
    return result
  },
  EditReceiveTask (params) {
    // 揽收任务单条修改
    let result = Post('/flash/waybill/update/WaybillReceiveTaskInfo', params)
    return result
  },
  QueryWaybillSendTaskById (params) {
    // 配送任务单条查询（回显）
    let result = PostFromData('/flash/waybill/query/WaybillSendTaskById', params)
    return result
  },
  EditSendTask (params) {
    // 配送任务单条修改
    let result = Post('/flash/waybill/update/WaybillSendTaskInfo', params)
    return result
  },
  QueryDriverList (params) {
    // 司机列表查询
    let result = Get('/crm/logisticsPersonnel/query/flash/selectLogisticsDriverByLogisticsId', params)
    return result
  },
  CancelReceiveTask (params) {
    // 揽收任务单条取消
    let result = PostFromData('/flash/waybill/update/WaybillReceiveTaskStatus', params)
    return result
  },
  CancelSendTask (params) {
    // 配送任务取消
    let result = Get('/flash/flash/waybill/flash/cancel', params)
    return result
  },
  QueryWarterSignDriverList (params) {
    // 查询前五个闪送司机列表
    let result = Post('/crm/api/crmUserSign/query/driver/list', params)
    return result
  },
  FlashWaybillCreate (params) {
    // 闪送运单开单
    let result = Post('/flash/flashWaybillCreateController/flashWaybillCreate', params)
    return result
  },
  NewQueryPrintData (params) {
    // 根据运单id获取运单打印数据
    let result = PostFromData('/flash/flashWaybillCreateController/queryFlashWaybillPrint', params)
    return result
  }
}
export default CreateTasksAjax
