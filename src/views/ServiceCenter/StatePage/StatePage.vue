<template>
  <div class="state-page">
    <!-- 不予开通 -->
    <div v-if="status === 1" class="no-allow-dredge">
      <div class="tip"><i class="el-icon-circle-close-outline"></i>无法申请</div>
      <div class="tip-text">贵公司服务物流公司未开通在线支付，无法申请虚拟账户</div>
    </div>
    <!-- 审核中 -->
    <div v-if="status === 2" class="audit">
      <div class="audit-tip"><i class="el-icon-time"></i>审核中，请耐心等待</div>
      <div class="content">
        <div class="fist"><i class="el-icon-circle-check-outline"></i></div>
        <div class="first-text">发起审核<div class="time">2018-11-21 12:32:34</div></div>
        <div class="first-line"></div>
        <div class="second">2</div>
        <div class="second-text">审核中<div class="time">2018-11-21 12:32:34</div></div>
        <div class="second-line"></div>
        <div class="three">3</div>
        <div class="three-text">审核结果<div class="time">2018-11-21 12:32:34</div></div>
      </div>
    </div>
    <!-- 审核不通过 -->
    <div v-if="status === 3" class="no-dredge">
      <div class="tip"><i class="el-icon-circle-close-outline"></i>审核不通过</div>
      <div class="tip-text">驳回原因：XXXXXXXXXXXXXXXXXXXXXXX</div>
      <div class="apply-con">
        <el-button class="btn-main" @click="apply()">再次申请</el-button>
      </div>
    </div>
    <!--支付成功 -->
    <div class="pay-success">
      <div class="tip"><i class="el-icon-circle-check-outline"></i>支付成功</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatePage',
  data () {
    return {
      status: 4
    }
  },
  // watch: {
  //   $route (to, from) {
  //     if (to.name === 'StatePage') {
  //       if (to.query && to.query.index === '2') { // 审核中
  //         this.status = 2
  //       } if (to.query && to.query.index === '3') {
  //         this.hasRegister = true
  //       } else if (to.query && to.query.index === '4') { // 支付成功
  //         this.status = 4
  //       }
  //     }
  //   },
  //   deep: true
  // },
  // created () {
  //   if (this.$route.query && this.$route.query.index === '2') { // 审核中
  //     this.status = 2
  //   } if (this.$route.query && this.$route.query.index === '3') {
  //     this.hasRegister = true
  //   } else if (to.query && to.query.index === '4') { // 支付成功
  //     this.status = 4
  //   }
  //   this.init()
  // },
  methods: {
    init () {

    },
    apply () {

    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.state-page{
  display: flex;
  flex: 1;
  background: #fff;
  // 不予开通
  .no-allow-dredge{
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .tip{
      height: 24px;
      display: flex;
      align-items: center;
      .mixin-sc(17px;#666);
      margin-bottom: 10px;
      i{
        .mixin-sc(24px;#ff4c4c);
        margin-right: 5px;
      }
    }
    .tip-text{
      height: 20px;
      .mixin-sc(14px;#999);
    }
  }
  // 审核中
  .audit{
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .audit-tip{
      height: 24px;
      display: flex;
      align-items: center;
      .mixin-sc(17px;#666);
      margin-bottom: 50px;
      i{
        .mixin-sc(24px;#5677fc);
        margin-right: 5px;
      }
    }
    .content{
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      .fist{
        width: 35px;
        height: 35px;
        margin-right: 5px;
        i{
          .mixin-sc(35px;#5677fc);
        }
      }
      .second,.three{
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 50%;
        background: #5677fc;
        margin-right: 5px;
        .mixin-sc(14px;#fff);
      }
      .three{
        .mixin-sc(14px;#d0d0d0);
        background: #fff;
        border: 1px solid #d0d0d0;
      }
      .first-text,.second-text,.three-text{
        width: 60px;
        height: 14px;
        position: relative;
        .mixin-sc(14px;#333);
        .time{
          position: absolute;
          left: 0px;
          top: 25px;
          width: 140px;
          height: 12px;
          line-height: 12px;
          .mixin-sc(12px;#999);
        }
      }
      .first-line,.second-line{
        width: 156px;
        height: 1px;
        background: #5677fc;
        margin-right: 5px;
      }
      .second-line{
        background: #e5e5e5;
      }
    }
  }
  // 审核不通过
  .no-dredge{
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .tip{
      height: 24px;
      display: flex;
      align-items: center;
      .mixin-sc(17px;#666);
      margin-bottom: 10px;
      i{
        .mixin-sc(24px;#ff4c4c);
        margin-right: 5px;
      }
    }
    .tip-text{
      height: 20px;
      .mixin-sc(14px;#999);
    }
    .apply-con{
      margin-top: 20px;
    }
  }
  // 支付成功
  .pay-success{
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .tip{
      font-size: 26px;
      color: #333;
    }
    .el-icon-circle-check-outline{
      font-size: 28px;
      color: green;
      margin-right: 10px;
    }
  }
}
</style>
