<template>
  <div class="route-card">
    <div class="public_card">
      <h3 class="card_header">自营路由配置</h3>
      <div class="card_main">
        <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="newRules" label-width="30px">
          <el-form-item label="上游起点:" prop="departureStationObj">
            <el-select v-model="form.departureStationObj" value-key="stationId" @change="addRow('pkStart', form.departureStationObj)" placeholder="请选择站点">
              <el-option
                v-for="(item, index) in departureStationOptions"
                :key="index"
                :label="item.stationName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="下游终点:" prop="logisticsId">
            <el-select v-model="form.logisticsId"  @change="logisticsChange" :disabled="logisticsDisabled" placeholder="请选择物流公司" clearable>
              <el-option
                v-for="(item, index) in logisticsOption"
                :key="index"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="下游终点:" prop="endStationId">
            <el-select v-model="form.endStationId" placeholder="请选择站点" clearable>
              <el-option
                v-for="(item, index) in departureStationOptions"
                :key="index"
                :label="item.stationName"
                :value="item.stationId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btns">
          <span style="margin-left: 10px; font-size: 13px; color: #606266;">路由配置</span>
        </div>
        <div class="table-con">
          <el-row>
            <el-col :span="24" :offset="1">
              <div style="display: flex; algin-item: center; color: #409eff;">
                <div class="content" v-if="!logisticsDisabled">{{form.departureStationObj.stationName}}</div>
                <div v-for="(item, index) in configList" :key="index" style="display: flex;">
                  <div v-if="item.checkLineId !== ''" class="content">
                    <span class="line"></span>
                    <span style="diaplay: inline-block;">{{item.rightStationName}}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in configList" :key="index">
            <el-col :span="1" :offset="1">
              <div class="configRow">
                <span v-if="index === 0">起点:</span>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="configRow">
                <span class="leftName">{{index === 0 ? form.departureStationObj.stationName : item.leftStationName}}</span>
                <el-select :disabled="(index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1)" v-model="item.checkLineId" placeholder="请选线路" @change="lineSelectChange(item, index)">
                  <el-option
                    v-for="(item, index) in item.lineList"
                    :key="index"
                    :label="item.lineName"
                    :value="item.lineId">
                  </el-option>
                </el-select>
                <span class="rightName"><span v-if="item.checkLineId !== ''" class="rightName">{{item.rightStationName}}</span></span>
                <span class="configRow">
                  <i v-if="(item.destinationStationId !== '' && item.checkLineId !== '' && (index === configList.length - 1) || (item.destinationStationId === '' && item.checkLineId === '' && configList.length === 0))" @click="addRow('add', item)" class="el-icon-circle-plus-outline"></i>
                  <!-- <span v-if="index === 0 || (item.destinationStationId !== '' && item.checkLineId !== '') || item.lineList.length === 0 ">&nbsp;</span> -->&nbsp;
                  <i v-if="index !== 0 && index === configList.length - 1" @click="reduceRow(index)" class="el-icon-remove-outline"></i>
                  </span>
              </div>
            </el-col>
            <!-- <el-col :span="2">
              <div class="configRow">
                <i v-if="(item.destinationStationId !== '' && item.checkLineId !== '' && (index === configList.length - 1) || (item.destinationStationId === '' && item.checkLineId === '' && configList.length === 0))" @click="addRow('add', item)" class="el-icon-circle-plus-outline"></i>
                <span v-if="index === 0 || (item.destinationStationId !== '' && item.checkLineId !== '') || item.lineList.length === 0 ">&nbsp;</span>
                <i v-if="index !== 0" @click="reduceRow(index)" class="el-icon-remove-outline"></i>
              </div>
            </el-col> -->
          </el-row>
        </div>
        <div class="bottom-btns">
          <el-button class="btn-main" @click="save()">保存</el-button>
          <el-button class="btn-main" @click="goback()">返回</el-button>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="dialogVisible"
      title="提示"
      :width="'486px'"
      mainText="您确定设置为无班次？"
      :closeClickModal="false"
      :dialogVisible="dialogVisible"
      @click-cancel="clickCancel"
      @click-sure="clickSure"
    />
    <v-dialog
      v-if="showErrorDialog"
      title="提示"
      :width="'486px'"
      mainText="下游终点和路由配置线路终点不一致，无法保存，请重新配置线路!"
      :closeClickModal="false"
      :showCancel="false"
      :dialogVisible="showErrorDialog"
      @click-cancel="showErrorDialog = false"
      @click-sure="showErrorDialog = false"
    />
    <v-dialog
      v-if="showErrorDialog1"
      title="提示"
      :width="'486px'"
      mainText="上游起点与下游终点不能相同，无法保存，请重新选择!"
      :closeClickModal="false"
      :showCancel="false"
      :dialogVisible="showErrorDialog1"
      @click-cancel="showErrorDialog1 = false"
      @click-sure="showErrorDialog1 = false"
    />
  </div>
