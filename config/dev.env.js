'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_BASE_URL: '"http://172.16.2.4:8081"',
  //API_BASE_URL: '"http://172.16.1.175:8085"',
  //API_BASE_URL: '"http://172.16.3.53:8085"',
  API_BASE_URL: '"http://172.16.1.121:8085"',
  //API_BASE_URL: '"http://logistics.b2bex.com"', // 琳雁
  DEBUG_MODE: true
})
 