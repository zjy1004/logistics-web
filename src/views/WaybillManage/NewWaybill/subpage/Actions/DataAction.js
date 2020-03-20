import WaybillAjax from '@/api/WaybillManage/WaybillManage'
import RouteAjax from '@/api/RouteManage/RouteManage'
/* 开单数据相关方法 */

/*
  查询全部收发货放客户信息
  param: _this vm
  return
*/
function _queryClientData (_this) {
  WaybillAjax.GetClientData().then(response => {
    if (response.code === 200) {
      let logisticsId = JSON.parse(sessionStorage.getItem('userInfo')).logisticsId
      if (logisticsId !== 29 && logisticsId !== 35 && logisticsId !== 36 && logisticsId !== 37 && logisticsId !== 38) {
        sessionStorage.setItem('allClientData', JSON.stringify(response))
      }
      if (_this.disableWayAndShift) { // 退货运单，收发货方数据需要调换
        _this.receiveSourceData = response.data['2']
        _this.receiveSearchTable = response.data['2']
        _this.sendSourceData = response.data['1']
        _this.sendSearchTable = response.data['1']
      } else {
        _this.receiveSourceData = response.data['1']
        _this.receiveSearchTable = response.data['1']
        _this.sendSourceData = response.data['2']
        _this.sendSearchTable = response.data['2']
      }
      if (!_this.disableWayAndShift) { // 非退货运单
        let receiveStroageVal = localStorage.getItem('receiveStroageVal')
        let sendStroageVal = localStorage.getItem('sendStroageVal')
        if (receiveStroageVal) {
          _this.receiveSearchRadio = receiveStroageVal
        }
        if (sendStroageVal) {
          _this.sendSearchRadio = sendStroageVal
        }
      }
    }
  })
}
/*
  查询全部收发货放客户信息
  param: _this vm
  return
*/
function _getLocalStorageClientData (_this) {
  let response = JSON.parse(sessionStorage.getItem('allClientData'))
  if (response) {
    if (_this.disableWayAndShift) { // 退货运单，收发货方数据需要调换
      _this.receiveSourceData = response.data['2']
      _this.receiveSearchTable = response.data['2']
      _this.sendSourceData = response.data['1']
      _this.sendSearchTable = response.data['1']
    } else {
      _this.receiveSourceData = response.data['1']
      _this.receiveSearchTable = response.data['1']
      _this.sendSourceData = response.data['2']
      _this.sendSearchTable = response.data['2']
    }
    if (!_this.disableWayAndShift) { // 非退货运单
      let receiveStroageVal = localStorage.getItem('receiveStroageVal')
      let sendStroageVal = localStorage.getItem('sendStroageVal')
      if (receiveStroageVal) {
        _this.receiveSearchRadio = receiveStroageVal
      }
      if (sendStroageVal) {
        _this.sendSearchRadio = sendStroageVal
      }
    }
  }
}
/*
  查询发货方站点下拉数据
  param: _this vm
  return
*/
function _queryStationList (_this) {
  WaybillAjax.QueryStationListByPkLogistics().then(response => {
    if (response.code === 200) {
      _this.stationOptions = response.data
    }
  })
}

/*
  查询收货方站点下拉数据
  param: _this vm
  return
*/
function _queryReceiveStationList (_this) {
  WaybillAjax.QueryReceiveStationListByPkLogistics().then(response => {
    if (response.code === 200) {
      _this.receiveStationOptions = response.data
    }
  })
}

/*
  查询全部线路
  param: _this vm
  return
*/
function _queryAllLine (_this) {
  RouteAjax.QueryLines({lineType: 1}).then(response => {
    if (response.code === 200) {
      _this.wayList = response.data
    }
  })
}

