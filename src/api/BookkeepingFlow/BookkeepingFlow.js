import { Post } from '@/api/axios.config'

const BookkeepingFlowAjax = {
  QueryFlowIncomeList (params) {
    // 驮付宝财务流水收入流水分页列表查询
    let result = Post('/finance/api/finaFlow/queryFlowIncomeList', params)
    return result
  },
  QueryFlowCommissionDivideIntoList (params) {
    // 驮付宝财务流水佣金分成分页列表查询
    let result = Post('/finance/api/finaFlow/queryFlowCommissionDivideIntoList', params)
    return result
  },
  QueryFinanceFlowChannelCostList (params) {
    // 驮付宝财务流水通道费用分页列表查询
    let result = Post('/finance/api/finaFlow/queryFinanceFlowChannelCostList', params)
    return result
  }
}

export default BookkeepingFlowAjax
