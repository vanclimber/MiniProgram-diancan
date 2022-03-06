// pages/products/products.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],      //存放商品列表
    typeList:[],
    shoppingCart:[],
    totalPrice:0,
    showCartDetail: false,
    totalNumber:0,
    rpxToPx: 2,
    menuIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在easy-mock中伪造数据
    // easy-mock老是炸，所以我在rap2伪造数据。
    const self = this;
    app.$request('/products')
      .then((res) => {
        console.log(res);
        let goodsList=[];
        let typeList=[];
        for(let i in res){
          typeList.push(res[i].type);
          for(let j in res[i].list){
            goodsList.push({
              ...res[i]['list'][j],
              foodType: res[i].type,
              number: 0,
              isStar: false,
              tasteSelected: res[i]['list'][j].tastes[0]
            })
          }
        }
        self.setData({
          goodsList: goodsList,
          typeList:typeList,
        })
        
    })
    // rpx和px进行转换
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          rpxToPx: res.screenWidth / 750
        })
      }
    });

  },
  // 点击左侧联动右侧
  selectMenu:function(event){
    let typeName = this.data.typeList[event.currentTarget.id.slice(4)];
    let goodsList=this.data.goodsList;
    let id;
    for(let i in goodsList){
      if(typeName==goodsList[i].foodType){
        id=goodsList[i].id;
        break;
      }
    }
    this.setData({
      menuIndex: event.currentTarget.dataset.index,
      contentView: 'title' + id,
    })
  },
  // 滑动右侧联动左侧
  scrollContent:function(e){
    let rpxToPx = this.data.rpxToPx;
    let scrollHeight = e.detail.scrollTop;  
    let goodsData = this.data.goodsList;
    let sumHeight = 0;	
    for (let index in goodsData) { 
      // 40为title高度。250为每个item高度    
      sumHeight +=  290*rpxToPx;
      if(index>0&&goodsData[index-1].foodType===goodsData[index].foodType){
        sumHeight-=40*rpxToPx;
      }
      if (scrollHeight <= sumHeight) {
        let foodType=goodsData[index].foodType;
        let typeList=this.data.typeList;
        let num=0;
        for(let i in typeList){
          if(foodType==typeList[i]){
            num=i;
            break;
          }
        }
        this.setData({
          menuView: 'menu'+num,
          menuIndex: num,
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

  // 更改商品数量
  controlGoodsNum:function(e){
    let item=e.currentTarget.dataset.item;
    let num=e.currentTarget.dataset.num;
    let shoppingCartCopy=[];
    let goodsListCopy=this.data.goodsList;
    let self=this;
    if(item.number===0&&num===1){
      wx.showActionSheet({
        itemList: item.tastes,
        success:function(res){
          console.log("成功了");
          for(let i in goodsListCopy){
            if(goodsListCopy[i].id===item.id){
              goodsListCopy[i].tasteSelected=goodsListCopy[i].tastes[res.tapIndex];
              goodsListCopy[i].number=1;
            }
            if(goodsListCopy[i].number!=0){
              shoppingCartCopy.push(goodsListCopy[i]);
            }
          }
          self.setData({
            goodsList:goodsListCopy,
            shoppingCart:shoppingCartCopy,
            totalPrice:self.data.totalPrice+num*item.price,
            totalNumber:self.data.totalNumber+num
          })
        },
        fail:function(){
          return;
        },
      })     
    }
    else{
      for(let i in goodsListCopy){
        if(goodsListCopy[i].id===item.id){
          goodsListCopy[i].number+=num;
        }
        if(goodsListCopy[i].number!=0){
          shoppingCartCopy.push(goodsListCopy[i]);
        }
      }
      this.setData({
        goodsList:goodsListCopy,
        shoppingCart:shoppingCartCopy,
        totalPrice:this.data.totalPrice+num*item.price,
        totalNumber:this.data.totalNumber+num
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
  // 购物车内实现数量改变
  goodsNumInCart: function (e) {
    let item = e.currentTarget.dataset.item;
    let num=e.currentTarget.dataset.num;
    let list=this.data.shoppingCart;
    let goodsData=this.data.goodsList;
    for(let index in list){
      if(item.id===list[index].id){
        list[index].number+=num;
          if(list[index].number===0){
            list.splice(index,1);
          }
          break;       
      }
    }
    this.setData({
      totalNumber:this.data.totalNumber+num,
      totalPrice:this.data.totalPrice+num*item.price,
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