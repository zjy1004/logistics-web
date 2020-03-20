<template>
  <div class="moreInfo">
    <div class="public_card">
      <h3 class="card_header">协议公示</h3>
      <div class="card_main">
        <div class="main">
          <div class="title">共 <span>{{listData.length}}</span> 条协议：</div>
          <div class="list">
            <ul>
              <a :href="'#/agreement?type=' +item.protocolType"  target="_blank" :key="index" v-for="(item,index) in listData"><li>《{{item.protocolName}}》&nbsp;&nbsp;&nbsp;&nbsp;<span>（{{item.createTime}}）</span></li></a>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAjax from '@/api/Login/Login'

export default {
  name: 'moreInfo',
  data () {
    return {
      listData: []
    }
  },
  created () {
    this.QueryProtocolVoList()
  },
  methods: {
    QueryProtocolVoList () { // 查询登录协议
      LoginAjax.QueryProtocolVoList().then((response) => {
        if (response.code === 200) {
          this.listData = response.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.moreInfo {
  display: flex;
  flex: 1;
  .main {
    margin: 20px 20px;
  }
  .title {
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    span {
      color: #f00;
    }
  }
  .list {
    li {
      height: 34px;
      line-height: 34px;
    }
  }
}
</style>
