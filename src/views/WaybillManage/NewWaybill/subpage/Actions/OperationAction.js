import WaybillAjax from '@/api/WaybillManage/WaybillManage'
/* 开单操作相关 */

/*
  收货方站点改变
  param: val 收货方站点id
  param: _this vm
  param: isEdit 是否是修改运单回显
  return
*/
function _changeReceiveStation (val, _this, isEdit) {
  _this.disableSubmit = false
  _this.receiveStationOptions.forEach(item => {
    if (item.stationId === val) {
      _this.receiveForm.stationObj.stationName = item.stationName
      _this.ReceiveStationId = item.stationId
    }
  })
  _stationChange(_this, isEdit)
}

/*
  站点变化查询线路班次
  param: _this vm
  param: isEdit 是否是修改运单回显
  return
*/
function _stationChange (_this, isEdit) {
  if (_this.waybillType) {
    _this.queryWaybillAndShift(_this.waybillType, _this.ReceiveStationId, _this.tempReceiveClientId, _this.sendStationId, _this, isEdit)
  } else {
    if (_this.pageType === 'add') { // 新建运单
      _this.queryWaybillAndShift(1, _this.ReceiveStationId, _this.tempReceiveClientId, _this.sendStationId, _this, isEdit)
    } else if (_this.pageType === 'tracking') {
      _this.queryWaybillAndShift(3, _this.ReceiveStationId, _this.tempReceiveClientId, _this.sendStationId, _this, isEdit)
    }
  }
}

/*
  发货方站点改变
  param: val 发货方站点id
  param: _this vm
  param: isEdit 是否是修改运单回显
  return
*/
function _changeSendStation (val, _this, isEdit) {
  _this.disableSubmit = false
  _this.stationOptions.forEach(item => {
    if (item.stationId === val) {
      _this.sendForm.stationObj.stationName = item.stationName
      _this.sendStationId = item.stationId
    }
  })
  _stationChange(_this, isEdit)
}

/*
  根据运费及代收货款计算应收金额
  param: event dom原生对象
  param: inputType 输入类型
  param: val 输入值
  param: _this vm
  return
*/
function _moneyChange (event, inputType, value, _this) {
  let val = value.match(/^\d*(\.?\d{0,2})/g)[0] || null
  _this.$nextTick(() => {
    event.target.value = val
    if (inputType === 'receivableFreight') {
      _this.isReceivableFreightChange = true
      _this.receiveMoneyForm.receivableFreight = val
    } else if (inputType === 'receivableGoods') {
      _this.receiveMoneyForm.receivableGoods = val
    }
    _this.computedWaybillReceivable()
  })
}

/*
  模糊搜索
  param: event dom原生对象
  param: searchColName 搜索列
  param: val 输入值
  param: editFormType 当前编辑是收货方或发货方
  param: _this vm
  return
*/
function _search (event, searchColName, val, editFormType, _this) {
  let value = event.target.value
  // if (value.length < 3) {
  //   return false
  // }
  if (value === '') {
    _this.receiveForm.isInput = ''
    _this.sendForm.isInput = ''
    return false
  }
  _this.disableSubmit = false
  if (searchColName === 'phone') {
    value = _this.validateOnlyNum(value)
    _this.$nextTick(() => {
      event.target.value = value
    })
  }
  if (editFormType === 'receiveForm') { // 搜索收货方
    _this.receiveSearchTable = _this.currrentSearchReceiveData.filter((item) => {
      if (item[searchColName] === null) {
        item[searchColName] = ''
      }
      if (searchColName === 'clientName') {
        return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
      } else {
        return item[searchColName].includes(value)
      }
    })
    if (_this.receiveSearchTable.length > 10) {
      _this.receiveSearchTable = _this.receiveSearchTable.slice(0, 10)
    }
    if (_this.receiveSearchTable.length > 0) {
      _this.currentIndex = 0
      _this.currentRow = _this.receiveSearchTable[0]
      _this.setCurrentRow()
    } else {
      _this.currentRow = null
    }
    _this.receiveForm.isInput = searchColName
  } else if (editFormType === 'sendForm') { // 搜索发货方
    _this.sendSearchTable = _this.currrentSearchSendData.filter((item) => {
      if (item[searchColName] === null) {
        item[searchColName] = ''
      }
      if (searchColName === 'clientName') {
        return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
      } else {
        return item[searchColName].includes(value)
      }
    })
    if (_this.sendSearchTable.length > 10) {
      _this.sendSearchTable = _this.sendSearchTable.slice(0, 10)
    }
    if (_this.sendSearchTable.length > 0) {
      _this.currentIndex = 0
      _this.currentRow = _this.sendSearchTable[0]
      _this.setCurrentRow()
    } else {
      _this.currentRow = null
    }
    _this.sendForm.isInput = searchColName
  }
}

