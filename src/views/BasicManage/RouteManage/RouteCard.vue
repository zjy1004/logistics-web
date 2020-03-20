<template>
  <div class="route-card">
    <div class="public_card">
      <h3 class="card_header">线路管理</h3>
      <div class="card_main">
        <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="新增线路" name="first">
            <el-form :inline="true" ref="newForm" :model="newForm" :rules="newRules" label-width="75px">
              <el-row>
                <el-col :span="6" :offset="0">
                  <el-form-item label="线路名称:" prop="lineName">
                    <el-input v-model="newForm.lineName" placeholder="请输入路线名称" maxlength="11" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="站点:" prop="stationObj">
                    <el-select v-model="newForm.stationObj" placeholder="请选择站点"  value-key="stationId" clearable>
                      <el-option
                        v-for="(item, index) in stationOptions"
                        :key="index"
                        :label="item.stationName"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="btns">
              <el-button @click="addPkLine('new')">+ 添加班次</el-button>
              <el-button @click="newDel()">删除</el-button>
            </div>
            <div class="table-con">
              <el-table
                :data="newTableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                stripe
                height="'100%'"
                border>
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                  min-width="10%"
                  prop="departureTime"
                  label="发车时间">
                  <template slot-scope="scope">
                    <el-time-select
                      :picker-options="{
                        start: '08:30',
                        step: '00:30',
                        end: '18:30'
                      }"
                      v-model="scope.row.departureTime"
                      placeholder="选择发车时间">
                    </el-time-select>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="pkUser"
                  label="司机">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.pkUser" @change="driverChange(scope.row, 'first')" placeholder="请选择司机">
                      <el-option
                        v-for="item in driverList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="pkCar"
                  label="车辆">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.pkCar" placeholder="请选择车辆">
                      <el-option
                        v-for="item in scope.row.carList"
                        :key="item.id"
                        :label="item.carNumber"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom-btns">
              <el-button class="btn-main" @click="newSave()">保存</el-button>
              <el-button @click="goback()">返回</el-button>
            </div>
          </el-tab-pane>
          <!-- 已有线路 -->
          <el-tab-pane label="已有线路" name="second">
            <el-form :inline="true" ref="form" :model="oldForm" label-width="69px">
              <el-row>
                <el-col :span="24" :offset="0">
                  <el-form-item label="线路名称:">
                    <el-radio-group v-model="oldForm.way" @change="lineChange">
                      <el-radio :key="item.generateKey" :label="item.generateKey" v-for="item in wayList">{{item.generateVal}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="btns">
              <el-button v-if="activeName !== 'first'" @click="editPkLine()">修改线路</el-button>
              <el-button @click="addPkLine('old')">+ 添加班次</el-button>
              <el-button @click="oldDel('old')">删除</el-button>
            </div>
            <div class="table-con">
              <el-table
                :data="oldTableData"
                style="width: 100%"
                @selection-change="tabSecondSelectionChange"
                stripe
                ref="oldTable"
                height="'100%'"
                border>
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                  min-width="10%"
                  prop="departureTime"
                  label="发车时间">
                  <template slot-scope="scope">
                    <el-time-select
                      v-model="scope.row.departureTime"
                      :picker-options="{
                        start: '08:30',
                        step: '00:30',
                        end: '18:30'
                      }"
                      placeholder="选择发车时间">
                    </el-time-select>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="userId"
                  label="司机">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.userId" placeholder="请选择司机" @change="driverChange(scope.row, 'second')">
                      <el-option
                        v-for="item in driverList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="15%"
                  prop="carId"
                  label="车辆">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.carId" placeholder="请选择车辆">
                      <el-option
                        v-for="item in scope.row.carList"
                        :key="item.id"
                        :label="item.carNumber"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom-btns">
              <el-button class="btn-main" @click="oldSave()">保存</el-button>
              <el-button @click="goback()">返回</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="删除"
      :width="'486px'"
      mainText="您确定删除选中的班次？"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
    <edit-route
      v-if="editRouteShow"
      :dialogVisible="editRouteShow"
      :editData="editData"
      @click-cancel-form="editRouteShow = false"
      @click-sure-form="editSure"
    />
  </div>
</template>

