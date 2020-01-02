// pages/products/products.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {},      //存放商品目录以及商品数量
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
      url: 'http://rap2api.taobao.org/app/mock/237196/productstest',
      method: 'GET',
      data: {},
      success: function (res) {
        wx.hideLoading();
        let listData={};
        // 将收到的object类型数据的整理成数组
        for(let index in res.data){
            listData[index]=res.data[index];
          for(let i in listData[index]){
            listData[index][i].number=0;
            listData[index][i].isStar=false;
          }
        }
        self.setData({
          goodsList: listData,
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
    let index = event.currentTarget.id;
    index=index.slice(4);
    this.setData({
      menuName: event.currentTarget.dataset.name,
      contentView: 'title' + index,
    })
  },
  // 滑动右侧联动左侧
  scrollContent:function(e){
    var rpxToPx = this.data.rpxToPx;
    var scrollHeight = e.detail.scrollTop;  
    var goodsData = this.data.goodsList;
    var sumHeight = 0;	
    for (let index in goodsData) { 
      // 35为title高度。250为每个item高度    
      sumHeight += 40*rpxToPx + goodsData[index].length * 250*rpxToPx;
      if (scrollHeight <= sumHeight) {
        this.setData({
          menuView: 'menu'+goodsData[index][0].id,
          menuName: index,
        })
        break;   
      }
    }
  },

  // 收藏菜品
  starGoods:function(e){
    let goodsData=this.data.goodsList;
    let id=e.target.dataset.item.id;
    for(let i in goodsData){
      for(let j in goodsData[i]){
        if(id===goodsData[i][j].id){
          goodsData[i][j].isStar=!goodsData[i][j].isStar;
          this.setData({
            goodsList:goodsData
          })
          return;
        }
        
      }
    }



  },


  // 添加商品
  addGoods:function(e){
    let item=e.currentTarget.dataset.item;
    let cartList = [];
    let goodsData=this.data.goodsList;
    for(let i in goodsData){
      for(let j in goodsData[i]){
        if(goodsData[i][j].id===item.id){
          goodsData[i][j].number++;
        }
        if(goodsData[i][j].number!==0){
          cartList.push(goodsData[i][j]);
        }
      }
    }
    this.setData({
      goodsList: goodsData,
      shoppingCart:cartList,
      totalPrice:this.data.totalPrice+item.price,
      totalNumber:this.data.totalNumber+1
    })


  },

  // 减少商品
  subtractGoods:function(e){
    let item=e.currentTarget.dataset.item;
    let cartList = [];
    let goodsData=this.data.goodsList;
    for(let i in goodsData){
      for(let j in goodsData[i]){
        if(goodsData[i][j].id===item.id){
          goodsData[i][j].number--;
        }
        if(goodsData[i][j].number!==0){
          cartList.push(goodsData[i][j]);
        }
      }
    }
    this.setData({
      goodsList: goodsData,
      shoppingCart:cartList,
      totalPrice:this.data.totalPrice-item.price,
      totalNumber:this.data.totalNumber-1
    })

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
    let goodsData=this.data.goodsList;
    for(let i in goodsData){
      for(let j in goodsData[i]){
        goodsData[i][j].number=0;
      }
    }
    
    this.setData({
      totalNumber:0,
      totalPrice:0,
      shoppingCart:[],
      goodsList:goodsData,
      showCartDetail:false
    })
  },
  // 购物车内实现数量减少
  subtractInCart:function(e){
    let item = e.currentTarget.dataset.item;
    let list=this.data.shoppingCart;
    let goodsData=this.data.goodsList;
    for(let index in list){
      if(item.id===list[index].id){
        list[index].number--;
        if(list[index].number===0){
          list.splice(index,1);
        }
        // 空元素弹出
        // for(let i in goodsData){
        //   for(let j in goodsData[i]){
        //     if(item.id===goodsData[i][j].id){
        //       console.log(goodsData[i][j].number);
        //       goodsData[i][j].number--;
        //       console.log(goodsData[i][j].number);
              
        //     }
        //   }
        // }
        break;
      }
    }
    this.setData({
      totalNumber:this.data.totalNumber-1,
      totalPrice:this.data.totalPrice-item.price,
      shoppingCart:list,
      goodsList:goodsData,
      showCartDetail:list.length===0?false:true,
    })
    
  },
  // 购物车内实现数量增加
  addInCart: function (e) {
    let item = e.currentTarget.dataset.item;
    let list=this.data.shoppingCart;
    let goodsData=this.data.goodsList;
    for(let index in list){
      if(item.id===list[index].id){
        list[index].number++;
        // 空元素弹出
        // for(let i in goodsData){
        //   for(let j in goodsData[i]){
        //     if(item.id===goodsData[i][j].id){
        //       console.log(goodsData[i][j].number);
        //       goodsData[i][j].number++;
        //       console.log(goodsData[i][j].number);
              
        //     }
        //   }
        // }
        break;
      }
    }
    this.setData({
      totalNumber:this.data.totalNumber+1,
      totalPrice:this.data.totalPrice+item.price,
      shoppingCart:list,
      goodsList:goodsData,
      showCartDetail:list.length===0?false:true,
    })
  },

  // 确认订单
  goToConfirm:function(){
    if(this.data.shoppingCart.length>0){
      wx.setStorageSync('shoppingCart', this.data.shoppingCart);
      wx.setStorageSync('totalNumber', this.data.totalNumber);
      wx.setStorageSync('totalPrice', this.data.totalPrice);
      wx.navigateTo({
        url: '../confirm/confirm',
      })
    }
  }
})