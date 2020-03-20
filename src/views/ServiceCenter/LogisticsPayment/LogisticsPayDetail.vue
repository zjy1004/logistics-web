<template>
  <div class="creatLogisticsCompany public_card">
    <h3 class="card_header">驮付宝</h3>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="130px">
    <div class="card_main">
      <div class="card_con">

          <div class="card_form_title">
            <span class="title_line"></span>
            <span class="title">分成比例</span>
          </div>
          <div class="info">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="物流云分成:" prop="logistics">
                  <el-input v-model="form.logistics" placeholder="请输入物流云分成" @keyup.native="inputLogistics()">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="量子分成:" prop="lzProportion">
                  <el-input v-model="form.lzProportion" placeholder="请输入量子分成" disabled>
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
        <el-button class="btn-main" @click="save(form, 'form')">保存</el-button>
        </div>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
import LogisticsPayAjax from '@/api/LogisticsPay/LogisticsPay'
export default {
  name: 'LogisticsPayDetail',
  data () {
    return {
      form: {
        logistics: '',
        lzProportion: '',
        id: ''
      },
      rules: {
        logistics: [{ required: true, message: '请输入物流云分成', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.queryDetail()
  },
  computed: {
    divideInto () {
      return this.form.logistics
    }
  },
  watch: {
    divideInto (newVal, oldVal) {
      this.form.lzProportion = 100 - newVal
    }
  },
  methods: {
    inputLogistics () {
      let newValue = this.form.logistics.toString().replace(/[^\d.]/g, '')
      console.log(newValue)
      if (newValue === '') {
        console.log('5666')
        this.form.logistics = ''
      } else {
        if (newValue <= 100) {
          console.log(12)
          this.form.logistics = newValue
        } else {
          this.form.logistics = ''
        }
      }
    },
    save (val, form) {
      if (val.id) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            LogisticsPayAjax.UpdateFinaInfo(val).then(res => {
              if (res.code === 200) {
                this.queryDetail()
                this.$notify({
                  type: 'success',
                  message: '保存成功！'
                })
              }
            })
          }
        })
      } else {
        this.$refs[form].validate((valid) => {
          if (valid) {
            LogisticsPayAjax.InsertFinaInfo(val).then(res => {
              if (res.code === 200) {
                this.queryDetail()
                this.$notify({
                  type: 'success',
                  message: '新增成功！'
                })
              }
            })
          }
        })
      }
    },
    queryDetail (val) {
      LogisticsPayAjax.QueryFinaInfo(val).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.form.logistics = res.data.logistics
            this.form.lzProportion = res.data.lzProportion
            this.form.id = res.data.id
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.creatLogisticsCompany {
  overflow: auto;
  .addressDetail .el-input__inner {
     width: 625px !important;
  }
  .tabLabel{
    .el-checkbox{
      margin-right: 10px;
    }
  }
}
</style>

<style lang="less" scoped>
.creatLogisticsCompany {
  .info {
    margin-bottom: 30px;
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
