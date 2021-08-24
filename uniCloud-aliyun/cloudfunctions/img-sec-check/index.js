'use strict';
const UniSecCheck = require('uni-sec-check')
exports.main = async (event, context) => {
  const uniSecCheck = new UniSecCheck({
    provider: 'mp-weixin',
    onlyUseCachedAccessToken: true
  })
  const image = event.image
  const imgSecCheckRes = await uniSecCheck.imgSecCheck({
    image
  })
  if (imgSecCheckRes.errCode === uniSecCheck.ErrorCode.RISK_CONTENT) {
    await uniCloud.deleteFile({
      fileList: [image]
    })
    return {
      errCode: imgSecCheckRes.errCode,
      errMsg: '图片存在风险，已自动删除',
      image
    }
  } else if (imgSecCheckRes.errCode) {
    console.log(`其他原因导致此文件未完成自动审核（错误码：${imgSecCheckRes.errCode}，错误信息：${imgSecCheckRes.errMsg}），需要人工审核`)
  }
  return {
    errCode: 0,
    errMsg: '',
    image
  }
};
