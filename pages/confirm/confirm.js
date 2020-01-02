// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {},
    repastStyle:"堂食",
    repastTime:"立即用餐",
    timeList:[],
    description:"",
    repastNow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createTimeList();
    this.setData({
      goodsList: wx.getStorageSync('shoppingCart'),
      totalPrice: wx.getStorageSync('totalPrice'),
      totalNumber: wx.getStorageSync('totalNumber'),
      repastStyle: this.data.repastStyle,
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
        finalTime:0,
        repastTime: e.detail.value
      })
    }
    else{
      this.setData({
        repastTime: e.detail.value
      })
    }   
  },
  // 预约用餐时间
  selectReservationTime(e){
    this.setData({
      repastTime: this.data.timeList[e.detail.value]
    })

  },
  // 取消预约就餐时间
  cancelReservationTime:function(e){
    console.log(e);
    if(this.data.repastTime==="预约用餐"){
      this.setData({
        repastNow: true,
        repastTime: "立即用餐"
      })
    }
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
  },
  // 更新备注
  showRemark:function(e){
    this.setData({
      description:e.detail.value
    })

  },
  toPay:function(e){
    let order={};
    order.goodsList=this.data.goodsList;
    order.description=this.data.description;
    order.style=this.data.repastStyle;
    order.time=this.data.repastTime;
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/237196/neworder',
      data: order,
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        wx.showToast({
          title:'支付成功',
          icon:'success',
          duration: 2000
        })
        wx.reLaunch({
          url: '../orders/orders?id='+"res.data.id"
        })
        console.log(res);
      },
      fail: function(res) {
        console.log
        wx.showToast({
          title:'支付失败',
          icon:'fail',
          duration: 2000
        })
      },
      complete: function(res) {
        

      },
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