/*
  选中表格某行数据
  param: row 选中行
  param: event dom原生对象
  param: type 选中收货方或发货方数据
  param: _this vm
  return
*/
function _selectTableRow (row, event, type, _this) {
  // 跳转下一处
  _this.nextFocus()
  let selectTableType = ''
  if (type === 'receive') {
    selectTableType = 'receiveType'
  } else if (type === 'send') {
    selectTableType = 'sendType'
  } else {
    let { path } = event
    let len = path.length
    for (let i = 0; i < len; i++) {
      if (path[i].className.includes('receiveType')) {
        selectTableType = 'receiveType'
        break
      } else if (path[i].className.includes('sendType')) {
        selectTableType = 'sendType'
        break
      }
    }
  }
  if (selectTableType === 'receiveType') { // 收货方
    if (_this.receiveMoneyForm.freightPayer === 2 && row.freightSettlementMethod !== null) { // 付费方是收货方
      _this.receiveMoneyForm.settlementMethod = Number(row.freightSettlementMethod)
      _this.settlementMethodChange(Number(row.freightSettlementMethod))
    }
    _this.receiveForm.id = row.id
    _this.receiveForm.receiveClientName = row.clientName
    _this.receiveForm.clientCode = row.clientCode
    _this.receiveForm.phone = row.phone
    _this.receiveForm.stationName = row.stationName
    _this.receiveForm.address = row.address
    _this.receiveForm.freightSettlementMethod = row.freightSettlementMethod
    _this.receiveForm.isInput = ''
    _this.ReceiveStationId = row.stationId
    let sendFormVal = JSON.parse(sessionStorage.getItem('sendFormVal'))
    if (sendFormVal) {
      _this.sendStationId = sendFormVal.stationObj.stationId
    }
    if (_this.pageType !== '') {
      if (_this.pageType === 'add') { // 新建运单
        if (_this.ReceiveStationId) {
          _this.tempReceiveClientId = row.id
          _this.queryWaybillAndShift(1, _this.ReceiveStationId, row.id, _this.sendStationId, _this)
        } else { // 若所选收货方无服务站点，清空路线班次
          _this.wayList = []
          _this.wayForm.pkLineObj = {
            generateVal: '',
            generateKey: ''
          }
          _this.stationList = []
          _this.wayForm.shiftObj = {
            generateVal: '',
            generateKey: ''
          }
        }
      } else if (_this.pageType === 'revoke') { // 退货运单
        // 不查询路线班次列表
      } else if (_this.pageType === 'tracking') { // 补录运单
        if (_this.ReceiveStationId) {
          _this.tempReceiveClientId = row.id
          _this.queryWaybillAndShift(3, _this.ReceiveStationId, row.id, _this.sendStationId, _this)
        } else { // 若所选收货方无服务站点，清空路线班次
          _this.wayList = []
          _this.wayForm.pkLineObj = {
            generateVal: '',
            generateKey: ''
          }
          _this.stationList = []
          _this.wayForm.shiftObj = {
            generateVal: '',
            generateKey: ''
          }
        }
      }
    }
    if (row.stationId) {
      // 若选择的收货方下有站点，收货方服务站默认设置为改收货方的站点
      // _this.receiveStationOptions = [{stationId: row.stationId, stationName: row.stationName}]
      _this.receiveForm.stationObj.stationId = row.stationId
      _this.receiveForm.stationObj.stationName = row.stationName
    } else {
      // 若无，则不允许开单
      _this.receiveStationOptions = []
    }
  } else if (selectTableType === 'sendType') { // 发货方
    if (_this.receiveMoneyForm.freightPayer === 1 && row.freightSettlementMethod !== null) { // 付费方是发货方
      _this.receiveMoneyForm.settlementMethod = Number(row.freightSettlementMethod)
      _this.settlementMethodChange(Number(row.freightSettlementMethod))
    }
    if (_this.pageType === 'add') { // 新建运单
      _this.queryWaybillAndShift(1, _this.ReceiveStationId, _this.tempReceiveClientId, row.stationId, _this)
    } else if (_this.pageType === 'tracking') {
      _this.queryWaybillAndShift(3, _this.ReceiveStationId, _this.tempReceiveClientId, row.stationId, _this)
    }
    _this.sendForm.id = row.id
    _this.sendForm.sendClientName = row.clientName
    _this.sendForm.clientCode = row.clientCode
    _this.sendForm.phone = row.phone
    _this.sendForm.stationName = row.stationName
    _this.sendForm.address = row.address
    _this.sendForm.freightSettlementMethod = row.freightSettlementMethod
    // _this.sendForm.isInput = false
    _this.sendForm.isInput = ''
    if (row.stationId) {
      _this.sendStationId = row.stationId
      _this.sendForm.stationObj.stationId = row.stationId
      _this.sendForm.stationObj.stationName = row.stationName
    }
  }
}

