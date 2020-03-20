
export default function MapLoader () {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.11&callback=initAMap&key=ea92f3e85b39ca33f72a1ba1d14036f7'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}
