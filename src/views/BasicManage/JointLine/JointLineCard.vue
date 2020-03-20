<template>
  <div class="joint-line-card">
    <div class="public_card">
      <h3 class="card_header">联营线路</h3>
      <div class="card_main">
        <el-form :inline="true" ref="newForm" label-position="right" :model="newForm" :rules="newRules" label-width="30px">
          <el-form-item label="线路归属:" prop="logisticsId">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="newForm.logisticsId" placeholder="请选择物流公司" @change="changeInitiateLogistics(newForm.logisticsId)" clearable>
              <el-option
                v-for="(item, index) in logisticsOptions"
                :key="index"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路名称:" prop="lineName">
            <el-input v-model="newForm.lineName" placeholder="请输入路线名称" maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item label="配送范围:" prop="lineType">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="newForm.lineType" placeholder="请选择配送范围" clearable>
              <el-option
                v-for="(item, index) in DistributionScopeOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上游站点:" prop="departureStation">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="newForm.departureStation" placeholder="请选择站点" clearable>
              <el-option
                v-for="(item, index) in UpStationOptions"
                :key="index"
                :label="item.stationName"
                :value="item.stationId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下游站点:" prop="queryDownstreamByLogistics">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="newForm.queryDownstreamByLogistics" placeholder="请选择物流公司" clearable @change="changeDownstreamLogistics(newForm.queryDownstreamByLogistics)">
              <el-option
                v-for="(item, index) in downstreamLogisticsOptions"
                :key="index"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="destinationStation">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="newForm.destinationStation" placeholder="请选择站点" clearable>
              <el-option
                v-for="(item, index) in DownStationOptions"
                :key="index"
                :label="item.stationName"
                :value="item.stationId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button @click="addPkLine('new')" :disabled="!shiftSwitch">+ 增加班次</el-button>
          <el-button @click="newDel()">删除</el-button>
          <span class="title">设置班次</span>
          <span style="margin-left:10px;">
          <el-switch
            @change="switchChange(shiftSwitch)"
            v-model="shiftSwitch">
          </el-switch>
          </span>
          <span v-show="shiftSwitch" style="margin-left:10px; color: red;">表内班次顺序为实际执行顺序</span>
        </div>
        <div class="table-con">
          <el-table
            ref="tableData"
            :data="tableData"
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
                min-width="3%"
                prop="serialNumber"
                label="序号">
              <template slot-scope="scope">
                <i :class="{'visible-icon': scope.row.serialNumber === 1}" @click="sortUp(scope.row)" class="iconfont icon-shangjiantou-"></i>
                <span>{{scope.row.serialNumber}}</span>
                <i :class="{'visible-icon': scope.row.serialNumber === tableData.length}" @click="sortDown(scope.row)" class="iconfont icon-xiajiantou-"></i>
              </template>
            </el-table-column>
            <el-table-column
              min-width="10%"
              prop="departureTime"
              label="发车班次">
              <template slot-scope="scope">
                <div class="timeWrap">
                  <el-input
                  v-show="shiftSwitch"
                  v-model="scope.row.departureTime"
                  size="small"
                  maxlength="7"
                  placeholder="请输入发车班次"
                  clearable
                />
                <el-input
                  v-show="!shiftSwitch"
                  v-model="scope.row.departureTime"
                  disabled
                  size="small"
                  placeholder="无班次"
                  clearable
                />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="driverLogisticsId"
              label="所属物流公司">
              <template slot-scope="scope">
                <el-select v-model="scope.row.driverLogisticsId" placeholder="请选择物流公司" @change="changeLIstLogistics(scope.row.driverLogisticsId, scope.row)">
                  <el-option
                    v-for="item in downstreamSelfLogisticsOptions"
                    :key="item.logisticsId"
                    :label="item.logisticsName"
                    :value="item.logisticsId">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              min-width="15%"
              prop="driverId"
              label="司机">
              <template slot-scope="scope">
                <el-select v-model="scope.row.driverId" placeholder="请选择司机">
                  <el-option
                    v-for="item in scope.row.driverAll"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom-btns">
          <el-button class="btn-main" @click="newSave()">保存</el-button>
          <el-button  class="btn-main" @click="goback()">返回</el-button>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="关闭班次设置会删除已有班次信息，是否确认关闭"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
  </div>
</template>