/*
  路线下拉改变，改变对应的班次
  param: selectObj 选中线路
  param: _this vm
  return
*/
function _wayChange (selectObj, _this) {
  _this.disableSubmit = false
  if (selectObj.data) {
    _this.stationList = selectObj.data
    _this.wayForm.shiftObj = selectObj.data[0]
  } else {
    WaybillAjax.QueryShiftList({lineId: selectObj.generateKey}).then(response => {
      if (response.code === 200) {
        _this.stationList = response.data.map(item => {
          item.generateKey = item.shiftId
          item.generateVal = item.departureTime
          return item
        })
        if (_this.stationList.length > 0) {
          _this.wayForm.shiftObj = _this.stationList[0]
        } else {
          _this.wayForm.shiftObj = {generateKey: '', generateVal: ''}
        }
      }
    })
  }
}

/*
  结算方式改变
  param: val 结算方式值
  param: changeType 改变源方式
  param: _this vm
  return
*/
function _settlementMethodChange (val, changeType, _this) {
  if (val === 3) { // 包月
    _this.receiveMoneyForm.receivableFreight = '0'
    _this.computedWaybillReceivable()
    _this.disableSettlement = true
    if (changeType === 'click') { // 点击改变的结算方式
      _this.$refs.receivableGoods.focus()
    }
  } else {
    // 帮帮达结算方式变化非包月时运费不带入用户信息中的默认运费
    if (_this.orderNumber === '') {
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        let userInfoObj = JSON.parse(userInfo)
        if (!_this.isReceivableFreightChange) { // 若未编辑过运费
          _this.receiveMoneyForm.receivableFreight = userInfoObj.freightDefault
          _this.computedWaybillReceivable(Number(userInfoObj.freightDefault))
        } // 编辑过运费后更换结算方式不再刷运费
      }
      _this.disableSettlement = false
      if (changeType === 'click') {
        _this.$nextTick(() => {
          _this.$refs.receivableFreight.focus()
        })
      }
      if (_this.$route.query.waybillId) { // 修改运单
        _this.$nextTick(() => {
          _this.$refs.receivableFreight.focus()
        })
      }
    }
  }
}

/*
  付费方下拉变化
  param: val 付费方
  param: _this vm
  return
*/
function _payerChange (val, _this) {
  if (val === 1) { // 发货方
    if (_this.receiveMoneyForm.settlementMethod === 3) {
      _this.disableSettlement = true
    }
    if (_this.sendForm.id && _this.sendForm.freightSettlementMethod !== '') { // 发货方已选数据且有结算方式
      _this.receiveMoneyForm.settlementMethod = Number(_this.sendForm.freightSettlementMethod)
      _this.settlementMethodChange(Number(_this.sendForm.freightSettlementMethod))
    } else {
      _this.receiveMoneyForm.settlementMethod = _this.payTypeList[0].id
      if (_this.sendForm.freightSettlementMethod !== '') {
        _this.settlementMethodChange(Number(_this.sendForm.freightSettlementMethod))
      }
    }
  } else { // 收货方
    if (_this.receiveMoneyForm.settlementMethod === 3) {
      _this.disableSettlement = false
    }
    if (_this.receiveForm.id && _this.receiveForm.freightSettlementMethod !== '') { // 收货方已选数据且有结算方式
      _this.receiveMoneyForm.settlementMethod = Number(_this.receiveForm.freightSettlementMethod)
      _this.settlementMethodChange(Number(_this.receiveForm.freightSettlementMethod))
    } else {
      _this.receiveMoneyForm.settlementMethod = _this.payTypeList[0].id
      if (_this.receiveForm.freightSettlementMethod !== '') {
        _this.settlementMethodChange(Number(_this.receiveForm.freightSettlementMethod))
      }
    }
  }
}

/*
  根据账号id查询该账号打印项
  param: accountId 账号id
  return
*/
function _queryPrintCheckbox (accountId) {
  return new Promise((resolve, reject) => {
    WaybillAjax.QueryPrintCheckbox({accountId}).then(response => {
      if (response.code === 200) {
        resolve(response.data)
      } else {
        reject(response)
      }
    })
  })
}

/*
  更新客户打印方式
  param: printMethod 打印方式
  param: accountId 账户id
  param: _this vm
  return
*/
function _updatePrintCheckbox (printMethod, accountId, _this) {
  WaybillAjax.UpdatePrintCheckbox({printMethod, accountId}).then(response => {
    if (response.code !== 200) {
      _this.$notify({
        message: '修改客户打印方式失败！',
        type: 'error'
      })
    }
  })
}
export { _changeReceiveStation, _changeSendStation, _moneyChange, _search, _selectTableRow, _wayChange, _settlementMethodChange, _payerChange, _queryPrintCheckbox, _updatePrintCheckbox }
