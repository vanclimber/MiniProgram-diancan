const app = getApp();
/*
url: 请求地址，必填；
data: 请求体，含义和
params: 一些例如header,timeout等参数，详见小程序开发文档。
ignoreError: 默认将会自动捕获reject
与官方不同的是，封装后的请求默认请求方式是post。
*/
const $request = (url,data = {},params = {}, ignoreError = true) => {
  let header = params.header || {};
  // 可以选择是否携带token
 // header["X-Access-Token"] = app.globalData["X-Access-Token"];

  const promise = new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url,
      data,
      method: 'POST',
      ...params,
      header,
      success: (res) => {
        // token发生了更新
        // if (res.header["X-Access-Token"]) {
        //   app.globalData["X-Access-Token"] = res.header["X-Access-Token"]
        // }
        // code码为200，说明请求正常返回。
        if (res.statusCode === 200) {
          // 后端封装的业务码，为零一切正常，否则message将会携带错误信息。
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            reject(res.data.data);
          }
        } else {
          wx.showToast({
            title: JSON.stringify(res.data),
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: JSON.stringify(err.errMsg),
          icon: 'none',
          mask: true
        });
        reject(err);
      },
      complete: () => {
        wx.hideLoading();
      }
    })

  })

  return ignoreError ? promise.catch(()=>{}) : promise;
};