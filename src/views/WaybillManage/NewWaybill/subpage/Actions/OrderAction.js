import WaybillAjax from '@/api/WaybillManage/WaybillManage'
/* 对接商城订单相关 */

/*
  点击搜索出的已有运单号
  param: waybillNumber 运单号
  param: _this vm
  return
*/
function _clickSearchSure (waybillNumber, _this) {
  _this.$notify({
    message: '选择运单号成功！',
    type: 'success'
  })
  _this.waybillNumber = waybillNumber
  _this.searchWaybillVisible = false
  _this.queryClientInfoByOrderNum(waybillNumber)
}

/*
  根据订单号查询客户信息
  param: waybillNumber 运单号
  param: _this vm
  return
*/
function _queryClientInfoByOrderNum (waybillNumber, _this) {
  WaybillAjax.QueryClientInfoByOrderNumber({waybillNumber}).then(response => {
    if (response.code === 200) {
      let { data } = response
      _this.receiveForm.receiverId = data.receiverId
      _this.sendForm.senderId = data.senderId
      if (data.sendClient && data.receiveClient) {
        _this.selectTableRow(data.receiveClient, undefined, 'receive')
        _this.selectTableRow(data.sendClient, undefined, 'send')
        _this.disableReceive = true
        _this.disableSend = true
      } else if (data.receiveClient) {
        _this.selectTableRow(data.receiveClient, undefined, 'receive')
        _this.disableReceive = true
      } else if (data.sendClient) {
        _this.selectTableRow(data.sendClient, undefined, 'send')
        _this.disableSend = true
      }
    }
  })
}
export { _clickSearchSure, _queryClientInfoByOrderNum }