/*
  根据选择的表格行数据客户id查询线路和班次下拉数据
  param: type 开单类型 1.新建运单
  param: stationId 站点id
  param: receiveClientId 收货方id
  param: sendStationId 发货方id
  param: _this vm
  param: isEdit 调用途径 1 修改时回显，其他手动修改客户或站点
  return
*/
function _queryWaybillAndShift (type, stationId, receiveClientId, sendStationId, _this, isEdit) {
  let id = receiveClientId || _this.receiveForm.id || ''
  WaybillAjax.QueryWaybillAndShift({waybillType: type, stationId, receiveClientId: id, sendStationId}).then(response => {
    if (response.code === 200) {
      _this.wayAndStationList = response.data
      if (response.data !== null) {
        if (response.data.length > 0) { // 若此客户下有线路及班次
          let hasFistShift = true
          _this.wayList = []
          _this.stationList = []
          response.data.forEach((wayItem, index) => {
            _this.wayList.push(wayItem)
            if (index === 0) {
              if (wayItem.data === null || wayItem.data.length === 0) {
                hasFistShift = false
              }
            }
          })
          let currentGenerateKey = ''
          if (_this.wayList.length > 0) {
            if (isEdit && _this.wayForm.pkLineObj.generateKey) { // 修改回显时已经有线路id值
              _this.wayList.forEach(item => {
                if (item.generateKey === _this.wayForm.pkLineObj.generateKey) {
                  _this.routerType = item.generateType
                }
              })
              currentGenerateKey = _this.wayForm.pkLineObj.generateKey
            } else { // 新开单时，默认选中第一个
              _this.wayForm.pkLineObj = _this.wayList[0]
              _this.routerType = _this.wayList[0].generateType
              currentGenerateKey = _this.wayList[0].generateKey
            }
          }
          if (hasFistShift) {
            response.data.forEach(item => {
              if (item.generateKey === currentGenerateKey) {
                _this.stationList = item.data || []
              }
            })
            if (_this.stationList.length > 0) {
              if (isEdit && _this.wayForm.shiftObj.generateKey) { // 修改回显时已经有班次id值
                // 后台返回的班次id是数字
                _this.wayForm.shiftObj.generateKey = _this.wayForm.shiftObj.generateKey.toString()
              } else {
                _this.wayForm.shiftObj = _this.stationList[0]
              }
            }
            // 帮帮达根据短码查询出运单信息回显后（有线路班次时）自动调开单接口开单
            if (_this.bbdReceivedFlag === 1 && _this.bbdSendFlag === 1) {
              _this.$nextTick(() => {
                // already标实锁字段，防止重复提交
                if (!_this.disableSubmit && !_this.already) {
                  _this.submitBill()
                }
              })
            }
          } else {
            _this.wayForm.shiftObj = {
              generateKey: '',
              generateVal: ''
            }
          }
        } else { // 路线下拉变为全数据，路线和班次清空
          _this.wayList = []
          _this.stationList = []
          _this.wayForm.pkLineObj = {
            generateKey: '',
            generateVal: ''
          }
          _this.wayForm.shiftObj = {
            generateKey: '',
            generateVal: ''
          }
        }
      }
    }
  })
}

