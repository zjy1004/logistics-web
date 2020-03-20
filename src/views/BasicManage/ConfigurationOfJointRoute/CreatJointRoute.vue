<template>
  <div class="route-card">
    <div class="public_card">
      <h3 class="card_header">联营路由配置</h3>
      <div class="card_main">
        <el-form :inline="true" ref="form" label-position="right" :model="form" :rules="newRules" label-width="30px">
          <el-form-item label="路由归属:" prop="joinLogisticsObj">
             <el-select v-model="form.joinLogisticsObj" value-key="logisticsId"  @change="logisticsChange('allLogistics')" placeholder="请选择物流公司">
              <el-option
                v-for="(item, index) in joinLogisticsOption"
                :key="index"
                :label="item.logisticsName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上游起点:" prop="departureStationObj">
            <el-select v-model="form.departureStationObj" value-key="stationId" @clear="clear()" @change="addRow('pkStart', form.departureStationObj)" placeholder="请选择站点">
              <el-option
                v-for="(item, index) in departureStationOptions"
                :key="index"
                :label="item.stationName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下游终点:" prop="relativeLogisticsId">
            <el-select v-model="form.relativeLogisticsId"  @change="logisticsChange('logisticsRelative')" :disabled="logisticsDisabled" placeholder="请选择物流公司" clearable>
              <el-option
                v-for="(item, index) in logisticsOption"
                :key="index"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="endStationId">
            <el-select v-model="form.endStationId" :disabled="endStationDisabled" placeholder="请选择站点" clearable>
              <el-option
                v-for="(item, index) in destinationStationOption"
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
          <el-row v-for="(item, index) in configList" :key="index">
            <el-col :span="1" :offset="1">
              <div class="configRow">
                <span v-if="index === 0">起点:</span>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="configRow">
                <span class="leftName">{{index === 0 ? form.joinLogisticsObj.logisticsName : item.leftLogisticsName}}-{{index === 0 ? form.departureStationObj.stationName : item.leftStationName}}</span>
                <el-select :disabled="(index !== 0 && index !== configList.length - 1 || index === 0 && configList.length > 1)" v-model="item.checkLineId" placeholder="请选线路" @change="lineSelectChange(item, index)">
                  <el-option
                    v-for="(item, index) in item.lineList"
                    :key="index"
                    :label="item.lineName"
                    :value="item.lineId">
                  </el-option>
                </el-select>
                <span class="rightName"><span v-if="item.checkLineId !== ''" class="rightName">{{item.rightLogisticsName}}-{{item.rightStationName}}</span></span>
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
  </div>
</template>

