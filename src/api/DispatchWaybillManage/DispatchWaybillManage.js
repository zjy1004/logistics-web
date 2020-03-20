import { Post } from '@/api/axios.config'

const DispatchWaybillManageAjax = {
  QueryList (params) {
    // 获取调度运单查询列表
    let result = Post('/waybill/dispatch/query/queryDispatchWaybill', params)
    return result
  }
}

export default DispatchWaybillManageAjax