/*
  新建运单格式化提交数据
  param: _this vm
  return postData
*/
function _formatPostData (_this) {
  let curDate = new Date()
  let currentTime = curDate.getTime()
  // waybillType 1: 新建运单 2: 退回运单
  let postData = {
    orderNumber: _this.orderNumber, // 帮帮达订单号
    receiveClient: _this.receiveForm.id, // 收货方
    bbdReceiveClient: _this.bbdReceiveClient,
    receiverId: _this.receiveForm.receiverId, // 交易收货方ID
    receiveClientName: _this.receiveForm.receiveClientName, // 收货方名称
    receiveStation: _this.receiveForm.stationObj.stationId, // 收货方站点id
    receiveStationName: _this.receiveForm.stationObj.stationName, // 收货方站点名称
    receivePhone: _this.receiveForm.phone, // 收货方电话
    receiveAddress: _this.receiveForm.address, // 收货方联系地址
    sendClient: _this.sendForm.id, // 发货方
    bbdSendClient: _this.bbdSendClient,
    senderId: _this.sendForm.senderId, // 交易发货方ID
    sendClientName: _this.sendForm.sendClientName, // 发货方名称
    sendStation: _this.sendForm.stationObj.stationId, // 发货方站点
    sendStationName: _this.sendForm.stationObj.stationName, // 发货方站点名称
    sendPhone: _this.sendForm.phone, // 发货方电话
    sendAddress: _this.sendForm.address, // 发货方联系地址
    pkLine: _this.wayForm.pkLineObj.generateKey, // 线路id
    lineName: _this.wayForm.pkLineObj.generateVal, // 线路名称
    shiftId: _this.wayForm.shiftObj.generateKey, // 班次
    shiftRunName: _this.wayForm.shiftObj.generateVal, // 班次名称
    packageNameFirst: _this.tableData[0].cargoName, // 包裹1名称
    packageQuantityFirst: _this.tableData[0].count, // 包裹1数量
    packageNameSecond: _this.tableData[1].cargoName, // 包裹2名称
    packageQuantitySecond: _this.tableData[1].count === 0 ? '' : _this.tableData[1].count, // 包裹2数量
    remark: _this.tableData[0].other, // 备注
    settlementMethod: _this.receiveMoneyForm.settlementMethod, // 结算方式
    receivableFreight: _this.receiveMoneyForm.receivableFreight === '' || _this.receiveMoneyForm.receivableFreight === null ? 0 : _this.receiveMoneyForm.receivableFreight, // 运费
    freightPayer: _this.receiveMoneyForm.freightPayer, // 收费方
    waybillReceivable: _this.receiveMoneyForm.waybillReceivable, // 应收金额
    receivableGoods: _this.receiveMoneyForm.receivableGoods || 0, // 代收贷款
    currentTime: currentTime,
    returnGoodsPutInStorage: _this.revokeChecked ? 10 : 9,
    waybillNumber: _this.waybillNumber, // 已选运单号
    routerType: _this.routerType // 运单配送类型
  }
  if (postData.settlementMethod === 0) { // 2019-1-25改，若结算方式为 0 默认传 1
    postData.settlementMethod = 1
  }
  if (_this.waybillType) { // 修改回显中有类型
    postData.waybillId = _this.waybillId
    postData.waybillType = _this.waybillType
  } else {
    if (_this.pageType !== '') {
      if (_this.pageType === 'add') { // 新建运单
        postData.waybillType = 1
      } else if (_this.pageType === 'revoke') { // 退货运单
        postData.waybillType = 2
      } else if (_this.pageType === 'tracking') { // 补录运单
        postData.waybillType = 3
      }
    }
  }
  return postData
}

/*
  新建运单提交前校验信息
  param: _this vm
  return result 校验结果对象
*/
function _validatePostData (_this) {
  // 只提示第一处不满足
  let result = {
    flag: true,
    message: ''
  }
  let reg = /^(\s+)(\s+)$/g
  // 收货方
  if ((_this.receiveForm.receiveClientName === '' || reg.test(_this.receiveForm.receiveClientName)) &&
  (_this.receiveForm.phone === '' || reg.test(_this.receiveForm.phone)) &&
  (_this.receiveForm.address === '' || reg.test(_this.receiveForm.address))) {
    result.flag = false
    result.message = '收货方名称，电话，地址至少填写一项!'
    return result
  }

  if (_this.receiveForm.stationObj.stationId === '') { // 收货方站点
    result.flag = false
    result.message = '请选择收货方服务站!'
    return result
  }

  // 发货方
  if ((_this.sendForm.sendClientName === '' || reg.test(_this.sendForm.sendClientName)) &&
  (_this.sendForm.phone === '' || reg.test(_this.sendForm.phone)) &&
  (_this.sendForm.address === '' || reg.test(_this.sendForm.address))) {
    result.flag = false
    result.message = '发货方名称，电话，地址至少填写一项!'
    return result
  }

  if (_this.sendForm.stationObj.stationId === '') { // 发货方站点
    result.flag = false
    result.message = '请选择发货方服务站!'
    return result
  }
  if (!_this.disableWayAndShift) { // 非退货运单时，需要填写路线班次
    if (_this.wayForm.pkLineObj.generateKey === '') { // 路线
      result.flag = false
      result.message = '请选择路线!'
      return result
    }
    if (_this.wayForm.shiftObj.generateKey === '') { // 班次
      result.flag = false
      result.message = '请选择班次!'
      return result
    }
  }
  if (_this.boxBillCount.length < 1) {
    result.flag = false
    result.message = '包裹数量至少为一个!'
    return result
  }
  return result
}

