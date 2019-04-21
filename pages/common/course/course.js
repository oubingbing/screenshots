// pages/common/course/course.js
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

  /**
   * 预览图片
   */
  previewImage: function (e) {
    let url = e.currentTarget.dataset.id;
    console.log(url)
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
})