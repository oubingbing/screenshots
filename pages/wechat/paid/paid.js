
Page({
  data: {
    avatar:'',
    nickname:'',
    amount: '',
    showNickname:false,
    showAmount: false
  },

  onLoad: function (options) {
    this.onScreen();
  },

  onScreen: function () {
    wx.onUserCaptureScreen(function (res) {
      wx.showModal({
        title: '系统提示',
        content: '需要对截图进行优化处理，使得截图更加真实',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/common/edit_screen/edit_screen?type=3'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  selectAvatar: function () {
    wx.chooseImage({
      count: 0, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        var filePaths = res.tempFilePaths;
        this.setData({ avatar: filePaths[0] })

      }
    })
  },

  getNickname:function(e){
    let value = e.detail.value;
    this.setData({ nickname: value })
  },

  loseNicknameCous: function (e) {
    let value = e.detail.value;
    if (value == '') {
      return false;
    }
    this.setData({ showNickname: true })
  },

  showNicknameInput:function(){
    this.setData({ showNickname: false })
  },

  getAmount: function (e) {
    let value = e.detail.value;
    this.setData({ amount: value })
  },

  loseAmountCous: function (e) {
    let value = e.detail.value;
    if (value == '') {
      return false;
    }
    this.setData({ showAmount: true })
  },

  hiddenAmount: function () {
    this.setData({ showAmount: false })
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