<script>
import RouteAjax from '@/api/RouteManage/RouteManage'
import VDialog from '@/components/Dialog/Dialog'
import EditRoute from './subpage/EditRoute'
let logisticsId
export default {
  name: 'RouteCard',
  data () {
    let validateUserName = (rule, value, callback) => {
      if (value.stationId === '') {
        callback(new Error('请选择站点！'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      // row: null,
      editRouteShow: false,
      editData: {
        lineId: '',
        lineName: ''
      },
      activeName: 'first',
      dialogVisible: false,
      newForm: {
        lineName: '',
        way: '',
        stationObj: {stationId: '', stationName: ''}
      },
      newRules: {
        lineName: [
          { required: true, message: '请输入路线名称!', trigger: 'blur' }
        ],
        stationObj: [
          { required: true, validator: validateUserName, trigger: 'change' }
        ]
      },
      oldForm: {
        lineName: '',
        way: '',
        stationObj: {stationId: '', stationName: ''}
      },
      stationOptions: [],
      wayList: [],
      multipleSelection: [],
      tabSecondSelection: [],
      driverList: [],
      carList: [],
      defaultTableRow: {departureTime: '', pkUser: '', pkCar: '', logisticsId: logisticsId, shiftId: '', carList: []},
      oldDefaultTableRow: {departureTime: '', userId: '', carId: '', logisticsId: logisticsId, shiftId: '', carList: []},
      newTableData: [],
      oldTableData: [],
      oldFrontDelData: [],
      oldDelIds: []
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      logisticsId = JSON.parse(userInfo).logisticsId
    }
    let query = this.$route.query
    if (query.isAdd === false || query.isAdd === 'false') { // 点击修改信息跳转
      this.activeName = query.activeName
      this.id = query.id
      // this.row = query.row
      // this.oldForm.way = Number(query.id)
      this.queryLines()
    } else {
      this.id = ''
    }
    this.init()
  },
  methods: {
    init () {
      this.queryStations()
      this.queryDrivers()
      this.queryCars()
    },
    // 修改路线，查询物流公司下所有线路
    queryLines (tab) {
      RouteAjax.QueryLines().then(response => {
        if (response.code === 200) {
          this.wayList = response.data
          if (tab === 'tab') { // 从新建线路切到已有线路
            if (this.id) {
              this.lineChange(this.id)
            } else {
              if (response.data[0]) {
                this.lineChange(response.data[0].generateKey)
              }
            }
          }
        }
      })
    },
    queryStations () {
      RouteAjax.QueryStations({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.stationOptions = response.data
        }
      })
    },
    queryDrivers () {
      RouteAjax.QueryDrivers({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.driverList = response.data
        }
      })
    },
    queryCars () {
      RouteAjax.QueryCars({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.carList = response.data
          // this.defaultTableRow.carList = response.data
          // this.oldDefaultTableRow.carList = response.data
          let query = this.$route.query
          this.lineChange(query.id)
        }
      })
    },
    driverChange (rowData, type) {
      RouteAjax.QueryCarsByUser({userId: rowData.pkUser || rowData.userId}).then(response => {
        if (response.code === 200) {
          if (type === 'first') {
            this.newTableData = this.newTableData.map(item => {
              // if (item.index === rowData.index) {
              //   item.pkCar = ''
              //   item.carList = response.data
              // } else {
              //   item.carList = []
              // }
              if (item.index === rowData.index) {
                item.pkCar = ''
                item.carList = response.data
              }
              return item
            })
          } else if (type === 'second') {
            this.oldTableData = this.oldTableData.map(item => {
              // if (item.index === rowData.index) {
              //   item.carId = ''
              //   item.carList = response.data
              // } else {
              //   item.carList = []
              // }
              if (item.index === rowData.index) {
                item.carId = ''
                item.carList = response.data
              }
              return item
            })
          }
        }
      })
    },
    lineChange (lineVal) {
      this.oldForm.way = Number(lineVal)
      RouteAjax.QueryShiftsByLine({lineId: lineVal}).then(response => {
        if (response.code === 200) {
          this.oldTableData = response.data.list.map((item, index) => {
            init.bind(this)(item.userId)
            async function init (userId) {
              item.carList = await this.queryCarsByUserId(userId)
              if (this.oldTableData.length > 0) {
                this.oldTableData.forEach((item, index) => {
                  this.$refs.oldTable.setCurrentRow(this.oldTableData[index])
                })
                this.$refs.oldTable.setCurrentRow(this.oldTableData[0])
              }
            }
            // 行车辆下拉框先默认为全部车辆，再设置值
            // item.carList = this.carList
            item.carId = Number(item.carId) === 0 ? '' : Number(item.carId)
            item.userId = Number(item.userId) === 0 ? '' : Number(item.userId)
            item.index = index
            return item
          })
        }
      })
    },
    async queryCarsByUserId (userId) {
      return new Promise((resolve, reject) => {
        RouteAjax.QueryCarsByUser({userId: userId}).then(response => {
          if (response.code === 200) {
            resolve(response.data)
          }
        })
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
      if (tab.index === '1') { // 已有线路
        this.queryLines('tab')
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tabSecondSelectionChange (val) {
      this.tabSecondSelection = val
    },
    addPkLine (type) {
      if (type === 'new') {
        let newObj = Object.assign({index: this.newTableData.length}, this.defaultTableRow)
        this.newTableData.push(newObj)
      } else if (type === 'old') {
        if (this.oldForm.way === '' || Number.isNaN(this.oldForm.way)) {
          this.$notify({
            message: '请您选择路线！',
            type: 'error'
          })
          return false
        }
        let oldObj = Object.assign({index: this.oldTableData.length}, this.oldDefaultTableRow)
        this.oldTableData.push(oldObj)
      }
    },
    editPkLine () {
      if (this.oldForm.way) { // 已选择线路
        this.editData.lineId = this.oldForm.way
        this.wayList.forEach(item => {
          if (item.generateKey === this.oldForm.way) {
            this.editData.lineName = item.generateVal
          }
        })
        this.editRouteShow = true
      } else {
        this.$notify({
          message: '请您选择要修改的线路！',
          type: 'error'
        })
      }
    },
    editSure (lineId, lineName) {
      this.editRouteShow = false
      this.queryLines()
    },
    newDel () { // 新增路线删除，前端删除
      if (this.multipleSelection.length < 1) {
        this.$notify({
          message: '请您选择要删除的行！',
          type: 'error'
        })
      } else {
        let difference = new Set([...this.newTableData].filter(x => !this.multipleSelection.includes(x)))
        this.newTableData = [...difference]
        this.newTableData = this.newTableData.map((item, index) => {
          item.index = index
          return item
        })
      }
    },
    oldDel () { // 已有路线删除，无id前端删除，有id的保存前走批量删除
      if (this.tabSecondSelection.length < 1) {
        this.$notify({
          message: '请您勾选要删除的班次！',
          type: 'error'
        })
      } else {
        this.dialogVisible = true
      }
    },
    clickSure () {
      this.oldFrontDelData = this.tabSecondSelection.filter(item => {
        return !item.shiftId
      })
      this.tabSecondSelection.forEach(item => {
        if (item.shiftId !== undefined && item.shiftId !== '') {
          this.oldDelIds.push(item.shiftId)
        }
      })
      let difference = new Set([...this.oldTableData].filter(x => !this.oldFrontDelData.includes(x)))
      this.oldTableData = [...difference]
      if (this.oldDelIds.length > 0) {
        RouteAjax.DeleteLine({shiftIdList: this.oldDelIds}).then(response => {
          if (response.code === 200) {
            this.dialogVisible = false
            this.$notify({
              message: '删除成功！',
              type: 'success'
            })
            this.oldFrontDelData = []
            this.oldDelIds = []
            this.lineChange(this.oldForm.way)
          }
        })
      } else {
        this.$notify({
          message: '删除成功！',
          type: 'success'
        })
        this.oldTableData = this.oldTableData.map((item, index) => {
          item.index = index
          return item
        })
        this.dialogVisible = false
      }
    },
    clickCancel () {
      this.dialogVisible = false
    },
    // 校验班次表格是否填写完整
    validateShiftTable (type) {
      let result = true
      if (type === 'new') { // 新建线路
        result = this.newTableData.every((item, index) => {
          return item.departureTime !== '' && item.pkUser !== '' && item.pkCar !== ''
        })
      } else if (type === 'old') {
        result = this.oldTableData.every((item, index) => {
          return item.departureTime !== '' && item.userId !== '' && item.carId !== ''
        })
      }
      return result
    },
    // 校验班次重复
    validateRepeat (type) {
      let isRepeat = false
      if (type === 'new') { // 新建线路
        this.newTableData.forEach((item, index) => {
          this.newTableData.forEach((innerItem, innerIndex) => {
            if (index !== innerIndex) {
              if (item.departureTime === innerItem.departureTime && item.pkUser === innerItem.pkUser && item.pkCar === innerItem.pkCar) { // 完全重复的班次
                isRepeat = true
              }
            }
          })
        })
      } else if (type === 'old') {
        this.oldTableData.forEach((item, index) => {
          this.oldTableData.forEach((innerItem, innerIndex) => {
            if (index !== innerIndex) {
              if (item.departureTime === innerItem.departureTime && item.userId === innerItem.userId && item.carId === innerItem.carId) { // 完全重复的班次
                isRepeat = true
              }
            }
          })
        })
      }
      return isRepeat
    },
    newSave () {
      this.$refs.newForm.validate((valid) => {
        let tableValidateResult = this.validateShiftTable('new')
        let isRepeat = this.validateRepeat('new')
        if (!tableValidateResult) { // 表格数据校验不通过
          this.$notify({
            message: '请完善班次表格数据再试！',
            type: 'error'
          })
          return false
        }
        if (isRepeat) {
          this.$notify({
            message: '班次行数据重复，不可保存！',
            type: 'error'
          })
          return false
        }
        if (valid) {
          let postData = {
            departureStation: this.newForm.stationObj.stationId,
            lineId: '',
            lineName: this.newForm.lineName,
            logisticsId: logisticsId,
            shiftSaveParams: []
          }
          postData.shiftSaveParams = this.newTableData.map(item => {
            return {
              departureTime: item.departureTime,
              logisticsId: logisticsId,
              pkCar: item.pkCar,
              pkUser: item.pkUser,
              shiftId: ''
            }
          })
          let obj = {}
          obj.lineName = this.newForm.lineName
          RouteAjax.validLineName(obj).then(response => {
            if (response.code === 200) {
              if (response.data) {
                this.$notify({
                  message: '该线路名称已存在！',
                  type: 'error'
                })
              } else {
                RouteAjax.Insert(postData).then(response => {
                  if (response.code === 200) {
                    this.$router.push({name: 'RouteList'})
                    this.$notify({
                      message: '保存成功！',
                      type: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      })
    },
    oldSave () {
      let tableValidateResult = this.validateShiftTable('old')
      let isRepeat = this.validateRepeat('old')
      if (!tableValidateResult) { // 表格数据校验不通过
        this.$notify({
          message: '请完善班次表格数据再试！',
          type: 'error'
        })
        return false
      }
      if (isRepeat) {
        this.$notify({
          message: '班次行数据重复，不可保存！',
          type: 'error'
        })
        return false
      }
      let postData = {
        lineId: this.oldForm.way,
        lineName: this.oldForm.lineName,
        logisticsId: logisticsId,
        shiftSaveParams: []
      }
      postData.shiftSaveParams = this.oldTableData.map(item => {
        let obj = {
          departureTime: item.departureTime,
          logisticsId: logisticsId,
          pkCar: item.carId,
          pkUser: item.userId,
          shiftId: item.shiftId
        }
        return obj
      })
      let obj = {}
      obj.lineId = this.id
      obj.lineName = this.newForm.lineName
      RouteAjax.validLineName(obj).then(response => {
        RouteAjax.UpdateLine(postData).then(response => {
          if (response.data) {
            this.$notify({
              message: '该线路名称已存在！',
              type: 'success'
            })
          } else {
            if (response.code === 200) {
              this.$router.push({name: 'RouteList'})
              this.$notify({
                message: '保存成功！',
                type: 'success'
              })
            }
          }
        })
      })
    },
    goback () {
      this.$router.push({name: 'RouteList'})
    }
  },
  components: {
    VDialog,
    EditRoute
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.route-card{
  display: flex;
  flex: 1;
  .card_main{
    padding: 30px 40px;
    .el-tab-pane{
      display: flex;
      flex-direction: column;
      .el-form{
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .btns{
        height: 32px;
        margin-bottom: 15px;
      }
      .table-con{
        display: flex;
        flex: 1;
      }
      .bottom-btns{
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
    }
  }
}
</style>
