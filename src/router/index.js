import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const routes = [
  {
    path: '/',
    name: 'Login',
    component: resolve => require(['@/views/Login/Login'], resolve),
    meta: {auth: true, title: '用户登录'}
  },
  // {
  //   path: '/downLoad',
  //   name: 'DownLoad',
  //   component: resolve => require(['@/views/DownLoad/DownLoad'], resolve),
  //   meta: { auth: true, title: '下载页' }
  // },
  {
    path: '/basic-manage/role-manage',
    name: 'RoleManage',
    component: resolve => require(['@/views/BasicManage/RoleManage/RoleManage'], resolve),
    meta: {auth: true, title: '角色管理'}
  },
  {
    path: '/basic-manage/organization-manage',
    name: 'OrganizationManage',
    component: resolve => require(['@/views/BasicManage/OrganizationManage/OrganizationManage'], resolve),
    meta: {auth: true, title: '组织管理'}
  },
  {
    path: '/basic-manage/role-card',
    name: 'RoleCard',
    component: resolve => require(['@/views/BasicManage/RoleManage/RoleCard'], resolve),
    meta: {auth: true, title: '新建角色'}
  },
  {
    path: '/basic-manage/logistics-staff-manage',
    name: 'LogisticsStaffList',
    component: resolve => require(['@/views/BasicManage/LogisticsStaffManage/LogisticsStaffList'], resolve),
    meta: {auth: true, title: '物流员工管理'}
  },
  {
    path: '/basic-manage/logistics-staff-manage/add',
    name: 'LogisticsStaffCard',
    component: resolve => require(['@/views/BasicManage/LogisticsStaffManage/LogisticsStaffCard'], resolve),
    meta: {auth: true, title: '新建物流员工'}
  },
  {
    path: '/basic-manage/logistics-staff-manage/detail',
    name: 'LogisticsStaffDetail',
    component: resolve => require(['@/views/BasicManage/LogisticsStaffManage/LogisticsStaffDetail'], resolve),
    meta: {auth: true, title: '物流员工详情'}
  },
  {
    path: '/basic-manage/route-manage',
    name: 'RouteList',
    component: resolve => require(['@/views/BasicManage/RouteManage/RouteList'], resolve),
    meta: {auth: true, title: '线路管理'}
  },
  {
    path: '/basic-manage/route-manage/add',
    name: 'RouteCard',
    component: resolve => require(['@/views/BasicManage/RouteManage/RouteCard'], resolve),
    meta: {auth: true, title: '新增线路'}
  },
  {
    path: '/basic-manage/customer-route',
    name: 'CustomerRoute',
    component: resolve => require(['@/views/BasicManage/CustomerRoute/CustomerRouteList'], resolve),
    meta: { auth: true, title: '客户线路' }
  },
  {
    path: '/basic-manage/customer-route/add',
    name: 'CustomerRouteCard',
    component: resolve => require(['@/views/BasicManage/CustomerRoute/CustomerRouteCard'], resolve),
    meta: { auth: true, title: '新建线路' }
  },
  {
    path: '/basic-manage/customer-route/look',
    name: 'LookCustomerRoute',
    component: resolve => require(['@/views/BasicManage/CustomerRoute/LookCustomerRoute'], resolve),
    meta: { auth: true, title: '查看信息' }
  },
  {
    path: '/basic-manage/self-route-config',
    name: 'SelfRouteList',
    component: resolve => require(['@/views/BasicManage/SelfRouteConfig/SelfRouteList'], resolve),
    meta: { auth: true, title: '自营路由配置' }
  },
  {
    path: '/basic-manage/self-route-config/creat-route',
    name: 'CreatSelfRoute',
    component: resolve => require(['@/views/BasicManage/SelfRouteConfig/CreatSelfRoute'], resolve),
    meta: { auth: true, title: '新建路由' }
  },
  {
    path: '/waybill-manage',
    name: 'WaybillManage',
    component: resolve => require(['@/views/WaybillManage/WaybillManage'], resolve),
    meta: {auth: true, title: '运单管理'}
  },
  {
    path: '/waybill-manage/new-waybill',
    name: 'NewWaybill',
    component: resolve => require(['@/views/WaybillManage/NewWaybill/NewWaybill'], resolve),
    meta: {auth: true, title: '新建运单'}
  },
  {
    path: '/service-center/funds-account',
    name: 'FundsAccount',
    component: resolve => require(['@/views/ServiceCenter/FundsAccount/FundsAccount'], resolve),
    meta: {auth: true, title: '资金账户'}
  },
  {
    path: '/service-center/dealer-account',
    name: 'DealerAccount',
    component: resolve => require(['@/views/ServiceCenter/DealerAccount/DealerAccount'], resolve),
    meta: {auth: true, title: '资金账户'}
  },
  {
    path: '/service-center/withdrawal-operation',
    name: 'WithdrawalOperation',
    component: resolve => require(['@/views/ServiceCenter/DealerAccount/subpage/WithdrawalOperation'], resolve),
    meta: {auth: true, title: '提现操作'}
  },
  {
    path: '/service-center/withdrawal-detail',
    name: 'WithdrawalDetail',
    component: resolve => require(['@/views/ServiceCenter/DealerAccount/subpage/WithdrawalDetail'], resolve),
    meta: {auth: true, title: '提现明细'}
  },
  {
    path: '/service-center/logistics-pay-detail',
    name: 'LogisticsPayConfig',
    component: resolve => require(['@/views/ServiceCenter/LogisticsPayment/LogisticsPayDetail'], resolve),
    meta: {auth: true, title: '驮付宝'}
  },
  {
    path: '/waybill-manage/waybill-statistics-list',
    name: 'WaybillStatisticsList',
    component: resolve => require(['@/views/WaybillManage/WaybillStatistics/WaybillStatisticsList'], resolve),
    meta: {auth: true, title: '发货运单'}
  },
  {
    path: '/operation-course',
    name: 'OperationCourse',
    component: resolve => require(['@/views/OperationCourse/OperationCourse'], resolve),
    meta: {auth: true, title: '运营路线'}
  },
  {
    path: '/operation-course/print-picking-bill',
    name: 'PrintPickingBill',
    component: resolve => require(['@/views/OperationCourse/PrintPickingBill/PrintPickingBill'], resolve),
    meta: {auth: true, title: '打印配货单'}
  },
  {
    path: '/operation-course/drop-shipping-detail',
    name: 'DropShippingDetail',
    component: resolve => require(['@/views/OperationCourse/DropShippingDetail/DropShippingDetail'], resolve),
    meta: {auth: true, title: '待发货单详情'}
  },
  {
    path: '/financing-manage',
    name: 'FinancingManage',
    component: resolve => require(['@/views/FinancingManage/FinancingManage'], resolve),
    meta: {auth: true, title: '财务管理'}
  },
  {
    path: '/basic-manage/car-manage',
    name: 'CarManage',
    component: resolve => require(['@/views/BasicManage/CarManage/CarManage'], resolve),
    meta: {auth: true, title: '车辆管理'}
  },
  {
    path: '/basic-manage/site-manage',
    name: 'SiteManage',
    component: resolve => require(['@/views/BasicManage/SiteManage/SiteManageList'], resolve),
    meta: {auth: true, title: '站点管理'}
  },
  {
    path: '/basic-manage/creat-site',
    name: 'CreatSite',
    component: resolve => require(['@/views/BasicManage/SiteManage/CreatSite'], resolve),
    meta: {auth: true, title: '新建站点'}
  },
  {
    path: '/basic-manage/logistics-company-manage',
    name: 'LogisticsCompanyManage',
    component: resolve => require(['@/views/BasicManage/LogisticsCompanyManage/LogisticsCompanyList'], resolve),
    meta: {auth: true, title: '物流公司管理'}
  },
  {
    path: '/basic-manage/creat-logistics-company',
    name: 'CreatLogisticsCompany',
    component: resolve => require(['@/views/BasicManage/LogisticsCompanyManage/CreatLogisticsCompany'], resolve),
    meta: {auth: true, title: '新建物流公司'}
  },
  {
    path: '/basic-manage/customer-manage',
    name: 'CustomerManage',
    component: resolve => require(['@/views/BasicManage/CustomerManage/CustomerManageList'], resolve),
    meta: {auth: true, title: '客户管理'}
  },
  {
    path: '/basic-manage/creat-customer',
    name: 'CreatCustomer',
    component: resolve => require(['@/views/BasicManage/CustomerManage/CreatCustomer'], resolve),
    meta: {auth: true, title: '新建客户'}
  },
  {
    path: '/basic-manage/inward-user-manage',
    name: 'InwardUserManage',
    component: resolve => require(['@/views/BasicManage/InwardUserManage/InwardUserList'], resolve),
    meta: {auth: true, title: '内部用户管理'}
  },
  {
    path: '/basic-manage/inward-user-card',
    name: 'InwardUserCard',
    component: resolve => require(['@/views/BasicManage/InwardUserManage/InwardUserCard'], resolve),
    meta: {auth: true, title: '新建内部用户'}
  },
  {
    path: '/basic-manage/inward-user-detail',
    name: 'InwardUserDetail',
    component: resolve => require(['@/views/BasicManage/InwardUserManage/InwardUserDetail'], resolve),
    meta: {auth: true, title: '内部用户详情'}
  },
  {
    path: '/waybill-manage/all-waybill',
    name: 'AllWaybill',
    component: resolve => require(['@/views/WaybillManage/WaybillManage/AllWaybill'], resolve),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/waybill-manage/waybill-detail',
    name: 'WaybillDetail',
    component: resolve => require(['@/views/WaybillManage/WaybillManage/WaybillDetail'], resolve),
    meta: {auth: true, title: '全部运单详情页'}
  },
  {
    path: '/operation-course/shift-plan',
    name: 'ShiftPlan',
    component: resolve => require(['@/views/OperationCourse/ShiftPlan/ShiftPlan'], resolve),
    meta: {auth: true, title: '班次计划管理'}
  },
  {
    path: '/financing-manage/financ-waybill-list',
    name: 'FinancWaybillLists',
    component: resolve => require(['@/views/FinancingManage/FinancWaybillManage/FinancWaybillList'], resolve),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/financing-manage/financ-waybill-detail',
    name: 'FinancWaybillDetail',
    component: resolve => require(['@/views/FinancingManage/FinancWaybillManage/FinancWaybillDetail'], resolve),
    meta: {auth: true, title: '全部运单详情页'}
  },
  {
    path: '/waybill-manage/distributor-waybill-manage-list',
    name: 'DistributorWaybillManageList',
    component: resolve => require(['@/views/WaybillManage/DistributorWaybillManage/DistributorWaybillManageList'], resolve),
    meta: {auth: true, title: '全部运单'}
  },
  {
    path: '/waybill-manage/distributor-waybill-manage-detail',
    name: 'DistributorWaybillManageDetail',
    component: resolve => require(['@/views/WaybillManage/DistributorWaybillManage/DistributorWaybillManageDetail'], resolve),
    meta: {auth: true, title: '全部运单详情页'}
  },
  {
    path: '/service-center/bookkeeping-flow-list',
    name: 'OnLineBookkeepingFlow',
    component: resolve => require(['@/views/FinancingManage/BookkeepingFlow/BookkeepingFlowList'], resolve),
    meta: {auth: true, title: '在线支付记账流水'}
  },
  {
    path: '/waybill-manage/return-goods-list',
    name: 'ReturnGoodsList',
    component: resolve => require(['@/views/WaybillManage/ReturnGoods/ReturnGoodsList'], resolve),
    meta: {auth: true, title: '待入库运单'}
  },
  {
    path: '/waybill-manage/return-goods-detail',
    name: 'ReturnGoodsDetail',
    component: resolve => require(['@/views/WaybillManage/ReturnGoods/ReturnGoodsDetail'], resolve),
    meta: {auth: true, title: '待入库运单详情页'}
  },
  {
    path: '/personal-manage/edit-password',
    name: 'EditPassWord',
    component: resolve => require(['@/views/BasicManage/PersonalManage/EditPassWord'], resolve),
    meta: {auth: true, title: '修改密码'}
  },
  {
    path: '/personal-manage/personal-info-logistics-company',
    name: 'PersonalInfoLogisticsCompany',
    component: resolve => require(['@/views/BasicManage/PersonalManage/PersonalInfoLogisticsCompany'], resolve),
    meta: {auth: true, title: '个人信息-物流公司'}
  },
  {
    path: '/personal-manage/personal-info-logistics-staff',
    name: 'PersonalInfoLogisticsStaff',
    component: resolve => require(['@/views/BasicManage/PersonalManage/PersonalInfoLogisticsStaff'], resolve),
    meta: {auth: true, title: '个人信息-物流员工'}
  },
  {
    path: '/personal-manage/personal-info-inward-user',
    name: 'PersonalInfoInwardUser',
    component: resolve => require(['@/views/BasicManage/PersonalManage/PersonalInfoInwardUser'], resolve),
    meta: {auth: true, title: '个人信息-内部用户'}
  },
  {
    path: '/personal-manage/personal-info-customer',
    name: 'PersonalInfoCustomer',
    component: resolve => require(['@/views/BasicManage/PersonalManage/PersonalInfoCustomer'], resolve),
    meta: {auth: true, title: '个人信息-客户管理'}
  },
  // 系统后台
  {
    path: '/system-manage/menu-manage',
    name: 'MenuManage',
    component: resolve => require(['@/views/SystemManage/MenuManage/MenuManage'], resolve),
    meta: {auth: true, title: '菜单管理'}
  },
  {
    path: '/system-manage/menu-card',
    name: 'MenuCard',
    component: resolve => require(['@/views/SystemManage/MenuManage/MenuCard'], resolve),
    meta: {auth: true, title: '菜单卡片'}
  },
  {
    path: '/financing-manage/outstanding-waybill',
    name: 'OutstandingWaybill',
    component: resolve => require(['@/views/FinancingManage/OutstandingWaybill/OutstandingWaybill'], resolve),
    meta: {auth: true, title: '待支付运单'}
  },
  {
    path: '/financing-manage/payment-history',
    name: 'PaymentHistory',
    component: resolve => require(['@/views/FinancingManage/PaymentHistory/PaymentHistory'], resolve),
    meta: { auth: true, title: '支付记录' }
  },
  {
    path: '/financing-manage/payment-history-detail',
    name: 'PaymentHistoryDetail',
    component: resolve => require(['@/views/FinancingManage/PaymentHistory/PaymentHistoryDetail'], resolve),
    meta: { auth: true, title: '支付记录详情' }
  },
  {
    path: '/financing-manage/outstanding-way-detail',
    name: 'OutstandingWayDetail',
    component: resolve => require(['@/views/FinancingManage/OutstandingWaybill/OutstandingWayDetail'], resolve),
    meta: {auth: true, title: '待支付运单详情'}
  },
  {
    path: '/financing-manage/monthly-freight',
    name: 'MonthlyFreight',
    component: resolve => require(['@/views/FinancingManage/Freight/MonthlyFreight/MonthlyFreight'], resolve),
    meta: {auth: true, title: '运费结算'}
  },
  {
    path: '/financing-manage/receipt-adjust',
    name: 'ReceiptAdjust',
    component: resolve => require(['@/views/FinancingManage/ReceiptAdjust/ReceiptAdjust'], resolve),
    meta: {auth: true, title: '收费调整'}
  },
  {
    path: '/service-center/state-page',
    name: 'StatePage',
    component: resolve => require(['@/views/ServiceCenter/StatePage/StatePage'], resolve),
    meta: {auth: true, title: '状态页'}
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: resolve => require(['@/views/BasicManage/PersonalManage/Agreement'], resolve),
    meta: {auth: true, title: '协议'}
  },
  {
    path: '/more-info',
    name: 'MoreInfo',
    component: resolve => require(['@/views/BasicManage/PersonalManage/MoreInfo'], resolve),
    meta: {auth: true, title: '更多'}
  },
  {
    path: '/receipt-money-config',
    name: 'ReceiptMoneyConfig',
    component: resolve => require(['@/views/BasicManage/PersonalManage/ReceiptMoneyConfig'], resolve),
    meta: { auth: true, title: '个人信息-代收款费用配置' }
  },
  {
    path: '/service-center/register-logistics-pay',
    name: 'RegisterLogisticsPay',
    component: resolve => require(['@/views/ServiceCenter/RegisterLogisticsPay/RegisterLogisticsPay'], resolve),
    meta: {auth: true, title: '驮付宝注册'}
  },
  {
    path: '/service-center/binding-card',
    name: 'BindingCard',
    component: resolve => require(['@/views/ServiceCenter/RegisterLogisticsPay/BindingCard'], resolve),
    meta: {auth: true, title: '绑定银行卡'}
  },
  {
    path: '/service-center/Continue-verification',
    name: 'ContinueVerification',
    component: resolve => require(['@/views/ServiceCenter/RegisterLogisticsPay/ContinueVerification'], resolve),
    meta: {auth: true, title: '继续认证'}
  },
  {
    path: '/basic-manage/configuration-of-joint-business',
    name: 'ConfigurationOfJointBusiness',
    component: resolve => require(['@/views/BasicManage/ConfigurationOfJointBusiness/ConfigurationOfJointBusiness'], resolve),
    meta: {auth: true, title: '联营业务配置'}
  },
  {
    path: '/basic-manage/configuration-of-joint-route',
    name: 'ConfigurationOfJointRoute',
    component: resolve => require(['@/views/BasicManage/ConfigurationOfJointRoute/ConfigurationOfJointRoute'], resolve),
    meta: { auth: true, title: '联营路由配置' }
  },
  {
    path: '/basic-manage/configuration-of-joint-route/add',
    name: 'CreatJointRoute',
    component: resolve => require(['@/views/BasicManage/ConfigurationOfJointRoute/CreatJointRoute'], resolve),
    meta: { auth: true, title: '新建路由' }
  },
  {
    path: '/basic-manage/joint-line-list',
    name: 'JointLineList',
    component: resolve => require(['@/views/BasicManage/JointLine/JointLineList'], resolve),
    meta: {auth: true, title: '联营线路'}
  },
  {
    path: '/basic-manage/joint-line-card',
    name: 'JointLineCard',
    component: resolve => require(['@/views/BasicManage/JointLine/JointLineCard'], resolve),
    meta: {auth: true, title: '联营线路'}
  },
  {
    path: '/basic-manage/check-joint-line',
    name: 'CheckJointLine',
    component: resolve => require(['@/views/BasicManage/JointLine/CheckJointLine'], resolve),
    meta: {auth: true, title: '联营线路'}
  },
  {
    path: '/basic-manage/join-dispatch-line-list',
    name: 'JoinDispatchLineList',
    component: resolve => require(['@/views/BasicManage/JoinDispatchLine/JoinDispatchLineList'], resolve),
    meta: {auth: true, title: '联营调度线路'}
  },
  {
    path: '/basic-manage/join-dispatch-line-list/check',
    name: 'CheckJoinDispatchLine',
    component: resolve => require(['@/views/BasicManage/JoinDispatchLine/CheckJoinDispatchLine'], resolve),
    meta: { auth: true, title: '查看信息' }
  },
  {
    path: '/basic-manage/join-route-info',
    name: 'JoinRouteInfo',
    component: resolve => require(['@/views/BasicManage/JoinRouteInfo/JoinRouteInfo'], resolve),
    meta: { auth: true, title: '联营路由信息' }
  },
  {
    path: '/basic-manage/proprietary-line-list',
    name: 'ProprietaryLineList',
    component: resolve => require(['@/views/BasicManage/ProprietaryLine/ProprietaryLineList'], resolve),
    meta: { auth: true, title: '自营线路' }
  },
  {
    path: '/basic-manage/proprietary-line-card',
    name: 'ProprietaryLineCard',
    component: resolve => require(['@/views/BasicManage/ProprietaryLine/ProprietaryLineCard'], resolve),
    meta: { auth: true, title: '新建自营线路' }
  },
  {
    path: '/basic-manage/look-proprietary-line',
    name: 'LookProprietaryLine',
    component: resolve => require(['@/views/BasicManage/ProprietaryLine/LookProprietaryLine'], resolve),
    meta: { auth: true, title: '查看信息' }
  },
  {
    path: '/financing-manage/receiptfrom-be-born-with-list',
    name: 'ReceiptfromBeBornWithList',
    component: resolve => require(['@/views/FinancingManage/ReceiptfromBeBornWith/ReceiptfromBeBornWithList'], resolve),
    meta: { auth: true, title: '向落地配收款' }
  },
  {
    path: '/financing-manage/receiptfrom-be-born-with',
    name: 'ReceiptfromBeBornWith',
    component: resolve => require(['@/views/FinancingManage/ReceiptfromBeBornWith/subpage/ReceiptfromBeBornWith'], resolve),
    meta: { auth: true, title: '向落地配收款' }
  },
  {
    path: '/financing-manage/receipt-from-staff-list',
    name: 'ReceiptFromStaffList',
    component: resolve => require(['@/views/FinancingManage/ReceiptFromStaff/ReceiptFromStaffList'], resolve),
    meta: { auth: true, title: '向员工收款' }
  },
  {
    path: '/financing-manage/receipt-from-staff',
    name: 'ReceiptFromStaff',
    component: resolve => require(['@/views/FinancingManage/ReceiptFromStaff/subpage/ReceiptFromStaff'], resolve),
    meta: { auth: true, title: '向员工收款' }
  },
  {
    path: '/waybill-manage/dispatch-waybill-list',
    name: 'DispatchWaybillList',
    component: resolve => require(['@/views/WaybillManage/DispatchWaybillManage/DispatchWaybillList'], resolve),
    meta: { auth: true, title: '调度运单查询' }
  },
  {
    path: '/waybill-manage/to-receive-waybill-List',
    name: 'ToReceiveWaybillList',
    component: resolve => require(['@/views/WaybillManage/DispatchWaybillManage/ToReceiveWaybillList'], resolve),
    meta: { auth: true, title: '待接收运单' }
  },
  {
    path: '/financing-manage/settlement-for-customersList',
    name: 'SettlementForCustomersList',
    component: resolve => require(['@/views/FinancingManage/SettlementForCustomers/SettlementForCustomersList'], resolve),
    meta: { auth: true, title: '给客户结算' }
  },
  {
    path: '/financing-manage/settlement-for-customers-queryList',
    name: 'SettlementForCustomersQueryList',
    component: resolve => require(['@/views/FinancingManage/SettlementForCustomers/SettlementForCustomersQueryList'], resolve),
    meta: { auth: true, title: '给客户结算查询列表' }
  },
  {
    path: '/financing-manage/unsettlement-for-customersList',
    name: 'UnSettlementForCustomersList',
    component: resolve => require(['@/views/FinancingManage/SettlementForCustomers/subpage/UnsettledForCustomersList'], resolve),
    meta: { auth: true, title: '未结算运单查看' }
  },
  {
    path: '/financing-manage/settlement-for-customersPage',
    name: 'SettlementForCustomersPage',
    component: resolve => require(['@/views/FinancingManage/SettlementForCustomers/subpage/SettlementForCustomersPage'], resolve),
    meta: { auth: true, title: '给客户结算对款结算页' }
  },
  {
    path: '/operation-statistics/waybill-export',
    name: 'WaybillExport',
    component: resolve => require(['@/views/OperationStatistics/WaybillExport/WaybillExport'], resolve),
    meta: { auth: true, title: '运营统计' }
  },
  {
    path: '/operation-statistics/platform-data-statistics',
    name: 'PlatformDataStatistics',
    component: resolve => require(['@/views/OperationStatistics/PlatformDataStatistics/PlatformDataStatistics'], resolve),
    meta: { auth: true, title: '平台数据统计' }
  },
  {
    path: '/operation-statistics/business-data-statistics',
    name: 'BusinessDataStatistics',
    component: resolve => require(['@/views/OperationStatistics/BusinessDataStatistics/BusinessDataStatistics'], resolve),
    meta: { auth: true, title: '业务数据统计' }
  },
  {
    path: '/timely-delivery/timely-waybill-manage',
    name: 'TimelyWaybillManage',
    component: resolve => require(['@/views/TimelyDelivery/WaybillManage/TimelyWaybillManage'], resolve),
    meta: { auth: true, title: '运单管理' }
  },
  {
    path: '/timely-delivery/timely-waybill-detail',
    name: 'TimelyWaybillDetail',
    component: resolve => require(['@/views/TimelyDelivery/WaybillManage/TimelyWaybillDetail'], resolve),
    meta: { auth: true, title: '运单详情' }
  },
  {
    path: '/timely-delivery/freight-check',
    name: 'FreightCheck',
    component: resolve => require(['@/views/TimelyDelivery/FreightCheck/FreightCheck'], resolve),
    meta: { auth: true, title: '运费核对' }
  },
  {
    path: '/timely-delivery/payment-check',
    name: 'PaymentCheck',
    component: resolve => require(['@/views/TimelyDelivery/PaymentCheck/PaymentCheck'], resolve),
    meta: { auth: true, title: '货款核对' }
  },
  {
    path: '/timely-delivery/station-order',
    name: 'StationOrder',
    component: resolve => require(['@/views/TimelyDelivery/StationOrder/StationOrder'], resolve),
    meta: { auth: true, title: '站点开单' }
  },
  {
    path: '/timely-delivery/statistics',
    name: 'Statistics',
    component: resolve => require(['@/views/TimelyDelivery/Statistics/Statistics'], resolve),
    meta: { auth: true, title: '统计' }
  },
  {
    path: '/timely-delivery/location-manage',
    name: 'LocationManage',
    component: resolve => require(['@/views/TimelyDelivery/LocationManage/LocationManage'], resolve),
    meta: { auth: true, title: '位置管理' }
  },
  {
    path: '/timely-delivery/creat-tasks/collect-task',
    name: 'CollectTask',
    component: resolve => require(['@/views/TimelyDelivery/CreateTasks/CollectTask'], resolve),
    meta: { auth: true, title: '揽收任务' }
  },
  {
    path: '/timely-delivery/creat-tasks/delivery-task',
    name: 'DeliveryTask',
    component: resolve => require(['@/views/TimelyDelivery/CreateTasks/DeliveryTask'], resolve),
    meta: { auth: true, title: '配送任务' }
  },
  {
    path: '/waybill-manage/edit-waybill',
    name: 'EditWaybill',
    component: resolve => require(['@/views/WaybillManage/NewWaybill/EditWaybill'], resolve),
    meta: {auth: true, title: '修改运单'}
  }
]

