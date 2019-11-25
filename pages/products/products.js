// pages/products/products.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    shoppingCart:[],
    totalPrice:0,
    showCartDetail: false,
    totalNumber:0,
    rpxToPx: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self=this;
    wx.showLoading({
      title: '正在努力加载中',
    })
    // 在easy-mock中伪造数据
    // eaay-mock老是炸，所以我在rap2伪造数据。
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/237196/products',
      method: 'GET',
      data: {},
      success: function (res) {
        wx.hideLoading();
        var listData=[];
        // 将收到的object类型数据的整理成数组
        for(var index in res.data){
          listData.push(res.data[index])
        }
        self.setData({
          listData: listData,
        })
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '哎呀，加载失败了',
          icon:'none',
          duration:1000
        })

      }
      
    })
    // rpx和px进行转换
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          rpxToPx: res.screenWidth / 750
        })
      }
    })

  },
  // 点击左侧联动右侧
  selectMenu:function(event){
    var index = event.currentTarget.dataset.index;
    this.setData({
      menuIndex: index,
      contentView: 'title' + index,
    })
  },
  // 滑动右侧联动左侧
  scrollContent:function(e){
    var rpxToPx = this.data.rpxToPx;
    var scrollHeight = e.detail.scrollTop;  
    var goodsData = this.data.listData;
    var sumHeight = 0;	
    for (var index=0;index<goodsData.length;index++) { 
      var type = goodsData[index];
      var dishSize = type.content.length;
      // 35为title高度。250为每个item高度    
      sumHeight += 35*rpxToPx + dishSize * 250*rpxToPx;
      if (scrollHeight <= sumHeight) {
        this.setData({
          menuView: 'menu'+index,
          menuIndex: index,
        })
        break;   
      }
    }
  },
  // 添加商品
  addCart:function(e){
    var num=this.data.totalNumber;
    var item=e.currentTarget.dataset.item;
    var cartList = this.data.shoppingCart;
    var addItem = {
      "name": item.name,
      "id": item.id,
      "price": item.price,
      "number": 1
    }
    for(var i in cartList){
      if (cartList[i].id === addItem.id){
        cartList[i].number++;
        this.setData({
          shoppingCart:cartList,
          totalPrice:this.data.totalPrice+addItem.price,
          totalNumber:num+1
        })
        addItem=null;
        break;
      }
    }
    if(addItem!==null){
      cartList.push(addItem);
      this.setData({
        shoppingCart: cartList,
        totalPrice:this.data.totalPrice+addItem.price,
        totalNumber: num + 1
      })
    }

  },
  // 开关购物车详情页面
  controlCart:function(){
    if(this.data.totalNumber!=0){
      var controller = this.data.showCartDetail;
      this.setData({
        showCartDetail: !controller
      })
    }
  },
  // 关闭购物车
  hideCart:function(){
    this.setData({
      showCartDetail:false
    })
  },

  // 打开购物车
  showCart:function(){
    this.setData({
      showCartDetail:true
    })
  },
  // 清空购物车
  clearCart:function(){
    this.setData({
      totalNumber:0,
      totalPrice:0,
      shoppingCart:[],
      showCartDetail:false
    })
  },
  // 购物车内实现数量减少
  subtractItem:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var list=this.data.shoppingCart;
    var index=0;
    for(var i in list){
      if(id===list[i].id){
        index=i;
        break;
      }
    }
    var price=list[index].price;
    list[index].number--;
    console.log(list[index].number);
    if (list[index].number == 0) {
      list.splice(index, 1);
    }
    this.setData({
      totalNumber:this.data.totalNumber-1,
      totalPrice:this.data.totalPrice-price,
      shoppingCart:list,
      showCartDetail:list.length===0?false:true,
    })
    
  },
  // 购物车内实现数量增加
  addItem: function (e) {
    var id = e.currentTarget.dataset.id;
    var list = this.data.shoppingCart;
    var index = 0;
    for (var i in list) {
      if (id === list[i].id) {
        index = i;
        break;
      }
    }
    list[index].number++;
    this.setData({
      totalNumber: this.data.totalNumber + 1,
      totalPrice: this.data.totalPrice + list[index].price,
      shoppingCart:list,
      showCartDetail: true,
    })
    console.log(this.data.showCartDetail)
  }
})