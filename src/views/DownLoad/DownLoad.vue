<template>
  <div id="download" class="download">
    <div style="width: 100%;background: white;">
      <div class="download-header">
        <div class="logo"></div>
        <div class="header-text">物流云平台/app下载中心</div>
        <div class="go_autozi">
          <!-- <a href="http://wl.autozi.com" target="_blank"> -->
          <a href="http://wl.autozi.com">
            返回登录
            <span>></span>
          </a>
        </div>
      </div>
    </div>
    <div class="download-banner">
      <!-- <img src="../../image/login.png" class="banner"/> -->
      <img src="../../image/banner.jpg" class="banner"/>
    </div>
    <div class="download-app">
      <div class="app-msg">
        物流云平台 产品App
      </div>
      <ul>
        <!-- s-物流商 -->
        <li>
          <div class="app-icon">
            <img src="../../image/wls_logo.png" class="logo" />
          </div>
          <div class="app-info">
            <div class="app-title">中驰车福物流商</div>
            <a href="https://www.baidu.com">
              <img src="../../image/android_new.png" />
            </a>
            <a href="https://www.baidu.com">
              <img src="../../image/ios_new.png" />
            </a>
          </div>
          <div class="app-code">
            <img src="../../image/wls_wm.png" class="code" />
          </div>
        </li>
        <!-- e-物流商 -->
        <!-- s-物流商 -->
        <li>
          <div class="app-icon">
            <img src="../../image/wls_logo.png" class="logo" />
          </div>
          <div class="app-info">
            <div class="app-title">中驰车福物流商</div>
            <a href="https://www.baidu.com">
              <img src="../../image/android_new.png" />
            </a>
            <a href="https://www.baidu.com">
              <img src="../../image/ios_new.png" />
            </a>
          </div>
          <div class="app-code">
            <img src="../../image/wls_wm.png" class="code" />
          </div>
        </li>
        <!-- e-物流商 -->
      </ul>
      <ul>
        <li>
          <div class="app-icon">
            <img src="../../image/wls_logo.png" class="logo" />
          </div>
          <div class="app-info">
            <div class="app-title">中驰车福物流商</div>
            <a href="https://www.baidu.com">
              <img src="../../image/android_new.png" />
            </a>
            <a href="https://www.baidu.com">
              <img src="../../image/ios_new.png" />
            </a>
          </div>
          <div class="app-code">
            <img src="../../image/wls_wm.png" class="code" />
          </div>
        </li>
        <li>
          <div class="app-icon">
            <img src="../../image/wls_logo.png" class="logo" />
          </div>
          <div class="app-info">
            <div class="app-title">中驰车福物流商</div>
            <a href="https://www.baidu.com">
              <img src="../../image/android_new.png" />
            </a>
            <a href="https://www.baidu.com">
              <img src="../../image/ios_new.png" />
            </a>
          </div>
          <div class="app-code">
            <img src="../../image/wls_wm.png" class="code" />
          </div>
        </li>
      </ul>
    </div>
    <div class="download-footer">Copyright © Autozi.com 2018 All Rights Reserved. Powered by Autozi</div>
  </div>
</template>

<script>
export default {
  name: 'DownLoad',
  data () {
    return {
    }
  },
  created () {
    this.$nextTick(() => {
      let layCon = document.getElementById('autozi-lay-con')
      layCon.style.overflowY = 'auto'
    })
  },
  methods: {
  },
  mounted () {
  },
  components: {}
}
</script>

<style lang="less" scoped>
@import '../../style/base.less';
.download{
  display: flex;
  flex: 1;
  // overflow-y: auto;
  flex-direction: column;
  background: #f7f7f7;
  .download-header{
    width: 1200px;
    height: 90px;
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 auto;
    .logo{
      display: block;
      .mixin-logidtic(140px;54px;-32px;-32px);
    }
    .header-text{
      margin-left: 22px;
      font-size: 24px;
      height: 24px;
      color: #333;
    }
    .go_autozi {
      line-height: 90px;
      margin-left: 660px;
    }
    .go_autozi a {
      color: #666;
      font-size: 16px;
      cursor: pointer;
    }
    .go_autozi a:hover {
      color: #5677fc;
    }
    .go_autozi a span {
      font-size: larger;
      color: #5677fc;
    }
  }
  .download-banner {
    width: 100%;
    height: 300px;
    display: flex;
    flex: 1;
    .banner {
      width: 100%;
      height: 300px;
    }
  }
  .download-app{
    display: flex;
    // min-height: calc(100vh - 460px);
    height: auto;
    width: 100%;
    // margin: 0 auto;
    flex-direction: column;
    background: #f7f7f7;
    padding: 20px 280px;
    .app-msg {
      width: 477px;
      height: 30px;
      line-height: 30px;
      font-size: 24px;
      color: #333333;
      font-weight: normal;
      padding: 0 25px;
      margin-bottom: 20px;
    }
    ul {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    li {
      width: 490px;
      height: 184px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 18px;
      box-shadow: 5px 5px 15px rgba(100,100,100,.1), -5px -5px 15px rgba(100,100,100,.1);
    }
    .app-icon {
      width: 130px;
      height: 130px;
      .logo {
        width: 100%;
        height: 100%;
      }
    }
    .app-info {
      width: 160px;
      height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .app-title {
        font-size: 22px;
        color: #434343;
        text-align: center;
      }
      a {
        width: 160px;
        height: 40px;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .app-code {
      width: 130px;
      height: 130px;
      .code {
        width: 100%;
        height: 100%;
      }
    }
  }
  .download-footer{
    width: 100%;
    height: 70px;
    .mixin-sc(12px;#969696);
    text-align: center;
    line-height: 70px;
    background: #f7f7f7;
  }
}
</style>
