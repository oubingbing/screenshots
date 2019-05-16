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

  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
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

  /**
* 分享
*/
  onShareAppMessage: function (res) {
    return {
      title: '一款生成微信聊天，红包等截图的好用工具',
      path: '/pages/home/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})