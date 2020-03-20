<template>
  <div class="new-waybill">
    <div class="public_card">
      <div class="card_main">
        <!-- 发货方信息 -->
        <el-form :inline="true" ref="sendForm" :rules="sendRules" :model="sendForm" label-width="90px">
          <el-row>
            <el-col :span="8" :offset="1" class="left-col">
              <el-form-item label="发货方名称:" prop="sendClientName" class="sendType">
                <el-input
                  :autofocus="true"
                  ref="sendClinetName"
                  @input.native="search($event, 'clientName', sendForm.sendClientName, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model="sendForm.sendClientName"
                  maxlength="128"
                  placeholder="请输入发货方名称">
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
            <el-col :span="8" class="left-col">
              <el-form-item label="联系电话:" prop="phone" class="sendType">
                <el-input
                  ref="sendPhone"
                  @input.native="search($event, 'phone', sendForm.phone, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model="sendForm.phone"
                  maxlength="11"
                  placeholder="请输入联系电话">
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
            <el-col :span="8" :offset="1" class="left-col">
              <el-form-item label="联系地址:" class="sendType" prop="address">
                 <el-input
                  ref="sendAddress"
                  @input.native="search($event, 'address', sendForm.address, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  v-model="sendForm.address"
                  maxlength="128"
                  placeholder="请输入联系地址">
                </el-input>
                <div v-if="sendForm.isInput === 'address'" class="receiveAddressLeft tableDivLeft positionDiv">
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
        </el-form>
        <!-- 收货方信息 -->
        <div class="hr-line"></div>
        <el-form :inline="true" ref="receiveForm" :rules="receiveRules" :model="receiveForm" label-width="90px">
          <el-row :span="24">
            <el-col :span="8" :offset="1" class="left-col">
              <el-form-item label="收货方名称:" prop="receiveClientName" class="receiveType">
                <el-input
                  ref="receiveClientName"
                  @input.native="search($event, 'clientName', receiveForm.receiveClientName, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model="receiveForm.receiveClientName"
                  maxlength="128"
                  placeholder="请输入收货方名称">
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
            <el-col :span="8" class="left-col">
              <el-form-item label="联系电话:" prop="phone" class="receiveType">
                <el-input
                  @input.native="search($event, 'phone', receiveForm.phone, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model.trim="receiveForm.phone"
                  maxlength="11"
                  placeholder="请输入联系电话">
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
            <el-col :span="8" :offset="1" class="left-col">
              <el-form-item label="联系地址:" prop="address" class="receiveType">
                <el-input
                  ref="receiveAddress"
                  @input.native="search($event, 'address', receiveForm.address, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  v-model="receiveForm.address"
                  maxlength="128"
                  placeholder="请输入联系地址">
                </el-input>
                <div v-if="receiveForm.isInput === 'address'" class="receiveAddressLeft tableDivLeft positionDiv">
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
        </el-form>
        <!-- 司机信息 -->
        <div class="hr-line"></div>
        <el-form :inline="true" ref="driverForm" :rules="receiveRules" :model="form" label-width="90px">
          <el-row>
            <el-col :span="5" :offset="1" class="left-col routeSelect">
              <el-form-item label="司机:" prop="driverName" class="driverType">
                <el-input
                  ref="driverInput"
                  @clear="clearDriver"
                  @input.native="search($event, 'userName', form.driverName, 'driverForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('driverForm',$event)"
                  @focus="focusInput('driverForm',$event)"
                  class="sortInput"
                  v-model="form.driverName"
                  placeholder="请输入司机"
                  >
                  </el-input>
                <div v-if="driverFlag === 'userName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <driver-list
                    ref="searchTable"
                    :tableData="driverListSearchData"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="17">
              <el-form-item label='' prop="waterSign">
                <el-radio-group v-model="waterSign" size="small" @change="waterSignChange(waterSign)">
                  <el-radio-button :label='item.id' :key="index" v-for="(item,index) in waterSignDriverList">{{item.driverName}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 货品信息 -->
        <div class="hr-line"></div>
        <div class="cargo-con">
          <el-table
            :data="tableData"
            height="'100%'"
            border
            style="width: 100%">
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
                <el-input-number :ref="scope.row.ref" @keyup.native.stop="countKeyEvent($event, scope.row.rowNum)" v-model="scope.row.count" :min="scope.row.min" :max="99"></el-input-number>
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
        <el-form :inline="true" ref="form" :model="form" label-width="90px">
          <el-row>
            <el-col :span="11" :offset="1" class="left-col">
              <el-form-item label="收货方运费:" prop="receiveFreight">
                <el-input
                  ref="receiveFreight"
                  v-model="form.receiveFreight"
                  @keyup.native="inputMoney($event, 'receiveFreight', form.receiveFreight)"
                  @keyup.native.stop="keyEvent($event, 'receiveFreight')"
                  placeholder="请输入收货方运费"
                  clearable>
                  </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="0" class="left-col">
              <el-form-item label="发货方运费:" prop="sendFreight">
                <el-input
                ref="sendFreight"
                v-model="form.sendFreight"
                @keyup.native="inputMoney($event, 'sendFreight', form.sendFreight)"
                @keyup.native.stop="keyEvent($event, 'sendFreight')"
                placeholder="请输入发货方运费"
                clearable>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1" class="left-col">
              <el-form-item label="补贴:" prop="subsidyFreight">
                <el-input
                  ref="subsidyFreight"
                  v-model="form.subsidyFreight"
                  @keyup.native="inputMoney($event, 'subsidyFreight', form.subsidyFreight)"
                  @keyup.native.stop="keyEvent($event, 'subsidyFreight')"
                  placeholder="请输入补贴"
                  clearable>
                  </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="0">
              <el-form-item label="代收货款:" prop="receivableGoods">
                <el-input
                  ref="receivableGoods"
                  v-model="form.receivableGoods"
                  @keyup.native="inputMoney($event, 'receivableGoods', form.receivableGoods)"
                  placeholder="请输入代收货款"
                  clearable>
                  </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <div class="btn-left">
            <div class="radio-con1">
            <el-radio-group v-model="form.taskMode">
              <el-radio label="1">上门揽货</el-radio>
              <el-radio label="3">站点揽货</el-radio>
            </el-radio-group>
          </div>
          </div>
          <div class="btn-right">
            <div class="radio-con">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="打印运单"></el-checkbox>
              <!-- <el-checkbox label="打印箱单"></el-checkbox> -->
            </el-checkbox-group>
          </div>
          <div class="sunmit-con">
            <el-button ref="submitBtn" :disabled="disableSubmit" class="btn-main" @click="submitBill()">提交（ctrl + enter）</el-button>
          </div>
          </div>
        </div>
        <!-- 三联运单与箱单 -->
        <print-way-and-box-bill
          ref="printComponent"
          :waybillId="waybillId"
          :isPrintwayBill="isPrintwayBill"
          :isPrintBoxBill="isPrintBoxBill"
        />
        <!-- <search-waybill
          v-if="searchWaybillVisible"
          :dialogVisible="searchWaybillVisible"
          @click-cancel="searchWaybillVisible = false"
          @click-sure="clickSearchSure"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import StationOrderAjax from '@/api/TimelyDeliveryApi/CreateTasksApi'
import SearchTable from './subpage/SearchTable'
import DriverList from './subpage/DriverList'
import PrintWayAndBoxBill from './subpage/printWayBill'
let page
export default {
  name: 'NewWaybill',
  data () {
    return {
      form: {
        id: '',
        subsidyFreight: '0',
        sendFreight: '0',
        receiveFreight: '0',
        receivableGoods: '0',
        commodityName: '配件',
        commodityNumber: '1',
        commodityRemark: '',
        driverId: '',
        driverName: '',
        senderName: '',
        taskMode: '1'
      },
      driverFlag: '',
      waterSign: '',
      waterSignDriverList: [
        // {driverName: '揽收司机1', id: 1115},
        // {driverName: '配送司机2', id: 1210},
        // {driverName: '揽收司机2', id: 1211},
        // {driverName: '揽收揽收3', id: 1212},
        // {driverName: '配啊配送司', id: 1213}
      ],
      driverListData: [],
      driverListSearchData: [],
      receiveSourceData: [], // 收货方（修理厂）所有源数据
      receiveSearchTable: [], // 收货方（修理厂）搜索结果数据
      sendSourceData: [], // 发货方（供应商）所有源数据
      sendSearchTable: [], // 发货方（供应商）搜索结果数据
      currentIndex: '',
      currentRow: null,
      receiveForm: { // 收货方表单信息
        id: '',
        receiverId: '', // 交易收货方ID
        receiveClientName: '',
        clientCode: '',
        phone: '',
        stationObj: {stationId: '', stationName: ''},
        stationName: '',
        address: '',
        freightSettlementMethod: '', // 结算方式
        isInput: ''
      },
      sendForm: { // 发货方表单信息
        id: '',
        senderId: '', // 交易发货方ID
        sendClientName: '',
        clientCode: '',
        phone: '',
        stationObj: {stationId: '', stationName: ''},
        stationName: '',
        address: '',
        freightSettlementMethod: '', // 结算方式
        isInput: ''
      },
      wayForm: { // 路线信息表单
        pkLineObj: {generateVal: '', generateKey: ''},
        shiftObj: {generateVal: '', generateKey: ''}
      },
      tableData: [
        {rowNum: 1, cargoName: '配件', count: '1', other: '', ref: 'numberInput1', min: 1}
      ],
      checkList: ['打印运单'],
      disableSubmit: false,
      waybillId: '', // 提交生成的运单id
      isPrintwayBill: false, // 是否打印运单
      isPrintBoxBill: false, // 是否打印箱单
      searchWaybillVisible: false, // 搜索已有运单
      sendRules: {
        sendClientName: [{ required: true, message: '请输入发货方名称', trigger: ['blur', 'change'] }],
        address: [{ required: true, message: '请输入联系地址', trigger: ['blur', 'change'] }],
        phone: [{ required: true, message: '请输入联系电话', trigger: ['blur', 'change'] }]
      },
      receiveRules: {
        receiveClientName: [{ required: true, message: '请输入收货方名称', trigger: ['blur', 'change'] }],
        address: [{ required: true, message: '请输入联系地址', trigger: ['blur', 'change'] }],
        phone: [{ required: true, message: '请输入联系电话', trigger: ['blur', 'change'] }],
        driverName: [{ required: true, message: '请输入司机', trigger: ['blur', 'change'] }]
      }
    }
  },
  components: {
    PrintWayAndBoxBill,
    SearchTable,
    DriverList
  },
  computed: {
    driverId () {
      return this.form.driverId
    },
    driverName () {
      return this.form.driverName
    },
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
    }
  },
  watch: {
    driverId (newValue, oldValue) {
      if (newValue === this.waterSign) {
        this.waterSign = newValue
      } else {
        this.waterSign = ''
      }
    },
    driverName (newValue, oldValue) {
      if (newValue === '') {
        this.waterSign = ''
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.$refs.sendClinetName.focus()
    document.removeEventListener('keydown', this.shortcuKeyEvent)
    page = this
    document.addEventListener('keydown', this.shortcuKeyEvent, true)
  },
  methods: {
    init () {
      this.queryClientData()
      this.QueryDriverList()
      this.QueryWarterSignDriverList()
      // let userInfo = sessionStorage.getItem('userInfo')
    },
    clearDriver () { // 清空司机
      this.form.driverId = ''
      this.waterSign = ''
    },
    waterSignChange (val) { // 选择水牌
      this.driverListData.forEach(item => {
        if (Number(val) === item.userId) {
          this.form.driverId = item.userId
          this.form.driverName = item.userName
          this.$refs.numberInput1.focus()
        }
      })
    },
    // 司机列表查询
    QueryDriverList (val) {
      StationOrderAjax.QueryDriverList(val).then(response => {
        if (response.code === 200) {
          this.driverListData = response.data
          this.driverListSearchData = response.data
        }
      })
    },
    // 水牌司机列表查询
    QueryWarterSignDriverList (val) {
      StationOrderAjax.QueryWarterSignDriverList(val).then(response => {
        if (response.code === 200) {
          this.waterSignDriverList = response.data.list
        }
      })
    },
    focusInput (editFormType, event) {
      if (editFormType === 'driverForm') {
        if (this.form.driverName === ' ') {
          this.form.driverName = ''
        }
        if (this.form.senderName === ' ') {
          this.form.senderName = ''
        }
      }
    },
    inputMoney (event, inputType, value) { // 保留俩位小数（数字）
      // let val = value.match(/^\d*(\.?\d{0,2})/g)[0]
      // val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') 只能有一个点
      // let val = value.replace(/[^\d.]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') 小数点后两位
      let val = value.replace(/[^\d.]/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.$nextTick(() => {
        event.target.value = val
        if (inputType === 'sendFreight') {
          this.form.sendFreight = val
        } else if (inputType === 'receiveFreight') {
          this.form.receiveFreight = val
        } else if (inputType === 'subsidyFreight') {
          this.form.subsidyFreight = val
        } else if (inputType === 'receivableGoods') {
          this.form.receivableGoods = val
        }
      })
    },
    // 快捷键提交
    shortcuKeyEvent (event) {
      if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) { // ctrl+enter提交
        if (this.disableSubmit) {
          return false
        }
        if (window.event) {
          // IE中阻止函数器默认动作的方式
          window.event.returnValue = false
        } else {
          event.preventDefault()
        }
        page.$refs.submitBtn.$el.click()
        page.disableSubmit = true
        document.removeEventListener('keydown', page.shortcuKeyEvent)
      } else if (event.keyCode === 81 && (event.ctrlKey || event.metaKey)) {
        this.searchWaybillVisible = true
      }
    },
    // 上下移动或回车事件
    shortcutKeyUp (event) {
      let val = event.target.value
      let editType = ''
      if (this.receiveForm.isInput !== '') {
        editType = 'receiveType'
      } else if (this.sendForm.isInput !== '') {
        editType = 'sendType'
      } else if (this.driverFlag !== '') {
        editType = 'driverType'
      }
      if (event.keyCode === 40) { // 下
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSearchTable.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.receiveSearchTable[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSearchTable[newIndex]
            } else if (this.receiveSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.receiveSearchTable[0]
            } else if (this.receiveSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSearchTable.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.sendSearchTable[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSearchTable[newIndex]
            } else if (this.sendSearchTable.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.sendSearchTable[0]
            } else if (this.sendSearchTable.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'driverType' && this.driverListSearchData.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.driverListSearchData[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.driverListSearchData[newIndex]
            } else if (this.driverListSearchData.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.driverListSearchData[0]
            } else if (this.driverListSearchData.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
        }
      } else if (event.keyCode === 38) { // 上
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSearchTable.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.receiveSearchTable[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSearchTable[newIndex]
            } else if (this.receiveSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.receiveSearchTable.length - 1
              this.currentRow = this.receiveSearchTable[this.currentIndex]
            } else if (this.receiveSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSearchTable.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.sendSearchTable[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSearchTable[newIndex]
            } else if (this.sendSearchTable.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.sendSearchTable.length - 1
              this.currentRow = this.sendSearchTable[this.currentIndex]
            } else if (this.sendSearchTable.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'driverType' && this.driverListSearchData.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.driverListSearchData[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.driverListSearchData[newIndex]
            } else if (this.driverListSearchData.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.driverListSearchData.length - 1
              this.currentRow = this.driverListSearchData[this.currentIndex]
            } else if (this.driverListSearchData.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
        }
      }
      this.setCurrentRow()
      if (event.keyCode === 13) { // 回车
        if (this.currentRow) {
          this.selectTableRow(this.currentRow, event)
        }
      }
    },
    // 查询全部收发货放客户信息
    queryClientData (val) {
      StationOrderAjax.QueryFlashLogisticsClient(val).then(response => {
        if (response.code === 200) {
          this.sendSourceData = response.data[2]
          this.sendSearchTable = response.data[2]
          this.receiveSourceData = response.data[1]
          this.receiveSearchTable = response.data[1]
        }
      })
    },
    // 模糊搜索
    search (event, searchColName, val, editFormType) {
      let value = event.target.value
      if (value === '') {
        this.receiveForm.isInput = ''
        this.sendForm.isInput = ''
        this.driverFlag = ''
        return false
      }
      this.disableSubmit = false
      if (searchColName === 'phone') {
        value = this.validateOnlyNum(value)
        this.$nextTick(() => {
          event.target.value = value
        })
      }
      if (editFormType === 'driverForm') {
        this.driverListSearchData = this.driverListData.filter((item) => {
          if (item[searchColName] === null) {
            item[searchColName] = ''
          }
          if (searchColName === 'userName') {
            return item[searchColName].includes(value)
          }
        })
        if (this.driverListSearchData.length > 0) {
          this.currentIndex = 0
          this.currentRow = this.driverListSearchData[0]
          this.setCurrentRow()
        } else {
          this.form.driverId = ''
          this.currentRow = null
        }
        this.driverFlag = searchColName
      }
      if (editFormType === 'receiveForm') { // 搜索收货方
        this.receiveSearchTable = this.receiveSourceData.filter((item) => {
          if (item[searchColName] === null) {
            item[searchColName] = ''
          }
          if (searchColName === 'clientName') {
            return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
          } else {
            return item[searchColName].includes(value)
          }
        })
        // if (this.receiveSearchTable.length > 10) {
        //   this.receiveSearchTable = this.receiveSearchTable.slice(0, 10)
        // }
        if (this.receiveSearchTable.length > 0) {
          this.currentIndex = 0
          this.currentRow = this.receiveSearchTable[0]
          this.setCurrentRow()
        }
        this.receiveForm.isInput = searchColName
      } else if (editFormType === 'sendForm') { // 搜索发货方
        this.sendSearchTable = this.sendSourceData.filter((item) => {
          if (item[searchColName] === null) {
            item[searchColName] = ''
          }
          if (searchColName === 'clientName') {
            return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
          } else {
            return item[searchColName].includes(value)
          }
        })
        // if (this.sendSearchTable.length > 10) {
        //   this.sendSearchTable = this.sendSearchTable.slice(0, 10)
        // }
        if (this.sendSearchTable.length > 0) {
          this.currentIndex = 0
          this.currentRow = this.sendSearchTable[0]
          this.setCurrentRow()
        }
        this.sendForm.isInput = searchColName
      }
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
      setTimeout(() => {
        if (editFormType === 'receiveForm') {
          this.receiveForm.isInput = ''
        } else if (editFormType === 'sendForm') {
          this.sendForm.isInput = ''
        }
        this.currentRow = null
      }, 200)
    },
    clickSelectTableRow (row, event) {
      this.selectTableRow(row, event)
    },
    // 选中某行数据
    selectTableRow (row, event) {
      // 跳转下一处
      this.nextFocus()
      let selectTableType = ''
      let { path } = event
      let len = path.length
      for (let i = 0; i < len; i++) {
        if (path[i].className.includes('receiveType')) {
          selectTableType = 'receiveType'
          break
        } else if (path[i].className.includes('sendType')) {
          selectTableType = 'sendType'
          break
        } else if (path[i].className.includes('driverType')) {
          selectTableType = 'driverType'
          break
        }
      }
      if (selectTableType === 'receiveType') { // 收货方
        this.receiveForm.id = row.id
        this.receiveForm.receiveClientName = row.clientName
        this.receiveForm.clientCode = row.clientCode
        this.receiveForm.phone = row.phone
        this.receiveForm.stationName = row.stationName
        this.receiveForm.address = row.address
        this.receiveForm.freightSettlementMethod = row.freightSettlementMethod
        this.receiveForm.isInput = ''
      } else if (selectTableType === 'sendType') { // 发货方
        this.sendForm.id = row.id
        this.sendForm.sendClientName = row.clientName
        this.sendForm.clientCode = row.clientCode
        this.sendForm.phone = row.phone
        this.sendForm.stationName = row.stationName
        this.sendForm.address = row.address
        this.sendForm.freightSettlementMethod = row.freightSettlementMethod
        this.sendForm.isInput = ''
      } else if (selectTableType === 'driverType') {
        this.form.driverId = row.userId
        this.form.driverName = row.userName
        this.waterSign = row.userId
        this.driverFlag = ''
      }
    },
    // 收发货方选中某行后光标自动聚焦至下一处编辑
    nextFocus () {
      if (this.sendForm.isInput !== '') { // 当前编辑的是发货方
        if (this.sendForm.isInput === 'clientName') { // 发货方名称
          this.$refs.receiveClientName.focus()
        } else if (this.sendForm.isInput === 'phone') { // 发货方电话
          this.$refs.receiveClientName.focus()
        } else if (this.sendForm.isInput === 'address') { // 发货方地址
          this.$refs.receiveClientName.focus()
        }
      }
      if (this.receiveForm.isInput !== '') { // 当前编辑的是收货方
        this.$refs.driverInput.focus()
      }
      if (this.driverFlag !== '') { // 当前编辑的是司机
        this.$refs.numberInput1.focus()
      }
    },
    // 数量框键盘事件
    countKeyEvent (event, rowNum) {
      if (event.keyCode === 13) {
        this.$refs.receiveFreight.focus()
      }
    },
    // 费用框键盘事件
    keyEvent (event, type) {
      if (event.keyCode === 13) {
        switch (type) {
          case 'receiveFreight':
            this.$refs.sendFreight.focus()
            break
          case 'sendFreight':
            this.$refs.subsidyFreight.focus()
            break
          case 'subsidyFreight':
            this.$refs.receivableGoods.focus()
            break
          default:
            break
        }
      }
    },
    // 提交前校验信息
    validatePostData (postData) {
      // 只提示第一处不满足
      let result = {
        flag: true,
        message: ''
      }
      let reg = /^(\s+)(\s+)$/g
      // 收货方
      if (this.receiveForm.receiveClientName === '' || reg.test(this.receiveForm.receiveClientName)) { // 收货方名称
        result.flag = false
        result.message = '请填写收货方名称!'
        return result
      }
      if (this.receiveForm.phone === '' || reg.test(this.receiveForm.phone)) { // 收货方联系电话
        result.flag = false
        result.message = '请填写收货方联系电话!'
        return result
      }
      if (this.receiveForm.stationObj.stationId === '') { // 收货方站点
        result.flag = false
        result.message = '请选择收货方服务站!'
        return result
      }
      // 发货方
      if (this.sendForm.sendClientName === '' || reg.test(this.sendForm.sendClientName)) { // 发货方名称
        result.flag = false
        result.message = '请填写发货方名称!'
        return result
      }
      if (this.sendForm.phone === '' || reg.test(this.sendForm.phone)) { // 发货方联系电话
        result.flag = false
        result.message = '请填写发货方联系电话!'
        return result
      }
      if (this.sendForm.stationObj.stationId === '') { // 发货方站点
        result.flag = false
        result.message = '请选择发货方站点!'
        return result
      }
      if (!this.disableWayAndShift) { // 非退货运单时，需要填写路线班次
        if (this.wayForm.pkLineObj.generateKey === '') { // 路线
          result.flag = false
          result.message = '请选择路线!'
          return result
        }
        if (this.wayForm.shiftObj.generateKey === '') { // 班次
          result.flag = false
          result.message = '请选择班次!'
          return result
        }
      }
      if (this.boxBillCount.length < 1) {
        result.flag = false
        result.message = '包裹数量至少为一个!'
        return result
      }
      return result
    },
    // 点击提交
    submitBill () {
      this.$refs.numberInput1.$children[0].blur()
      let sendFormResult = true
      let receiveFormResult = true
      this.$refs.sendForm.validate((valid) => {
        sendFormResult = valid
        this.$refs.receiveForm.validate((valid) => {
          receiveFormResult = valid
          this.$refs.driverForm.validate((valid) => {
            if (valid && sendFormResult && receiveFormResult) {
              this.disableSubmit = true
              if (this.form.sendFreight === '') {
                this.form.sendFreight = 0
              }
              if (this.form.subsidyFreight === '') {
                this.form.subsidyFreight = 0
              }
              if (this.form.receivableGoods === '') {
                this.form.receivableGoods = 0
              }
              if (this.form.receiveFreight === '') {
                this.form.receiveFreight = 0
              }
              let postData = {
                commodityName: this.tableData[0].cargoName,
                commodityNumber: this.tableData[0].count, // 包裹1数量
                commodityRemark: this.tableData[0].other, // 备注
                createWaybillType: 2, // 开单类型
                driverId: this.form.driverId, // 司机id
                driverName: this.form.driverName, // 司机名称
                flashWaybillTaskId: '', // 任务id 有则传无则不传
                receiveClientAddress: this.receiveForm.address, // 收货方地址
                receiveClientId: this.receiveForm.id, // 收货方id
                receiveClientName: this.receiveForm.receiveClientName, // 收货方名称
                sendClientAddress: this.sendForm.address, // 发货方地址
                sendClientId: this.sendForm.id, // 发货方id
                sendClientName: this.sendForm.sendClientName, // 发货方名称
                sendClientPhone: this.sendForm.phone, // 发货方电话
                receiveClientPhone: this.receiveForm.phone, // 收货方电话
                taskMode: Number(this.form.taskMode),
                sendFreight: this.form.sendFreight, // 发货方运费
                subsidyFreight: this.form.subsidyFreight, // 运费补贴
                receivableGoods: this.form.receivableGoods, // 代收货款
                receiveFreight: this.form.receiveFreight // 收货方运费
              }
              StationOrderAjax.FlashWaybillCreate(postData).then(response => {
                if (response.code === 200) {
                  this.disableSubmit = false
                  this.$notify({
                    message: '开单成功！',
                    type: 'success'
                  })
                  this.waybillId = response.data.waybillId
                  this.printBill()
                }
              })
            }
          })
        })
      })
    },
    resetPage () {
      this.resetObj(this.receiveForm)
      this.resetObj(this.sendForm)
      this.resetObj(this.form)
      this.tableData = [{rowNum: 1, cargoName: '配件', count: '1', other: '', ref: 'numberInput1'}]
      this.checkList = ['打印运单']
      this.resetObj(this.firstPrint)
      this.resetObj(this.secondPrint)
    },
    resetObj (obj) {
      for (let prop in obj) {
        if (typeof (obj[prop]) !== 'object') {
          obj[prop] = ''
        } else {
          for (let innerProp in obj[prop]) {
            obj[prop][innerProp] = ''
          }
        }
      }
    },
    printBill () {
      setTimeout(() => {
        if (this.checkList.length === 2) {
          this.isPrintwayBill = true
          this.isPrintBoxBill = true
        } else if (this.checkList.length === 1) {
          if (this.checkList[0] === '打印运单') {
            // 打印三联
            this.isPrintwayBill = true
            this.isPrintBoxBill = false
          } else {
            // 打印箱单
            this.isPrintwayBill = false
            this.isPrintBoxBill = true
          }
        } else {
          this.isPrintwayBill = false
          this.isPrintBoxBill = false
        }
        this.$refs.printComponent.init()
      }, 10)
    }
  }
}
</script>

<style lang="less">
@import '../../../style/base.less';
.new-waybill{
  // 表头固定滚动
  .el-table__body-wrapper{
    max-height: 350px!important;
    overflow-y: auto;
  }
  .receiveNameLeft{
    .customerNameCol{
      background: #66ccff;
    }
  }
  .receivePhoneLeft{
    .customerPhoneCol{
      background: #66ccff;
    }
  }
  .receiveAddressLeft{
    .addressCol{
      background: #66ccff;
    }
  }
  .card_main{
    padding: 30px 40px;
  }
  .public_card .card_main {
    margin: 0!important;
  }
  .redLabel{
    label{
      color: #f00;
    }
  }
  .el-form-item{
    width: 100%;
    display: flex!important;
    flex-direction: row;
    position: relative;
    .positionDiv{
      display: flex;
      flex: 1;
      width: 200%;
      position: absolute;
      top: 40px;
      z-index: 10;
      background: #ccc;
    }
    .tableDivLeft{
      left: 0px;
    }
    .tableDivRight{
      right: -4%;
    }
    .tableDivRightLast{
      right: 4%;
    }
    .el-form-item__content{
      display: flex;
      flex: 1;
      flex-direction: column;
      .el-input__inner{
        width: 100%;
        border: none;
      }
      .el-form-item__error{
        top: -5px!important;
        left: 10px;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #5677fc;
        border-color: #5677fc;
      }
      .el-radio-button__inner:hover {
        // color: #5677fc;
      }
    }
  }
  .el-table__empty-block{
    min-height: 80px;
    .el-table__empty-text{
      margin-top: 0px;
    }
    .el-table__empty-text:after{
      display: none;
    }
  }
  .el-radio-group{
    display: flex;
    align-items: center;
  }
  .el-tab-pane{
    overflow-y: auto;
  }
  .cargo-con{
    .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #fff;
    }
    .el-table__body tr.current-row > td{
      background-color: #fff!important;
    }
    .el-table_1_column_4{
      padding: 0 5px;
    }
  }
  .hr-line{
    width: 100%;
    height: 3px;
    background: #f0f2fa;
  }
  .cargo-con{
    .el-table thead{
      background: #fff;
    }
    .el-table th{
      background: #fff;
    }
    .el-table{
      display: block;
      flex: none;
    }
  }
  .yellowColor{
    color: #ffb856;
  }
  .el-input-group__append, .el-input-group__prepend{
    background-color: #fff;
    border: none;
    color: #333;
  }
  .account-col{
    .el-input{
      width: 60%;
    }
  }
  .el-input-number__increase, .el-input-number__decrease{
    height: 29px;
    line-height: 29px;
    margin-top: 2px;
    top: 3px;
    width: 35px;
  }
  .el-textarea .el-textarea__inner{
    -height: 80px;
  }
  .el-input-number{
    width: 100%;
  }
  .addressCol{
    padding-right: 10px;
  }
  .routeSelect{
    .el-select{
      width: 400px;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../../style/base.less';
.new-waybill{
  display: flex;
  flex: 1;
  -webkit-box-flex: 1;
  .header-con{
    background: #f0f2fa;
    font-weight: bold;
    height: 37px;
    line-height: 37px;
    .mixin-sc(13px;#333);
    text-indent: 45px;
  }
  .el-form{
    .el-row{
      border-bottom: 1px solid #ebecf0;
    }
    .last-row{
      border-bottom: none;
    }
  }
  .btns{
    height: 34px;
    display: flex;
    margin-top: 20px;
    margin-right: 20px;
    .btn-left {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .btn-right {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .radio-con1{
      margin-left: 40px;
    }
    .radio-con{
      margin-right: 40px;
    }
    .print-con{
      margin-left: 15px;
    }
  }
  .revoke{
    margin-right: 25px;
  }
}
</style>
