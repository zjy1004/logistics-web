<template>
  <div class="localtion-manager">
    <div id="map-container">
      <div v-if="!mapOption.center[0]" class="none-position">暂无站点位置信息</div>
    </div>
    <div class="search-con">
      <el-input placeholder="请输入司机姓名" v-model="form.driverName" clearable class="input-with-select">
        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import MapLoader from '@/assets/AMap.js'
import carIcon from '@/image/car2.gif'
import posIcon from '@/image/pos-icon.gif'
import LocationManageAjax from '@/api/LocationManage/LocationManage'
export default {
  name: 'LocationManage',
  data () {
    return {
      map: null,
      mapOption: {
        resizeEnable: true,
        center: ['', ''],
        zoom: 13
      },
      form: {
        driverName: ''
      },
      drivers: []
    }
  },
  methods: {
    search () {
      this.mapInit()
    },
    // 绘制站点
    drawStation (AMap) {
      let marker = new AMap.Marker({
        map: this.map,
        draggable: false,
        position: this.mapOption.center,
        riseOnHover: true,
        icon: new AMap.Icon({
          size: new AMap.Size(63, 70), // 图标的大小
          image: posIcon
        }),
        autoRotation: true,
        angle: 0
      })
      this.stationMarker = marker
      this.map.add(marker)
    },
    // 计算司机距站点距离（米）
    setDriverDistance (AMap) {
      this.drivers.forEach(driver => {
        driver.distance = Math.round(driver.marker.getPosition().distance(this.stationMarker.getPosition()))
      })
      this.drawDrivers(AMap)
    },
    // 绘制司机位置信息
    drawDrivers (AMap) {
      this.drivers = this.drivers.map(driver => {
        let marker = new AMap.Marker({
          map: this.map,
          draggable: false,
          position: new AMap.LngLat(driver.position[0], driver.position[1]),
          riseOnHover: true,
          icon: new AMap.Icon({
            size: new AMap.Size(63, 70), // 图标的大小
            image: carIcon
          }),
          autoRotation: true,
          angle: 0
        })
        marker.setLabel({
          offset: new AMap.Pixel(-20, 72), // 设置文本标注偏移量
          content: `<div class='info'>${driver.driverName} ${(driver.distance / 1000).toFixed(2)}km</div>`, // 设置文本标注内容
          direction: 'right' // 设置文本标注方位
        })
        driver.marker = marker
        this.map.add(marker)
        return driver
      })
    },
    // 根据司机及站点坐标重新设置中心点
    setNewCenter () {
      let newCenter = this.map.setFitView()
      this.mapOption.center[0] = newCenter.pc.lng
      this.mapOption.center[1] = newCenter.pc.lat
    },
    // 设置控制组件
    setControlBar (AMap) {
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Autocomplete', 'AMap.Driving'], () => {
        let toolbar = new AMap.ToolBar({position: 'RB', liteStyle: true})
        let scale = new AMap.Scale()
        var autoOptions = {
          // city 限定城市，默认全国
          city: '全国'
        }
        let complate = new AMap.Autocomplete(autoOptions)
        this.map.addControl(toolbar)
        this.map.addControl(scale)
        this.map.addControl(complate)
        // this.initRoute(AMap)
      })
    },
    // 绘制导航线路
    initRoute (AMap) {
      let drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME, // 路线规划策略
        ferry: 1, // 是否可以使用轮渡
        hideMarkers: false,
        showTraffic: true, // 是否显示实时路况信息
        isOutline: true, // 是否显示描边
        outlineColor: 'white', // 描边颜色
        autoFitView: false // 是否自动调整视野
      }
      let driving = new AMap.Driving(drivingOption)
      driving.search(new AMap.LngLat(111.602, 40.805), new AMap.LngLat(111.67, 40.83), (status, result) => {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            // 绘制第一条路线，也可以按需求绘制其它几条路线
            this.drawRoute(result.routes[0], AMap)
          }
        } else {
          console.log('获取驾车数据失败：' + result)
        }
      })
    },
    drawRoute (route, AMap) {
      let path = this.parseRouteToPath(route)
      let startMarker = new AMap.Marker({
        position: path[0],
        icon: new AMap.Icon({
          size: new AMap.Size(50, 50), // 图标的大小
          image: carIcon
        }),
        map: this.map
      })
      let endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: new AMap.Icon({
          size: new AMap.Size(50, 50), // 图标的大小
          image: posIcon
        }),
        map: this.map
      })
      let routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        lineJoin: 'round'
      })
      routeLine.setMap(this.map)

      // 调整视野达到最佳显示区域
      this.map.setFitView([ startMarker, endMarker, routeLine ])
    },
    parseRouteToPath (route) {
      let path = []
      for (let i = 0, l = route.steps.length; i < l; i++) {
        let step = route.steps[i]
        for (let j = 0, n = step.path.length; j < n; j++) {
          path.push(step.path[j])
        }
      }
      return path
    },
    mapInit () {
      MapLoader().then(AMap => {
        AMap.plugin(['AMap.Geolocation'], () => {
        // 查询站点位置信息
          LocationManageAjax.QueryStationLocation().then(res => {
            if (res.code === 200) {
              if (!res.data) {
                return false
              }
              let { longitude, latitude } = res.data
              this.mapOption.center[0] = res.data.longitude
              this.mapOption.center[1] = res.data.latitude
              if (!longitude || !latitude) {
                return false
              }
              LocationManageAjax.QueryDriverPosition(this.form).then(response => {
                if (res.code === 200) {
                  this.drivers = response.data.map(item => {
                    item.position = [item.longitude, item.latitude]
                    item.distance = ''
                    return item
                  })
                  this.drivers = this.drivers.filter(item => {
                    return (item.longitude && item.latitude) && (item.longitude !== 'null' && item.latitude !== 'null')
                  })
                  if (this.mapOption.center[0] || this.drivers.length > 0) {
                    this.map = new AMap.Map('map-container', this.mapOption)
                    this.setControlBar(AMap)
                    if (this.mapOption.center.lng && this.mapOption.center.lat) {
                      this.drawStation(AMap)
                    }
                    if (this.drivers.length > 0) {
                      this.drawDrivers(AMap)
                      if (this.mapOption.center.lng && this.mapOption.center.lat) {
                        this.setDriverDistance(AMap)
                      }
                    }
                    this.setNewCenter()
                  }
                }
              })
            }
          })
        })
      // this.map.clearMap()
      }, e => {
        console.log('地图加载失败', e)
      })
    }
  },
  mounted () {
    this.mapInit()
  }
}
</script>

<style lang="less" scoped>
@import '../../../style/base.less';
.localtion-manager{
  display: flex;
  flex: 1;
  position: relative;
  #map-container {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .none-position{
      .mixin-sc(16px;#333);
    }
  }
  .search-con{
    position: absolute;
    padding: 0px 10px;
    width: 300px;
    height: 40px;
    display: flex;
    align-items: center;
    margin: 10px 0px 0 10px;
    background: #fff;
    .stationSelect{
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
@import '../../../style/base.less';
.localtion-manager{
  .el-input-group__append{
    border-radius: 0px!important;
    button.el-button{
      border-radius: 0px!important;
      border: 1px solid #5677fc;
      background: #5677fc;
      color: #fff;
    }
  }
  #map-container {
    .amap-marker-label{
      border: none;
      background: #fff;
      opacity: 1;
      .info{
        font-weight: bold;
      }
    }
    .amap-icon{
      img{
        width: 90%!important;
        height: 100%!important;
      }
    }
  }
}
</style>