<script>
import JoinRouterConfigAjax from '@/api/RouterConfig/JoinRouteConfig'
import VDialog from '@/components/Dialog/Dialog'
export default {
  name: 'CreatJointRoute',
  data () {
    let validateDepartureStation = (rule, value, callback) => {
      if (value.stationId === '') {
        callback(new Error('请选择上游起点！'))
      } else {
        callback()
      }
    }
    let validateJoinLogistics = (rule, value, callback) => {
      if (value.logisticsId === '') {
        callback(new Error('请选择物流公司！'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: '',
      showErrorDialog: false, // 判断终点匹配弹框
      form: {
        joinLogisticsObj: {logisticsId: '', logisticsName: ''}, // 联营物流公司
        departureStationObj: {stationId: '', stationName: ''}, // 上游站点
        relativeLogisticsId: '', // 下游物流公司id
        endStationId: '' // 下游站点id
      },
      departureStationOptions: [], // 上游站点集合
      joinLogisticsOption: [], // 联营物流公司集合
      logisticsOption: [], // 下游物流公司集合
      destinationStationOption: [], // 下游站点集合
      configList: [], // 表格数据集合
      newRules: { // 表单验证
        joinLogisticsObj: [
          { required: true, validator: validateJoinLogistics, trigger: 'change' }
        ],
        departureStationObj: [
          { required: true, validator: validateDepartureStation, trigger: 'change' }
        ],
        relativeLogisticsId: [
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
    }
  },
  computed: {
    downLogisticsId () {
      return this.form.relativeLogisticsId
    },
    logisticsDisabled () { // 下游物流公司下拉框禁用判断
      return this.form.joinLogisticsObj.logisticsId === ''
    },
    endStationDisabled () { // 下游站点下拉框禁用判断
      return this.form.relativeLogisticsId === ''
    }
  },
  created () {
    this.routeFrom = this.$route.query.from
    this.init()
  },
  methods: {
    init () {
      // this.queryStations()
      // this.getLogisticsList()
      this.queryLogisticsSelectInitiate()
    },
    clear () {
    },
    addRow (type, data) { // 增行
      if (type === 'pkStart') {
        this.configList = []
        let rowItemObj = {
          leftStationName: '',
          checkLineId: '',
          rightStationName: '',
          leftLogisticsName: '',
          rightLogisticsName: '',
          lineList: [],
          destinationStationId: ''
        }
        if (data !== '') {
          let logisticsId = this.form.joinLogisticsObj.logisticsId
          this.queryLineListByStationId(rowItemObj, data.stationId, logisticsId)
        }
      }
      if (type === 'add') {
        let rowItemObj = {
          leftStationName: data.rightStationName,
          leftLogisticsName: data.rightLogisticsName,
          rightLogisticsName: '',
          checkLineId: '',
          rightStationName: '',
          lineList: [],
          destinationStationId: ''
        }
        if (data !== '') {
          this.queryLineListByStationId(rowItemObj, data.destinationStationId, data.logisticsId)
        }
      }
    },
    reduceRow (rowIndex) { // 减行
      this.configList = this.configList.filter((item, index) => {
        return rowIndex !== index
      })
    },
    queryLogisticsSelectInitiate () { // 获取所有联营物流公司
      JoinRouterConfigAjax.QueryLogisticsSelectInitiate().then(res => {
        if (res.code === 200) {
          this.joinLogisticsOption = res.data
        }
      })
    },
    queryLogisticsSelectRelation (id) { // 查询发起方联营物流公司的所有关联物流公司下拉框选择
      JoinRouterConfigAjax.QueryLogisticsSelectRelation({logisticsIdInitiate: id}).then(res => {
        if (res.code === 200) {
          this.logisticsOption = res.data
        }
      })
    },
    queryStationByLogisticsId (id, flag) { // 通过物流公司查站点
      JoinRouterConfigAjax.SelectStationListByPkLogistics({logisticsId: id}).then(response => {
        if (response.code === 200) {
          if (flag === 'allLogistics') {
            this.departureStationOptions = response.data
          }
          if (flag === 'logisticsRelative') {
            this.destinationStationOption = response.data
          }
        }
      })
    },
    logisticsChange (flag) { // 物流公司变化
      if (flag === 'allLogistics') {
        this.form.departureStationObj = {}
        this.configList = []
        this.form.relativeLogisticsId = ''
        let logisticsId = this.form.joinLogisticsObj.logisticsId
        this.queryStationByLogisticsId(logisticsId, flag)
        this.queryLogisticsSelectRelation(logisticsId)
      }
      if (flag === 'logisticsRelative') {
        this.form.endStationId = ''
        let logisticsId = this.form.relativeLogisticsId
        this.queryStationByLogisticsId(logisticsId, flag)
      }
    },
    queryLineListByStationId (rowItemObj, stationId, logisticsId) { // 根据站点查线路
      // let logisticsId = this.form.joinLogisticsObj.logisticsId
      JoinRouterConfigAjax.QueryLineListByStationId({stationId, routeConfigType: 2, logisticsId: logisticsId}).then(res => {
        if (res.code === 200) {
          rowItemObj.lineList = [...res.data]
          this.configList.push(rowItemObj)
        }
      })
    },
    lineSelectChange (lineItem, lineIndex) { // 根据线路查站点
      JoinRouterConfigAjax.QueryStationByLineId({lineId: lineItem.checkLineId, routeConfigType: 2, logisticsId: ''}).then(res => {
        if (res.code === 200) {
          this.configList.forEach((item, index) => {
            if (lineIndex === index) {
              item.lineList.forEach(lineItem => {
                if (lineItem.lineId === item.checkLineId) {
                  item.pkLineName = lineItem.lineName
                }
              })
              item.logisticsId = res.data.logisticsId
              item.rightStationName = res.data.stationName
              item.rightLogisticsName = res.data.logisticsName
              item.destinationStationId = res.data.stationId
            }
          })
        }
      })
    },
    getLogisticsList () { // 获取物流公司
      JoinRouterConfigAjax.GetLogisticsList().then(response => {
        if (response.code === 200) {
          this.logisticsOption = response.data
        }
      })
    },
    save () { // 保存
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.configList.length < 2) {
            this.$notify({
              message: '路由线路重复，请重新编辑',
              type: 'error'
            })
          } else {
            if (this.configList[this.configList.length - 1].destinationStationId === this.form.endStationId) { // 下游站点和路由末级站点id相同,形成闭环
              let postData = {
                pkStationStart: this.form.departureStationObj.stationId,
                pkStationEnd: this.form.endStationId,
                pkStationStartLogisticsId: this.form.joinLogisticsObj.logisticsId,
                routeConfigType: 2,
                someStationLineParams: []
              }
              console.log(this.configList)
              postData.someStationLineParams = this.configList.map(item => {
                let obj = {
                  pkLineId: item.checkLineId, // 本行线路id
                  pkLineName: item.pkLineName, // 本行线路name
                  pkStationId: item.destinationStationId, // 本行下游站点id
                  pkStationName: item.rightStationName, // 本行下游站点name
                  pkLogisticsId: item.logisticsId // 本行下游站点物流公司id
                }
                return obj
              })
              JoinRouterConfigAjax.Insert(postData).then(response => {
                if (response.code === 200) {
                  this.$notify({
                    message: '保存成功！',
                    type: 'success'
                  })
                  this.$router.push({name: 'ConfigurationOfJointRoute'})
                }
              })
            } else {
              this.showErrorDialog = true
            }
          }
          // if (this.configList[this.configList.length - 1].destinationStationId === this.form.endStationId) { // 下游站点和路由末级站点id相同,形成闭环
          //   let postData = {
          //     pkStationStart: this.form.departureStationObj.stationId,
          //     pkStationEnd: this.form.endStationId,
          //     pkStationStartLogisticsId: this.form.joinLogisticsObj.logisticsId,
          //     routeConfigType: 2,
          //     someStationLineParams: []
          //   }
          //   console.log(this.configList)
          //   postData.someStationLineParams = this.configList.map(item => {
          //     let obj = {
          //       pkLineId: item.checkLineId, // 本行线路id
          //       pkLineName: item.pkLineName, // 本行线路name
          //       pkStationId: item.destinationStationId, // 本行下游站点id
          //       pkStationName: item.rightStationName, // 本行下游站点name
          //       pkLogisticsId: item.logisticsId // 本行下游站点物流公司id
          //     }
          //     return obj
          //   })
          //   JoinRouterConfigAjax.Insert(postData).then(response => {
          //     if (response.code === 200) {
          //       this.$notify({
          //         message: '保存成功！',
          //         type: 'success'
          //       })
          //       this.$router.push({name: 'ConfigurationOfJointRoute'})
          //     }
          //   })
          // } else {
          //   this.showErrorDialog = true
          // }
        }
      })
    },
    clickSure () {
    },
    clickCancel () {
    },
    goback () {
      this.$router.push({name: 'ConfigurationOfJointRoute'})
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
        // display: flex;
        // flex: 1;
        // padding-left: 50px;
        .el-row{
          margin-bottom: 10px;
        }
        .content {
          min-height: 30px;
          line-height: 30px;
          display: flex;
          align-items: center;
          font-size: 13px;
        }
        .configRow {
          min-height: 40px;
          line-height: 40px;
          font-size: 13px;
          span {
            font-size: 13px;
          }
          .leftName {
            margin-right: 40px;
            width: 250px;
            display: inline-block;
            text-align: right
          }
          .rightName {
            margin-left: 40px;
            width: 250px;
            display: inline-block;
            text-align: left
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
