<template>
  <div class="creatLogisticsCompany public_card">
    <h3 class="card_header">物流公司管理</h3>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" class="demo-form-inline" label-width="150px">
    <div class="card_main">
      <div class="card_con">
        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">基本信息</span>
        </div>
        <div class="basicInfo info">
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="物流公司简称:" prop="logisticsName">
                    <el-input v-model="form.logisticsName" placeholder="请输入物流公司" :disabled="checkDisabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="企业全称:" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入企业名称" :disabled="checkDisabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="登录账号:" prop="account">
                    <el-input v-model="form.account" placeholder="请输入账号" :disabled="checkDisabled" @keyup.native="accountInput"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系人:" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入联系人" :disabled="checkDisabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" @keyup.native="inputPhone" placeholder="请输入联系电话" :disabled="checkDisabled"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="营业执照:" prop="attachId">
                  <el-upload
                  :disabled="checkDisabled"
                  :action="uploadAction"
                  :limit="1"
                  :on-exceed="handleExceed"
                  accept="image/*"
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-preview="handlePictureCardPreview"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                </el-form-item>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="1">
                <el-form-item label="经营地址:" required>
                <el-form-item label="" prop="mProvince">
                  <el-select v-model="form.mProvince" placeholder="请选择省" clearable @change="changeProvince(form.addressSaveData.provinceCode, 'Management')" :disabled="checkDisabled">
                    <el-option
                      v-for="(item, index) in management.areaPList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                  （省）
                <el-form-item label="" prop="mCity">
                  <el-select v-model="form.mCity" placeholder="请选择市" clearable @change="changeCity(form.addressSaveData.cityCode,'Management')" :disabled="checkDisabled">
                    <el-option
                      v-for="(item, index) in management.areaCList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                  （市）
                <el-form-item label="" prop="mArea">
                  <el-select v-model="form.mArea" placeholder="请选择区" clearable @change="changeArea(form.addressSaveData.areaCode,'Management')" :disabled="checkDisabled">
                    <el-option
                      v-for="(item, index) in management.areaQList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                  （区）
                <el-form-item label="" prop="mTown">
                  <el-select v-model="form.mTown" placeholder="请选择乡镇/街道" clearable :disabled="checkDisabled">
                    <el-option
                      v-for="(item, index) in management.areaTList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaCode">
                    </el-option>
                  </el-select>
                  （乡镇/街道）
                </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="3">
                <el-form-item label="" prop="areaInfo">
                  <el-input class="addressDetail" @input="changeAddressSaveDataInfo(form.addressSaveData.areaInfo)" v-model="form.areaInfo" placeholder="请输入详细经营地址（如街道门牌号）" clearable :disabled="checkDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">服务信息</span>
        </div>
        <div class="serviceInfo info">
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="配送方式:" prop="deliveryMethod">
                <el-checkbox-group v-model="form.deliveryMethod" :disabled="checkDisabled">
                  <el-checkbox label=1 name="type">修理厂自提</el-checkbox>
                  <el-checkbox label=2 name="type">送货上门</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="揽货方式:" prop="pickupMethod">
                <el-checkbox-group v-model="form.pickupMethod" :disabled="checkDisabled">
                  <el-checkbox label=1 name="type">经销商送货</el-checkbox>
                  <el-checkbox label=2 name="type">上门取货</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="运费结算方式:" prop="freightSettlementMethod">
                <el-checkbox-group v-model="form.freightSettlementMethod" :disabled="checkDisabled">
                  <el-checkbox label=1 name="type">现结</el-checkbox>
                  <el-checkbox label=3 name="type">包月</el-checkbox>
                  <el-checkbox label=2 name="type">月结</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="三联单打印:" prop="printMethod">
                <el-checkbox-group v-model="form.printMethod" :disabled="checkDisabled">
                  <el-checkbox label=1 name="type">发货方</el-checkbox>
                  <el-checkbox label=2 name="type">收货方</el-checkbox>
                  <el-checkbox label=3 name="type">物流公司</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1" class="mobilePrint">
              <el-form-item label="移动三联单打印:" prop="mobilePrintMethod">
                <el-checkbox-group v-model="form.mobilePrintMethod" :disabled="checkDisabled">
                  <el-checkbox label=1 name="type">发货方</el-checkbox>
                  <el-checkbox label=2 name="type">收货方</el-checkbox>
                  <el-checkbox label=3 name="type">物流公司</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="1">
              <el-form-item label="业务模式:" prop="businessModelList">
                <el-checkbox-group v-model="form.businessModelList" :disabled="checkDisabled">
                  <el-checkbox label=2 name="type">经销商开单</el-checkbox>
                  <el-checkbox label=1 name="type">扫码开单</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8" :offset="1">
            <el-form-item label="默认运费金额:" prop="freightDefault">
              <el-input v-model="form.freightDefault" :disabled="checkDisabled"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form :inline="true" ref="form" :model="form" class="demo-form-inline" label-width="95px">
            <el-form-item label="代收手续费:" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="结算周期:" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-form> -->
          <el-row>
            <el-col :span="20" :offset="1">
            <div v-for="(element,index) in this.form.addressSaveDataList" :key="index">
            <el-form-item label="服务范围:" prop="addressSaveDataList">
              <el-select v-model="element.provinceCode" placeholder="请选择省" clearable @change="changeProvince(element.provinceCode,'service', index)" :disabled="checkDisabled">
                <el-option
                  v-for="(item, index) in management.areaPList"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （省）
              <el-select v-model="element.cityCode" placeholder="请选择市" clearable @change="changeCity(element.cityCode,'service', index)" :disabled="checkDisabled">
                <el-option
                  v-for="(item, index) in element.serviceArr.CArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （市）
              <el-select v-model="element.areaCode" placeholder="请选择区" clearable @change="changeArea(element.areaCode,'service',index)" :disabled="checkDisabled">
                <el-option
                  v-for="(item, index) in element.serviceArr.QArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （区）
              <el-select v-model="element.townCode" placeholder="请选择乡镇/街道" clearable :disabled="checkDisabled">
                <el-option
                  v-for="(item, index) in element.serviceArr.TArray"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaCode">
                </el-option>
              </el-select>
              （乡镇/街道）

            </el-form-item>
            <el-form-item>
              <a class="check" href="javascript:;" type="text" size="small" @click="add(element, index)">新建</a>
              <a class="check" href="javascript:;" type="text" size="small" v-if="delBtnShow" @click="del(element, index)">删除</a>
            </el-form-item>
            </div>
            </el-col>
          </el-row>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">代收款费用</span>
        </div>

        <div class="collectionFee info">
          <el-row>
            <el-col :span="3">
              <el-form-item label="" prop="dividedType">
                <el-radio v-model="form.dividedType" label="1" @change="changeDividedType(form.dividedType)" :disabled="checkDisabled">按比例收费</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <el-form-item label="代收手续费率：" prop="goodsCommissionRate">
                <el-input v-model="form.goodsCommissionRate" placeholder="请输入代收手续费率" :disabled="disabledGoodsCommissionRate || checkDisabled" @keyup.native="inputServiceCharge">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item label="" prop="dividedType">
                <el-radio v-model="form.dividedType" label="2" @change="changeDividedType(form.dividedType)" :disabled="disabledDividedType ||checkDisabled">阶梯价格收费</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <div v-for="(element,index) in this.form.goodsAllList" :key="index" style="height:44px;line-height:44px;">
                <div style="display:inline-block;width:600px;">
                  <el-form-item label="" style="width:180px;">
                    当前货款为：
                    <div style="display: inline-block; text-align: right; width:90px;">
                      <span>{{element.goodsStart}} 元</span>
                      <span>至</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="" prop="goodsEnd" style="height:44px;line-height:44px;">
                    <el-input v-model="element.goodsEnd" :maxlength=6 placeholder=" " :disabled="disabledGoodsAll || form.goodsAllList.length !== index + 1 || checkDisabled" @keyup.native="keyupGoodsEnd(element.goodsEnd, index)">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <span style="display:inline-block;width:150px;">（不包含{{element.goodsEnd}}元）</span>
                </div>

                  <span style="margin-left: 20px;">代收手续费用：</span>
                  <el-form-item label="" prop="poundageFee">
                    <el-input v-model="element.poundageFee" placeholder="请输入代收手续费率" :disabled="disabledGoodsAll || checkDisabled"  @keyup.native="keyupPoundageFee(element.poundageFee, index,$event,)">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>

                <el-form-item>
                  <el-button size="small" v-if="form.goodsAllList.length === index + 1" :disabled="disabledGoodsEnd && disabledPoundageFee || checkDisabled"  @click="addStep(element, index)">增加阶梯</el-button>
                  <el-button size="small" v-if="form.goodsAllList.length === index + 1" :disabled="form.goodsAllList.length ===1 || checkDisabled" @click="delStep(element, index)">删除阶梯</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="18" :offset="3">
              <div>
                <el-form-item label="" prop="lastGoodsEnd" class="lastGoodEndCss" style="width:594px;">
                  <div style="margin-left: 190px;">
                    <span>{{lastGoodsEnd}}</span><span>元及以上</span>
                  </div>
                </el-form-item>

                <el-form-item label="代收手续费用：" prop="lastPoundageFee" style="margin-left: 0px">
                  <el-input v-model="lastPoundageFee" placeholder="请输入代收手续费率" :disabled="disabledGoodsAll || checkDisabled" @keyup.native="keyupLastPoundageFee(lastPoundageFee,$event,)">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">开通驮付宝</span>
          <span>

          <el-switch
            :disabled="checkDisabled || disabledGoodsCommissionRate"
            v-model="form.onlinePaySwitch">
          </el-switch>
          </span>
        </div>
        <div class="onlinePayment info">

        <el-row>
          <!-- <el-col :span="6" :offset="1">
            <el-form-item label="代收手续费率:" prop="goodsCommissionRate">
              <el-input v-model="form.goodsCommissionRate" @keyup.native="inputServiceCharge" placeholder="请输入代收手续费率" :disabled="checkDisabled">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8" :offset="1">
            <el-form-item label="物流公司分成:" prop="logisticsProportion">
              <el-input v-model="form.logisticsProportion" @keyup.native="freight" placeholder="请输入物流公司分成" :disabled="checkDisabled||disabledGoodsCommissionRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="物流云分成:" prop="logistics">
              <el-input v-model="form.logistics" placeholder="请输入物流云分成" disabled>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        </div>

        <!-- <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">银行卡信息</span>
        </div>
        <div class="bankCardInfo info">

        <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="开户银行:" prop="logisticsName">
              <el-input v-model="form.logisticsName" placeholder="请输入开户银行"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="银行卡号:" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="户主姓名:" prop="account">
              <el-input v-model="form.account" placeholder="请输入户主姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        </div> -->

        <div class="card_form_title">
          <span class="title_line"></span>
          <span class="title">角色信息</span>
        </div>
        <div class="roleInfo info">
        <el-tabs class="default-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in form.roleMenuLogisticsList" :key="index" :name="index.toString()">
            <div class="tabLabel" slot="label"><el-checkbox v-if="false" @change="tabCheckChange(item, index)" :ref="'tabCheckbox'+index" v-model="item.allChecked" :disabled="checkDisabled"></el-checkbox>{{item.roleName}}</div>
            <el-tree
              :data="item.treeNodeList"
              :default-checked-keys="item.treeNodeCheckedList"
              show-checkbox
              default-expand-all
              node-key="id"
              :ref="'tree'+index"
              highlight-current
              @check-change="handleCheckChange"
              :props="defaultProps">
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        </div>
      </div>
      <div class="card_btn">
        <div class="search-btn-con">
        <el-button class="btn-main" v-if="saveShow" @click="save('form')">保存</el-button>
        <el-button class="btn-main" @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
