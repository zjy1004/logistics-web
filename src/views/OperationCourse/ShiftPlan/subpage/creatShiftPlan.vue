<template>
  <el-dialog :before-close="closeFormDialog" class="creatShiftPlan form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="线路类型:" prop="lineType">
          <el-select v-model="form.lineType" :disabled="isEdit" placeholder="请选择线路类型" @change="selectLineType(form.lineType)">
            <el-option
              v-for="(item, index) in lineTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路:" prop="pkLine">
          <el-select v-model="form.pkLine" :disabled="isEdit" placeholder="请选择线路" @change="changeLine(form.pkLine)">
            <el-option
              v-for="(item, index) in lineOptions"
              :key="index"
              :label="item.lineName"
              :value="item.lineId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次:" prop="departureTime">
          <!-- <el-time-select
            style="width:245px !important;"
            :picker-options="{
              start: '08:30',
              step: '00:30',
              end: '18:30'
            }"
            v-model="form.departureTime"
            placeholder="选择发车班次">
          </el-time-select> -->
          <el-input v-model="form.departureTime" :disabled="isEdit" maxlength="7"  placeholder="请输入班次"></el-input>
        </el-form-item>
        <el-form-item label="司机所属物流公司:" prop="driverLogisticsId" v-if="isPool">
          <el-select v-model="form.driverLogisticsId" :disabled="isEdit" @change="logisticsChange(form.driverLogisticsId)" placeholder="请选择司机所属物流公司">
            <el-option
              v-for="(item, index) in LogisticsList"
              :key="index"
              :label="item.logisticsName"
              :value="item.logisticsId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机:" prop="pkUser">
          <el-select v-model="form.pkUser" placeholder="请选择司机" @change="changeDriver(form.pkUser)">
            <el-option
              v-for="(item, index) in selfDriversOptionsArr"
              :key="index"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="phone" disabled  placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">保存</el-button>
        <el-button @click="clickCancel">返回</el-button>
    </div>
    </el-dialog>
</template>

<script>
import ShiftPlanAjax from '@/api/ShiftPlan/ShiftPlan'

export default {
  name: 'DialogForm',
  props: {
    width: {
      type: String,
      default: '40%'
    },
    title: {
      type: String,
      default: '标准弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    closeClickModal: {
      type: Boolean,
      default: true
    },
    lineNameOptionsArr: {
      type: Array,
      default: () => ([])
    },
    CarsOptionsArr: {
      type: Array,
      default: () => ([])
    },
    DriversOptionsArr: {
      type: Array,
      default: () => ([])
    },
    addFlagProps: {
      type: String,
      default: ''
    },
    editObjProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      logisticsId: '', // 物流公司id
      isPool: false,
      isEdit: false, // 是否是编辑态
      phone: '',
      form: {
        lineType: '', // 线路类型
        pkUser: '', // 司机
        pkLine: '', // 所属线路
        departureTime: '', // 班次日期
        driverLogisticsId: '' // 司机所属物流公司ID
      },
      rules: {
        lineType: [{ required: true, message: '请选择线路类型', trigger: 'change' }],
        pkLine: [{ required: true, message: '请选择线路', trigger: 'change' }],
        departureTime: [{ required: true, message: '请输入班次', trigger: 'blur' }],
        pkUser: [{ required: true, message: '请选择司机', trigger: 'change' }]
      },
      lineTypeOptions: [{id: 1, name: '站点派车(客户线路)'}, {id: 3, name: '自营同城调度'}, {id: 4, name: '自营城际调度'}, {id: 5, name: '联营同城调度'}, {id: 6, name: '联营城际调度'}],
      lineOptions: [],
      LogisticsList: [], // 所属物流公司
      dialogVisibleSelf: this.dialogVisible,
      // selfDriversOptionsArr: this.DriversOptionsArr
      selfDriversOptionsArr: []
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo) {
      this.logisticsId = userInfo.logisticsId
    }
    if (this.addFlagProps === 'edit') {
      this.isEdit = true
      this.form.lineType = this.editObjProps.lineType
      this.form.pkLine = this.editObjProps.lineId
      this.form.pkUser = Number(this.editObjProps.userId)
      this.form.departureTime = this.editObjProps.departureTime
      this.phone = this.editObjProps.phone
      this.form.driverLogisticsId = this.editObjProps.driverLogisticsId
      this.selectLineType(this.form.lineType, 'edit')
      this.queryDriverList(this.form.lineType)
    } else {
      this.isEdit = false
    }
  },
  methods: {
    queryDriverList (val) { // 司机列表
      ShiftPlanAjax.queryDriverList({lineType: val}).then(res => {
        if (res.code === 200) {
          this.selfDriversOptionsArr = res.data
        }
      })
    },
    selectLineType (lineType, type) {
      ShiftPlanAjax.queryLineSelectByLogisticsIdLineType({logisticsId: this.logisticsId, lineType}).then(res => {
        if (res.code === 200) {
          this.lineOptions = res.data
          if (type === 'edit') {
            this.changeLine(this.form.pkLine, type)
          } else {
            this.form.pkLine = ''
            this.isPool = false
            this.form.driverLogisticsId = ''
          }
        }
      })
      this.queryDriverList(this.form.lineType)
    },
    changeLine (val, type) {
      this.lineOptions.forEach(item => {
        if (item.lineId === val) {
          if (item.lineType === 5 || item.lineType === 6) {
            this.isPool = true
            if (type !== 'edit') { // 新建班次
              this.form.driverLogisticsId = ''
              this.logisticsChange(item.logisticsId)
            } else {
              this.logisticsChange(item.logisticsId, 'edit')
            }
            this.QueryLogisticsSelectRelationSelf({logisticsIdInitiate: item.logisticsId})
          } else {
            this.isPool = false
            this.form.driverLogisticsId = item.logisticsId
          }
        }
      })
    },
    logisticsChange (logisticsId, type) {
      ShiftPlanAjax.queryDriverList({logisticsId}).then(res => {
        if (res.code === 200) {
          this.selfDriversOptionsArr = res.data
          if (type !== 'edit') {
            this.form.pkUser = ''
          }
        }
      })
    },
    changeDriver (row) {
      this.selfDriversOptionsArr.forEach(element => {
        if (row === element.userId) {
          this.phone = element.phone
        }
      })
    },
    QueryLogisticsSelectRelationSelf (val) { // 查询发起方联营物流公司的所有关联物流公司和本身下拉框选择
      ShiftPlanAjax.QueryLogisticsSelectRelationSelf(val).then(res => {
        if (res.code === 200) {
          this.LogisticsList = res.data
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.addFlagProps === 'edit') {
            this.form.shiftId = this.editObjProps.shiftId
          }
          this.$emit('click-sure', this.form, this.addFlagProps)
        }
      })
    },
    closeFormDialog (done) {
      this.$emit('click-cancel', 'cancel')
      done()
    }
  }
}
</script>

<style lang="less">
.creatShiftPlan {
  .el-date-editor{
      width: 245px;
  }
  .el-dialog{
    .el-dialog__body{
      .el-form-item{
        .el-form-item__label{
          width: 120px!important;
        }
      }
    }
  }
}
</style>
