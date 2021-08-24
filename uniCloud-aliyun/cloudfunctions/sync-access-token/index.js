'use strict';
const createConfig = require('uni-config-center')
const configCenter = createConfig({
  pluginId: 'uni-sec-check'
})
const db = uniCloud.database()

// 此云函数需要设置为定时执行，已在package.json的cloudfunction-config字段内进行配置，目前配置为每隔一小时触发一次

exports.main = async (event, context) => {
  const {
    appid,
    appsecret
  } = configCenter.config('provider.mp-weixin')
  const res = await uniCloud.httpclient.request(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`, {
      dataType: 'json'
    })
  const {
    access_token: accessToken,
    expires_in: expiresIn
  } = res.data
  // uni-sec-check会自动读取数据库内的accessToken缓存，需要将此值存储在opendb-cloud-cache集合的_id为`access_token_mp-weixin_${appid}`的记录内
  const accessTokenCacheKey = `access_token_mp-weixin_${appid}`
  await db.collection('opendb-cloud-cache').doc(accessTokenCacheKey).set({
    value: accessToken,
    expired: Date.now() + expiresIn * 1000
  })
};
