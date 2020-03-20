<template>
  <el-dialog :before-close="closeFormDialog" class="form-dialog" :close-on-click-modal="closeClickModal" :width="width" :title="title" :visible.sync="dialogVisibleSelf">
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="username-tbody" label-width="120px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input style="width: 245px;" v-model="form.carNumber" @input="nameInput" clearable></el-input>
        </el-form-item>
        <el-form-item label="车辆类型:" prop="carType">
          <el-select v-model="form.carType" placeholder="全部" clearable>
            <el-option
              v-for="(item, index) in carTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属物流公司:" prop="pkLogistics">
          <el-select v-model="form.pkLogistics" placeholder="全部">
            <el-option
              v-for="(item, index) in logisticsListArr"
              :key="index"
              :label="item.logisticsName"
              :value="item.logisticsId">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn-main" @click="clickSure('form')">保存</el-button>
        <el-button @click="clickCancel">返回</el-button>
    </div>
    </el-dialog>
</template>

<script>
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
    logisticsListArr: {
      type: Array,
      default: () => ([])
    },
    editInfo: {
      type: Object,
      default: () => ({})
    },
    typeFlag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        carNumber: '', // 车牌号
        carType: '' // 车辆类型
        // pkLogistics: '' // 所属物流公司
      },
      options: [{name: '启用', id: 1}, {name: '禁用', id: 0}],
      carTypeOptions: [
        {
          id: 1,
          name: '小型面包车'
        },
        {
          id: 2,
          name: '金杯'
        },
        {
          id: 3,
          name: '厢式货车'
        },
        {
          id: 4,
          name: '其他'
        }
      ],
      rules: {
        carNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        carType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }]
      },
      dialogVisibleSelf: this.dialogVisible
    }
  },
  created () {
    if (this.typeFlag === 'update') {
      this.form.carNumber = this.editInfo.carNumber
      this.form.carType = Number(this.editInfo.carType)
      this.returnPkLogistics()
    }
  },
  methods: {
    nameInput (val) {
      let nameVal = val.substring(0, 128)
      this.form.carNumber = nameVal
    },
    returnPkLogistics () { // 所属物流公司取ID
      this.logisticsListArr.forEach(element => {
        if (this.editInfo.logisticsName === element.logisticsName) {
          this.form.pkLogistics = element.logisticsId
        }
      })
    },
    clickCancel () {
      this.$emit('click-cancel', 'cancel')
    },
    clickSure (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.typeFlag === 'add') {
            this.$emit('click-sure', this.form, 'add')
          }
          if (this.typeFlag === 'update') {
            let obj = {}
            obj.cid = this.editInfo.id
            obj.carNumber = this.form.carNumber
            obj.carType = this.form.carType
            obj.pkLogistics = this.form.pkLogistics
            this.$emit('click-sure', obj, 'update')
          }
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