</template>

<script>
import CustomerRouteAjax from '@/api/RouteManage/CustomerRouteMannge'
import RouterConfigAjax from '@/api/RouterConfig/RouterConfig'
import VDialog from '@/components/Dialog/Dialog'
let logisticsId
export default {
  name: 'CreatSelfRoute',
  data () {
    let validateDepartureStation = (rule, value, callback) => {
      if (value.stationId === '') {
        callback(new Error('请选择上游起点！'))
      } else {
        callback()
      }
    }
    return {
      showErrorDialog1: false,
      logisticsId: '', // 自营时查询接口需传物流公司id
      dialogVisible: '', // 班次禁用弹框
      showErrorDialog: false, // 站点是否闭环判断
      form: {
        departureStationObj: {stationId: '', stationName: ''}, // 上游站点id
        logisticsId: '', // 物流公司id
        endStationId: '' // 下游终点id
      },
      departureStationOptions: [], // 上游站点集合
      logisticsOption: [], // 物流公司集合
      destinationStationOption: [], // 下游站点集合
      configList: [], // 表格数据集合
      newRules: { // 表单验证
        departureStationObj: [
          { required: true, validator: validateDepartureStation, trigger: 'change' }
        ],
        logisticsId: [
          { required: true, message: '请选择物流公司！', trigger: 'change' }
        ],
        endStationId: [
          { required: true, message: '请选择终点！', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    downLogisticsId (newVal, oldVal) {
      if (newVal === '') {
        this.form.endStationId = ''
      }
    },
    upStationId (newVal, oldVal) {
      if (newVal === '') {
        this.form.logisticsId = ''
      }
    }
  },
  computed: {
    upStationId () {
      return this.form.departureStationObj
    },
    downLogisticsId () {
      return this.form.logisticsId
    },
    logisticsDisabled () { // 下游物流公司下拉框禁用判断
      return this.form.departureStationObj.stationId === ''
    },
    endStationDisabled () { // 下游站点下拉框禁用判断
      return this.form.logisticsId === ''
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo) {
      this.logisticsId = userInfo.logisticsId
    }
    this.routeFrom = this.$route.query.from
    this.init()
  },
  methods: {
    // clear (flag) {
    //   if (flag === 'logistics') {
    //     this.form.logisticsId = ''
    //   }
    // },
    init () {
      this.queryStations()
      this.getLogisticsList()
    },
    addRow (type, data) { // 增行
      if (type === 'pkStart') {
        this.configList = []
        let rowItemObj = {
          leftStationName: '',
          checkLineId: '',
          rightStationName: '',
          lineList: [],
          destinationStationId: ''
        }
        if (data !== '') {
          this.queryLineListByStationId(rowItemObj, data.stationId)
        }
      }
      if (type === 'add') {
        let rowItemObj = {
          leftStationName: data.rightStationName,
          checkLineId: '',
          rightStationName: '',
          lineList: [],
          destinationStationId: ''
        }
        if (data !== '') {
          this.queryLineListByStationId(rowItemObj, data.destinationStationId)
        }
      }
    },
    reduceRow (rowIndex) { // 减行
      this.configList = this.configList.filter((item, index) => {
        return rowIndex !== index
      })
    },
    queryLineListByStationId (rowItemObj, stationId) { // 根据站点查线路
      RouterConfigAjax.QueryLineListByStationId({stationId, routeConfigType: 1}).then(res => {
        if (res.code === 200) {
          rowItemObj.lineList = [...res.data]
          this.configList.push(rowItemObj)
        }
      })
    },
    lineSelectChange (lineItem, lineIndex) { // 根据线路查站点
      RouterConfigAjax.QueryStationByLineId({lineId: lineItem.checkLineId, logisticsId: this.logisticsId, routeConfigType: 1}).then(res => {
        if (res.code === 200) {
          this.configList.forEach((item, index) => {
            if (lineIndex === index) {
              item.lineList.forEach(lineItem => {
                if (lineItem.lineId === item.checkLineId) {
                  item.pkLineName = lineItem.lineName
                }
              })
              item.rightStationName = res.data.destinationStationName
              item.destinationStationId = res.data.destinationStation
            }
          })
        }
      })
    },
    queryStations () { // 查询上游站点
      CustomerRouteAjax.QueryStations({logisticsId: logisticsId}).then(response => {
        if (response.code === 200) {
          this.departureStationOptions = response.data
          if (this.$route.query.id) {
            // this.QueryLineShift(this.$route.query.id)
          }
        }
      })
    },
    getLogisticsList () { // 获取物流公司
      RouterConfigAjax.GetLogisticsList().then(response => {
        if (response.code === 200) {
          this.logisticsOption = response.data
        }
      })
    },
    queryStationByLogisticsId (logisticsId) { // 通过物流公司查站点
      RouterConfigAjax.SelectStationListByPkLogistics({logisticsId}).then(response => {
        if (response.code === 200) {
          this.destinationStationOption = response.data
        }
      })
    },
    logisticsChange (logisticsId) { // 物流公司变化
      this.queryStationByLogisticsId(logisticsId)
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        // let validateRouteConfigResult = this.validateRouteConfig()
        // if (!validateRouteConfigResult) { // 路由数据校验不通过
        //   this.$notify({
        //     message: '请完善路由配置信息再试！',
        //     type: 'error'
        //   })
        //   return false
        // }
        if (valid) {
          if (this.configList.length <= 1) { // 只有一条不能提交
            this.$notify({
              message: '路由线路重复，请重新编辑',
              type: 'error'
            })
          } else {
            if (this.form.departureStationObj.stationId === this.form.endStationId) { // 上下游站点不能相同
              this.showErrorDialog1 = true
            } else {
              if (this.configList[this.configList.length - 1].destinationStationId === this.form.endStationId) { // 下游站点和路由末级站点id相同,形成闭环
                let postData = {
                  pkStationStart: this.form.departureStationObj.stationId,
                  pkStationEnd: this.form.endStationId,
                  routeConfigType: 1,
                  someStationLineParams: []
                }
                console.log(this.configList)
                postData.someStationLineParams = this.configList.map(item => {
                  let obj = {
                    pkLineId: item.checkLineId, // 本行线路id
                    pkLineName: item.pkLineName, // 本行线路name
                    pkStationId: item.destinationStationId, // 本行下游站点id
                    pkStationName: item.rightStationName // 本行下游站点name
                  }
                  return obj
                })
                RouterConfigAjax.Insert(postData).then(response => {
                  if (response.code === 200) {
                    this.$notify({
                      message: '保存成功！',
                      type: 'success'
                    })
                    this.$router.push({name: 'SelfRouteList'})
                  }
                })
              } else {
                this.showErrorDialog = true
              }
            }
          }
          // if (this.configList[this.configList.length - 1].destinationStationId === this.form.endStationId) { // 下游站点和路由末级站点id相同,形成闭环
          //   let postData = {
          //     pkStationStart: this.form.departureStationObj.stationId,
          //     pkStationEnd: this.form.endStationId,
          //     routeConfigType: 1,
          //     someStationLineParams: []
          //   }
          //   console.log(this.configList)
          //   postData.someStationLineParams = this.configList.map(item => {
          //     let obj = {
          //       pkLineId: item.checkLineId, // 本行线路id
          //       pkLineName: item.pkLineName, // 本行线路name
          //       pkStationId: item.destinationStationId, // 本行下游站点id
          //       pkStationName: item.rightStationName // 本行下游站点name
          //     }
          //     return obj
          //   })
          //   RouterConfigAjax.Insert(postData).then(response => {
          //     if (response.code === 200) {
          //       this.$notify({
          //         message: '保存成功！',
          //         type: 'success'
          //       })
          //       this.$router.push({name: 'SelfRouteList'})
          //     }
          //   })
          // } else {
          //   this.showErrorDialog = true
          // }
        }
      })
    },
    // 校验路由配置否填写完整
    validateRouteConfig () {
      let result = true
      result = this.configList.every((item, index) => {
        if (item.lineList.length > 0) {
          return item.checkLineId !== ''
        }
      })
      return result
    },
    clickSure () { // 弹框确定
    },
    clickCancel () { // 弹框取消
    },
    goback () { // 返回
      this.$router.push({name: 'SelfRouteList'})
    }
  },
  components: {
    VDialog
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
    .el-form{
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .btns{
        height: 20px;
        line-height: 20px;
        margin-bottom: 15px;
        border-left: 3px solid #409eff;
        .title {
          margin-left: 30px;
          font-size: 13px;
        }
      }
      .table-con{
        width: 100%;
        height: 100%;
        .el-row{
          margin-bottom: 10px;
        }
        .content {
          min-height: 30px;
          line-height: 30px;
          display: flex;
          align-items: center;
          font-size: 13px;
          span {
            font-size: 13px;
          }
        }
        .configRow {
          min-height: 40px;
          line-height: 40px;
          font-size: 13px;
          .leftName {
            margin-right: 40px;
            width: 150px;
            display: inline-block;
            text-align: right
          }
          .rightName {
            margin-left: 40px;
            width: 150px;
            display: inline-block;
            text-align: left
          }
          span {
            font-size: 13px;
          }
          i {
            font-size: 20px;
          }
        }
        .line {
          width: 100px;
          height: 2px;
          display: inline-block;
          background-color: #409eff;
          margin: 0 10px;
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
.route-card{
  .public_card {
    width: 100%;
  }
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
