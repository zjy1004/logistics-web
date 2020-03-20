<template>
  <div class="menu-card">
    <div class="public_card">
      <h3 class="card_header">菜单管理</h3>
      <div class="card_main">
        <div class="form-con">
          <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="75px">
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="菜单名称:" prop="menuName">
                  <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable maxlength="128"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="菜单编码:" prop="menuCode">
                  <el-input v-model="form.menuCode" maxlength="128" placeholder="请输入菜单编码" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="菜单路径:" prop="url">
                  <el-input v-model="form.url" maxlength="128" placeholder="请输入菜单路径" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :offset="2">
                <el-form-item label="上级菜单:" prop="pkMenu">
                  <!-- <el-select :disabled="this.id !== ''" v-model="form.pkMenu" placeholder="请选择上级菜单" clearable> -->
                  <el-select v-model="form.pkMenu" placeholder="请选择上级菜单" clearable>
                    <el-option
                      v-for="item in pkMenuList"
                      :key="item.id"
                      :label="item.menuName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="菜单类型:" prop="menuType">
                  <el-select v-model="form.menuType" placeholder="请选择菜单类型" clearable>
                    <el-option
                      v-for="item in menuTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="排序号:" prop="serialNumber">
                  <el-input v-model="form.serialNumber" maxlength="128" placeholder="请输入排序号" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="2">
                <el-form-item label="业务类型:" prop="menuBusinessType">
                  <el-select v-model="form.menuBusinessType" placeholder="请选择菜单业务类型" clearable>
                    <el-option
                      v-for="item in menuBusinessTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="btns">
          <div class="btn-con">
            <el-button class="btn-main" @click="save()">保存</el-button>
            <el-button @click="back()">返回</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuManageAjax from '@/api/MenuManage/MenuManage'
export default {
  name: 'MenuCard',
  data () {
    return {
      form: {
        menuName: '', // 菜单名称
        menuCode: '', // 菜单编码
        url: '', // 菜单路径
        pkMenu: '', // 上级菜单
        menuType: '', // 菜单类型
        menuBusinessType: '', // 菜单业务类型
        serialNumber: '' // 排序号
      },
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称！', trigger: 'blur' }
        ],
        menuCode: [
          { required: false, message: '请输入菜单编码！', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入菜单路径！', trigger: 'blur' }
        ],
        pkMenu: [
          { required: false, message: '请选择上级菜单!', trigger: 'change' }
        ],
        menuType: [
          { required: true, message: '请选择菜单类型!', trigger: 'change' }
        ],
        menuBusinessType: [
          { required: true, message: '请选择菜单业务类型!', trigger: 'change' }
        ],
        serialNumber: [
          { required: true, message: '请输入排序号！', trigger: 'blur' }
        ]
      },
      pkMenuList: [],
      menuTypeList: [
        {id: 1, name: '系统菜单'}, {id: 2, name: '业务菜单'}, {id: 3, name: '按钮'}, {id: 99, name: '管理菜单'}
      ],
      menuBusinessTypeList: [
        {id: 1, name: '后台'}, {id: 2, name: '业务管理'}, {id: 3, name: '司机端'}
      ]
    }
  },
  created () {
    this.init()
    let query = this.$route.query
    if (query.isAdd === false || query.isAdd === 'false') { // 点击修改信息跳转
      this.id = query.id
      this.queryDetail(query.id)
    } else {
      this.id = ''
    }
  },
  methods: {
    init () {
      this.queryAllPkMenu()
    },
    queryAllPkMenu () {
      MenuManageAjax.QueryPkMenuList().then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.pkMenuList = data
        }
      })
    },
    queryDetail (id) {
      MenuManageAjax.QueryDetail({id: this.id}).then((response) => {
        if (response.code === 200) {
          let { data } = response
          this.form = {
            menuName: data.menuName,
            menuCode: data.menuCode,
            url: data.url,
            pkMenu: data.pkMenuInt === 0 || data.pkMenuInt === null ? '' : data.pkMenuInt,
            menuType: data.menuTypeInt,
            menuBusinessType: data.menuBusinessTypeInt,
            serialNumber: data.serialNumber
          }
        }
      })
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.id) {
            let postData = Object.assign({}, this.form)
            postData.id = this.id
            MenuManageAjax.Update(postData).then((response) => {
              if (response.code === 200) {
                this.$notify({
                  message: '修改成功！',
                  type: 'success'
                })
                this.$router.push({name: 'MenuManage'})
              }
            })
          } else {
            MenuManageAjax.Insert(this.form).then((response) => {
              if (response.code === 200) {
                this.$notify({
                  message: '新增成功！',
                  type: 'success'
                })
                this.$router.push({name: 'MenuManage'})
              }
            })
          }
        }
      })
    },
    back () {
      this.$router.push({name: 'MenuManage'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.menu-card{
  display: flex;
  flex: 1;
  flex-direction: column;
  .form-con{
    display: flex;
    flex: 1;
    .el-form{
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .el-row{
    margin: 10px 0;
  }
  .btns{
    height: 32px;
    margin-bottom: 15px;
  }
  .btn-con{
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
  }
}
</style>
