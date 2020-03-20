<template>
  <div class="proprietary-line-card">
    <div class="public_card">
      <h3 class="card_header">自营线路</h3>
      <div class="card_main">
        <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="newRules" label-width="30px">
          <el-form-item label="线路名称:" prop="lineName">
            <el-input v-model="form.lineName" placeholder="请输入路线名称" maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item label="上游站点:" prop="departureStation">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="form.departureStation" placeholder="请选择上游站点" clearable>
              <el-option
                v-for="(item, index) in stationOptions"
                :key="index"
                :label="item.stationName"
                :value="item.stationId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下游站点:" prop="destinationStation">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="form.destinationStation" placeholder="请选择下游站点" clearable>
              <el-option
                v-for="(item, index) in stationOptions"
                :key="index"
                :label="item.stationName"
                :value="item.stationId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送范围:" prop="lineType">
            <el-select :disabled="this.routeFrom === 'edit'" v-model="form.lineType" @change="selectLineType(form.lineType)" filterable placeholder="请选择配送范围" clearable>
              <el-option
                v-for="(item, index) in lineTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
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
              prop="driverId"
              label="司机">
              <template slot-scope="scope" >
                <el-select v-model="scope.row.driverId" placeholder="请选择司机">
                  <el-option
                    v-for="item in driverList"
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
          <el-button class="btn-main" @click="goback()">返回</el-button>
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
      @click-cancel="clickCancel('enAbleShift')"
      @click-sure="clickSure('enAbleShift')"
    />
    <v-dialog
      v-if="dialogDelShow"
      title="提示"
      :width="'486px'"
      mainText="是否确认删除班次信息"
      :closeClickModal="false"
      :dialogVisible="dialogDelShow"
      @click-cancel="clickCancel('del')"
      @click-sure="clickSure('del')"
    />
  </div>
</template>

