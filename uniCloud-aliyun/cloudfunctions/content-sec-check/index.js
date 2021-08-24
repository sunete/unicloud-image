'use strict';
const UniSecCheck = require('uni-sec-check')
exports.main = async (event, context) => {
  const uniSecCheck = new UniSecCheck({
    provider: 'mp-weixin',
    onlyUseCachedAccessToken: true
  })
  const contentSecCheckRes = await uniSecCheck.contentSecCheck({
    content: event.content
  })
  if (contentSecCheckRes.errCode === uniSecCheck.ErrorCode.RISK_CONTENT) {
    return {
      errCode: contentSecCheckRes.errCode,
      errMsg: '文字存在风险'
    }
  } else if (contentSecCheckRes.errCode) {
    console.log(`其他原因导致此文件未完成自动审核（错误码：${contentSecCheckRes.errCode}，错误信息：${contentSecCheckRes.errMsg}），需要人工审核`)
  }
  return {
    errCode: 0,
    errMsg: ''
  }
};
