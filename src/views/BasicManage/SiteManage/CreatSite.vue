<template>
  <div class="creatSite public_card">
  <h3 class="card_header">站点管理</h3>
    <div class="card_main">
      <div class="card_con">
        <div class="creatSite_main">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="132px" :disabled="pageDisabled">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="站点名称:" prop="stationName">
                  <el-input v-model="form.stationName" maxlength="10" placeholder="请输入站点名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="站点种类:" prop="stationType">
                  <el-select v-model="form.stationType" placeholder="请选择站点种类" clearable>
                    <el-option
                      v-for="(item, index) in stationTypeOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <!-- <el-form-item label="所属物流公司:" prop="pkLogistics">
                  <el-select v-model="form.pkLogistics" placeholder="请选择所属物流公司" clearable>
                    <el-option
                      v-for="(item, index) in logisticsList"
                      :key="index"
                      :label="item.logisticsName"
                      :value="item.logisticsId">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </el-col>
            </el-row>

          <el-row>
            <el-col :span="22" :offset="1">
            <el-form-item label="经营地址:" required>
              <el-form-item label="" prop="province">
                <el-select v-model="form.province" placeholder="请选择省" clearable>
                  <el-option
                    v-for="(item, index) in this.areaOBj.areaPList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item>
              （省）
              <el-form-item label="" prop="city">
                <el-select v-model="form.city" placeholder="请选择市" clearable>
                  <el-option
                    v-for="(item, index) in this.areaOBj.areaCList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item>
              （市）
              <el-form-item label="" prop="area">
                <el-select v-model="form.area" placeholder="请选择区" clearable>
                  <el-option
                    v-for="(item, index) in this.areaOBj.areaQList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item>
              （区）
              <el-form-item label="" prop="town">
                <el-select v-model="form.town" placeholder="请选择乡镇/街道" clearable>
                  <el-option
                    v-for="(item, index) in this.areaOBj.areaTList"
                    :key="index"
                    :label="item.areaName"
                    :value="item.areaCode">
                  </el-option>
                </el-select>
              </el-form-item>
              （乡镇/街道）
            </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12" :offset="3">
              <el-form-item label="" prop="areaInfo">
                <el-input class="addressDetail" v-model="form.areaInfo" placeholder="请输入详细经营地址（如街道门牌号）" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
        </div>
      </div>

      <div class="card_btn">
        <div class="search-btn-con">
        <el-button :disabled="pageDisabled" class="btn-main" @click="save('form')">保存</el-button>
        <el-button class="btn-main" @click="goBack()">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CarManageAjax from '@/api/CarManage/CarManage'
