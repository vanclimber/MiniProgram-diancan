// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repastStyle:"堂食",
    repastTime:"立即用餐",
    timeList:[],
    finalTime:0,
    newOrder:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = {
      goodsList: wx.getStorageSync('shoppingCart'),
      totalPrice: wx.getStorageSync('totalPrice'),
      totalNumber: wx.getStorageSync('totalNumber'),
      repastStyle: this.data.repastStyle,
    }
    this.createTimeList();
    console.log(order);
    this.setData({
      newOrder:order
    })

  },
  // 选择就餐方式
  choiceRepastStyle:function(e){
    this.setData({
      repastStyle: e.detail.value
    })
      // neworder数据不需要渲染,因此不需要setdata
    this.data.newOrder.repastStyle=this.data.repastStyle;
  },
  //选择就餐时间
  choiceRepastTime:function(e){
    if (e.detail.value ==="立即用餐"){
      this.setData({
        finalTime:0
      })
    }
    this.setData({
      repastTime: e.detail.value
    })
  },
  // 预约用餐时间
  selectReservationTime(e){
    this.setData({
      finalTime: this.data.timeList[e.detail.value]
    })

  },
  // 生成就餐时间列表
  createTimeList:function(e){
    let date=new Date();
    let timeList=[];
    let hours;
    let minutes;
    while(date.getHours()<23){
      date.setMinutes(date.getMinutes()+15);
      hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeList.push( hours+ ":" + minutes);
    }
    this.setData({
      timeList:timeList,
    })
    console.log(date);
  },
  // 更新备注
  // showRemark:function(e){
  //   console.log(e.detail.value);
  // },
  toPay:function(e){
    console.log(this.data.newOrder)
    wx:wx.request({
      url: 'http://rap2api.taobao.org/app/mock/237196/neworder',
      data: {
        order: this.data.newOrder

        },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {},
    })

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