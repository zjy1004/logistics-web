
/* 开单键盘相关时间 */

/*
  扫码开单框键盘事件
  param: e dom原生对象
  param: _this vm
  return
*/
function _scanKeyDown (e, _this) {
  if (e && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
    let domValue = e.target.value
    if (domValue === '') {
      _this.$refs.receiveClientName.focus()
    } else {
      let packageArr = domValue.split('/')
      let packageNum = packageArr[packageArr.length - 1]
      _this.scanValue = packageNum
      _this.scanComplate(packageNum)
    }
  }
}

/*
  快捷键提交(ctrl+enter)
  param: event dom原生对象
  param: _this vm
  param: page 事件外this
  param: type 新建运单或修改运单 insert || edit
  return
*/
function _shortcuKeyEvent (event, _this, page, type) {
  if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) { // ctrl+enter提交
    if (_this.disableSubmit) {
      return false
    }
    if (window.event) {
      // IE中阻止函数器默认动作的方式
      window.event.returnValue = false
    } else {
      event.preventDefault()
    }
    _this.$refs.submitBtn.$el.click()
    _this.disableSubmit = true
    _this.already = true
    document.removeEventListener('keydown', page.shortcuKeyEvent)
  } else if (event.keyCode === 81 && (event.ctrlKey || event.metaKey)) {
    if (type === 'insert') {
      _this.searchWaybillVisible = true
    }
  }
}

/*
  模糊搜索结果表格上下键事件
  param: event dom原生对象
  param: _this vm
  return
*/
function _shortcutKeyUp (event, _this) {
  let val = event.target.value
  let editType = ''
  if (_this.receiveForm.isInput !== '') {
    editType = 'receiveType'
  } else if (_this.sendForm.isInput !== '') {
    editType = 'sendType'
  }
  if (event.keyCode === 40) { // 下
    if (val.length > 0) {
      if (editType === 'receiveType' && _this.receiveSearchTable.length > 0) {
        let newIndex = _this.currentIndex + 1
        if (_this.receiveSearchTable[newIndex]) { // 下一行有数据
          _this.currentIndex = newIndex
          _this.currentRow = _this.receiveSearchTable[newIndex]
        } else if (_this.receiveSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
          _this.currentIndex = 0
          _this.currentRow = _this.receiveSearchTable[0]
        } else if (_this.receiveSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
          _this.currentIndex = ''
          _this.currentRow = null
        }
      }
      if (editType === 'sendType' && _this.sendSearchTable.length > 0) {
        let newIndex = _this.currentIndex + 1
        if (_this.sendSearchTable[newIndex]) { // 下一行有数据
          _this.currentIndex = newIndex
          _this.currentRow = _this.sendSearchTable[newIndex]
        } else if (_this.sendSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
          _this.currentIndex = 0
          _this.currentRow = _this.sendSearchTable[0]
        } else if (_this.sendSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
          _this.currentIndex = ''
          _this.currentRow = null
        }
      }
    }
  } else if (event.keyCode === 38) { // 上
    if (val.length > 0) {
      if (editType === 'receiveType' && _this.receiveSearchTable.length > 0) {
        let newIndex = _this.currentIndex - 1
        if (_this.receiveSearchTable[newIndex]) { // 上一行有数据
          _this.currentIndex = newIndex
          _this.currentRow = _this.receiveSearchTable[newIndex]
        } else if (_this.receiveSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
          _this.currentIndex = _this.receiveSearchTable.length - 1
          _this.currentRow = _this.receiveSearchTable[_this.currentIndex]
        } else if (_this.receiveSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
          _this.currentIndex = ''
          _this.currentRow = null
        }
      }
      if (editType === 'sendType' && _this.sendSearchTable.length > 0) {
        let newIndex = _this.currentIndex - 1
        if (_this.sendSearchTable[newIndex]) { // 上一行有数据
          _this.currentIndex = newIndex
          _this.currentRow = _this.sendSearchTable[newIndex]
        } else if (_this.sendSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
          _this.currentIndex = _this.sendSearchTable.length - 1
          _this.currentRow = _this.sendSearchTable[_this.currentIndex]
        } else if (_this.sendSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
          _this.currentIndex = ''
          _this.currentRow = null
        }
      }
    }
  }
  _this.setCurrentRow()
  if (event.keyCode === 13) { // 回车
    if (_this.currentRow) {
      _this.selectTableRow(_this.currentRow, event)
    }
  }
}

/*
  输入框失焦事件
  param: editFormType 当前处于聚焦输入框类型
  param: _this vm
  return
*/
function _blurFormInput (editFormType, _this) {
  setTimeout(() => {
    if (editFormType === 'receiveForm') {
      _this.receiveForm.isInput = ''
    } else if (editFormType === 'sendForm') {
      _this.sendForm.isInput = ''
    }
    _this.currentRow = null
  }, 200)
}

/*
  选中模糊搜索结果选中后下一位置聚焦事件
  param: _this vm
  return
*/
function _nextFocus (_this) {
  if (_this.receiveForm.isInput !== '') { // 当前编辑的是收货方
    if (_this.receiveForm.isInput === 'clientName') { // 收货方名称
      _this.$refs.sendClinetName.focus()
    } else if (_this.receiveForm.isInput === 'clientCode') { // 收货方编码
      _this.$refs.sendClinetCode.focus()
    } else if (_this.receiveForm.isInput === 'phone') { // 收货方电话
      _this.$refs.sendPhone.focus()
    }
  }
  if (_this.sendForm.isInput !== '') { // 当前编辑的是发货方
    _this.$refs.numberInput1.focus()
  }
}

/*
  数量输入框回车事件
  param: event dom原生对象
  param: _this vm
  return
*/
function _countKeyEvent (event, _this) {
  if (event.keyCode === 13) {
    if (_this.receiveMoneyForm.settlementMethod === 3) { // 结算方式为包月
      _this.$refs.receivableGoods.focus()
    } else {
      _this.$refs.receivableFreight.focus()
    }
  }
}

/*
  运费输入框回车事件
  param: event dom原生对象
  param: _this vm
  return
*/
function _freightKeyEvent (event, _this) {
  if (event.keyCode === 13) {
    _this.$refs.receivableGoods.focus()
  }
}
export { _scanKeyDown, _shortcuKeyEvent, _shortcutKeyUp, _blurFormInput, _nextFocus, _countKeyEvent, _freightKeyEvent }
