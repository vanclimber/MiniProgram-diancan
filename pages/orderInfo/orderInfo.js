// pages/orderInfo/orderInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    orderId:567,    //订单ID
    storeName:"建设路店",
    description:"这个味道不错",//订单备注
    status:"已支付",     //订单状态
    orderTime:"",  //下单时间
    repastStyle:"堂食",//就餐方式
    repastTime:"", //用餐时间
    payStyle:"微信支付",   //支付方式
    totalPrice:-1,
    totalNumber:-1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this;
    wx.request({
      url:'http://rap2api.taobao.org/app/mock/237196/orderdetail',
      data:{
        ID:options.id
      },
      method:'GET',
      success:function(res){
        let item=res.data;
        let price=0;
        let list=item.goodsList;
        for(let i in list){
          price+=list[i].price*list[i].num;
        }
          self.setData({
            goodsList:item.goodsList,
            orderId:item.orderID,
            description:item.description,
            orderTime:item.orderTime,
            status:item.status,
            repastTime:item.repastTime,
            repastStyle:item.repastStyle,
            totalPrice:price
          })   
      },
      fail:function(res){
        console.log(res);
      }

    });


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