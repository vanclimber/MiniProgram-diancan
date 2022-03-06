// pages/orders/orders.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 后端接口还没开发，所以伪数据进行实验
    storesList:[]

  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    app.$request('/orderlist')
      .then((res) => {
        this.setData({ storesList: res || [] });
    })
    if(options.id){
      wx.navigateTo({
        url: '../orderInfo/orderInfo?id='+options.id,
      })
    }

  },

  goToOrderInfo:function(e){
    let id=e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
      mask:true,
    });
    wx.navigateTo({
      url: '../orderInfo/orderInfo?id='+id,
    })
    wx.hideLoading();

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})