/*
  修改运单查询运单信息回显
  param: waybillId 运单id
  param: _this vm
*/
function _queryDetail (waybillId, _this) {
  WaybillAjax.QueryDetail({waybillId}).then(response => {
    if (response.code === 200) {
      let {data} = response
      _this.waybillType = data.waybillType
      _this.waybillNumber = data.waybillNumber
      _this.receiveMoneyForm.freightPayer = data.freightPayer
      if (data.freightPayer === 1) { // 发货方付
        _this.sendForm.freightSettlementMethod = data.settlementMethod
        _this.receiveForm.freightSettlementMethod = data.receiveSettlementMethod
      } else {
        _this.receiveForm.freightSettlementMethod = data.settlementMethod
        _this.sendForm.freightSettlementMethod = data.sendSettlementMethod
      }
      // _this.tempReceiveClientId = data.receiveClient || ''
      _this.wayForm.pkLineObj.generateKey = data.pkLine
      _this.wayForm.pkLineObj.generateVal = data.lineName
      _this.logisticsId = data.logisticsId
      _this.orderNumber = data.orderNumber || ''
      _this.tableData[0].cargoName = data.packageNameFirst || ''
      _this.tableData[0].count = data.packageQuantityFirst || ''
      _this.tableData[1].packageNameSecond = data.packageNameSecond || ''
      _this.tableData[1].count = data.packageQuantitySecond || ''
      _this.tableData[0].other = data.remark || ''
      _this.tableData[1].other = data.remark || ''
      if (data.settlementMethod === 3) { // 运费包月显示为'0'且不可修改
        _this.receiveMoneyForm.receivableFreight = '0'
        _this.disableSettlement = true
      } else {
        _this.receiveMoneyForm.receivableFreight = (typeof (data.receivableFreight) === 'number') ? data.receivableFreight.toString() : ''
      }
      if (data.receivableGoods === 0) { // 代收为0显示为'0'
        _this.receiveMoneyForm.receivableGoods = '0'
      } else {
        _this.receiveMoneyForm.receivableGoods = (typeof (data.receivableGoods) === 'number') ? data.receivableGoods.toString() : ''
      }
      _this.receiveForm.address = data.receiveAddress || ''
      _this.receiveForm.id = data.receiveClient
      _this.receiveForm.receiveClientName = data.receiveClientName || ''
      _this.receiveForm.clientCode = data.receiveClientCode || ''
      _this.receiveForm.phone = data.receivePhone || ''
      _this.receiveForm.stationObj.stationId = data.receiveStation || ''
      _this.changeReceiveStation(data.receiveStation, 1)
      _this.revokeChecked = data.returnGoodsPutInStorage || ''
      _this.routerType = data.routerType || ''
      _this.sendForm.address = data.sendAddress || ''
      _this.sendForm.id = data.sendClient
      _this.sendForm.clientCode = data.sendClientCode || ''
      _this.sendForm.sendClientName = data.sendClientName || ''
      _this.sendForm.phone = data.sendPhone || ''
      _this.sendForm.stationObj.stationId = data.sendStation || ''
      _this.changeSendStation(data.sendStation, 1)
      _this.receiveMoneyForm.settlementMethod = data.settlementMethod
      _this.wayForm.shiftObj.generateKey = data.shiftId
      _this.wayForm.shiftObj.generateVal = data.shiftRunName
      _this.receiveMoneyForm.waybillReceivable = data.waybillReceivable
    }
  })
}
export { _queryClientData, _getLocalStorageClientData, _queryStationList, _queryReceiveStationList, _queryAllLine, _queryWaybillAndShift, _formatPostData, _validatePostData, _queryDetail }