<script>
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'ProprietaryLineCard',
  data () {
    return {
      id: '',
      dialogDelShow: false,
      shiftSwitch: true,
      driverLogisticsId: '', // userinfo物流公司id
      routeFrom: '',
      dialogVisible: false,
      form: {
        lineName: '',
        shiftFlag: '',
        departureStation: '', // 上游站点
        destinationStation: '', // 下有站点
        lineType: '' // 配送范围
      },
      newRules: {
        lineName: [
          { required: true, message: '请输入线路名称!', trigger: 'blur' }
        ],
        departureStation: [
          { required: true, message: '请选择上游站点！', trigger: 'change' }
        ],
        destinationStation: [
          { required: true, message: '请选择下游站点！', trigger: 'change' }
        ],
        lineType: [
          { required: true, message: '请选择配送范围！', trigger: 'change' }
        ]
      },
      stationOptions: [], // 上游、下游站点集合
      lineTypeOptions: [{id: 3, name: '自营同城调度'}, {id: 4, name: '自营城际调度'}], // 配送范围
      multipleSelection: [],
      driverList: [],
      defaultTableRow: {departureTime: '', driverId: '', logisticsId: this.driverLogisticsId, shiftId: ''},
      tableData: []
    }
  },
  created () {
    let userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      this.driverLogisticsId = JSON.parse(userInfo).logisticsId
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.QueryLineShift(this.id)
    } else {
      this.id = ''
    }
    this.routeFrom = this.$route.query.from
    if (this.routeFrom === 'edit') {
      this.queryDrivers(this.$route.query.lineType)
    }
    this.init()
  },
  methods: {
    init () {
      this.queryStations()
      // this.queryDrivers()
      this.form.shiftFlag = 1
      this.addPkLine()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 配送范围变化
    selectLineType (lineType, type) {
      this.queryDrivers(this.form.lineType)
    },
    // 班次切换
    switchChange (val) {
      if (val) {
        this.tableData = []
        this.addPkLine()
        this.form.shiftFlag = 1
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
      if (this.tableData.length > 0) {
        this.dialogDelShow = true
      }
    },
    // 重新为表格赋值
    resetTable () {
      this.tableData = this.tableData.map((item, index) => {
        item.serialNumber = index + 1
        return item
      })
    },
    // 添加班次
    addPkLine () {
      let newObj = {departureTime: '', driverId: '', driverLogisticsId: this.driverLogisticsId, shiftId: '', serialNumber: ''}
      newObj.serialNumber = this.tableData.length
      this.tableData.push(newObj)
      this.resetTable()
    },
    // 查询上游站点及下游站点下拉框数据
    queryStations () {
      CustomerRouteAjax.QueryStations({logisticsId: this.driverLogisticsId}).then(response => {
        if (response.code === 200) {
          this.stationOptions = response.data
        }
      })
    },
    // 查询司机
    queryDrivers (val) {
      CustomerRouteAjax.QueryDrivers({logisticsId: this.driverLogisticsId, lineType: val}).then(response => {
        if (response.code === 200) {
          this.driverList = response.data
        }
      })
    },
    // 修改查看 获取
    QueryLineShift (val) {
      CustomerRouteAjax.QueryLineList({lineId: val}).then(response => {
        if (response.code === 200) {
          let data = response.data.list[0]
          this.tableData = data.lineShiftListVoList
          this.id = data.lineId
          this.form.lineName = data.lineName
          this.form.departureStation = data.departureStation
          this.form.destinationStation = data.destinationStation
          this.form.lineType = data.lineType
          if (data.shiftFlag === 1) {
            this.shiftSwitch = true
            this.form.shiftFlag = 1
          } else {
            this.shiftSwitch = false
            this.form.shiftFlag = 0
          }
        }
      })
    },
    formData () {
      let postData = {
        departureStation: this.form.departureStation, // 上游站点
        destinationStation: this.form.destinationStation, // 下游站点
        lineId: this.id, // 线路id
        lineName: this.form.lineName, // 线路名称
        lineType: this.form.lineType, // 线路类型 (1站点派车,2站点自取,3自营同城调度,4自营城际调度,5联营同城调度,6联营城际调度)
        logisticsId: this.driverLogisticsId, // 物流公司id
        shiftFlag: this.form.shiftFlag, // 线路班次标识（0无班次，1有班次）
        shiftSaveParams: [] // 线路班次信息
      }
      postData.shiftSaveParams = this.tableData.map(item => {
        if (postData.shiftFlag === 1) {
          return {
            departureTime: item.departureTime,
            driverId: item.driverId,
            driverLogisticsId: item.driverLogisticsId,
            serialNumber: item.serialNumber,
            shiftId: item.shiftId
          }
        } else {
          return {
            departureTime: '无班次',
            driverLogisticsId: this.driverLogisticsId,
            serialNumber: item.serialNumber,
            driverId: item.driverId,
            shiftId: item.shiftId
          }
        }
      })
      return postData
    },
    insert (postData) {
      CustomerRouteAjax.Insert(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '保存成功！',
            type: 'success'
          })
          this.$router.push({name: 'ProprietaryLineList'})
        }
      })
    },
    updateData (postData) {
      CustomerRouteAjax.UpdateLine(postData).then(response => {
        if (response.code === 200) {
          this.$notify({
            message: '修改成功！',
            type: 'success'
          })
          this.$router.push({name: 'ProprietaryLineList'})
        }
      })
    },
    // 保存
    newSave () {
      this.$refs.form.validate((valid) => {
        let tableValidateResult = this.validateShiftTable()
        if (!tableValidateResult) { // 表格数据校验不通过
          this.$notify({
            message: '请完善班次表格数据再试！',
            type: 'error'
          })
          return false
        }
        if (valid) {
          let postData = this.formData()
          CustomerRouteAjax.validLineName({lineId: this.id, lineName: this.form.lineName}).then(response => {
            if (response.code === 200) {
              if (response.data) {
                this.$notify({
                  message: '该线路名称已存在！',
                  type: 'error'
                })
              } else {
                if (this.routeFrom === 'add') {
                  if (postData.departureStation === postData.destinationStation) {
                    this.$notify({
                      message: '上游站点与下游站点重复，请重新选择',
                      type: 'error'
                    })
                  } else {
                    this.insert(postData)
                  }
                } else if (this.routeFrom === 'edit') {
                  this.updateData(postData)
                }
              }
            }
          })
        }
      })
    },
    clickSure (flag) {
      if (flag === 'enAbleShift') {
        this.tableData = []
        this.addPkLine()
        this.form.shiftFlag = 0
        this.shiftSwitch = false
        this.dialogVisible = false
      }
      if (flag === 'del') {
        this.dialogDelShow = false
        if (this.multipleSelection.length < 1) {
          this.$notify({
            message: '未选择班次记录，无法进行删除操作',
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
      }
    },
    clickCancel (flag) {
      if (flag === 'enAbleShift') {
        this.shiftSwitch = true
        this.dialogVisible = false
      }
      if (flag === 'del') {
        this.dialogDelShow = false
      }
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
      // result = this.tableData.every((item, index) => {
      //   return item.departureTime !== '' && item.driverId !== ''
      // })
      return result
    },
    goback () {
      this.$router.push({name: 'ProprietaryLineList'})
    }
  },
  components: {
    VDialog
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.proprietary-line-card{
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
.proprietary-line-card{
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
