import WaybillAjax from '@/api/WaybillManage/WaybillManage'
// 自动打印
function autoPrint (_this) {
  let curDate = new Date()
  let currentTime = curDate.getTime()
  let postData = {
    receiveClient: 1, // 收货方
    receiveClientName: '测试10', // 收货方名称
    receiveStation: 4, // 收货方站点id
    receiveStationName: '站点001', // 收货方站点名称
    receivePhone: '13837067691', // 收货方电话
    receiveAddress: '山西省长治市长治县xxxxxxxx', // 收货方联系地址
    sendClient: 2, // 发货方
    sendClientName: '客户11', // 发货方名称
    sendStation: 1, // 发货方站点
    sendStationName: '阿范站点', // 发货方站点名称
    sendPhone: '13837067592', // 发货方电话
    sendAddress: '北京市海淀区西北旺', // 发货方联系地址
    pkLine: 41, // 线路id
    lineName: '冯磊测试', // 线路名称
    shiftId: 3022, // 班次
    shiftRunName: '08:30', // 班次名称
    packageNameFirst: '配件', // 包裹1名称
    packageQuantityFirst: 1, // 包裹1数量
    packageNameSecond: '', // 包裹2名称
    packageQuantitySecond: '', // 包裹2数量
    remark: '', // 备注
    settlementMethod: 3, // 结算方式
    receivableFreight: '0', // 运费
    freightPayer: 2, // 收费方
    waybillReceivable: 0, // 应收金额
    receivableGoods: '0', // 代收贷款
    currentTime: currentTime,
    returnGoodsPutInStorage: 9
  }
  postData.waybillType = 1
  WaybillAjax.CreateWayBill(postData).then(response => {
    if (response.code === 200) {
      _this.$notify({
        message: '新建运单成功！',
        type: 'success'
      })
      _this.waybillId = response.data
      _this.printBill()
    }
  })
}

export { autoPrint }
