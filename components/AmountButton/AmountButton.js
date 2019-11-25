// components/AmountButton/AmountButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    fakeData:123456

  },

  /**
   * 组件的方法列表
   */
  methods: {
    subtractItem:function(){
      this.setData({
        fakeData:this.data.fakeData-1
      })
    },
    addItem:function(){
      this.setData({
        fakeData: this.data.fakeData + 1
      })

    }

  }
})