import SiteManageAjax from '@/api/SiteManage/SiteManage'
export default {
  data () {
    // let validateAddress = (rule, value, callback) => {
    //   if (value.provinceCode === '') {
    //     callback(new Error('请选择省！'))
    //   } else if (value.cityCode === '') {
    //     callback(new Error('请选择市！'))
    //   } else if (value.areaCode === '') {
    //     callback(new Error('请选择区/县！'))
    //   } else if (value.townCode === '') {
    //     if (!this.townNullFlag) {
    //       callback(new Error('请选择乡镇/街道！'))
    //     }
    //   } else if (value.areaInfo === '') {
    //     callback(new Error('请输入详细经营地址！'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      pageDisabled: false,
      form: {
        stationName: '', // 站点名称
        stationType: '', // 站点类型
        pkLogistics: '', // 所属物流公司
        addressSaveData: {
          addressId: '',
          areaCode: '',
          areaInfo: '',
          cityCode: '',
          provinceCode: '',
          townCode: ''
        },
        province: '',
        city: '',
        area: '',
        town: '',
        areaInfo: ''
      },
      areaOBj: {
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [], // 区
        areaTList: [] // 乡
      },
      logisticsList: [], // 所属物流公司
      stationTypeOptions: [ // 站点种类
        {
          id: 1,
          name: '服务站'
        },
        {
          id: 2,
          name: '分拨点'
        },
        {
          id: 3,
          name: '驿站'
        }
      ],
      updateShowArea: {
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        townCode: ''
      },
      updateObj: {

      },
      rules: {
        stationName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
        stationType: [{ required: true, message: '请选择站点种类', trigger: 'change' }],
        pkLogistics: [{ required: true, message: '请选择所属物流公司', trigger: 'change' }],
        // addressSaveData: [{ required: true, validator: validateAddress, trigger: 'change' || 'blur' }],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        area: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        town: [{ required: true, message: '请选择乡镇/街道', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址（如街道门牌号）', trigger: 'blur' }]
      }
    }
  },
  computed: {
    provinceCode () {
      return this.form.province
    },
    cityCode () {
      return this.form.city
    },
    areaCode () {
      return this.form.area
    },
    townCode () {
      return this.form.town
    },
    areaInfo () {
      return this.form.areaInfo
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.provinceCode = newVal
        this.areaOBj.areaPList.forEach(item => {
          if (this.form.addressSaveData.cityCode !== item) {
            this.form.city = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.cityCode = newVal
        this.areaOBj.areaCList.forEach(item => {
          if (this.form.addressSaveData.areaCode !== item) {
            this.form.area = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaCode = newVal
        this.areaOBj.areaQList.forEach(item => {
          if (this.form.addressSaveData.townCode !== item) {
            this.form.town = ''
          } else {

          }
        })
        this.QueryAreaList({areaParentCode: newVal}, 'town')
      }
    },
    townCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.townCode = newVal
      }
    },
    areaInfo (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaInfo = newVal
      }
    }
  },
  created () {
    this.QueryLogisticsList()
    // 查看详情或修改
    let type = this.$route.query.type
    if (type === 'check') {
      this.pageDisabled = true
    } else {
      this.pageDisabled = false
    }
    let id = this.$route.query.id
    if (id !== undefined && id !== '') {
      this.updateInit(id)
    } else {
      let obj = {}
      obj.areaParentCode = 0
      this.QueryAreaList(obj, 'province')
    }
  },
  methods: {
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        await this.updateCrmLogisticsStationShow({id: id})
        this.QueryAreaList({areaParentCode: 0}, 'province')
        this.QueryAreaList({areaParentCode: this.updateShowArea.provinceCode}, 'city')
        this.QueryAreaList({areaParentCode: this.updateShowArea.cityCode}, 'area')
        this.QueryAreaList({areaParentCode: this.updateShowArea.areaCode}, 'town')
      }
    },
    save (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let id = this.$route.query.id
          if (id !== '' && id !== undefined) { // 修改
            this.form.stationId = id
            let obj = {}
            obj = Object.assign(this.updateObj, this.form)
            this.UpdateStation(obj)
          } else { // 新增
            this.InsertStation(this.form)
          }
        }
      })
    },
    goBack () {
      this.$router.push({path: '/basic-manage/site-manage'})
    },
    // changeProvince (val) { // 选择省
    //   let obj = {}
    //   obj.areaParentCode = val
    //   this.QueryAreaList(obj, 'city')
    // },
    // changeCity (val) {
    //   let obj = {}
    //   obj.areaParentCode = val
    //   this.QueryAreaList(obj, 'area')
    // },
    // changeArea (val) {
    //   let obj = {}
    //   obj.areaParentCode = val
    //   this.QueryAreaList(obj, 'town')
    // },
    QueryLogisticsList (val) { // 物流公司列表
      CarManageAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.data
        }
      })
    },
    InsertStation (val) { // 新增站点
      SiteManageAjax.insertStation(val).then(res => {
        if (res.code === 200) {
          this.$router.push({path: '/basic-manage/site-manage'})
          this.$notify({
            type: 'success',
            message: '新增成功！'
          })
        }
      })
    },
    UpdateStation (val) { // 修改站点
      SiteManageAjax.updateStation(val).then(res => {
        if (res.code === 200) {
          this.$router.push({path: '/basic-manage/site-manage'})
          this.$notify({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    },
    showStationDetails (val) { // 查看站点详情
      SiteManageAjax.showStationDetails(val).then(res => {
        if (res.code === 200) {
          this.form.stationName = res.data.stationName
          this.form.stationType = res.data.stationType
          this.form.pkLogistics = res.data.logisticsName
          this.form.addressSaveData.areaInfo = res.data.areaInfo
        }
      })
    },
    async updateCrmLogisticsStationShow (val) { // 修改回显
      return new Promise((resolve, reject) => {
        SiteManageAjax.updateCrmLogisticsStationShow(val).then(res => {
          if (res.code === 200) {
            this.updateObj = res.data // 缓存修改回显对象
            this.form.stationName = res.data.stationName
            this.form.stationType = res.data.stationType
            this.form.pkLogistics = res.data.pkLogistics
            this.form.areaInfo = res.data.areaInfo
            this.form.addressSaveData.addressId = res.data.stationAddressId
            this.updateShowArea.provinceCode = res.data.provinceCode
            this.updateShowArea.cityCode = res.data.cityCode
            this.updateShowArea.areaCode = res.data.areaCode
            this.updateShowArea.townCode = res.data.townCode
            this.form.province = res.data.provinceCode
            this.form.city = res.data.cityCode
            this.form.area = res.data.areaCode
            this.form.town = res.data.townCode
            resolve(res.data)
          }
        })
      })
    },
    QueryAreaList (val, flag) { // 省市
      SiteManageAjax.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.areaOBj.areaPList = res.data
          }
          if (flag === 'city') {
            this.areaOBj.areaCList = res.data
          }
          if (flag === 'area') {
            this.areaOBj.areaQList = res.data
          }
          if (flag === 'town') {
            if (res.data.length === 0) {
              this.rules.town[0].required = false
            } else {
              this.rules.town[0].required = true
            }
            this.areaOBj.areaTList = res.data
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.creatSite_main {
  .addressDetail .el-input__inner {
    width: 625px !important;
    //margin-left: 17%;
  }
}
</style>

<style lang="less" scoped>
.creatSite {
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
