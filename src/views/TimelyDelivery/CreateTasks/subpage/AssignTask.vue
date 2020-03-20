<template>
  <div class="AssignTask">
    <div class="item">
      <div class="title">发<br/><br/>货<br/><br/>方</div>
      <div class="content">
        <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="70px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="联系地址:" prop="sendClientAddress" class="sendType">
                <el-input
                  @input.native="search($event, 'address', form.sendClientAddress, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  class="longInput"
                  v-model.trim="form.sendClientAddress"
                  clearable>
                 </el-input>
                  <div v-if="sendFlag === 'address'" class="receiveNameLeft tableDivLeft positionDiv">
                    <search-table
                      ref="searchTable"
                      :tableData="sendSourceSearchData"
                      :type="'发货方名称'"
                      @click-select-table-row="clickSelectTableRow"
                    />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话:" prop="sendClientPhone" class="sendType">
                <el-input
                  @input.native="search($event, 'phone', form.sendClientPhone, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  class="sortInput"
                  v-model.trim="form.sendClientPhone"
                  clearable>
                </el-input>
                <div v-if="sendFlag === 'phone'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :tableData="sendSourceSearchData"
                    :type="'发货方名称'"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货方名称:" prop="sendClientName" class="sendType">
                <el-input
                  maxlength=10
                  @input.native="search($event, 'clientName', form.sendClientName, 'sendForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('sendForm')"
                  class="sortInput"
                  v-model.trim="form.sendClientName"
                  clearable>
                </el-input>
                <div v-if="sendFlag === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :tableData="sendSourceSearchData"
                    :type="'发货方名称'"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="item">
      <div class="title">收<br/><br/>货<br/><br/>方</div>
      <div class="content">
        <el-form :inline="true" ref="form1" :model="form" class="demo-form-inline" label-width="70px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="联系地址:" prop="receiveClientAddress" class="receiveType">
                <el-input
                  @input.native="search($event, 'address', form.receiveClientAddress, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  ref="receiveClientAddress"
                  class="longInput"
                  v-model.trim="form.receiveClientAddress"
                  clearable>
                </el-input>
                <div v-if="receiveFlag === 'address'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :tableData="receiveSourceSearchData"
                    :type="'收货方名称'"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话:" prop="receiveClientPhone" class="receiveType">
                <el-input
                  @input.native="search($event, 'phone', form.receiveClientPhone, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  class="sortInput"
                  v-model.trim="form.receiveClientPhone"
                  clearable>
                </el-input>
                <div v-if="receiveFlag === 'phone'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :tableData="receiveSourceSearchData"
                    :type="'收货方名称'"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货方名称:" prop="receiveClientName" class="receiveType">
                <el-input
                  maxlength=10
                  @input.native="search($event, 'clientName', form.receiveClientName, 'receiveForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('receiveForm')"
                  class="sortInput"
                  v-model.trim="form.receiveClientName"
                  clearable>
                </el-input>
                <div v-if="receiveFlag === 'clientName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <search-table
                    ref="searchTable"
                    :tableData="receiveSourceSearchData"
                    :type="'收货方名称'"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="item">
      <div class="title">员<br/><br/>工<br/></div>
      <div class="content">
        <el-form :inline="true" ref="form2" :model="form" class="demo-form-inline" label-width="70px" style="width: 100%;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="揽收司机:" prop="driverName" v-if="!pageFlag" class="driverType">
                <el-input
                  @clear="clearDriver"
                  @input.native="search($event, 'userName', form.driverName, 'driverForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('driverForm',$event)"
                  @focus="focusInput('driverForm',$event)"
                  class="sortInput"
                  v-model="form.driverName"
                  clearable>
                  </el-input>
                  <el-input v-model="form.driverId" v-if="false"></el-input>
                <div v-if="driverFlag === 'userName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <driver-list
                    ref="searchTable"
                    :tableData="driverListSearchData"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配送司机:" prop="senderName" v-if="pageFlag" class="senderType">
                <el-input
                  @clear="clearDriver"
                  @input.native="search($event, 'userName', form.senderName, 'driverForm')"
                  @keyup.native.stop="shortcutKeyUp"
                  @blur="blurFormInput('driverForm',$event)"
                  @focus="focusInput('driverForm',$event)"
                  class="sortInput"
                  v-model="form.senderName"
                  clearable>
                </el-input>
                <el-input v-model="form.sender" v-if="false"></el-input>
                <div v-if="driverFlag === 'userName'" class="receiveNameLeft tableDivLeft positionDiv">
                  <driver-list
                    ref="searchTable"
                    :tableData="driverListSearchData"
                    @click-select-table-row="clickSelectTableRow"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label=" " prop="taskMode" class="radioCss" v-if="!pageFlag">
                <el-radio-group v-model="form.taskMode">
                  <el-radio label="1">直配</el-radio>
                  <el-radio label="2">回站</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1">
              <el-form-item label='' prop="waterSign">
                <el-radio-group v-model="waterSign" @change="waterSignChange(waterSign)">
                  <el-radio-button :label='item.id' :key="index" v-for="(item,index) in waterSignDriverList">{{item.driverName}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="item">
      <div class="title">货<br/><br/>品<br/><br/>信<br/><br/>息</div>
      <div class="content">
        <el-form :inline="true" ref="form3" :model="form" class="demo-form-inline" label-width="70px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="货物名称:" prop="commodityName">
                <el-input class="sortInput" v-model="form.commodityName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量:" prop="commodityNumber">
                <el-input class="sortInput" v-model="form.commodityNumber" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注:" prop="commodityRemark">
                <el-input class="sortInput" v-model="form.commodityRemark" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="item">
      <div class="title">运<br/><br/>费<br/></div>
      <div class="content">
        <el-form :inline="true" ref="form4" :model="form" class="demo-form-inline" label-width="70px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="发货方:" prop="sendFreight">
                <el-input class="sortInput" v-model="form.sendFreight" @keyup.native="inputMoney($event, 'sendFreight', form.sendFreight)" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货方:" prop="receiveFreight">
                <el-input class="sortInput" v-model="form.receiveFreight"  @keyup.native="inputMoney($event, 'receiveFreight', form.receiveFreight)" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="补贴:" prop="subsidyFreight">
                <el-input class="sortInput" v-model="form.subsidyFreight"  @keyup.native="inputMoney($event, 'subsidyFreight', form.subsidyFreight)" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="item-1">
      <div class="title">代<br/><br/>收<br/></div>
      <div class="content">
        <el-form :inline="true" ref="form5" :model="form" class="demo-form-inline" label-width="70px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="代收货款:" prop="receivableGoods">
                <el-input class="sortInput" v-model="form.receivableGoods" @keyup.native="inputMoney($event, 'receivableGoods', form.receivableGoods)" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="btnCss">
      <el-button class="btn-main" v-if="goBackShow" @click="refresh">返回</el-button>
      <el-button ref="submitBtn" class="btn-main" v-if="btnShow" @click="AssignBtn('form')">指派（ctrl + enter）</el-button>
    </div>

    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      :mainText="dialogText"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      :showCancel="false"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
import SearchTable from './SearchTable'
import DriverList from './DriverList'
import CreateTasksAjax from '@/api/TimelyDeliveryApi/CreateTasksApi'
import VDialog from '@/components/Dialog/Dialog'

export default {
  name: 'AssignTask',
  components: {
    SearchTable,
    DriverList,
    VDialog
  },
  props: {
    idProps: {
      default: ''
    }
  },
  data () {
    return {
      dialogText: '未选择揽收司机，该任务信息将保存至右侧的任务列表中，是否继续？',
      dialogVisible: false,
      waterSign: '', // 水牌
      PageId: '',
      pageFlag: false, // fase为揽收任务true配送任务
      btnShow: true, // 配送任务指派
      goBackShow: false,
      driverFlag: '',
      sendFlag: '',
      receiveFlag: '',
      currentIndex: '',
      currentRow: null,
      form: {
        id: '',
        sendClientAddress: '',
        sendClientPhone: '',
        sendClientName: '',
        receiveClientName: '',
        receiveClientPhone: '',
        receiveClientAddress: '',
        subsidyFreight: 0,
        sendFreight: 0,
        receiveFreight: 0,
        receivableGoods: 0,
        commodityName: '配件',
        commodityNumber: '1',
        commodityRemark: '',
        driverId: '',
        driverName: '',
        sender: '',
        senderName: '',
        taskMode: '1'
      },
      rules: {
        sendClientAddress: [{ required: true, message: '请输入联系地址', trigger: ['blur', 'change'] }],
        sendClientPhone: [{ required: true, message: '请输入联系电话', trigger: ['blur', 'change'] }]
      },
      sendSourceData: [],
      sendSourceSearchData: [],
      receiveSourceData: [],
      receiveSourceSearchData: [],
      driverListData: [],
      driverListSearchData: [],
      waterSignDriverList: []
    }
  },
  created () {
    document.removeEventListener('keydown', this.shortcuKeyEvent)

    let routerFlag = this.$route.name
    if (routerFlag === 'CollectTask') {
      this.pageFlag = false
      this.goBackShow = false
    }
    if (routerFlag === 'DeliveryTask') {
      this.pageFlag = true
      this.btnShow = false
      this.goBackShow = false
    }
    this.QueryDriverList()
    this.queryClientData()
    this.QueryWarterSignDriverList()
  },
  mounted () {
    document.removeEventListener('keydown', this.shortcuKeyEvent)
    document.addEventListener('keydown', this.shortcuKeyEvent, true)
  },
  computed: {
    routerChange () {
      return this.$route.name
    },
    receiverDriverChange () {
      return this.form.driverId
    },
    sendDriverChange () {
      return this.form.sender
    }
  },
  watch: {
    idProps (newValue, oldValue) {
      if (newValue === '') {
        return false
      }
      let routerFlag = this.$route.name
      if (routerFlag === 'CollectTask') {
        this.PageId = newValue
        this.QueryWaybillReceiveTaskById({id: newValue})
        this.goBackShow = true
      }
      if (routerFlag === 'DeliveryTask') {
        this.PageId = newValue
        this.QueryWaybillSendTaskById({id: newValue})
        this.btnShow = true
        this.goBackShow = true
      }
    },
    routerChange (newValue, oldValue) {
      document.removeEventListener('keydown', this.shortcuKeyEvent)
      if (newValue === 'CollectTask') {
        this.pageFlag = false
        this.goBackShow = false
      }
      if (newValue === 'DeliveryTask') {
        this.pageFlag = true
        this.btnShow = false
        this.goBackShow = false
      }
    },
    receiverDriverChange (newValue, oldValue) {
      if (newValue === this.waterSign) {

      } else {
        this.waterSign = ''
        this.waterSign = newValue
      }
    },
    sendDriverChange (newValue, oldValue) {
      if (newValue === this.waterSign) {

      } else {
        this.waterSign = ''
        this.waterSign = newValue
      }
    }
  },
  methods: {
    clearDriver () { // 清空司机
      this.form.driverId = ''
      this.form.sender = ''
      this.waterSign = ''
    },
    waterSignChange (val) { // 选择水牌
      this.driverListData.forEach(item => {
        if (Number(val) === item.userId) {
          if (this.pageFlag) {
            this.form.sender = item.userId
            this.form.senderName = item.userName
          } else {
            this.form.driverId = item.userId
            this.form.driverName = item.userName
          }
        }
      })
    },
    inputMoney (event, inputType, value) { // 保留俩位小数（数字）
      let val = value.match(/^\d*(\.?\d{0,2})/g)[0] || null
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
    // 揽收任务单条查询（回显）
    QueryWaybillReceiveTaskById (val) {
      CreateTasksAjax.QueryWaybillReceiveTaskById(val).then(response => {
        if (response.code === 200) {
          this.form = {...response.data}
          this.$nextTick(() => {
            this.$refs.form.validate()
          })
        }
      })
    },
    // 配送任务单条查询（回显）
    QueryWaybillSendTaskById (val) {
      CreateTasksAjax.QueryWaybillSendTaskById(val).then(response => {
        if (response.code === 200) {
          // this.form.id = response.data.id
          // this.form.sendClientAddress = response.data.sendClientAddress
          // this.form.sendClientPhone = response.data.sendClientPhone
          // this.form.sendClientName = response.data.sendClientName
          // this.form.receiveClientAddress = response.data.receiveClientAddress
          // this.form.receiveClientPhone = response.data.receiveClientPhone
          // this.form.receiveClientName = response.data.receiveClientName
          // this.form.sender = response.data.sender
          // this.form.senderName = response.data.senderName
          // this.form.commodityName = response.data.commodityName
          // this.form.commodityNumber = response.data.commodityNumber
          // this.form.commodityRemark = response.data.commodityRemark
          // this.form.sendFreight = response.data.sendFreight
          // this.form.receiveFreight = response.data.receiveFreight
          // this.form.subsidyFreight = response.data.subsidyFreight
          // this.form.receivableGoods = response.data.receivableGoods
          this.form = {...response.data}
          this.$nextTick(() => {
            this.$refs.form.validate()
          })
        }
      })
    },
    // 查询全部收发货放客户信息
    queryClientData (val) {
      CreateTasksAjax.QueryFlashLogisticsClient(val).then(response => {
        if (response.code === 200) {
          this.sendSourceData = response.data[2]
          this.sendSourceSearchData = response.data[2]
          this.receiveSourceData = response.data[1]
          this.receiveSourceSearchData = response.data[1]
        }
      })
    },
    // 司机列表查询
    QueryDriverList (val) {
      CreateTasksAjax.QueryDriverList(val).then(response => {
        if (response.code === 200) {
          this.driverListData = response.data
          this.driverListSearchData = response.data
        }
      })
    },
    // 水牌司机列表查询
    QueryWarterSignDriverList (val) {
      CreateTasksAjax.QueryWarterSignDriverList(val).then(response => {
        if (response.code === 200) {
          this.waterSignDriverList = response.data.list
        }
      })
    },
    refresh () {
      this.$router.go(0)
    },
    addFun (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          CreateTasksAjax.InsertWaybillTask(this.form).then(response => {
            if (response.code === 200) {
              this.$emit('call-back-flag', 'true')// 指派成功回调列表，刷新列表
              this.QueryWarterSignDriverList()
              this.QueryDriverList()
              this.resetForm()
              this.$nextTick(() => {
                this.$refs.form.clearValidate()
              })
              this.goBackShow = false
              this.$notify({
                message: '任务指派成功！',
                type: 'success'
              })
            }
          })
        }
      })
    },
    editSendTasks (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          CreateTasksAjax.EditSendTask(this.form).then(response => { // 配送任务单条修改
            if (response.code === 200) {
              this.$emit('call-back-flag', 'true')// 指派成功回调列表，刷新列表
              this.QueryWarterSignDriverList()
              this.QueryDriverList()
              this.resetForm()
              this.$nextTick(() => {
                this.$refs.form.clearValidate()
              })
              this.btnShow = false
              this.goBackShow = false
              this.$notify({
                message: '修改成功！',
                type: 'success'
              })
            }
          })
        }
      })
    },
    editReciveTask (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          CreateTasksAjax.EditReceiveTask(this.form).then(response => { // 揽收任务单条修改
            if (response.code === 200) {
              this.$emit('call-back-flag', 'true')// 指派成功回调列表，刷新列表
              this.QueryWarterSignDriverList()
              this.QueryDriverList()
              this.goBackShow = false
              this.resetForm()
              this.$nextTick(() => {
                this.$refs.form.clearValidate()
              })
              this.$notify({
                message: '修改成功！',
                type: 'success'
              })
            }
          })
        }
      })
    },
    // 提交
    AssignBtn (form) {
      if (!this.form.sendClientAddress || !this.form.sendClientPhone) {
        this.dialogText = '信息不全无法指派'
        this.dialogVisible = true
        return false
      }
      if (this.idProps === '') {
        if (!this.form.driverId) {
          this.dialogText = '未选择揽收司机，该任务信息将保存至右侧的任务列表中，是否继续？'
          this.dialogVisible = true
        } else {
          this.addFun(form)
        }
      } else {
        console.log(this.pageFlag)
        if (this.pageFlag) {
          if (!this.form.sender) {
            this.dialogVisible = true
            this.dialogText = '未选择配送司机，该任务信息将保存至右侧的任务列表中，是否继续？'
          } else {
            this.editSendTasks(form)
          }
        } else {
          if (!this.form.driverId) {
            this.dialogVisible = true
            this.dialogText = '未选择揽收司机，该任务信息将保存至右侧的任务列表中，是否继续？'
          } else {
            this.editReciveTask(form)
          }
        }
      }
    },
    // 模糊搜索
    search (event, searchColName, val, editFormType) {
      console.log(event, searchColName, val, editFormType)
      let value = event.target.value
      if (value === '') {
        this.sendFlag = ''
        this.receiveFlag = ''
        this.driverFlag = ''
        return false
      }
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
          this.form.sender = ''
          this.currentRow = null
        }
        this.driverFlag = searchColName
      }
      if (editFormType === 'sendForm') {
        this.sendSourceSearchData = this.sendSourceData.filter((item) => {
          if (item[searchColName] === null) {
            item[searchColName] = ''
          }
          if (searchColName === 'clientName') {
            return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
          } else {
            return item[searchColName].includes(value)
          }
        })
        if (this.sendSourceSearchData.length > 0) {
          this.currentIndex = 0
          this.currentRow = this.sendSourceSearchData[0]
          this.setCurrentRow()
        }
        this.sendFlag = searchColName
      }
      if (editFormType === 'receiveForm') {
        this.receiveSourceSearchData = this.receiveSourceData.filter((item) => {
          if (item[searchColName] === null) {
            item[searchColName] = ''
          }
          if (searchColName === 'clientName') {
            return item[searchColName].includes(value) || (item['clientNamePinYin'] && item['clientNamePinYin'].includes(value)) || (item['clientNameQuanPin'] && item['clientNameQuanPin'].includes(value))
          } else {
            return item[searchColName].includes(value)
          }
        })
        if (this.receiveSourceSearchData.length > 0) {
          this.currentIndex = 0
          this.currentRow = this.receiveSourceSearchData[0]
          this.setCurrentRow()
        }
        this.receiveFlag = searchColName
      }
    },
    clickSelectTableRow (row, event) {
      this.selectTableRow(row, event)
    },
    // 选中某行数据
    selectTableRow (row, event) {
      // 跳转下一处
      // this.nextFocus()
      let selectTableType = ''
      let { path } = event
      let len = path.length
      for (let i = 0; i < len; i++) {
        console.log(path[i].className)
        if (path[i].className.includes('receiveType')) {
          selectTableType = 'receiveType'
          break
        } else if (path[i].className.includes('sendType')) {
          selectTableType = 'sendType'
          break
        } else if (path[i].className.includes('driverType')) {
          selectTableType = 'driverType'
          break
        } else if (path[i].className.includes('senderType')) {
          selectTableType = 'senderType'
          break
        }
      }

      if (selectTableType === 'receiveType') { // 收货方
        this.form.receiveClientAddress = row.address
        this.form.receiveClientPhone = row.phone
        this.form.receiveClientName = row.clientName
        this.form.receiveClient = row.id
        this.receiveFlag = ''
      } else if (selectTableType === 'sendType') { // 发货方
        this.form.sendClientAddress = row.address
        this.form.sendClientPhone = row.phone
        this.form.sendClientName = row.clientName
        this.form.sendClient = row.id
        this.sendFlag = ''
      } else if (selectTableType === 'driverType') {
        this.form.driverId = row.userId
        this.form.driverName = row.userName
        this.driverFlag = ''
      } else if (selectTableType === 'senderType') {
        this.form.sender = row.userId
        this.form.senderName = row.userName
        this.driverFlag = ''
      }
    },
    // 收发货方选中某行后光标自动聚焦至下一处编辑
    nextFocus () {
      if (this.sendFlag !== '') {
        if (this.sendFlag === 'clientName') { // 收货方
          this.$refs.receiveClientAddress.focus()
        }
      }
    },
    // 上下移动或回车事件
    shortcutKeyUp (event) {
      let val = event.target.value
      let editType = ''
      if (this.receiveFlag !== '') {
        editType = 'receiveType'
      } else if (this.sendFlag !== '') {
        editType = 'sendType'
      } else if (this.driverFlag !== '') {
        editType = 'driverType'
      }
      // } else if (this.sendFlag !== '') {
      //   editType = 'senderType'
      // }
      if (event.keyCode === 40) { // 下
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSourceSearchData.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.receiveSourceSearchData[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSourceSearchData[newIndex]
            } else if (this.receiveSourceSearchData.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.receiveSourceSearchData[0]
            } else if (this.receiveSourceSearchData.length === 0) { // 下一行没有数据了且第一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSourceSearchData.length > 0) {
            let newIndex = this.currentIndex + 1
            if (this.sendSourceSearchData[newIndex]) { // 下一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSourceSearchData[newIndex]
            } else if (this.sendSourceSearchData.length > 0) { // 下一行没有数据了但第一行有数据
              this.currentIndex = 0
              this.currentRow = this.sendSourceSearchData[0]
            } else if (this.sendSourceSearchData.length === 0) { // 下一行没有数据了且第一行无数据
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
          // if (editType === 'senderType' && this.driverListSearchData.length > 0) {
          //   let newIndex = this.currentIndex + 1
          //   if (this.driverListSearchData[newIndex]) { // 下一行有数据
          //     this.currentIndex = newIndex
          //     this.currentRow = this.driverListSearchData[newIndex]
          //   } else if (this.driverListSearchData.length > 0) { // 下一行没有数据了但第一行有数据
          //     this.currentIndex = 0
          //     this.currentRow = this.driverListSearchData[0]
          //   } else if (this.driverListSearchData.length === 0) { // 下一行没有数据了且第一行无数据
          //     this.currentIndex = ''
          //     this.currentRow = null
          //   }
          // }
        }
      } else if (event.keyCode === 38) { // 上
        if (val.length > 0) {
          if (editType === 'receiveType' && this.receiveSourceSearchData.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.receiveSourceSearchData[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.receiveSourceSearchData[newIndex]
            } else if (this.receiveSourceSearchData.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.receiveSourceSearchData.length - 1
              this.currentRow = this.receiveSourceSearchData[this.currentIndex]
            } else if (this.receiveSourceSearchData.length === 0) { // 上一行没有数据了且最后一行无数据
              this.currentIndex = ''
              this.currentRow = null
            }
          }
          if (editType === 'sendType' && this.sendSourceSearchData.length > 0) {
            let newIndex = this.currentIndex - 1
            if (this.sendSourceSearchData[newIndex]) { // 上一行有数据
              this.currentIndex = newIndex
              this.currentRow = this.sendSourceSearchData[newIndex]
            } else if (this.sendSourceSearchData.length > 0) { // 上一行没有数据了但最后一行有数据
              this.currentIndex = this.sendSourceSearchData.length - 1
              this.currentRow = this.sendSourceSearchData[this.currentIndex]
            } else if (this.sendSourceSearchData.length === 0) { // 上一行没有数据了且最后一行无数据
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
          // if (editType === 'senderType' && this.driverListSearchData.length > 0) {
          //   let newIndex = this.currentIndex - 1
          //   if (this.driverListSearchData[newIndex]) { // 上一行有数据
          //     this.currentIndex = newIndex
          //     this.currentRow = this.driverListSearchData[newIndex]
          //   } else if (this.driverListSearchData.length > 0) { // 上一行没有数据了但最后一行有数据
          //     this.currentIndex = this.driverListSearchData.length - 1
          //     this.currentRow = this.driverListSearchData[this.currentIndex]
          //   } else if (this.driverListSearchData.length === 0) { // 上一行没有数据了且最后一行无数据
          //     this.currentIndex = ''
          //     this.currentRow = null
          //   }
          // }
        }
      }
      this.setCurrentRow()
      if (event.keyCode === 13) { // 回车
        if (this.currentRow) {
          this.selectTableRow(this.currentRow, event)
        } else {
          this.form.driverName = ''
          this.form.sender = ''
          this.form.driverId = ''
          this.form.senderName = ''
          this.driverFlag = ''
        }
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
    blurFormInput (editFormType, event) {
      setTimeout(() => {
        if (editFormType === 'receiveForm') {
          this.receiveFlag = ''
        } else if (editFormType === 'sendForm') {
          this.sendFlag = ''
        } else if (editFormType === 'driverForm') {
          this.driverFlag = ''
          console.log(this.form.driverId)
          if (!this.form.driverId) {
            this.form.driverName = ' '
            // event.target.value = ' '
          }
          if (!this.form.sender) {
            this.$nextTick(() => {
              this.form.senderName = ' '
              // event.target.value = ' '
            })
          }
        }
        this.currentRow = null
      }, 500)
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
    // 快捷键提交
    shortcuKeyEvent (event) {
      if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) { // ctrl+enter提交
        if (window.event) {
          // IE中阻止函数器默认动作的方式
          window.event.returnValue = false
        } else {
          event.preventDefault()
        }
        this.$refs.submitBtn.$el.click()
        document.removeEventListener('keydown', this.shortcuKeyEvent)
      }
    },
    clickCancel () {
      this.dialogVisible = false
    },
    clickSure () {
      this.dialogVisible = false
      if (!this.form.sendClientAddress || !this.form.sendClientPhone) {
        return false
      }
      if (this.idProps === '') {
        this.addFun('form')
      } else {
        console.log(this.pageFlag)
        if (this.pageFlag) {
          this.editSendTasks('form')
        } else {
          this.editReciveTask('form')
        }
      }
    },
    resetForm () {
      this.idProps = ''
      this.waterSign = ''
      this.form.id = ''
      this.form.sendClientAddress = ''
      this.form.sendClientPhone = ''
      this.form.sendClientName = ''
      this.form.receiveClientName = ''
      this.form.receiveClientPhone = ''
      this.form.receiveClientAddress = ''
      this.form.subsidyFreight = 0
      this.form.sendFreight = 0
      this.form.receiveFreight = 0
      this.form.receivableGoods = 0
      this.form.commodityName = '配件'
      this.form.commodityNumber = '1'
      this.form.commodityRemark = ''
      this.form.driverId = ''
      this.form.driverName = ''
      this.form.sender = ''
      this.form.senderName = ''
      this.form.taskMode = '1'
    }
  }
}
</script>

<style lang="less" scoped>
.AssignTask {
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid #eee;
  .item {
    display: flex;
    flex: 3;
    .title {
      display: flex;
      flex: 1;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      justify-content: center;
      align-items: center;
      color: #606266;
      font-size: 13px;
    }
    .content {
      display: flex;
      flex: 9;
      border-bottom: 1px solid #eee;
      align-items: center;
    }
  }
  .item-1 {
    display: flex;
    flex: 2;
    .title {
      display: flex;
      flex: 1;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      justify-content: center;
      align-items: center;
      color: #606266;
      font-size: 13px;
    }
    .content {
      display: flex;
      flex: 9;
      border-bottom: 1px solid #eee;
      align-items: center;
    }
  }
  .btnCss {
    margin: 10px 10px;
    text-align: right;
  }
}
</style>

<style lang="less">
.AssignTask {
  .content {
    .longInput, .sortInput {
      .el-input__inner {
        //width: 300px;
        width: 100%;
      }
    }
  }
  .radioCss {
    .el-radio-group {
      height: 44px;
      line-height: 44px;
    }
  }
  .el-form-item{
    width: 100%;
    // display: flex!important;
    // flex-direction: row;
    // position: relative;
    .positionDiv{
      display: flex;
      flex: 1;
      width: 200%;
      position: absolute;
      top: 40px;
      z-index: 10000;
      background: #ccc;
      .el-table {
        max-height: 550px;
        overflow: auto;
      }
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
    // .el-form-item__content{
    //   display: flex;
    //   flex: 1;
    // }
  }
}
</style>