let router = new Router({
  // mode: 'history',
  history: false,
  hashbang: true,
  base: process.env.ROUTER_BASE,
  routes
})

router.beforeEach((to, from, next) => {
  // 路由进入控制
  if (to.name === 'NewWaybill' && to.query.index === 'add') {
    document.title = '新建运单'
  } else if (to.name === 'NewWaybill' && to.query.index === 'revoke') {
    document.title = '退货运单'
  } else if (to.name === 'NewWaybill' && to.query.index === 'tracking') {
    document.title = '补录运单'
  } else if (to.name === 'FinancWaybillLists' && to.query.index === '0') {
    document.title = '全部运单'
  } else if (to.name === 'FinancWaybillLists' && to.query.index === '1') {
    document.title = '待收款运单'
  } else if (to.name === 'FinancWaybillLists' && to.query.index === '2') {
    document.title = '待结算运单'
  } else if (to.name === 'FinancWaybillLists' && to.query.index === '3') {
    document.title = '已完结运单'
  } else if (to.name === 'FinancWaybillDetail' && to.query.waybillTitle === '全部运单') {
    document.title = '全部运单详情'
  } else if (to.name === 'FinancWaybillDetail' && to.query.waybillTitle === '待收款运单') {
    document.title = '待收款运单详情'
  } else if (to.name === 'FinancWaybillDetail' && to.query.waybillTitle === '待结算运单') {
    document.title = '待结算运单详情'
  } else if (to.name === 'FinancWaybillDetail' && to.query.waybillTitle === '已完结运单') {
    document.title = '已完结运单详情'
  } else if (to.name === 'FinancWaybillDetail' && to.query.waybillTitle === '运费结算') {
    document.title = '运费结算详情'
  } else if (to.name === 'ReturnGoodsList' && to.query.index === 'prepareForStorage') {
    document.title = '待入库运单'
  } else if (to.name === 'ReturnGoodsList' && to.query.index === 'prepareForReturn') {
    document.title = '待退货运单'
  } else if (to.name === 'ReturnGoodsList' && to.query.index === 'prepareForStorageComplete') {
    document.title = '已完成运单'
  } else if (to.name === 'ReturnGoodsList' && to.query.index === 'cancel') {
    document.title = '已取消运单'
  } else if (to.name === 'ReturnGoodsDetail' && to.query.waybillTitle === '待入库运单') {
    document.title = '待入库运单详情'
  } else if (to.name === 'ReturnGoodsDetail' && to.query.waybillTitle === '待退货运单') {
    document.title = '待退货运单详情'
  } else if (to.name === 'ReturnGoodsDetail' && to.query.waybillTitle === '已完成运单') {
    document.title = '已完成运单详情'
  } else if (to.name === 'ReturnGoodsDetail' && to.query.waybillTitle === '已取消运单') {
    document.title = '已取消运单详情'
  } else if (to.name === 'AllWaybill' && to.query.index === '0') {
    document.title = '全部运单'
  } else if (to.name === 'AllWaybill' && to.query.index === '1') {
    document.title = '待发货运单'
  } else if (to.name === 'AllWaybill' && to.query.index === '2') {
    document.title = '运输中运单'
  } else if (to.name === 'AllWaybill' && to.query.index === '3') {
    document.title = '已签收运单'
  } else if (to.name === 'AllWaybill' && to.query.index === '4') {
    document.title = '已关闭运单'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '全部运单') {
    document.title = '全部运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '待发货运单') {
    document.title = '待发货运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '运输中运单') {
    document.title = '运输中运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '已签收运单') {
    document.title = '已签收运单详情'
  } else if (to.name === 'WaybillDetail' && to.query.waybillTitle === '已关闭运单') {
    document.title = '已关闭运单详情'
  } else if (to.name === 'Agreement' && to.query.type === '1') {
    document.title = '中驰车福物流云平台网站注册服务协议'
  } else if (to.name === 'Agreement' && to.query.type === '2') {
    document.title = '物流云 “驮付宝”货款收取见证系统使用规则'
  } else if (to.name === 'Agreement' && to.query.type === '3') {
    document.title = '量子金福平台服务协议'
  } else {
    document.title = to.meta.title
  }
  next()
})
router.afterEach((to, from, next) => {

})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
export default router