import LogisticsCompanyManage from '@/api/LogisticsCompanyManage/LogisticsCompanyManage'
import LoginAjax from '@/api/Login/Login'

export default {
  data () {
    // let validateAddress = (rule, value, callback) => {
    //   if (value.provinceCode === '' || value.provinceCode === null) {
    //     callback(new Error('请选择省！'))
    //   } else if (value.cityCode === '' || value.cityCode === null) {
    //     callback(new Error('请选择市！'))
    //   } else if (value.areaCode === '' || value.areaCode === null) {
    //     callback(new Error('请选择区/县！'))
    //   } else if (value.townCode === '' || value.townCode === null) {
    //     callback(new Error('请选择乡镇/街道！'))
    //   } else if (value.areaInfo === '') {
    //     callback(new Error('请输入详细经营地址！'))
    //   } else {
    //     callback()
    //   }
    // }
    // let validateAddressList = (rule, value, callback) => {
    //   value.forEach(item => {
    //     if (item.provinceCode === '' || item.provinceCode === null) {
    //       callback(new Error('请选择省！'))
    //     } else if (item.cityCode === '' || item.cityCode === null) {
    //       callback(new Error('请选择市！'))
    //     } else if (item.areaCode === '' || item.areaCode === null) {
    //       callback(new Error('请选择区/县！'))
    //     } else if (item.townCode === '' || item.townCode === null) {
    //       callback(new Error('请选择乡镇/街道！'))
    //     } else {
    //       callback()
    //     }
    //   })
    // }
    let validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录账户！'))
      } else if (this.hasUserName) {
        callback(new Error('账户名称已存在！'))
      } else {
        callback()
      }
    }

    let validatePhoneNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话！'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的联系电话！'))
      } else if (this.hasPhone) {
        callback(new Error('联系电话已存在！'))
      } else {
        callback()
      }
    }
    return {
      disabledGoodsEnd: true,
      disabledPoundageFee: true,
      disabledDividedType: false, // 打开驮付宝开关禁用阶梯价格收费
      lastPoundageFee: '', // 阶梯价格收费最后一个代收手续费用
      disabledGoodsAll: true, // 选择比例收费禁用阶梯收费
      disabledGoodsCommissionRate: false, // 选择阶梯价格收费代收手续费率禁用
      delStepBtnShow: true,
      hasUserName: false,
      treeDate: [],
      saveUserId: '', // 校验手机号同模块是否存在
      defaultData: {
        addressId: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        areaCode: '',
        areaName: '',
        townCode: '',
        townName: '',
        serviceArr:
          {
            PArray: [],
            CArray: [],
            QArray: [],
            TArray: []
          }
      },
      form: {
        dividedType: '1',
        accountId: '', // 用于验证账号重复
        logisticsId: '', // 物流公司Id
        freightDefault: '', // 默认运费
        logisticsName: '', // 物流公司名称
        companyName: '', // 企业名称
        account: '', // 账号
        userName: '', // 联系人
        phone: '', // 联系电话
        addressSaveData: { // 经营地址实体
          addressId: '',
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          townCode: '',
          areaInfo: ''
        },
        mProvince: '',
        mCity: '',
        mArea: '',
        mTown: '',
        areaInfo: '',
        deliveryMethod: [], // 配送方式
        pickupMethod: [], // 取货方式
        freightSettlementMethod: [], // 运费结算方式
        printMethod: [], // 三联单打印
        mobilePrintMethod: [], // 移动端三联单打印
        businessModelList: [], // 业务模式
        addressSaveDataList: [{
          addressId: '',
          provinceCode: '',
          provinceName: '',
          cityCode: '',
          cityName: '',
          areaCode: '',
          areaName: '',
          townCode: '',
          townName: '',
          serviceArr:
            {
              PArray: [],
              CArray: [],
              QArray: [],
              TArray: []
            }
        }],
        goodsAllList: [{
          goodsStart: 0,
          goodsEnd: '',
          poundageFee: ''
        }],
        roleMenuLogisticsList: [{
          // 'isChange': '',
          'menuIdList': [],
          'roleId': ''
        }],
        attachId: '', // 营业执照id
        attachName: '', // 营业执照名称
        onlinePaySwitch: false, // 在线支付开关
        goodsCommissionRate: '', // 代收货款手续费率
        logisticsProportion: '', // 物流公司分成
        logistics: '' // 物流云分成

      },
      management: { // 经营地址
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [], // 区
        areaTList: [] // 乡
      },
      service: { // 经营地址
        areaPList: [], // 省
        areaCList: [], // 市
        areaQList: [], // 区
        areaTList: [] // 乡
      },
      companyOptions: [],
      dialogImageUrl: '',
      dialogVisible: false,
      activeName: '0',
      uploadAction: `${process.env.API_BASE_URL}/crm/attach/fileUpload`,
      roleArr: [], // 角色
      defaultProps: {
        children: 'childrenList',
        label: 'menuName',
        disabled: this.$route.query.type === 'check' ? 'id' : ''
      },
      allDate: [], // 编辑全部数据
      fileList: [],
      saveShow: true,
      checkDisabled: false, // 查看禁用标识
      delBtnShow: true, // 服务范围地址删除按钮
      hasPhone: false,
      rules: {
        logisticsName: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
        freightDefault: [{ required: true, message: '请输入默认运费', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        account: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        userName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhoneNum, trigger: 'blur' }],
        attachId: [{ required: true, message: '请输入营业执照', trigger: 'change' }],
        // addressSaveData: [{ required: true, validator: validateAddress, trigger: 'change' || 'blur' }],
        deliveryMethod: [{ required: true, message: '请输入配送方式', trigger: 'change' }],
        pickupMethod: [{ required: true, message: '请输入取货方式', trigger: 'change' }],
        freightSettlementMethod: [{ required: true, message: '请输入运费结算方式', trigger: 'change' }],
        printMethod: [{ required: true, message: '请选择三联单打印', trigger: 'change' }],
        mobilePrintMethod: [{ required: true, message: '请选择移动端三联单打印', trigger: 'change' }],
        // addressSaveDataList: [{ required: true, validator: validateAddressList, trigger: 'change' }]
        mProvince: [{ required: true, message: '请选择省', trigger: 'change' }],
        mCity: [{ required: true, message: '请选择市', trigger: 'change' }],
        mArea: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        mTown: [{ required: true, message: '请选择乡镇/街道', trigger: 'change' }],
        areaInfo: [{ required: true, message: '请输入详细经营地址（如街道门牌号）', trigger: 'blur' }],
        goodsCommissionRate: [{ required: true, message: '请输入代收货款手续费率', trigger: 'blur' }],
        logisticsProportion: [{ required: true, message: '请输入物流公司分成', trigger: 'blur' }]
        // logistics: [{ required: true, message: '请输入物流云分成', trigger: 'blur' }]
      }
    }
  },
  created () {
    console.log(this.$route.query.type)
    let pageType = this.$route.query.type
    if (pageType === 'check') {
      this.saveShow = false
      this.checkDisabled = true
    } else {
      this.saveShow = true
      this.checkDisabled = false
    }
    let id = this.$route.query.id
    if (id) {
      this.updateInit(id)
    } else {
      let obj = {}
      obj.areaParentCode = 0
      this.QueryManagementAreaList(obj, 'province')

      this.creatInit()
      if (this.form.addressSaveDataList.length === 1) {
        this.delBtnShow = false
      } else {
        this.delBtnShow = true
      }
      if (this.form.goodsAllList.length === 1) {
        this.delStepBtnShow = false
      } else {
        this.delStepBtnShow = true
      }
    }
  },
  computed: {
    provinceCode () {
      return this.form.mProvince
    },
    cityCode () {
      return this.form.mCity
    },
    areaCode () {
      return this.form.mArea
    },
    townCode () {
      return this.form.mTown
    },
    areaInfo () {
      return this.form.areaInfo
    },
    provinceCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].provinceCode
    },
    cityCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode
    },
    areaCodeList () {
      return this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode
    },
    divideInto () {
      return this.form.logisticsProportion
    },
    dividedTypeChange () {
      return this.form.dividedType
    },
    onlinePaySwitchChange () {
      return this.form.onlinePaySwitch
    },
    lastGoodsEnd () {
      if (this.form.goodsAllList.length > 0) {
        if (this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd === '' || this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd === null) {
          // return Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsStart)
          return ''
        } else {
          return Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd)
        }
      }
    },
    goodsAllList () {
      return this.form.goodsAllList
    }
  },
  watch: {
    goodsAllList (newVal, oldVal) {
      if (newVal.length > 0) {
        if (newVal[newVal.length - 1].goodsEnd !== '' && newVal[newVal.length - 1].poundageFee !== '') {
          this.disabledPoundageFee = false
        } else {
          this.disabledPoundageFee = true
        }
      }
    },
    onlinePaySwitchChange (newVal, oldVal) {
      if (newVal === 1) {
        newVal = false
      } else if (newVal === 0) {
        newVal = true
      }
      if (newVal) {
        this.disabledDividedType = true
      } else {
        this.disabledDividedType = false
      }
    },
    dividedTypeChange (newVal, oldVal) {
      if (newVal === '1') {
        this.rules.goodsCommissionRate[0].message = '请输入代收货款手续费率'
        this.rules.goodsCommissionRate[0].required = true
        this.rules.logisticsProportion[0].required = true
        this.rules.logisticsProportion[0].message = '请输入物流公司分成'
        this.disabledGoodsCommissionRate = false
        this.disabledGoodsAll = true
      }
      if (newVal === '2') {
        this.rules.goodsCommissionRate[0].message = ''
        this.rules.goodsCommissionRate[0].required = false
        this.rules.logisticsProportion[0].required = false
        this.rules.logisticsProportion[0].message = ''
        this.disabledGoodsCommissionRate = true
        this.disabledGoodsAll = false
      }
      console.log(this.rules.goodsCommissionRate)
    },
    provinceCode (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.provinceCode = newVal
        this.management.areaPList.forEach(item => {
          if (this.form.addressSaveData.cityCode !== item) {
            this.form.mCity = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'city')
      }
    },
    cityCode (newVal, oldVal) {
      this.form.addressSaveData.cityCode = newVal
      if (newVal !== oldVal) {
        this.management.areaCList.forEach(item => {
          if (this.form.addressSaveData.areaCode !== item) {
            this.form.mArea = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'area')
      }
    },
    areaCode (newVal, oldVal) {
      this.form.addressSaveData.areaCode = newVal
      if (newVal !== oldVal) {
        this.management.areaQList.forEach(item => {
          if (this.form.addressSaveData.townCode !== item) {
            this.form.mTown = ''
          } else {

          }
        })
        this.QueryManagementAreaList({areaParentCode: newVal}, 'town')
      }
    },
    townCode (newVal, oldVal) {
      this.form.addressSaveData.townCode = newVal
    },
    areaInfo (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.addressSaveData.areaInfo = newVal
      }
    },
    provinceCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaPList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].cityCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'city', this.form.addressSaveDataList.length - 1)
      }
    },
    cityCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaCList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].areaCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'area', this.form.addressSaveDataList.length - 1)
      }
    },
    areaCodeList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.management.areaQList.forEach(item => {
          if (this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].townCode !== item) {
            this.form.addressSaveDataList[this.form.addressSaveDataList.length - 1].townCode = ''
          } else {

          }
        })
        this.QueryServiceAreaList({areaParentCode: newVal}, 'town', this.form.addressSaveDataList.length - 1)
      }
    },
    divideInto (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.form.logistics = Number(100 - newVal).toFixed(2)
      }
    }
  },
  methods: {
    keyupGoodsEnd (val, index) {
      this.form.goodsAllList[index].goodsEnd = val.toString().replace(/[^\d]/g, '')
      console.log(this.form.goodsAllList)
      if (this.form.goodsAllList.length - 1 === index) {
        if (val !== '') {
          this.disabledGoodsEnd = true
        } else {
          this.disabledGoodsEnd = false
        }
      }
      if (Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd) < Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsStart)) {

        // this.$notify({
        //   type: 'error',
        //   message: '输入货款金额不能小于当前货款金额！'
        // })
      }
    },
    keyupPoundageFee (val, index, event) {
      // let hasPoint = (/\./g).test(val)
      // let value = ''
      // if (!hasPoint) {
      //   value = val.match(/^\d{0,4}/g)[0] || null
      // } else {
      //   value = val.match(/^\d*(\.?\d{0,2})/g)[0] || null
      // }
      // this.$nextTick(() => {
      //   event.target.value = value
      // })

      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 四位整数和俩位小数
        this.form.goodsAllList[index].poundageFee = val.match(/^\d{0,4}/g)[0] || null
      } else {
        this.form.goodsAllList[index].poundageFee = val.match(/^\d{0,4}(\.?\d{0,2})/g)[0] || null
      }

      if (this.form.goodsAllList.length - 1 === index) {
        if (val !== '') {
          this.disabledPoundageFee = false
        } else {
          this.disabledPoundageFee = true
        }
      }
    },
    keyupLastPoundageFee (val) {
      let hasPoint = (/\./g).test(val)
      if (!hasPoint) { // 四位整数和俩位小数
        this.lastPoundageFee = val.match(/^\d{0,4}/g)[0] || null
      } else {
        this.lastPoundageFee = val.match(/^\d{0,4}(\.?\d{0,2})/g)[0] || null
      }
    },
    changeDividedType (val) {
      if (val === '1') {
        this.disabledGoodsAll = true
        this.disabledGoodsCommissionRate = false
      }
      if (val === '2') {
        this.disabledGoodsCommissionRate = true
        this.disabledGoodsAll = false
      }
    },
    accountInput () {
      this.form.account = this.validateAccount(this.form.account)
      this.hasUserName = false
    },
    freight () {
      // let newValue = this.form.logisticsProportion.toString().replace(/[^\d.]/g, '')
      let newValue = this.form.logisticsProportion.toString().match(/^\d{0,2}(\.?\d{0,2})/g)[0] || null
      if (newValue <= 100) {
        this.form.logisticsProportion = newValue
      } else {
        this.form.logisticsProportion = ''
      }
    },
    inputServiceCharge () {
      // let newValue = this.form.goodsCommissionRate.toString().replace(/^\D*([1-9]\d*\.?\d{0,2})?.*$/, '$1')
      let newValue = this.form.goodsCommissionRate.toString().match(/^\d{0,2}(\.?\d{0,2})/g)[0] || null
      if (newValue <= 100) {
        this.form.goodsCommissionRate = newValue
      } else {
        this.form.goodsCommissionRate = ''
      }
    },
    creatInit () {
      init.bind(this)()
      async function init () {
        await this.queryRoleMenuList()
        this.form.roleMenuLogisticsList.forEach((item, index) => {
          let checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
          item.treeNodeCheckedList = halfCheckedArr.concat(checkedArr)
        })
      }
    },
    updateInit (id) {
      init.bind(this)(id)
      async function init (id) {
        await this.queryRoleMenuList({logisticsId: id})
        this.form.roleMenuLogisticsList.forEach((item, index) => {
          let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
          let checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          item.checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          let allCheck = true
          item.treeNodeList.forEach((innerItem, i) => {
            if (!item.checkedArr.includes(innerItem.id)) {
              allCheck = false
            }
          })
          item.allChecked = allCheck
          item.treeNodeCheckedList = halfCheckedArr.concat(checkedArr)
        })
        await this.queryDetail({logisticsId: id})
        this.QueryManagementAreaList({areaParentCode: 0}, 'province')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.provinceCode}, 'city')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.cityCode}, 'area')
        this.QueryManagementAreaList({areaParentCode: this.form.addressSaveData.areaCode}, 'town')
      }
    },
    handleRemove (file, fileList) {
      this.deleteFile({attachId: this.form.attachId})
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    handleAvatarSuccess (res, file) {
      this.form.attachId = res.data.attachId
      this.form.attachName = res.data.attachName
    },
    add (val, index) {
      if (this.checkDisabled) {
        return
      }
      this.delBtnShow = true
      this.form.addressSaveDataList.push({
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        areaCode: '',
        areaName: '',
        townCode: '',
        townName: '',
        serviceArr:
            {
              PArray: [],
              CArray: [],
              QArray: [],
              TArray: []
            }
      })
    },
    del (val, index) {
      if (this.form.addressSaveDataList.length === 2) {
        this.delBtnShow = false
      } else {
        this.delBtnShow = true
      }
      this.form.addressSaveDataList = this.form.addressSaveDataList.filter((item, itemIndex) => {
        return itemIndex !== index
      })
    },
    addStep (val, index) {
      if (Number(val.goodsEnd) <= Number(val.goodsStart)) {
        this.$notify({
          type: 'error',
          message: '输入货款金额不能小于当前货款金额！'
        })
      } else {
        this.delStepBtnShow = true
        this.form.goodsAllList.push({
          goodsStart: Number(val.goodsEnd),
          goodsEnd: '',
          poundageFee: ''
        })
      }
    },
    delStep (val, index) {
      if (this.form.goodsAllList.length === 2) {
        this.delStepBtnShow = false
      } else {
        this.delStepBtnShow = true
      }
      this.form.goodsAllList = this.form.goodsAllList.filter((item, itemIndex) => {
        return itemIndex !== index
      })
    },
    inputPhone (evnet, value) {
      this.hasPhone = false
      this.form.phone = this.validateNum(this.form.phone)
    },
    changeAddressSaveDataInfo (val) {

    },
    save (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.validatePhoneEnable({userId: this.saveUserId, phone: this.form.phone, referenceType: 1, callback: this.validatePhone})
        }
      })
    },
    validatePhone (data) {
      if (!data) {
        console.log(this.form, '123')
        if (this.form.onlinePaySwitch === false) {
          this.form.onlinePaySwitch = 1
        }
        if (this.form.onlinePaySwitch === true) {
          this.form.onlinePaySwitch = 0
        }
        let type = this.$route.query.type
        if (type === 'add') {
          if (this.form.dividedType === '1') {
            this.form.goodsAllList = []
          }
          if (this.form.dividedType === '2') {
            if (this.form.goodsAllList.length > 0) {
              // if (this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd === '') {
              //   this.form.goodsAllList.pop()
              // }
              this.form.goodsAllList.push({
                goodsStart: Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd),
                goodsEnd: -1,
                poundageFee: this.lastPoundageFee
              })
            }
            let validFlag = this.form.goodsAllList.some(item => {
              return (item.poundageFee === '' || item.poundageFee === null)
            })
            if (validFlag) {
              this.$notify({
                type: 'error',
                message: '阶梯价格收费配置不完整，请补充完整！'
              })
              this.form.goodsAllList.pop()
              return false
            }
          }
          this.insertCrmLogistics(this.form)
        }
        if (type === 'edit') {
          LogisticsCompanyManage.ValidateFreightMethod({freightSettlementMethodList: this.form.freightSettlementMethod, logisticsId: this.form.logisticsId}).then(res => {
            if (res.data.list.length > 0) {
              this.$notify({
                type: 'error',
                message: `您名下总共有${res.data.list.length}个客户正在用此结算方式，请勿修改!`
              })
            } else {
              this.form.logisticsId = this.$route.query.id
              let obj = {}
              // this.allDate.roleMenuLogisticsList.forEach((item, index1) => {
              //   this.form.roleMenuLogisticsList.forEach((innerItem, index2) => {
              //     if (innerItem.id === item.rolePosition) {
              //       let differenceABSet = Array.from(new Set([...new Set(item.menuIdList)].filter(x => !new Set(innerItem.menuIdList).has(x))))
              //       console.log(differenceABSet)
              //       innerItem.isChange = differenceABSet.length > 0 ? 1 : 2
              //     }
              //   })
              // })
              console.log(this.allDate)
              console.log(this.form.goodsAllList, '====')
              if (this.form.dividedType === '1') {
                this.form.goodsAllList = []
              }
              if (this.form.dividedType === '2') {
                if (this.form.goodsAllList.length > 0) {
                  if (this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd === '') {
                    this.form.goodsAllList.pop()
                  }
                }

                this.form.goodsAllList.push({
                  goodsStart: Number(this.form.goodsAllList[this.form.goodsAllList.length - 1].goodsEnd),
                  goodsEnd: -1,
                  poundageFee: this.lastPoundageFee
                })
                let validFlag = this.form.goodsAllList.some(item => {
                  return (item.poundageFee === '' || item.poundageFee === null)
                })
                if (validFlag) {
                  this.$notify({
                    type: 'error',
                    message: '阶梯价格收费配置不完整，请补充完整！'
                  })
                  this.form.goodsAllList.pop()
                  return false
                }
                console.log(this.form.goodsAllList, '========')
              }
              obj = Object.assign(this.allDate, this.form)

              this.updateCrmLogistics(obj)
            }
          })
        }
      } else {
        this.hasPhone = true
        this.$refs.form.validate()
      }
    },
    goBack () {
      this.$router.push({name: 'LogisticsCompanyManage'})
    },
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys () {

    },
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, '12333333')
      this.form.roleMenuLogisticsList.forEach((item, index) => {
        if (item.rolePosition === data.rolePosition) {
          console.log(this.$refs['tree' + index][0].getHalfCheckedKeys())
          let halfCheckedArr = this.$refs['tree' + index][0].getHalfCheckedKeys()
          console.log(this.$refs['tree' + index][0].getCheckedKeys())
          let checkedArr = this.$refs['tree' + index][0].getCheckedKeys()
          this.form.roleMenuLogisticsList[index].treeNodeCheckedList = halfCheckedArr.concat(checkedArr)
          // if (checked || indeterminate) {
          //   this.form.roleMenuLogisticsList[index].treeNodeCheckedList.push(data.id)
          // } else {
          //   this.form.roleMenuLogisticsList[index].treeNodeCheckedList = this.form.roleMenuLogisticsList[index].treeNodeCheckedList.filter(item => {
          //     return item !== data.id
          //   })
          // }
        }
      })
    },
    tabCheckChange (data, index) {
      if (data.allChecked) {
        let rootIds = this.form.roleMenuLogisticsList[index].treeNodeList.map(item => {
          return item.id
        })
        this.$refs['tree' + index][0].setCheckedKeys(rootIds)
      } else {
        this.$refs['tree' + index][0].setCheckedKeys([])
      }
    },
    changeProvince (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'city')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].cityCode = ''
        this.form.addressSaveDataList[index].cityName = '全部'
        this.form.addressSaveDataList[index].areaCode = ''
        this.form.addressSaveDataList[index].areaName = '全部'
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'city', index)
      }
    },
    changeCity (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'area')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].areaCode = ''
        this.form.addressSaveDataList[index].areaName = '全部'
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'area', index)
      }
    },
    changeArea (val, dif, index) {
      let obj = {}
      obj.areaParentCode = val
      if (dif === 'Management') {
        this.QueryManagementAreaList(obj, 'town')
      }
      if (dif === 'service') {
        this.form.addressSaveDataList[index].townCode = ''
        this.form.addressSaveDataList[index].townName = '全部'
        this.QueryServiceAreaList(obj, 'town', index)
      }
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    QueryManagementAreaList (val, flag) { // 省市
      LogisticsCompanyManage.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.management.areaPList = res.data
          }
          if (flag === 'city') {
            this.management.areaCList = res.data
          }
          if (flag === 'area') {
            this.management.areaQList = res.data
          }
          if (flag === 'town') {
            if (res.data.length === 0) {
              this.rules.mTown[0].required = false
            } else {
              this.rules.mTown[0].required = true
            }
            this.management.areaTList = res.data
          }
        }
      })
    },
    QueryServiceAreaList (val, flag, index) { // 省市
      LogisticsCompanyManage.QueryAreaList(val).then(res => {
        if (res.code === 200) {
          if (flag === 'province') {
            this.form.addressSaveDataList[index].serviceArr.PArray = res.data
          }
          if (flag === 'city') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.CArray = res.data
          }
          if (flag === 'area') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.QArray = res.data
          }
          if (flag === 'town') {
            res.data.unshift({areaCode: '', areaName: '全部'})
            this.form.addressSaveDataList[index].serviceArr.TArray = res.data
          }
        }
      })
    },
    insertCrmLogistics (val) { // 新增物流公司
      LoginAjax.ValidateUserName({account: this.form.account}).then(response => {
        if (response.code === 200 && !response.data) {
          LogisticsCompanyManage.insertCrmLogistics(val).then(res => {
            if (res.code === 200) {
              this.$router.push({path: '/basic-manage/logistics-company-manage'})
              this.$notify({
                type: 'success',
                message: '新增成功！'
              })
            }
          })
        } else {
          this.hasUserName = true
          this.$refs.form.validate()
        }
      })
    },
    updateCrmLogistics (val) { // 修改物流公司
      LoginAjax.ValidateUserName({account: this.form.account, accountId: this.form.accountId}).then(response => {
        if (response.code === 200 && !response.data) {
          LogisticsCompanyManage.updateCrmLogistics(val).then(res => {
            if (res.code === 200) {
              this.$router.push({path: '/basic-manage/logistics-company-manage'})
              this.$notify({
                type: 'success',
                message: '修改成功！'
              })
            }
          })
        } else {
          this.hasUserName = true
          this.$refs.form.validate()
        }
      })
    },
    deleteFile (val) { // 附件管理删除
      LogisticsCompanyManage.deleteFile(val).then(res => {
        if (res.code === 200) {
          this.form.attachId = ''
          this.form.attachName = ''
          this.$notify({
            type: 'success',
            message: '删除成功！'
          })
        }
      })
    },
    async queryRoleMenuList (val) { // 角色
      return new Promise((resolve, reject) => {
        LogisticsCompanyManage.queryRoleMenuList(val).then(res => {
          if (res.code === 200) {
            this.form.roleMenuLogisticsList = res.data.map((item, index) => {
              item.menuIdList = []
              item.roleId = item.id
              return item
            })
          }
          resolve(res.data)
        })
      })
    },
    async queryDetail (val) { // 修改详情
      return new Promise((resolve, reject) => {
        LogisticsCompanyManage.queryEditDetail(val).then(res => {
          if (res.code === 200) {
            if (res.data.addressSaveDataList.length > 1) {
              this.delBtnShow = true
            } else {
              this.delBtnShow = false
            }
            this.lastPoundageFee = res.data.goodsAllList[res.data.goodsAllList.length - 1].poundageFee
            this.form.goodsAllList = res.data.goodsAllList
            if (this.form.goodsAllList.length > 1) {
              this.form.goodsAllList.pop()
            }
            console.log(this.form, this.lastPoundageFee)
            this.form.dividedType = res.data.dividedType
            this.form.accountId = res.data.accountId
            this.form.logisticsId = res.data.logisticsId
            this.saveUserId = res.data.userId
            this.allDate = res.data
            this.form.logisticsName = res.data.logisticsName
            this.form.companyName = res.data.companyName
            this.form.account = res.data.account
            this.form.userName = res.data.userName
            this.form.phone = res.data.phone
            this.form.freightDefault = res.data.freightDefault
            this.form.addressSaveData.addressId = res.data.addressSaveData.addressId
            this.form.mProvince = res.data.addressSaveData.provinceCode
            this.form.mCity = res.data.addressSaveData.cityCode
            this.form.mArea = res.data.addressSaveData.areaCode
            this.form.mTown = res.data.addressSaveData.townCode
            this.form.areaInfo = res.data.addressSaveData.areaInfo
            this.form.deliveryMethod = res.data.deliveryMethod
            this.form.pickupMethod = res.data.pickupMethod
            this.form.freightSettlementMethod = res.data.freightSettlementMethod
            this.form.printMethod = res.data.printMethod
            this.form.mobilePrintMethod = res.data.mobilePrintMethod
            this.form.addressSaveDataList = []
            res.data.addressSaveDataList.map((innerItem, index) => {
              if (innerItem.cityCode === null) {
                innerItem.cityCode = ''
              }
              if (innerItem.areaCode === null) {
                innerItem.areaCode = ''
              }
              if (innerItem.townCode === null) {
                innerItem.townCode = ''
              }
              this.form.addressSaveDataList.push({
                addressId: innerItem.addressId,
                provinceCode: innerItem.provinceCode,
                provinceName: innerItem.provinceName,
                cityCode: innerItem.cityCode,
                cityName: innerItem.cityName,
                areaCode: innerItem.areaCode,
                areaName: innerItem.areaName,
                townCode: innerItem.townCode,
                townName: innerItem.townName,
                serviceArr: {
                  PArray: [],
                  CArray: [{
                    areaCode: innerItem.cityCode,
                    areaName: innerItem.cityName
                  }],
                  QArray: [{
                    areaCode: innerItem.areaCode,
                    areaName: innerItem.areaName
                  }],
                  TArray: [{
                    areaCode: innerItem.townCode,
                    areaName: innerItem.townName
                  }]
                }
              })
            })
            if (res.data.addressSaveDataList.length < 1) {
              this.form.addressSaveDataList = [{...this.defaultData}]
            }
            if (res.data.attachId) {
              this.fileList.push({name: res.data.attachName, url: `${process.env.API_BASE_URL}/crm/attach/seeFile?attachId=${res.data.attachId}`})
            }
            this.form.attachId = res.data.attachId
            this.form.attachName = res.data.attachName
            this.form.goodsCommissionRate = res.data.goodsCommissionRate
            this.form.logisticsProportion = res.data.logisticsProportion
            this.form.logistics = res.data.logistics
            this.form.businessModelList = res.data.businessModelList || []
            if (res.data.onlinePaySwitch === 0) {
              this.form.onlinePaySwitch = true
            }
            if (res.data.onlinePaySwitch === 1) {
              this.form.onlinePaySwitch = false
            }
          // this.form = {
          //   logisticsName: res.data.logisticsName,
          //   companyName: res.data.companyName,
          //   account: res.data.account,
          //   userName: res.data.userName,
          //   phone: res.data.phone,
          //   addressSaveData: { // 经营地址实体
          //     provinceCode: res.data.addressSaveData.provinceCode,
          //     cityCode: res.data.addressSaveData.cityCode,
          //     areaCode: res.data.addressSaveData.areaCode,
          //     townCode: res.data.addressSaveData.townCode
          //   }
          //   // deliveryMethod: [], // 配送方式
          //   // pickupMethod: [], // 取货方式
          //   // freightSettlementMethod: [], // 运费结算方式
          //   // printMethod: [], // 三联单打印
          //   // addressSaveDataList: [{
          //   //   provinceCode: '',
          //   //   cityCode: '',
          //   //   areaInfo: '',
          //   //   townCode: ''
          //   // }]
          // }
          }
          resolve(res.data)
        })
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
  .el-form-item__label{
    width: 120px!important;
  }
}
</style>

<style lang="less" scoped>
.creatLogisticsCompany {
  .info {
    margin-bottom: 30px;
  }
  .collectionFee {
    div, span {
      font-size: 13px;
      color: #606266;
    }
  }
  .card_btn {
    margin: 0 40px 20px 40px;
    .search-btn-con {
      float: right;
    }
  }
}
</style>
