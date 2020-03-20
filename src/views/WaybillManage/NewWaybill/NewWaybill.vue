<template>
  <div class="new-waybill">
    <div class="public_card">
      <div class="card_main">
        <!-- 收货方信息 -->
        <el-form :inline="true" ref="receiveForm" :model="receiveForm" label-width="90px">
          <el-row v-if="showScan" :span="24">
            <el-col :span="20" :offset="1">
              <el-form-item label="箱单扫码:" class="receiveType">
                <el-input
                  ref="scanInput"
                  @keydown.native.stop="scanKeyDown($event)"
                  v-model="scanValue"
                  placeholder="请扫描或输入箱单号">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!disableWayAndShift" :span="24">
            <el-col :span="8" :offset="1">
              <el-form-item label="收货方名称筛选:" class="receiveType">
                <el-radio-group @change="receiveRadioChange('receive')" v-model="receiveSearchRadio" size="mini" fill="#5677fc">
                  <el-radio-button label="全部"></el-radio-button>
                  <el-radio-button label="修理厂"></el-radio-button>
                  <el-radio-button label="经销商"></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="发货方名称筛选:" class="receiveType">
                <el-radio-group @change="receiveRadioChange('send')" v-model="sendSearchRadio" size="mini" fill="#5677fc">
                  <el-radio-button label="全部"></el-radio-button>
                  <el-radio-button label="经销商"></el-radio-button>
                  <el-radio-button label="修理厂"></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <div class='update-client-data'>
                <i class="el-icon-refresh" @click="queryClientData()"></i><span>更新客户列表</span>
              </div>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="8" :offset="1" class="left-col">
              <el-form-item label="收货方名称:" class="receiveType" :class="{'notPerfect': orderNumber && bbdReceivedFlag === 0}">
                <el-input
                  :autofocus="true"
                  ref="receiveClientName"
                  @input.native="search($event, 'clientName', receiveForm.receiveClientName, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model="receiveForm.receiveClientName"
                  maxlength="128"
                  :disabled="disableReceive"
                  :placeholder="(orderNumber && bbdReceivedFlag === 0) ? receiveClinetNamePlaceholder : '请输入收货方名称'">
                </el-input>
                <div v-if="receiveForm.isInput === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :type="'receive'"
                    :tableData="receiveSearchTable"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="客户编码:" class="receiveType">
                <el-input
                  @input.native="search($event, 'clientCode', receiveForm.clientCode, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model="receiveForm.clientCode"
                  maxlength="128"
                  :disabled="true"
                  placeholder="请输入客户编码">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="left-col">
              <el-form-item label="联系电话:" class="receiveType" :class="{'notPerfect': orderNumber && bbdReceivedFlag === 0}">
                <el-input
                  @input.native="search($event, 'phone', receiveForm.phone, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model.trim="receiveForm.phone"
                  maxlength="11"
                  :disabled="disableReceive"
                  :placeholder="(orderNumber && bbdReceivedFlag === 0) ? receivePhonePlaceholder : '请输入联系电话'">
                </el-input>
                <div v-if="receiveForm.isInput === 'phone'" class="receivePhoneLeft tableDivRightLast positionDiv">
                  <search-table
                    ref="searchTable"
                    :type="'receive'"
                    :tableData="receiveSearchTable"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="服务站名称:">
                <el-select :disabled="disableReceive" v-model="receiveForm.stationObj.stationId" placeholder="请选择服务站" @change="changeReceiveStation">
                  <el-option
                    v-for="item in receiveStationOptions"
                    :key="item.stationId"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="left-col">
              <el-form-item label="联系地址:">
                <el-input
                  v-model="receiveForm.address"
                  maxlength="128"
                  :disabled="disableReceive"
                  placeholder="请输入联系地址">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 发货方信息 -->
        <div class="hr-line"></div>
        <el-form :inline="true" ref="sendForm" :model="sendForm" label-width="90px">
          <el-row>
            <el-col :span="1" v-show="this.$route.query.index === 'add'">
              <div class="lock-wrap">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  popper-class="porper-class"
                  :content="sendForm.lockSendInfo ? '点击解锁后, 不保留发货方信息' : '点击锁定后, 提交运单后保留发货方信息'">
                  <div class="lock" :class="{'open-lock': !sendForm.lockSendInfo}" @click="lockSendVal()" slot="reference"></div>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="1" v-show="this.$route.query.index !== 'add'">
              <div class="lock-wrap">
              </div>
            </el-col>
            <el-col :span="8" :offset="0" class="left-col">
              <el-form-item label="发货方名称:" class="sendType" :class="{'notPerfect': orderNumber && bbdSendFlag === 0}">
                <el-input
                  ref="sendClinetName"
                  @input.native="search($event, 'clientName', sendForm.sendClientName, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model="sendForm.sendClientName"
                  maxlength="128"
                  :disabled="disableSend"
                  :placeholder="(orderNumber && bbdSendFlag === 0) ? sendClinetNamePlaceholder : '请输入发货方名称'">
                </el-input>
                <div v-if="sendForm.isInput === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :type="'send'"
                    :tableData="sendSearchTable"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7" >
              <el-form-item label="客户编码:" class="sendType">
                <el-input
                  ref="sendClinetCode"
                  @input.native="search($event, 'clientCode', sendForm.clientCode, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model="sendForm.clientCode"
                  maxlength="128"
                  :disabled="true"
                  placeholder="请输入客户编码">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="left-col">
              <el-form-item label="联系电话:" class="sendType" :class="{'notPerfect': orderNumber && bbdSendFlag === 0}">
                <el-input
                  ref="sendPhone"
                  @input.native="search($event, 'phone', sendForm.phone, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model.trim="sendForm.phone"
                  maxlength="11"
                  :disabled="disableSend"
                  :placeholder="(orderNumber && bbdSendFlag === 0) ? sendPhonePlaceholder : '请输入联系电话'">
                </el-input>
                <div v-if="sendForm.isInput === 'phone'" class="receivePhoneLeft tableDivRightLast positionDiv">
                  <search-table
                    ref="searchTable"
                    :type="'send'"
                    :tableData="sendSearchTable"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="服务站名称:">
                <el-select :disabled="disableSend" v-model="sendForm.stationObj.stationId" placeholder="请选择服务站" @change="changeSendStation">
                  <el-option
                    v-for="item in stationOptions"
                    :key="item.stationId"
                    :label="item.stationName"
                    :value="item.stationId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="left-col">
              <el-form-item label="联系地址:">
                <el-input
                  v-model="sendForm.address"
                  maxlength="128"
                  :disabled="disableSend"
                  placeholder="请输入联系地址">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 路线信息 -->
        <div class="hr-line"></div>
        <el-form :inline="true" ref="wayForm" :model="wayForm" label-width="90px">
          <el-row class="last-row">
            <el-col :span="11" :offset="1" class="left-col routeSelect">
              <el-form-item label="路线选择:">
                <el-select :disabled="disableWayAndShift" v-model="wayForm.pkLineObj" placeholder="请选择路线" @change="wayChange" value-key="generateKey">
                  <el-option
                    v-for="item in wayList"
                    :key="item.generateKey"
                    :label="item.generateVal"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" class="routeSelect">
              <el-form-item label="班次选择:">
                <el-select :disabled="disableWayAndShift" v-model="wayForm.shiftObj" placeholder="请选择班次" value-key="generateKey">
                  <el-option
                    v-for="item in stationList"
                    :key="item.generateKey"
                    :label="item.generateVal"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 货品信息 -->
        <div class="hr-line"></div>
        <div class="cargo-con">
          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            height="'100%'"
            border
            style="width: 100%">
            <el-table-column
              min-width="10%"
              prop="rowNum"
              label="序号">
            </el-table-column>
            <el-table-column
              min-width="25%"
              prop="cargoName"
              label="货品名称">
              <template slot-scope="scope">
                <el-input class="selfInput" v-model="scope.row.cargoName" maxlength="128"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              min-width="20%"
              prop="count"
              label="包裹数量">
              <template slot-scope="scope">
                <el-input-number @keyup.native.stop="countKeyEvent($event, scope.row.rowNum)" :ref="scope.row.ref" v-model="scope.row.count" :min="scope.row.min" :max="99"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              min-width="45%"
              prop="other"
              class="other-column"
              label="备注">
              <template slot-scope="scope">
                <el-input :resize="'none'" type="textarea" :rows="1" class="selfInput otherCol" v-model="scope.row.other" maxlength="30" placeholder="请输入备注（最长30个字）"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 应收款信息 -->
        <div class="hr-line"></div>
        <el-form :inline="true" ref="receiveMoneyForm" :model="receiveMoneyForm" label-width="90px">
          <el-row class="radioRow">
            <el-col :span="11" :offset="1" class="left-col">
              <el-form-item label="付费方:">
                <el-radio-group v-model="receiveMoneyForm.freightPayer" @change="payerChange">
                  <el-radio :key="item.id" :label="item.id" v-for="item in receiveList">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="0">
              <el-form-item label="结算方式:">
                <el-radio-group v-model="receiveMoneyForm.settlementMethod" @change="settlementMethodChange(receiveMoneyForm.settlementMethod, 'click')">
                  <el-radio :disabled="!((receiveMoneyForm.settlementMethod === 1 || receiveMoneyForm.settlementMethod === 4) && receiveMoneyForm.freightPayer === 1) || (item.id !== 1 && item.id !== 4)" :key="item.id" :label="item.id" v-for="item in payTypeList">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" :offset="1" class="left-col">
              <el-form-item label="运费:" class="redLabel">
                <el-input
                  ref="receivableFreight"
                  @input.native="moneyChange($event, 'receivableFreight', receiveMoneyForm.receivableFreight)"
                  @keyup.native.stop="freightKeyEvent"
                  v-model="receiveMoneyForm.receivableFreight"
                  :disabled="disableSettlement || showEditFreigt"
                  maxlength="6"
                  placeholder="请输入运费">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" class="redLabel">
                <el-button v-if="showEditFreigt" ref="changeFreightBtn" class="btn-main" @click="cliclChangeFreight">修改运费</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="代收货款:" class="redLabel">
                <el-input
                  ref="receivableGoods"
                  @input.native="moneyChange($event, 'receivableGoods', receiveMoneyForm.receivableGoods)"
                  v-model="receiveMoneyForm.receivableGoods"
                  maxlength="6"
                  placeholder="请输入代收贷款">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <div v-show="disableWayAndShift" class="revoke"><el-checkbox v-model="revokeChecked" @change="revokeChange">退货已入库</el-checkbox></div>
          <div class="radio-con">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="checkItem.label" :key="index" v-for="(checkItem,index) in checkGroup">{{checkItem.text}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="radio-con">
            <div>应收金额：<span class="yellowColor">{{receiveMoneyForm.waybillReceivable}}元</span></div>
          </div>
          <div class="sunmit-con">
            <el-button ref="submitBtn" :disabled="disableSubmit" class="btn-main" @click="submitBill">提交（ctrl + enter）</el-button>
          </div>
        </div>
        <!-- 三联运单与箱单 -->
        <print-way-and-box-bill
          ref="printComponent"
          :waybillId="waybillId"
          :checkList="checkList"
        />
        <search-waybill
          v-if="searchWaybillVisible"
          :dialogVisible="searchWaybillVisible"
          @click-cancel="searchWaybillVisible = false"
          @click-sure="clickSearchSure"
        />
        <!-- 修改运费 -->
        <edit-freight
          v-if="showChangeFreight"
          :dialogVisible="showChangeFreight"
          :collectPrice="collect_price"
          :deliveryPrice="delivery_price"
          :tableData="orderPackageList"
          @click-cancel="showChangeFreight = false"
          @click-sure="clickChangeFreightSure"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WaybillAjax from '@/api/WaybillManage/WaybillManage'
import SearchTable from './subpage/SearchTable'
import EditFreight from './subpage/EditFreight'
import PrintWayAndBoxBill from './subpage/printWayBoxBill'
import SearchWaybill from './subpage/SearchWaybill'
import { autoPrint } from './subpage/Action'
import ENUMS from '@/enums/enums'
import { _scanKeyDown, _shortcuKeyEvent, _shortcutKeyUp, _blurFormInput, _nextFocus, _countKeyEvent, _freightKeyEvent } from './subpage/Actions/KeyEvent'
import { _scanComplate, _cliclChangeFreight, _clickChangeFreightSure } from './subpage/Actions/ScanAction'
import { _clickSearchSure, _queryClientInfoByOrderNum } from './subpage/Actions/OrderAction'
import { _queryClientData, _getLocalStorageClientData, _queryStationList, _queryReceiveStationList, _queryAllLine, _queryWaybillAndShift, _formatPostData, _validatePostData } from './subpage/Actions/DataAction'
import { _changeReceiveStation, _changeSendStation, _moneyChange, _search, _selectTableRow, _wayChange, _settlementMethodChange, _payerChange, _queryPrintCheckbox, _updatePrintCheckbox } from './subpage/Actions/OperationAction'
let page
export default {
  name: 'NewWaybill',
  data () {
    return {
      accountId: '',
      collect_price: '', // 上门揽收价格
      delivery_price: '', // 送货上门价格
      showScan: false, // 是否显示扫码开单功能
      showEditFreigt: false, // 是否显示修改运费按钮
      scanValue: '', // 扫描箱单id
      showChangeFreight: false, // 修改包裹运费弹框
      orderPackageList: [], // 订单包裹list
      disableReceive: false,
      disableSend: false,
      routerType: '', // 运单配送类型
      tempReceiveClientId: '', // 收货方客户id
      ReceiveStationId: '', // 收货方站点id
      sendStationId: '', // 发货方站点id
      pageType: '', // add -> 新建运单 revoke -> 退货运单 tracking -> 补录运单
      titleName: '',
      receiveSourceData: [], // 收货方（修理厂）所有源数据
      receiveSearchTable: [], // 收货方（修理厂）搜索结果数据
      sendSourceData: [], // 发货方（供应商）所有源数据
      sendSearchTable: [], // 发货方（供应商）搜索结果数据
      currentIndex: '',
      currentRow: null,
      receiveStationOptions: [], // 收货方服务站下拉数据
      stationOptions: [], // 发货方服务站下拉数据
      orderNumber: '', // 订单号（帮帮达）
      receiveSearchRadio: '全部',
      receiveForm: { // 收货方表单信息
        id: '', // 收货方id
        receiverId: '', // 交易收货方ID
        receiveClientName: '', // 收货方名称
        clientCode: '',
        phone: '',
        stationObj: {stationId: '', stationName: ''},
        stationName: '',
        address: '',
        freightSettlementMethod: '', // 结算方式
        isInput: ''
      },
      bbdReceivedFlag: '',
      bbdReceiveClient: '',
      receiveClinetNamePlaceholder: '', // 收货方名提示（帮帮达）
      receivePhonePlaceholder: '', // 收货方电话提示（帮帮达）
      sendSearchRadio: '全部',
      sendForm: { // 发货方表单信息
        lockSendInfo: false,
        id: '', // 发货方id
        senderId: '', // 交易发货方ID
        sendClientName: '', // 发货方名称
        clientCode: '',
        phone: '',
        stationObj: {stationId: '', stationName: ''},
        stationName: '',
        address: '',
        freightSettlementMethod: '', // 结算方式
        isInput: ''
      },
      bbdSendFlag: '',
      bbdSendClient: '',
      sendClinetNamePlaceholder: '', // 发货方名提示（帮帮达）
      sendPhonePlaceholder: '', // 发货方电话提示（帮帮达）
      wayAndStationList: [], // 线路班次下拉集合
      allWayList: [], // 所有路线下拉集合
      wayList: [], // 路线下拉集合
      stationList: [], // 班次下拉集合
      wayForm: { // 路线信息表单
        pkLineObj: {generateVal: '', generateKey: ''},
        shiftObj: {generateVal: '', generateKey: ''}
      },
      tableData: [
        {rowNum: 1, cargoName: '配件', count: '1', other: '', ref: 'numberInput1', min: 1},
        {rowNum: 2, cargoName: '', count: '', other: '', ref: 'numberInput2', min: 0}
      ],
      payTypeList: [], // 1.现结 2.月结 3.包月 4.回付
      receiveList: [{id: 2, name: '收货方'}, {id: 1, name: '发货方'}],
      disableSettlement: false,
      receiveMoneyForm: {
        settlementMethod: 3,
        receivableFreight: '',
        freightPayer: 2,
        waybillReceivable: '',
        receivableGoods: '0'
      },
      isReceivableFreightChange: false, // 是否编辑过运费
      revokeChecked: false, // 退货已入库
      checkGroup: [],
      checkList: [],
      disableSubmit: false,
      already: false,
      waybillId: '', // 提交生成的运单id
      searchWaybillVisible: false, // 搜索已有运单
      waybillNumber: '' // ctrl+q选取的已有运单号
    }
  },
  components: { PrintWayAndBoxBill, SearchWaybill, SearchTable, EditFreight },
  computed: {
    boxBillCount () {
      let result = 0
      this.tableData.forEach(item => {
        result += Number(item.count)
      })
      let mapArr = []
      for (let i = 0; i < result; i++) {
        let obj = {
          id: `qrcode${i}`,
          ref: `qrcode${i}`,
          printId: `printBox${i}`
        }
        mapArr.push(obj)
      }
      return mapArr
    },
    disableWayAndShift () {
      return this.pageType === 'revoke'
    },
    // 收货方当前搜索表数据
    currrentSearchReceiveData () {
      if (this.receiveSearchRadio === '全部') {
        let temp = [...this.receiveSourceData, ...this.sendSourceData]
        let hash = {}
        let result = temp.reduce((item, next) => {
          if (!hash[next.id]) {
            hash[next.id] = true
            item.push(next)
          }
          return item
        }, [])
        return result
      } else if (this.receiveSearchRadio === '修理厂') {
        return [...this.receiveSourceData]
      } else {
        return [...this.sendSourceData]
      }
    },
    // 发货方当前搜索表数据
    currrentSearchSendData () {
      if (this.sendSearchRadio === '全部') {
        let temp = [...this.receiveSourceData, ...this.sendSourceData]
        let hash = {}
        let result = temp.reduce((item, next) => {
          if (!hash[next.id]) {
            hash[next.id] = true
            item.push(next)
          }
          return item
        }, [])
        return result
      } else if (this.sendSearchRadio === '修理厂') {
        return [...this.receiveSourceData]
      } else {
        return [...this.sendSourceData]
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'NewWaybill') {
        document.removeEventListener('keydown', this.shortcuKeyEvent)
        if (to.query) {
          this.$router.go(0)
        }
      }
    },
    deep: true
  },
  created () {
    // let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // this.sendForm.logisticsId = userInfo.logisticsId
    this.init()
  },
  mounted () {
    this.$refs.receiveClientName.focus()
    document.removeEventListener('keydown', this.shortcuKeyEvent)
    this.pageType = this.$route.query.index
    if (this.pageType !== '') {
      if (this.pageType === 'add') { // 新建运单
        this.titleName = '新建运单'
        this.$nextTick(() => {
          this.$watermark.set('新建运单')
        })
      } else if (this.pageType === 'revoke') { // 退货运单
        this.titleName = '退货运单'
        this.$nextTick(() => {
          this.$watermark.set('退货运单')
        })
        this.revokeChecked = false
        this.checkList = []
      } else if (this.pageType === 'tracking') { // 补录运单
        this.titleName = '补录运单'
        this.$nextTick(() => {
          this.$watermark.set('补录运单')
        })
      }
    }
    page = this
    if (this.$route.name === 'NewWaybill') {
      document.addEventListener('keydown', this.shortcuKeyEvent, true)
    }
  },
  beforeDestroy () {
    let can = document.getElementById('myCanvas')
    can.style.display = 'none'
    can.style.background = ''
  },
  methods: {
    // 点击锁定发货方
    lockSendVal () {
      this.sendForm.lockSendInfo = !this.sendForm.lockSendInfo
    },
    scanKeyDown (e) {
      _scanKeyDown(e, this)
    },
    // 扫码完成
    scanComplate (packageNum) {
      _scanComplate(packageNum, this)
    },
    // 修改运费
    cliclChangeFreight () {
      _cliclChangeFreight(this)
    },
    // 确认修改运费
    clickChangeFreightSure (orderPackageList, collectPrice, deliveryPrice) {
      _clickChangeFreightSure(orderPackageList, collectPrice, deliveryPrice, this)
    },
    receiveRadioChange (type) {
      if (type === 'receive') {
        this.$refs.receiveClientName.focus()
      } else {
        this.$refs.sendClinetName.focus()
      }
    },
    // 自动打印脚本
    autoPrint () {
      autoPrint(this)
    },
    init () {
      this.computedWaybillReceivable()
      this.queryStationList()
      this.queryReceiveStationList()
      this.queryAllLine()
      this.checkGroup = [...ENUMS.checkGroup]
      // 获取本地缓存的全部收发货方信息
      let localAllClientData = JSON.parse(sessionStorage.getItem('allClientData'))
      if (localAllClientData) {
        this.getLocalStorageClientData()
      } else {
        this.queryClientData()
      }
      // 连续开单，锁定发货方信息
      this.pageType = this.$route.query.index
      // if (this.pageType === 'add') {
      //   let sendFormVal = JSON.parse(localStorage.getItem('sendFormVal'))
      //   if (sendFormVal) {
      //     let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      //     if (sendFormVal.logisticsId === userInfo.logisticsId) {
      //       this.sendForm = sendFormVal
      //     }
      //   }
      // }
      if (this.pageType === 'add') {
        let sendFormVal = JSON.parse(sessionStorage.getItem('sendFormVal'))
        if (sendFormVal) {
          this.sendForm = sendFormVal
          this.sendStationId = sendFormVal.stationObj.stationId
        }
      }
      // 登录用户信息中获取结算方式
      let userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        let userInfoObj = JSON.parse(userInfo)
        this.accountId = userInfoObj.accountId
        this.queryPrintCheckbox(this.accountId)
        this.payTypeList = userInfoObj.settlementMethod.map(item => {
          let obj = {
            id: item.generateKey,
            name: item.generateVal
          }
          return obj
        })
        this.payTypeList.splice(1, 0, {id: 4, name: '回付'})
        let businessModelList = userInfoObj.businessModelList
        if (businessModelList && businessModelList.length > 0) {
          let hasScan = businessModelList.some(item => {
            return parseInt(item) === 1
          })
          this.showScan = hasScan && this.$route.query.index !== 'revoke'
        }
        this.receiveMoneyForm.receivableFreight = userInfoObj.freightDefault
        this.computedWaybillReceivable(Number(userInfoObj.freightDefault))
        // 结算方式默认选中第一种
        if (this.payTypeList.length > 0) {
          this.receiveMoneyForm.settlementMethod = this.payTypeList[0].id
        }
      }
    },
    // 快捷键提交
    shortcuKeyEvent (event) {
      _shortcuKeyEvent(event, this, page, 'insert')
    },
    // 点击搜索出的已有运单号
    clickSearchSure (waybillNumber) {
      _clickSearchSure(waybillNumber, this)
    },
    // 根据订单号查询客户信息
    queryClientInfoByOrderNum (waybillNumber) {
      _queryClientInfoByOrderNum(waybillNumber, this)
    },
    computedWaybillReceivable (propsReceivable) {
      if (propsReceivable === undefined) {
        this.receiveMoneyForm.waybillReceivable = (Number(this.receiveMoneyForm.receivableFreight) + Number(this.receiveMoneyForm.receivableGoods)).toFixed(2)
      } else {
        this.receiveMoneyForm.waybillReceivable = (propsReceivable + Number(this.receiveMoneyForm.receivableGoods)).toFixed(2)
      }
    },
    // 上下移动或回车事件
    shortcutKeyUp (event) {
      _shortcutKeyUp(event, this)
    },
    // 查询当前用户打印联复选框信息
    queryPrintCheckbox (accountId) {
      _queryPrintCheckbox(accountId).then(res => {
        this.checkList = res
      })
    },
    // 查询全部收发货放客户信息
    queryClientData () {
      _queryClientData(this)
    },
    // 获取全部收发货放客户信息
    getLocalStorageClientData () {
      _getLocalStorageClientData(this)
    },
    // 查询发货方站点下拉数据
    queryStationList () {
      _queryStationList(this)
    },
    // 查询收货方站点下拉数据
    queryReceiveStationList () {
      _queryReceiveStationList(this)
    },
    // 查询全部线路
    queryAllLine () {
      _queryAllLine(this)
    },
    // 收货方站点改变
    changeReceiveStation (val) {
      _changeReceiveStation(val, this)
    },
    // 发货方站点改变
    changeSendStation (val) {
      _changeSendStation(val, this)
    },
    revokeChange (val) {
      if (val) { // 选中
        if (!this.checkList.includes('4')) { // 此时打印箱单未选中
          this.checkList.push('4')
        }
      }
    },
    // 根据运费及代收货款计算应收金额
    moneyChange (event, inputType, value) {
      _moneyChange(event, inputType, value, this)
    },
    // 合并备注
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return {
          rowspan: 2,
          colspan: 1
        }
      }
    },
    // 模糊搜索
    search (event, searchColName, val, editFormType) {
      _search(event, searchColName, val, editFormType, this)
    },
    // 设置当前行
    setCurrentRow () {
      this.$nextTick(() => {
        if (this.$refs.searchTable) {
          this.$refs.searchTable.$children[0].setCurrentRow(this.currentRow)
        }
      })
    },
    // 模糊搜索输入框失去焦点
    blurFormInput (editFormType) {
      _blurFormInput(editFormType, this)
    },
    clickSelectTableRow (row, event) {
      this.selectTableRow(row, event)
    },
    // 选中某行数据
    selectTableRow (row, event, type) {
      _selectTableRow(row, event, type, this)
    },
    // 收发货方选中某行后光标自动聚焦至下一处编辑
    nextFocus () {
      _nextFocus(this)
    },
    // 数量框键盘事件
    countKeyEvent (event) {
      _countKeyEvent(event, this)
    },
    // 运费框键盘事件
    freightKeyEvent (event) {
      _freightKeyEvent(event, this)
    },
    // 付费方下拉变化
    payerChange (val) {
      _payerChange(val, this)
    },
    // 根据选择的表格行数据客户id查询线路和班次下拉数据
    queryWaybillAndShift (type, stationId, receiveClientId, sendStationId, _this, isEdit) {
      _queryWaybillAndShift(type, stationId, receiveClientId, sendStationId, _this, isEdit)
    },
    // 路线下拉改变，改变对应的班次
    wayChange (selectObj) {
      _wayChange(selectObj, this)
    },
    // 结算方式改变
    settlementMethodChange (val, changeType) {
      _settlementMethodChange(val, changeType, this)
    },
    // 格式化提交数据
    formatPostData () {
      return _formatPostData(this)
    },
    // 提交前校验信息
    validatePostData () {
      return _validatePostData(this)
    },
    // 点击提交
    submitBill (type) {
      this.$refs.numberInput1.$children[0].blur()
      this.$refs.numberInput2.$children[0].blur()
      let postData = this.formatPostData()
      let validateResult = this.validatePostData(postData)
      if (!validateResult.flag) {
        this.$notify({
          message: `${validateResult.message}`,
          type: 'error'
        })
        return
      }
      this.disableSubmit = true
      this.already = true
      WaybillAjax.CreateWayBill(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '新建运单成功！',
            type: 'success'
          })
          this.waybillId = response.data
          if (this.bbdReceivedFlag === '' && this.bbdSendFlag === '') { // 非帮帮达运单
            this.updatePrintCheckbox()
          }
          // 设置缓存收发货方配置
          localStorage.setItem('receiveStroageVal', this.receiveSearchRadio)
          localStorage.setItem('sendStroageVal', this.sendSearchRadio)
          if (this.sendForm.lockSendInfo) {
            // localStorage.setItem('sendFormVal', JSON.stringify(this.sendForm))
            sessionStorage.setItem('sendFormVal', JSON.stringify(this.sendForm))
          } else {
            // localStorage.removeItem('sendFormVal')
            sessionStorage.removeItem('sendFormVal')
          }
          if (this.checkList.length > 0) {
            this.printBill()
          } else {
            setTimeout(() => {
              this.$router.go(0)
            }, 500)
          }
        }
      })
    },
    printBill () {
      setTimeout(() => {
        this.$refs.printComponent.init()
      }, 10)
    },
    updatePrintCheckbox () {
      let postData = this.checkList.join(',')
      _updatePrintCheckbox(postData, this.accountId, this)
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
@import './style/createWaybill.less';
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
@import './style/createWaybillScope.less';
</style>
