import WaybillAjax from '@/api/WaybillManage/WaybillManage'

/* 帮帮达扫码开单相关 */

/*
  扫描完成，根据箱单号查询回显页面数据
  param: packageNum 想单号
  param: _this vm
  return
*/
function _scanComplate (packageNum, _this) {
  WaybillAjax.QueryWaybillInfoByPackageId({packageId: packageNum}).then(res => {
    if (res.code === 200) {
      let { data } = res
      if (!data) {
        _this.$notify({
          message: `${res.message}`,
          type: 'error'
        })
        return false
      }
      _this.bbdReceivedFlag = data.bbdReceivedFlag
      _this.bbdSendFlag = data.bbdSendFlag
      // 回显收货方信息
      _this.orderNumber = data.orderNumber // 订单号
      _this.receiveForm.id = data.receiveClient // 收货方id
      _this.bbdReceiveClient = data.bbdReceiveClient
      if (data.bbdReceivedFlag === 1) {
        _this.receiveForm.receiveClientName = data.receiveClientName // 收货方名称
        _this.receiveForm.phone = data.receivePhone // 收货方电话
        _this.receiveForm.stationObj.stationId = data.receiveStationId // 收货方站点id
        _this.changeReceiveStation(data.receiveStationId)
      } else if (data.bbdReceivedFlag === 0) { // 帮帮达新用户
        _this.receiveClinetNamePlaceholder = data.receiveClientName
        _this.receivePhonePlaceholder = data.receivePhone
      }
      _this.receiveForm.address = data.receiveAddress // 收货方联系地址
      // 回显发货方信息
      _this.sendForm.id = data.sendClient // 发货方id
      _this.bbdSendClient = data.bbdSendClient
      if (data.bbdSendFlag === 1) {
        _this.sendForm.sendClientName = data.sendClientName // 发货方名称
        _this.sendForm.phone = data.sendPhone // 发货方电话
        _this.sendForm.stationObj.stationId = data.sendStationId // 发货方站点id
        _this.changeSendStation(data.sendStationId)
      } else if (data.bbdSendFlag === 0) { // 帮帮达新用户
        _this.sendClinetNamePlaceholder = data.sendClientName
        _this.sendPhonePlaceholder = data.sendPhone
      }
      _this.sendForm.address = data.sendAddress // 发货方联系地址
      // 回显货品信息
      _this.tableData[0].cargoName = data.packageNameFirst || '配件'
      _this.tableData[0].count = data.packageQuantityFirst || '1'
      _this.tableData[1].cargoName = data.packageNameSecond || ''
      _this.tableData[1].count = data.packageQuantitySecond || ''
      _this.tableData[0].other = data.remark || ''
      // 回显费用相关
      _this.receiveMoneyForm.freightPayer = parseInt(data.freightPayer) // 付费方
      if (parseInt(data.orderTotalPrice) === parseFloat(data.orderTotalPrice)) { // 小数位全是0
        _this.receiveMoneyForm.receivableFreight = parseInt(data.orderTotalPrice) // 运费
      } else {
        _this.receiveMoneyForm.receivableFreight = parseFloat(data.orderTotalPrice) // 运费
      }
      if (parseInt(data.receivableGoods) === parseFloat(data.receivableGoods)) {
        _this.receiveMoneyForm.receivableGoods = parseInt(data.receivableGoods) // 代收货款
      } else {
        _this.receiveMoneyForm.receivableGoods = parseFloat(data.receivableGoods) // 代收货款
      }
      _this.showEditFreigt = true
      _this.computedWaybillReceivable()
      _this.$notify({
        message: '查询订单信息成功！',
        type: 'success'
      })
    } else {
      _this.$notify({
        message: '查询订单信息失败！',
        type: 'error'
      })
    }
  }).catch(error => {
    console.log(error)
    _this.$notify({
      message: '查询订单信息失败！',
      type: 'error'
    })
  })
}

/*
  根据订单号查询订单运费
  param: packageNum 想单号
  param: _this vm
  return
*/
function _cliclChangeFreight (_this) {
  WaybillAjax.QueryPackage({orderNo: _this.orderNumber}).then(res => {
    if (res.code === 200) {
      let { data } = res
      _this.collect_price = data.collectPrice // 上门揽收价格
      _this.delivery_price = data.deliveryPrice // 送货上门价格
      _this.orderPackageList = data.packetList
      _this.showChangeFreight = true
    }
  })
}

/*
  修改运费
  param: orderPackageList 想单list
  param: collectPrice 上门揽收价格
  param: deliveryPrice 送货上门价格
  param: _this vm
  return
*/
function _clickChangeFreightSure (orderPackageList, collectPrice, deliveryPrice, _this) {
  let postData = {
    orderNumber: _this.orderNumber,
    collectPrice,
    deliveryPrice
  }
  postData.packetList = orderPackageList.map(item => {
    let obj = {
      packet_no: item.packet_no,
      packet_spec: item.packet_spec,
      transport_price: item.transport_price
    }
    return obj
  })
  let packageTotal = orderPackageList.reduce((prev, curr) => {
    const value = Number(curr.transport_price)
    if (!isNaN(value)) {
      return prev + value
    } else {
      return prev
    }
  }, 0)
  let totalFreight = packageTotal + (parseFloat(collectPrice) || 0) + (parseFloat(deliveryPrice) || 0)
  postData.orderTotalPrice = totalFreight.toFixed(2)
  WaybillAjax.UpdatePackage(postData).then(res => {
    if (res.code === 200) {
      _this.$notify({
        message: '修改运费成功！',
        type: 'success'
      })
      _this.receiveMoneyForm.receivableFreight = totalFreight.toFixed(2)
      _this.computedWaybillReceivable()
      _this.showChangeFreight = false
    }
  })
}
export { _scanComplate, _cliclChangeFreight, _clickChangeFreightSure }