<script>
import LinesManageAjax from '@/api/LinesManage/LinesManage'
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
import VDialog from '@/components/Dialog/Dialog'
let logisticsId
export default {
  name: 'JointLineCard',
  data () {
    return {
      id: '',
      shiftSwitch: true,
      queryLineShiftData: {},
      routeFrom: '',
      dialogVisible: false,
      newForm: {
        logisticsId: '', // 线路归属
        lineName: '', // 线路名称
        shiftFlag: '',
        lineType: '', // 5联营同城调度,6联营城际调度 (配送范围)
        departureStation: '', // 上游站点
        destinationStation: '', // 下游站点
        queryDownstreamByLogistics: '' // 下游站点前的物流公司
      },
      newRules: {
        lineName: [
          { required: true, message: '请输入路线名称!', trigger: 'blur' }
        ],
        departureStation: [
          { required: true, message: '请选择上游站点！', trigger: 'change' }
        ],
        lineType: [
          { required: true, message: '请选择配送范围！', trigger: 'change' }
        ],
        destinationStation: [
          { required: true, message: '请选择下游站点！', trigger: 'change' }
        ],
        logisticsId: [
          { required: true, message: '请选择物流公司！', trigger: 'change' }
        ],
        queryDownstreamByLogistics: [
          { required: true, message: '请选择物流公司！', trigger: 'change' }
        ]
      },
      UpStationOptions: [], // 上游站点
      DownStationOptions: [], // 下游站点
      logisticsOptions: [], // 线路归属下拉框
      downstreamSelfLogisticsOptions: [], // 列表司机前的所属物流公司
      DistributionScopeOptions: [
        {name: '联营同城调度', id: 5},
        {name: '联营城际调度', id: 6}
      ],
      wayList: [],
      multipleSelection: [],
      tabSecondSelection: [],
      driverList: [],
      carList: [],
      defaultTableRow: {departureTime: '', driverId: '', logisticsId: logisticsId, shiftId: ''},
      oldDefaultTableRow: {departureTime: '', userId: '', carId: '', logisticsId: logisticsId, shiftId: '', carList: []},
      newTableData: [],
      oldTableData: [],
      oldFrontDelData: [],
      oldDelIds: [],
      tableData: [],
      downstreamLogisticsOptions: [] // 下游站点物流公司
    }
  },
  created () {
    this.QueryLogisticsSelectInitiate()
    this.init()
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      // logisticsId = JSON.parse(userInfo).logisticsId
      // this.driverLogisticsId = JSON.parse(userInfo).logisticsId
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.QueryLineShift(this.id)
    } else {
      this.id = ''
    }
    this.routeFrom = this.$route.query.from
  },
  watch: {
  },
  methods: {
    init () {
      this.newForm.shiftFlag = 1
      this.addPkLine()
    },
    changeInitiateLogistics (val) { // 选择发起物流
      this.newForm.departureStation = ''
      this.newForm.queryDownstreamByLogistics = ''
      this.queryUpStations({logisticsId: val})
      this.QueryLogisticsSelectRelation({logisticsIdInitiate: val})
      this.QueryLogisticsSelectRelationSelf({logisticsIdInitiate: val})
    },
    changeDownstreamLogistics (val) { // 选择关联结束物流查询下游站点
      this.newForm.destinationStation = ''
      this.queryDownStations({logisticsId: val})
    },
    changeLIstLogistics (val, row) { // 选择列表中的物流公司查询司机
      if (this.newForm.lineType !== '') {
        CustomerRouteAjax.QueryDrivers({logisticsId: val, lineType: this.newForm.lineType}).then(response => {
          if (response.code === 200) {
            this.tableData = this.tableData.map((item, index, array) => {
              if (item.serialNumber === row.serialNumber) {
                item.driverId = ''
                item.driverAll = response.data
              }
              return item
            })
          }
        })
      } else {
        this.tableData = this.tableData.map((item, index, array) => {
          if (item.serialNumber === row.serialNumber) {
            item.driverId = ''
            item.driverAll = []
          }
          return item
        })
      }
    },
    // 班次切换
    switchChange (val) {
      if (val) {
        this.tableData = []
        this.addPkLine()
        this.newForm.shiftFlag = 1
      } else {
        this.dialogVisible = true
      }
    },
    // 向上
    sortUp (row) {
      this.tableData.map((item, index, array) => {
        if (item.serialNumber === row.serialNumber) {
          let tepmIndex = --item.serialNumber
          item.serialNumber = tepmIndex
          array[tepmIndex - 1].serialNumber++
        }
        return item
      })
      this.sortTableData()
    },
    // 向下
    sortDown (row) {
      this.tableData.map((item, index, array) => {
        if (item.serialNumber === row.serialNumber) {
          let tepmIndex = ++item.serialNumber
          item.serialNumber = tepmIndex
          array[tepmIndex - 1].serialNumber--
        }
        return item
      })
      this.sortTableData()
    },
    // 排序后改变tableData
    sortTableData () {
      this.tableData = this.tableData.sort((item1, item2) => {
        return item1.serialNumber - item2.serialNumber
      })
      this.tableData.map((item, index) => {
        item.serialNumber = index + 1
        return item
      })
    },
    newDel () { // 新增路线删除，前端删除
      if (this.multipleSelection.length < 1) {
        this.$notify({
          message: '请您选择要删除的行！',
          type: 'error'
        })
      } else {
        if (this.tableData.length > 1) {
          let difference = new Set([...this.tableData].filter(x => !this.multipleSelection.includes(x)))
          this.tableData = [...difference]
          this.resetTable()
          if (this.tableData.length === 0) {
            this.addPkLine()
          }
        } else {
          this.$notify({
            message: '仅有一条班次信息无法进行删除',
            type: 'error'
          })
        }
        // let difference = new Set([...this.tableData].filter(x => !this.multipleSelection.includes(x)))
        // this.tableData = [...difference]
        // this.resetTable()
      }
    },
    // 重新为表格复制
    resetTable () {
      this.tableData = this.tableData.map((item, index) => {
        item.serialNumber = index + 1
        return item
      })
    },
    // 添加班次
    addPkLine () {
      let newObj = {departureTime: '', driverId: '', driverLogisticsId: '', shiftId: '', serialNumber: ''}

      newObj.serialNumber = this.tableData.length
      this.tableData.push(newObj)
      this.resetTable()
    },
    // 查询上游站点
    queryUpStations (val) {
      CustomerRouteAjax.QueryStations(val).then(response => {
        if (response.code === 200) {
          this.UpStationOptions = response.data
        }
      })
    },
    // 查询下游站点
    queryDownStations (val) {
      CustomerRouteAjax.QueryStations(val).then(response => {
        if (response.code === 200) {
          this.DownStationOptions = response.data
        }
      })
    },
    // 查询所有联营物流公司下拉框选择(归属)
    QueryLogisticsSelectInitiate () {
      LinesManageAjax.QueryLogisticsSelectInitiate().then(response => {
        if (response.code === 200) {
          this.logisticsOptions = response.data
        }
      })
    },
    // 查询发起方联营物流公司的所有关联物流公司下拉框选择(下游站点物流公司)
    QueryLogisticsSelectRelation (val) {
      LinesManageAjax.QueryLogisticsSelectRelation(val).then(response => {
        if (response.code === 200) {
          this.downstreamLogisticsOptions = response.data
        }
      })
    },
    // 查询发起方联营物流公司的所有关联物流公司和本身下拉框选择
    QueryLogisticsSelectRelationSelf (val) {
      LinesManageAjax.QueryLogisticsSelectRelationSelf(val).then(response => {
        if (response.code === 200) {
          this.downstreamSelfLogisticsOptions = response.data
        }
      })
    },
    async QueryDrivers (driverLogisticsId, lineType) {
      return new Promise((resolve, reject) => {
        CustomerRouteAjax.QueryDrivers({logisticsId: driverLogisticsId, lineType}).then(response => {
          if (response.code === 200) {
            resolve(response.data)
          }
        })
      })
    },
    // 修改查看 获取
    QueryLineShift (val) {
      CustomerRouteAjax.QueryLineList({lineId: val}).then(response => {
        if (response.code === 200) {
          let data = response.data.list[0]
          this.queryLineShiftData = data
          this.tableData = data.lineShiftListVoList.map((item, index, array) => {
            init.bind(this)(item.driverLogisticsId, response.data.list[0].lineType)
            async function init (driverLogisticsId, lineType) {
              item.driverAll = await this.QueryDrivers(driverLogisticsId, lineType)
              if (this.tableData.length > 0) {
                this.tableData.forEach((item, index) => {
                  this.$refs.tableData.setCurrentRow(this.tableData[index])
                })
                this.$refs.tableData.setCurrentRow(this.tableData[0])
              }
            }
            return item
          })
          this.newForm.lineName = this.queryLineShiftData.lineName
          this.newForm.departureStation = this.queryLineShiftData.departureStation
          this.newForm.destinationStation = this.queryLineShiftData.destinationStation
          this.newForm.logisticsId = this.queryLineShiftData.logisticsId
          this.newForm.lineType = this.queryLineShiftData.lineType
          this.newForm.queryDownstreamByLogistics = this.queryLineShiftData.destinationStationLogisticsId
          this.queryUpStations({logisticsId: this.queryLineShiftData.logisticsId})
          this.QueryLogisticsSelectRelation({logisticsIdInitiate: this.queryLineShiftData.logisticsId})
          this.QueryLogisticsSelectRelationSelf({logisticsIdInitiate: this.queryLineShiftData.logisticsId})

          this.queryDownStations({logisticsId: this.queryLineShiftData.destinationStationLogisticsId})
          if (this.queryLineShiftData.shiftFlag === 1) {
            this.shiftSwitch = true
            this.newForm.shiftFlag = 1
          } else {
            this.shiftSwitch = false
            this.newForm.shiftFlag = 0
          }
          console.log(this.queryLineShiftData)
          console.log(this.tableData)
        }
      })
    },
    // 保存
    newSave () {
      this.$refs.newForm.validate((valid) => {
        let tableValidateResult = this.validateShiftTable()
        // let tableValidateResult
        // if (this.shiftSwitch) {
        //   tableValidateResult = this.validateShiftTable()
        // } else {
        //   tableValidateResult = true
        // }
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
            departureStation: this.newForm.departureStation,
            destinationStation: this.newForm.destinationStation,
            shiftFlag: this.newForm.shiftFlag,
            lineName: this.newForm.lineName,
            lineId: this.id,
            logisticsId: this.newForm.logisticsId,
            lineType: this.newForm.lineType,
            shiftSaveParams: []
          }
          postData.shiftSaveParams = this.tableData.map(item => {
            if (postData.shiftFlag === 1) {
              return {
                departureTime: item.departureTime,
                driverLogisticsId: item.driverLogisticsId,
                serialNumber: item.serialNumber,
                driverId: item.driverId,
                shiftId: ''
              }
            } else {
              return {
                departureTime: '无班次',
                driverLogisticsId: item.driverLogisticsId,
                serialNumber: item.serialNumber,
                driverId: item.driverId,
                shiftId: ''
              }
            }
          })
          let obj = {}
          obj.lineName = this.newForm.lineName
          obj.lineId = this.id
          obj.logisticsId = this.newForm.logisticsId
          CustomerRouteAjax.validLineName(obj).then(response => {
            if (response.code === 200) {
              if (response.data) {
                this.$notify({
                  message: '该线路名称已存在！',
                  type: 'error'
                })
              } else {
                console.log(postData.lineId)
                if (postData.lineId === '') {
                  CustomerRouteAjax.Insert(postData).then(response => {
                    if (response.code === 200) {
                      this.$router.push({name: 'JointLineList'})
                      this.$notify({
                        message: '保存成功！',
                        type: 'success'
                      })
                    }
                  })
                } else {
                  CustomerRouteAjax.UpdateLine(postData).then(response => {
                    if (response.code === 200) {
                      this.$router.push({name: 'JointLineList'})
                      this.$notify({
                        message: '保存成功！',
                        type: 'success'
                      })
                    }
                  })
                }
              }
            }
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    clickSure () {
      this.tableData = []
      this.addPkLine()
      this.newForm.shiftFlag = 0
      this.shiftSwitch = false
      this.dialogVisible = false
    },
    clickCancel () {
      this.shiftSwitch = true
      this.dialogVisible = false
    },
    // 校验班次表格是否填写完整
    validateShiftTable () {
      let result = true
      if (this.shiftSwitch) {
        result = this.tableData.every((item, index) => {
          return item.departureTime !== '' && item.driverId !== ''
        })
      } else {
        result = this.tableData.every((item, index) => {
          return item.driverId !== ''
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
              if (item.departureTime === innerItem.departureTime && item.driverId === innerItem.driverId && item.pkCar === innerItem.pkCar) { // 完全重复的班次
                isRepeat = true
              }
            }
          })
        })
      }
      return isRepeat
    },
    goback () {
      this.$router.push({name: 'JointLineList'})
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.joint-line-card{
  display: flex;
  flex: 1;
  .card_main{
    padding: 30px 40px;
    .el-form{
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .btns{
        height: 32px;
        margin-bottom: 15px;
        .title {
          margin-left: 30px;
          font-size: 13px;
        }
      }
      .table-con{
        display: flex;
        flex: 1;
        i {
          font-size: 16px;
        }
        .driverWrap {
          margin-top: 2px;
        }
      }
      .bottom-btns{
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.joint-line-card{
  .timeWrap {
    .el-input {
      width: 70%;
    }
  }
  .visible-icon{
    visibility:hidden;
  }
  .el-switch.is-checked .el-switch__core{
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
