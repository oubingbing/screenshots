// pages/home/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  navigateSingle:function(){
    wx.navigateTo({
      url: '/pages/wechat/single_chat/single_chat'
    })
  }
})