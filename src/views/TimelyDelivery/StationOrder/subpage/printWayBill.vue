<template>
  <div class="wayAndBoxPrintCon">
    <!-- 三联单 -->
    <div id="outer-print-con" style="marginTop: 0px; min-width: 510px;" class="print-table-con" ref="print">
      <div class="printWayBillCon" style="width: 511px; height: 680px;">
        <!-- 一联 -->
        <div style="display: none; width: 510px; height: 225px;" id="printId1">
          <div class="first-print" style="float: left; width: 510px; height: 225px; border-width: 1px;border-color: #000; border-style: solid; overflow-y: hidden;">
            <!-- 左侧 -->
            <div style="float: left; boxSizing: borderBox; width: 322px; height: 225px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none;">
              <!-- 顶部增加行：物流公司名称及电话 -->
              <div style="width: 100%; height: 25px; lineHeight: 25px; border-width: 1px;border-color: #000; border-style: solid; border-top: none; border-right: none; border-left: none; fontWeight: bold;">&nbsp;{{printData.logisticsName}} ({{printData.logisticsPhone}})</div>
              <div style="height: 25px; lineHeight: 25px; textIndent: 6px; width: 100%; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                <div style="float: left; fontWeight: bold; width: 94px; height: 25px; lineHeight: 25px;">发货方信息</div>
                <div style="float: left; textAlign: right; fontWeight: bold; width: 224px; height: 25px; lineHeight: 25px;">&nbsp;</div>
              </div>
              <div style="height: 25px;"> <!-- 承运方，电话 -->
                <div :style="style" style="width: 50px; fontWeight: bold; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">发货方</div>
                <!-- <div :style="style" style="width: 110px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">{{firstPrint.receiveHeaderName}}</div> -->
                <div style="width: 268px; height: 25px; lineHeight: 25px; float: left; fontSize: 12px; textAlign: left; fontWeight: bold; fontSize: 14px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">&nbsp;{{printData.sendClientName}}</div>
                <!-- <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">制单人</div>
                <div :style="style" style="width: 108px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">{{firstPrint.creator}}</div> -->
              </div>
              <div style="height: 25px;"> <!-- 站点，制单人 -->
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">电话</div>
                <div :style="style" style="width: 110px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">{{printData.sendPhone}}</div>
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">站点</div>
                <div :style="style" style="width: 106px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.sendStationName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 联系地址 -->
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">联系地址</div>
                <!-- <div :style="style" style="width: 268px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">{{firstPrint.address}}</div> -->
                <div :style="style" style="width: 268px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.sendAddress}}</div>
              </div>
              <div style="height: 75px;">
                <div :style="style1" style="width: 100px; height: 75px; lineHeight: 75px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none;">
                  <div style="height: 25px;"> <!-- 代收货款 -->
                    <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">代收金额</div>
                    <div :style="style" style="width: 49px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receivableGoods}}</div>
                  </div>
                  <div style="height: 50px;"> <!-- 运费付款方 -->
                    <div :style="style1" style="width: 50px; height: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">
                      <div style="width: 49px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">运费金额</div>
                      <div style="width: 49px; height: 25px; lineHeight: 25px; border: none; fontWeight: bold;">付款方</div>
                    </div>
                    <div :style="style1" style="width: 48px; height: 50px; lineHeight: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                      <!-- <div style="width: 48px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderTop: none; borderLeft: none; borderRight: none;">{{firstPrint.payer === '发货方' ? receiveMoneyForm.receivableFreight : 0}}</div> -->
                      <div style="width: 48px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderTop: none; borderLeft: none; borderRight: none; fontWeight: bold;">{{printData.receivableFreight}}</div>
                      <div style="width: 48px; height: 25px; lineHeight: 25px; border: none; fontWeight: bold;">{{printData.freightPayer}}</div>
                    </div>
                  </div>
                </div> <!-- 条形码区域 -->
                <div :style="style1" style="width: 218px; height: 75px; lineHeight: 75px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                  <div style="height: 75px; overflow: hidden;">
                    <img :src="printData.barcodeurl" style="display: block; border: none; width: 70%; height: 40px; margin: auto; marginTop: 10px;" id='barcode'/>
                    <!-- <img style="display: block; border: none; width: 98%; height: 50px; marginTop: 3px; marginLeft: 2px;" id='barcode'/> -->
                    <div style="width: 98%; height: 20px; lineHeight: 20px; fontWeight: bold;">{{printData.waybillNumber}}</div>
                    <!-- <barcode style="width: 100%; height: 65px;" :value="firstPrint.waybillNumber" :options="barcodeOption"></barcode> -->
                  </div> <!-- 条形码 -->
                </div>
              </div>
              <div style="height: 25px;"> <!-- 应收金额，商品数量 -->
                <div style="float: left; width: 50px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">应收金额</div>
                <div style="float: left; width: 109px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">{{printData.waybillReceivable}}</div>
                <div style="float: left; width: 50px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">商品数量</div>
                <div style="float: left; width: 108px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; fontWeight: bold;">{{printData.packageTotalQuantity}}</div>
              </div>
            </div>
            <!-- 右侧标准 -->
            <div style="float: left; boxSizing: borderBox; width: 185px; height: 225px; border: none;">
              <div style="height: 50px;">
                <!-- 开单时间 -->
                <div :style="style1" style="width: 88px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">
                  <div style="height: 20px; lineHeight: 20px; fontWeight: bold;">开单时间：</div>
                  <div style="height: 30px; fontWeight: bold;">{{printData.createTime}}</div>
                </div>
                <!-- 线路班次 -->
                <div :style="style1" style="width: 96px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                  <div :style="style1" style="width: 96px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                    <!-- <div style="height: 20px; lineHeight: 20px; fontWeight: bold;">线路班次：</div> -->
                    <div style="height: 20px; lineHeight: 20px; fontWeight: bold;">班次：</div>
                    <!-- <div style="height: 30px; border: none; fontWeight: bold;">{{printData.lineName}} {{printData.shiftRunName}}</div> -->
                    <div style="height: 30px; border: none; fontWeight: bold;">{{printData.shiftRunName}}</div>
                  </div>
                </div>
              </div>
              <!-- 收货方信息 -->
              <div style="width: 185px; height: 25px; lineHeight: 25px; fontWeight: bold; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; textIndent: 6px;">收货方信息</div>
              <div style="width: 184px; height: 50px;"> <!-- 收货方 -->
                <div style="float: left; fontSize: 12px; width: 50px; height: 50px; lineHeight: 40px; fontWeight: bold; textAlign: center; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">收货方</div>
                <div style="float: left; fontSize: 12px; width: 132px; height: 50px; lineHeight: 15px; fontWeight: bold; fontSize: 14px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">&nbsp;{{printData.receiveClientName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 所属站点 -->
                <div :style="style" style="width: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">所属站点</div>
                <div :style="style" style="width: 132px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receiveStationName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 电话 -->
                <div :style="style" style="width: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">电话</div>
                <div :style="style" style="width: 132px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receivePhone}}</div>
              </div>
              <!-- 发货方签字 -->
              <!-- <div style="width: 176px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">发货方签字:</div> -->
              <!-- 备注 -->
              <div style="width: 176px; height: 50px; padding: 5px; fontSize: 12px; overflow: hidden; fontWeight: bold;">备注: {{printData.remark}}</div>
            </div>
          </div>
        </div>

        <!-- 二联，三联 -->
        <div style="width: 510px; height: 225px;" :id="item.printId" :key="index" v-for="(item, index) in (printData.printTypeOther)">
          <div class="second-print" style="float: left; width: 510px; height: 225px; border-width: 1px;border-color: #000; border-style: solid; overflow-y: hidden;">
            <!-- 右侧 -->
            <div style="float: left; boxSizing: borderBox; width: 179px; height: 225px; border: none;">
              <div style="height: 50px;">
                <!-- 开单时间 -->
                <div :style="style1" style="width: 88px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">
                  <div style="height: 20px; lineHeight: 20px; fontWeight: bold;">开单时间：</div>
                  <div style="height: 30px; fontWeight: bold;">{{printData.createTime}}</div>
                </div>
                <!-- 线路班次 -->
                <div :style="style1" style="width: 88px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                  <div :style="style1" style="width: 88px; height: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                    <!-- <div style="height: 20px; lineHeight: 20px;">线路班次：</div> -->
                    <div style="height: 20px; lineHeight: 20px; fontWeight: bold;">班次：</div>
                    <!-- <div style="height: 30px; border: none;">{{printData.lineName}} {{printData.shiftRunName}}</div> -->
                    <div style="height: 30px; border: none; fontWeight: bold;">{{printData.shiftRunName}}</div>
                  </div>
                </div>
              </div>
              <!-- 发货方信息 -->
              <div style="height: 25px; lineHeight: 25px; fontWeight: bold; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; textIndent: 6px;">发货方信息</div>
              <div style="height: 50px;"> <!-- 发货方 -->
                <div style="float: left; fontSize: 12px; textAlign: center; width: 50px; height: 50px; lineHeight: 40px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">发货方</div>
                <div style="float: left; fontSize: 12px; width: 126px; height: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">&nbsp;{{printData.sendClientName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 所属站点 -->
                <div :style="style" style="width: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">所属站点</div>
                <div :style="style" style="width: 126px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.sendStationName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 电话 -->
                <div :style="style" style="width: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">电话</div>
                <div :style="style" style="width: 126px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.sendPhone}}</div>
              </div>
              <!-- 发货方签字 -->
              <!-- <div style="width: 176px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">收货方签字:</div> -->
              <!-- 备注 -->
              <div style="width: 176px; height: 50px; padding: 5px; fontSize: 12px; overflow: hidden; fontWeight: bold;">备注: {{printData.remark}}</div>
            </div>
            <!-- 左侧 -->
            <div style="float: left; boxSizing: borderBox; width: 328px; height: 225px; border-width: 1px;border-color: #000; border-style: solid; borderTop: none; borderBottom: none; borderRight: none;">
              <!-- 顶部增加行：物流公司名称及电话 -->
              <div style="width: 100%; height: 25px; lineHeight: 25px; border-width: 1px;border-color: #000; border-style: solid; border-left: none; border-top: none; border-right: none; fontWeight: bold;">&nbsp;{{printData.logisticsName}} ({{printData.logisticsPhone}})</div>
              <div style="height: 25px; lineHeight: 25px; textIndent: 6px; width: 100%; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                <div style="float: left; fontWeight: bold; width: 94px; height: 25px; lineHeight: 25px;">收货方信息</div>
                <div style="float: left; textAlign: right; fontWeight: bold; width: 224px; height: 25px; lineHeight: 25px;">{{printData.articleNumber}}（{{printData.packageTotalQuantity}}件）&nbsp;</div>
              </div>
              <div style="height: 25px;"> <!-- 承运方，电话 -->
                <div :style="style" style="width: 50px; fontWeight: bold; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">收货方</div>
                <div style="float: left; width: 277px; height: 25px; lineHeight: 25px; fontWeight: bold; fontSize: 14px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; textAlign: left;">&nbsp;{{printData.receiveClientName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 站点，制单人 -->
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">电话</div>
                <div :style="style" style="width: 110px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">{{printData.receivePhone}}</div>
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">站点</div>
                <div :style="style" style="width: 114px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receiveStationName}}</div>
              </div>
              <div style="height: 25px;"> <!-- 联系地址 -->
                <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">联系地址</div>
                <div :style="style" style="width: 274px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receiveAddress}}</div>
              </div>
              <div style="height: 75px;">
                <div :style="style1" style="width: 100px; height: 75px; lineHeight: 75px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none;">
                  <div style="height: 25px;"> <!-- 代收货款 -->
                    <div :style="style" style="width: 50px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; fontWeight: bold;">代收金额</div>
                    <div :style="style" style="width: 49px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">{{printData.receivableGoods}}</div>
                  </div>
                  <div style="height: 50px;"> <!-- 运费付款方 -->
                    <div :style="style1" style="width: 50px; height: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none;">
                      <div style="width: 49px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none; fontWeight: bold;">运费金额</div>
                      <div style="width: 49px; height: 25px; lineHeight: 25px; border: none; fontWeight: bold;">付款方</div>
                    </div>
                    <div :style="style1" style="width: 48px; height: 50px; lineHeight: 50px; border-width: 1px; border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                      <!-- <div style="width: 48px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderTop: none; borderLeft: none; borderRight: none;">{{secondPrint.payer === '收货方' ? receiveMoneyForm.receivableFreight : 0}}</div> -->
                      <div style="width: 48px; height: 25px; lineHeight: 25px; border-width: 1px; border-color: #000; border-style: solid; borderTop: none; borderLeft: none; borderRight: none; fontWeight: bold;">{{printData.receivableFreight}}</div>
                      <div style="width: 48px; height: 25px; lineHeight: 25px; border: none; fontWeight: bold;">{{printData.freightPayer}}</div>
                    </div>
                  </div>
                </div> <!-- 条形码区域 -->
                <div :style="style1" style="width: 224px; height: 75px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderRight: none;">
                  <div style="height: 75px;">
                    <img :src="printData.barcodeurl" style="display: block; border: none; width: 70%; height: 40px; margin: auto; marginTop: 10px;" :id='item.id'/>
                    <!-- <barcode class="canvasBarcode" style="width: 320px; height: 50px;" :value="firstPrint.waybillNumber" :options="barcodeOption"></barcode> -->
                    <!-- <img :src="barcodeurl" style="display: block; border: none; width: 98%; height: 50px; marginTop: 3px; marginLeft: 2px;" :id='item.id'/> -->
                    <div style="width: 98%; height: 20px; lineHeight: 20px; fontWeight: bold;">{{printData.waybillNumber}}</div>
                  </div> <!-- 条形码 -->
                </div>
              </div>
              <div style="height: 25px;"> <!-- 应收金额，商品数量 -->
                <div style="float: left; width: 50px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">应收金额</div>
                <div style="float: left; width: 109px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">{{printData.waybillReceivable}}</div>
                <div style="float: left; width: 50px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border-width: 1px;border-color: #000; border-style: solid; borderLeft: none; borderTop: none; borderBottom: none; fontWeight: bold;">商品数量</div>
                <div style="float: left; width: 107px; height: 25px; fontSize: 12px; textAlign: center; lineHeight: 20px; border: none; fontWeight: bold;">{{printData.packageTotalQuantity}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 箱单 -->
    <div class="printBoxBillCon">
      <div :id="boxItem.printId" :key="index" v-for="(boxItem, index) in boxBillCount" class="print-box-con" ref="printBox">
        <div style="width: 280px; height: 170px;" :style="boxOuterStyle">
          <!-- 头部 -->
          <div style="width: 100%; height: 50px;">
            <div style="float: left; width: 246px; height: 50px; lineHeight: 50px; fontSize: 30px; fontWeight: bold; textIndent: 5px; fontFamily: '黑体';">{{printData.articleNumber}}</div>
            <div v-show="printData.waybillType === 2" style="float: left; width: 30px; height: 30px; lineHeight: 25px; fontSize: 16px; fontWeight: bold; textIndent: 5px; border-width: 1px;border-color: #000; border-style: solid; borderRadius: 100%; fontFamily: '黑体';">{{printData.waybillType === 2 ? '退' : ''}}</div>
          </div>
          <!-- 收货方 -->
          <div style="width: 100%; height: 25px; marginBottom: 10px;">
            <div style="float: left; width: 40px; height: 25px; lineHeight: 25px; fontSize: 22px; fontWeight: bold; textIndent: 5px; fontFamily: '黑体';">收:</div>
            <div style="float: left; width: 237px; height: 25px; lineHeight: 25px; fontSize: 22px; fontWeight: bold; fontFamily: '黑体';">{{printData.receiveClientName}} ({{index+1}}/{{printData.packageTotalQuantity}})</div>
          </div>
          <!-- 单号 -->
          <div style="width: 100%; height: 20px;">
            <div style="float: left; width: 40px; height: 20px; lineHeight: 20px; fontSize: 14px; textIndent: 5px; textAlign: right; fontWeight: bold;">单号:</div>
            <div style="float: left; width: 228px; height: 20px; lineHeight: 20px; fontSize: 14px; fontWeight: bold;">&nbsp;{{printData.waybillNumber}}</div>
          </div>
          <!-- 单号，电话，发货方 -->
          <div style="width: 100%; height: 60px;">
            <div style="float: left; width: 190px; height: 60px;">
              <!-- 电话 -->
              <div style="height: 20px;">
                <div style="float: left; width: 40px; height: 20px; lineHeight: 20px; fontSize: 14px; textIndent: 5px; textAlign: right; fontWeight: bold;">电话:</div>
                <div style="float: left; width: 148px; height: 20px; lineHeight: 20px; fontSize: 14px; fontWeight: bold;">&nbsp;{{printData.receivePhone}}</div>
              </div>
              <!-- 发货方 -->
              <div style="height: 20px;">
                <div style="float: left; width: 40px; height: 20px; lineHeight: 20px; fontSize: 14px; textIndent: 5px; textAlign: right; fontWeight: bold;">发货:</div>
                <div style="float: left; width: 148px; height: 20px; lineHeight: 20px; fontSize: 14px; fontWeight: bold;">&nbsp;{{printData.sendClientName}}</div>
              </div>
              <!-- 日期 -->
              <div style="height: 20px;">
                <div style="float: left; width: 40px; height: 20px; lineHeight: 20px; fontSize: 14px; textIndent: 5px; textAlign: right; fontWeight: bold;">日期:</div>
                <div style="float: left; width: 148px; height: 20px; lineHeight: 20px; fontSize: 14px; fontWeight: bold;">&nbsp;{{printData.createTime}}</div>
              </div>
            </div>
            <!-- 二维码 -->
            <div style="float: left; width: 60px; height: 60px; marginLeft: 15px;">
              <div :id="boxItem.id" :ref="boxItem.ref"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import WaybillAjax from '@/api/WaybillManage/WaybillManage'
import StationOrderAjax from '@/api/TimelyDeliveryApi/CreateTasksApi'
import QRCode from 'qrcodejs2'
import { getLodop } from '@/plugs/LodopFuncs'
let qrcode
export default {
  name: 'PrintWayAndBoxBill',
  props: {
    waybillId: { // 运单id
      type: [String, Number],
      default: ''
    },
    isPrintwayBill: { // 是否打印运单
      type: Boolean,
      default: false
    },
    isPrintBoxBill: { // 是否打印箱单
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      style: {
        float: 'left',
        height: '25px',
        lineHeight: '25px',
        textAlign: 'center',
        fontSize: '12px'
      },
      style1: {
        float: 'left',
        textAlign: 'center',
        fontSize: '12px'
      },
      boxOuterStyle: {
        // borderWidth: '1px',
        // borderColor: '#000',
        // borderStyle: 'solid'
      },
      boxIndex: 0,
      barcodeOption: {
        displayValue: true
      },
      printData: {
        logisticsName: '', // 物流公司名称
        logisticsPhone: '', // 物流公司电话
        articleNumber: '', // 货号
        packageTotalQuantity: 1, // 包裹总数量(商品数量)
        sendClientName: '', // 发货方名称
        sendPhone: '', // 发货方电话
        sendStationName: '', // 发货方站点
        sendAddress: '', // 发货方联系地址
        receivableGoods: '', // 代收金额
        receivableFreight: '', // 运费金额
        freightPayer: '', // 付款方
        waybillNumber: '', // 运单号
        waybillReceivable: '', // 应收金额
        barcodeurl: '', // 条形码
        createTime: '', // 开单时间
        lineName: '', // 线路
        shiftRunName: '', // 班次
        receiveClientName: '', // 收货方
        receiveStationName: '', // 收货方站点
        receivePhone: '', // 收货方电话
        receiveAddress: '', // 收货方联系地址
        remark: '', // 备注
        printTypeOne: [],
        printTypeOther: [],
        freightPayerSecond: '', // 运费付款方
        destination: '', // 目的地
        settlementMethodName: '', // 结算方式
        freightSettlementMethodName: '', // 运费结算方式
        waybillType: 1 // 运单类型 2为退货运单
      }
    }
  },
  computed: {
    boxBillCount () {
      let mapArr = []
      for (let i = 0; i < this.printData.packageTotalQuantity; i++) {
        let obj = {
          id: `qrcode${i}`,
          ref: `qrcode${i}`,
          printId: `printBox${i}`
        }
        mapArr.push(obj)
      }
      return mapArr
    }
  },
  methods: {
    init () {
      if (this.waybillId) {
        this.queryPrintWayData()
      } else {
        throw new Error('未传入运单id！')
      }
    },
    queryPrintWayData () {
      StationOrderAjax.NewQueryPrintData({waybillId: this.waybillId}).then((response) => {
        if (response.code === 200) {
          let { data } = response
          data.barcodeurl = `data:image/png;base64,${data.barcode}`
          this.printData = Object.assign({}, data)
          this.$nextTick(() => {
            this.qrcode(data.waybillNumber)
            // JsBarcode('#barcode', this.firstPrint.waybillNumber, {width: 1, height: 50, displayValue: false, margin: 0, marginTop: -10, marginLeft: -10})
            // JsBarcode('#barcode1', this.firstPrint.waybillNumber, {width: 1, height: 50, displayValue: false, margin: 0, marginTop: -10, marginLeft: -10})
            // JsBarcode('#barcode2', this.firstPrint.waybillNumber, {width: 1, height: 50, displayValue: false, margin: 0, marginTop: -10, marginLeft: -10})
            this.printBill(response.data)
          })
        }
      })
    },
    printBill (printData) {
      if (this.isPrintwayBill || this.isPrintBoxBill) {
        this.printLoading() // 打印loading
      }
      setTimeout(() => {
        if (this.isPrintwayBill && this.isPrintBoxBill) { // 运单箱单都打印
          // 打印三联
          this.printThreeBill(printData)
          // 打印箱单
          // setTimeout(() => { // 箱单延迟打印
          //   this.boxBillCount.forEach((item, index) => {
          //     this.printBoxBillFn(item.printId)
          //     if (index === (this.boxBillCount.length - 1)) { // 最后一个打印完后清除二维码
          //       this.boxBillCount.forEach(item => {
          //         let qrcodeCon = document.getElementById(item.id)
          //         qrcodeCon.innerHTML = ''
          //       })
          //       setTimeout(() => {
          //         this.$router.go(0)
          //       }, (this.boxBillCount.length * 800))
          //     }
          //   })
          // }, 2000)
        } else if (this.isPrintwayBill && !this.isPrintBoxBill) { // 打印运单
          // 打印三联
          this.printThreeBill(printData)
          setTimeout(() => {
            this.$router.go(0)
          }, 1500)
        } else if (!this.isPrintwayBill && this.isPrintBoxBill) { // 打印箱单
          // 打印箱单
          // this.boxBillCount.forEach((item, index) => {
          //   this.printBoxBillFn(item.printId)
          //   if (index === (this.boxBillCount.length - 1)) { // 最后一个打印完后清除二维码
          //     this.boxBillCount.forEach(item => {
          //       let qrcodeCon = document.getElementById(item.id)
          //       qrcodeCon.innerHTML = ''
          //     })
          //     setTimeout(() => {
          //       this.$router.go(0)
          //     }, (this.boxBillCount.length * 800))
          //   }
          // })
        } else {
          setTimeout(() => {
            this.$router.go(0)
          }, 100)
        }
      }, 10)
    },
    // 打印三联运单
    printThreeBill (printData) {
      printData.printMethod.forEach(item => {
        this.printThreeWayBillFn(`printId${item}`)
      })
    },
    // 打印三联
    printThreeWayBillFn (elementId) {
      let printData = this.printData.appWaybillPrintDataVo
      console.log(printData, '===')
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      LODOP.ADD_PRINT_RECT(5, 0, 480, 210, 0, 1) // 外边框
      LODOP.SET_PRINT_STYLE('Bold', 1)
      LODOP.SET_PRINT_STYLE('FontName', '黑体')
      LODOP.SET_PRINT_STYLEA(0, 'AngleOfPageInside', -90) // 最新打印机顺时针旋转90度

      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.SET_PRINT_STYLEA(0, 'Color', '#000000')
      LODOP.ADD_PRINT_TEXT(10, 5, 180, 15, `${printData.logisticsName}`) // 物流公司
      LODOP.SET_PRINT_STYLE('Alignment', 1)
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(10, 180, 220, 15, `开单时间：${printData.createTime}`) // 开单时间
      LODOP.SET_PRINT_STYLE('Alignment', 3)
      if (elementId === 'printId1') {
        LODOP.ADD_PRINT_TEXT(10, 400, 80, 15, `发货方留存`)
      }
      if (elementId === 'printId2') {
        LODOP.ADD_PRINT_TEXT(10, 400, 80, 15, `收货方留存`)
      }
      if (elementId === 'printId3') {
        LODOP.ADD_PRINT_TEXT(10, 400, 80, 15, `物流回执联`)
      }
      LODOP.ADD_PRINT_LINE(30, 0, 30, 480, 0, 1)
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 10)
      // LODOP.ADD_PRINT_TEXT(35, 5, 310, 25, `${printData.articleNumber}`) // 线路名称
      // LODOP.SET_PRINT_STYLE('Alignment', 2)
      // LODOP.ADD_PRINT_TEXT(35, 310, 80, 25, `${printData.packageTotalQuantity}件`) // 包裹数量值
      // LODOP.ADD_PRINT_LINE(30, 310, 55, 310, 0, 1)
      LODOP.ADD_PRINT_LINE(30, 390, 120, 390, 0, 1)
      LODOP.ADD_PRINT_BARCODE(45, 400, 105, 105, 'QRCode', `${printData.waybillNumber}`) // 二维码
      LODOP.ADD_PRINT_LINE(90, 0, 90, 390, 0, 1)

      if (elementId === 'printId2') {
        LODOP.SET_PRINT_STYLE('Alignment', 1)
        LODOP.SET_PRINT_STYLE('FontSize', 12)
        LODOP.ADD_PRINT_TEXT(40, 5, 40, 40, `发:`) // 收货方label
        LODOP.SET_PRINT_STYLE('Alignment', 1)
        LODOP.SET_PRINT_STYLE('FontSize', 8)
        LODOP.ADD_PRINT_TEXT(35, 35, 170, 20, `${printData.sendClientName}`) // 收货方值
        LODOP.ADD_PRINT_TEXT(35, 210, 180, 20, `电话:${printData.sendClientPhone}`) // 收货方电话
        LODOP.ADD_PRINT_TEXT(65, 35, 390, 20, `地址:${printData.sendAddress}`) // 收货方地址
        LODOP.ADD_PRINT_LINE(120, 0, 120, 360, 0, 1)
        LODOP.ADD_PRINT_TEXT(100, 5, 210, 20, `收:${printData.receiveClientName}`) // 发货方值
        LODOP.ADD_PRINT_TEXT(100, 210, 180, 20, `电话:${printData.receiveClientPhone}`) // 发货方电话
      } else {
        LODOP.SET_PRINT_STYLE('Alignment', 1)
        LODOP.SET_PRINT_STYLE('FontSize', 12)
        LODOP.ADD_PRINT_TEXT(40, 5, 40, 40, `收:`) // 收货方label
        LODOP.SET_PRINT_STYLE('Alignment', 1)
        LODOP.SET_PRINT_STYLE('FontSize', 8)
        LODOP.ADD_PRINT_TEXT(35, 35, 170, 20, `${printData.receiveClientName}`) // 收货方值
        LODOP.ADD_PRINT_TEXT(35, 210, 180, 20, `电话:${printData.receiveClientPhone}`) // 收货方电话
        LODOP.ADD_PRINT_TEXT(65, 35, 390, 20, `地址:${printData.receiveAddress}`) // 收货方地址
        LODOP.ADD_PRINT_LINE(120, 0, 120, 360, 0, 1)
        LODOP.ADD_PRINT_TEXT(100, 5, 210, 20, `发:${printData.sendClientName}`) // 发货方值
        LODOP.ADD_PRINT_TEXT(100, 210, 180, 20, `电话:${printData.sendClientPhone}`) // 发货方电话
      }

      LODOP.ADD_PRINT_LINE(120, 0, 120, 480, 0, 1)
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.ADD_PRINT_TEXT(125, 15, 90, 20, `运费`) // 运费
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(125, 135, 90, 20, `￥${printData.receivableFreight}`) // 运费
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.ADD_PRINT_TEXT(125, 255, 90, 20, `代收`) // 代收
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(125, 375, 90, 20, `￥${printData.receivableGoods}`) // 代收
      LODOP.ADD_PRINT_LINE(120, 120, 145, 120, 0, 1)
      LODOP.ADD_PRINT_LINE(120, 240, 145, 240, 0, 1)
      LODOP.ADD_PRINT_LINE(120, 360, 145, 360, 0, 1)
      LODOP.ADD_PRINT_LINE(145, 0, 145, 480, 0, 1)
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.ADD_PRINT_TEXT(155, 15, 90, 20, `配件`) // 配件
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(160, 125, 50, 20, `${printData.packageQuantity}`) // 配件
      LODOP.SET_PRINT_STYLE('Alignment', 1)
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT(160, 185, 290, 20, `备注:${printData.commodityRemark}`) // 备注
      LODOP.ADD_PRINT_LINE(145, 120, 185, 120, 0, 1)
      LODOP.ADD_PRINT_LINE(145, 180, 185, 180, 0, 1)
      LODOP.ADD_PRINT_LINE(185, 0, 185, 480, 0, 1)
      // LODOP.ADD_PRINT_TEXT(125, 5, 60, 25, `发:`) // 代收金额label
      // LODOP.SET_PRINT_STYLE('Alignment', 1)
      // LODOP.SET_PRINT_STYLE('FontSize', 9)
      // LODOP.ADD_PRINT_TEXT(128, 50, 420, 25, `${printData.receivableGoods}元`) // 代收金额值
      // if (elementId === 'printId1' || elementId === 'printId3') {
      //   LODOP.ADD_PRINT_LINE(120, 240, 145, 240, 0, 1)
      //   LODOP.SET_PRINT_STYLE('FontSize', 10)
      //   LODOP.ADD_PRINT_TEXT(125, 242, 80, 25, `结算方式:`) // 结算方式label
      //   LODOP.SET_PRINT_STYLE('FontSize', 9)
      //   LODOP.ADD_PRINT_TEXT(125, 310, 160, 25, `${printData.settlementMethodName}`) // 结算方式值
      //   LODOP.ADD_PRINT_LINE(165, 320, 190, 320, 0, 1)
      //   LODOP.SET_PRINT_STYLE('Alignment', 2)
      //   LODOP.ADD_PRINT_TEXT(170, 320, 160, 25, `开单站点:${printData.sendStationName}`) // 开单站点
      // }
      // LODOP.ADD_PRINT_LINE(145, 0, 145, 480, 0, 1)
      // LODOP.ADD_PRINT_LINE(145, 80, 165, 80, 0, 1)
      // // LODOP.ADD_PRINT_LINE(145, 160, 165, 160, 0, 1)
      // // LODOP.ADD_PRINT_LINE(145, 240, 165, 240, 0, 1)
      // LODOP.ADD_PRINT_LINE(145, 320, 165, 320, 0, 1)
      // LODOP.ADD_PRINT_LINE(145, 400, 165, 400, 0, 1)
      // LODOP.SET_PRINT_STYLE('Alignment', 2)
      // LODOP.SET_PRINT_STYLE('FontSize', 10)
      // LODOP.ADD_PRINT_TEXT(148, 0, 80, 20, `运费`) // 运费label
      // // LODOP.ADD_PRINT_TEXT(148, 160, 80, 20, `付款方`) // 付款方label
      // LODOP.ADD_PRINT_TEXT(148, 320, 80, 20, `付款方式`) // 付款方式label
      // LODOP.SET_PRINT_STYLE('FontSize', 8)
      // LODOP.ADD_PRINT_TEXT(150, 80, 80, 20, `${printData.receivableFreight}(${printData.freightPayerSecond})`) // 运费金额值与付款方
      // // LODOP.ADD_PRINT_TEXT(150, 240, 80, 20, `${printData.freightPayer}`) // 付款方值
      // LODOP.ADD_PRINT_TEXT(150, 400, 80, 20, `${printData.freightSettlementMethodName}`) // 付款方式值
      // LODOP.ADD_PRINT_LINE(165, 0, 165, 480, 0, 1)
      // LODOP.SET_PRINT_STYLE('Alignment', 1)
      // LODOP.ADD_PRINT_TEXT(170, 5, 480, 25, `备注:${printData.remark}`) // 备注
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.SET_PRINT_STYLE('Alignment', 1)
      if (elementId === 'printId1' || elementId === 'printId2') {
        LODOP.ADD_PRINT_TEXT(195, 5, 150, 20, `客服电话:${printData.logisticsPhone}`) // 客服电话
      }
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      LODOP.ADD_PRINT_TEXT(195, 155, 150, 20, `开单员:${printData.createWaybillUserName}`) // 开单员
      LODOP.SET_PRINT_STYLE('Alignment', 3)
      LODOP.ADD_PRINT_TEXT(195, 240, 240, 20, `单号:${printData.waybillNumber}`) // 单号
      // 配置打印选项
      LODOP.SET_PRINT_MODE('RESELECT_PRINTER', true) // 允许重选打印机
      LODOP.SET_PRINTER_INDEX('GP-80160(Cut) Series')
      LODOP.SET_LICENSES('', '55C6FFA97D89D4EEFBCA3B741EF2FE49', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Width:110%;Height:124%')
      // LODOP.PREVIEW()
      LODOP.PRINT()
    },
    // 打印箱单
    printBoxBillFn (elementId) {
      let printData = this.printData
      this.boxIndex++
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      // LODOP.ADD_PRINT_RECT(5, 50, 280, 170, 0, 1) // 外边框
      LODOP.SET_PRINT_STYLE('Bold', 1)
      LODOP.SET_PRINT_STYLE('FontName', '黑体')
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.SET_PRINT_STYLEA(0, 'Color', '#000000')
      // 箱单内容
      LODOP.SET_PRINT_STYLE('FontSize', 20)
      if (printData.waybillType === 2) { // 退货运单
        LODOP.ADD_PRINT_TEXT(5, 50, 250, 50, `${printData.articleNumber}`)
        if (printData.articleNumber.length > 9) {
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -12)
        }
        LODOP.SET_PRINT_STYLE('FontSize', 15)
        LODOP.ADD_PRINT_TEXT(5, 300, 30, 15, `退`) // 是否退货运单
        LODOP.ADD_PRINT_SHAPE(3, 1, 295, 30, 30, 0, 2, '#000000')
      } else {
        LODOP.ADD_PRINT_TEXT(5, 50, 280, 50, `${printData.articleNumber}`)
        if (printData.articleNumber.length > 9) {
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -12)
        }
      }
      if (printData.articleNumber.length <= 9) {
        if (printData.receiveClientName.length <= 7) {
          LODOP.SET_PRINT_STYLE('FontSize', 16)
          LODOP.ADD_PRINT_TEXT(40, 50, 250, 20, `收:${printData.receiveClientName}`) // 收货方
          LODOP.ADD_PRINT_TEXT(40, 252, 100, 20, `(${this.boxIndex}/${printData.packageTotalQuantity})`) // 包裹
        } else {
          LODOP.SET_PRINT_STYLE('FontSize', 12)
          LODOP.ADD_PRINT_TEXT(40, 50, 265, 20, `收:${printData.receiveClientName}`) // 收货方
          LODOP.ADD_PRINT_TEXT(40, 267, 100, 20, `(${this.boxIndex}/${printData.packageTotalQuantity})`) // 包裹
        }
        LODOP.SET_PRINT_STYLE('FontSize', 10)
        LODOP.ADD_PRINT_TEXT(75, 50, 280, 20, `电话：${printData.receivePhone}`) // 电话
        LODOP.ADD_PRINT_TEXT(100, 50, 220, 20, `发货：${printData.sendClientName}`) // 发货
        LODOP.ADD_PRINT_TEXT(125, 50, 220, 20, `日期：${printData.createTime}`) // 日期
        LODOP.ADD_PRINT_TEXT(150, 50, 220, 20, `单号：${printData.waybillNumber}`) // 单号
        LODOP.ADD_PRINT_BARCODE(95, 254, 85, 85, 'QRCode', `${printData.waybillNumber}`) // 二维码
      } else {
        if (printData.receiveClientName.length <= 7) {
          LODOP.SET_PRINT_STYLE('FontSize', 16)
          LODOP.ADD_PRINT_TEXT(65, 50, 250, 20, `收:${printData.receiveClientName}`) // 收货方
          LODOP.ADD_PRINT_TEXT(65, 252, 100, 20, `(${this.boxIndex}/${printData.packageTotalQuantity})`) // 包裹
        } else {
          LODOP.SET_PRINT_STYLE('FontSize', 12)
          LODOP.ADD_PRINT_TEXT(65, 50, 265, 20, `收:${printData.receiveClientName}`) // 收货方
          LODOP.ADD_PRINT_TEXT(65, 267, 100, 20, `(${this.boxIndex}/${printData.packageTotalQuantity})`) // 包裹
        }
        LODOP.SET_PRINT_STYLE('FontSize', 10)
        LODOP.ADD_PRINT_TEXT(96, 50, 280, 20, `电话：${printData.receivePhone}`) // 电话
        LODOP.ADD_PRINT_TEXT(114, 50, 220, 20, `发货：${printData.sendClientName}`) // 发货
        LODOP.ADD_PRINT_TEXT(132, 50, 220, 20, `日期：${printData.createTime}`) // 日期
        LODOP.ADD_PRINT_TEXT(150, 50, 220, 20, `单号：${printData.waybillNumber}`) // 单号
        LODOP.ADD_PRINT_BARCODE(92, 258, 85, 85, 'QRCode', `${printData.waybillNumber}`) // 二维码
      }
      LODOP.SET_PRINT_MODE('RESELECT_PRINTER', true) // 允许重选打印机
      LODOP.SET_PRINTER_INDEX('KM-200(USB)')
      LODOP.SET_LICENSES('', '55C6FFA97D89D4EEFBCA3B741EF2FE49', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
      LODOP.PREVIEW()
      // LODOP.PRINT()
    },
    // 二维码
    qrcode (text) {
      this.boxBillCount.forEach(item => {
        qrcode = new QRCode(item.id, {
          width: 60, // 设置宽度，单位像素
          height: 60, // 设置高度，单位像素
          text: text // 设置二维码内容或跳转地址
        })
        console.log(qrcode)
      })
    }
  }
}
</script>
<style lang="less" scope>
@import '../../../../style/base.less';
.wayAndBoxPrintCon{
  .print-table-con{
    display: none;
  }
  .print-box-con{
    display: none;
  }
}

</style>
