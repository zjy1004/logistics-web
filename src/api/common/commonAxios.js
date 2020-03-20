import { Get, Post, PostFromData } from '@/api/axios.config'

const CommonAxios = {
  QueryOperationRecord (params) {
    // 查询操作记录
    let result = Get('/crm/OperateRecord/query/operateList', params)
    return result
  },
  ValidatePhone (params) {
    // 校验手机号同模块是否存在,true已存在，false不存在
    let result = Get('/crm/user/validPhone', params)
    return result
  },
  QueryUserState (params) {
    // 用户开通状态查询
    let result = Post('/finance/register/status/query', params)
    return result
  },
  Withdraw (params) {
    // 提现
    let result = PostFromData('/finance/funds/lz/withdraw', params)
    return result
  },
  WalletBankAccount (params) {
    // 查询虚拟账户信息
    let result = Post('/finance/funds/walletBankAccount/info', params)
    return result
  },
  QueryBankInfo (params) {
    // 根据当前登录用户的默认银行卡数据
    let result = Get('/finance/api/finaBankInfo/selectBankInfoByFundAccountId', params)
    return result
  },
  queryFlagByUserIdProtocolType (params) {
    // 判断已注册驮付宝用户是否已读协议true已读false未读,1中驰车福物流云平台网站注册服务协议，2物流云“驮付宝”货款收取见证系统使用规则
    let result = PostFromData('/crm/api/crmProtocol/queryFlagByUserIdProtocolType', params)
    return result
  },
  InsertCrmUserProtocol (params) {
    // 用户协议表保存1中驰车福物流云平台网站注册服务协议，2物流云“驮付宝”货款收取见证系统使用规则
    let result = PostFromData('/crm/api/crmProtocol/insertCrmUserProtocol', params)
    return result
  },
  QueryLogisticType (params) {
    // 根据物流公司id查询是否有联营其他物流公司
    let result = PostFromData('/crm/routerConfig/query/joint/logistics/by/logisticsId', params)
    return result
  }
}

export default CommonAxios
