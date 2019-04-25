Page({
  data: {
    amount:'',
    showAmountInput:true
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
              url: '/pages/common/edit_screen/edit_screen?type=6'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  showAmountInput: function () {
    this.setData({ showAmountInput: true })
  },

  hiddenAmountInput: function () {
    this.setData({ showAmountInput: false })
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
    this.setData({ showAmountInput: false })
  },

  hiddenAmount: function () {
    this.setData({ showAmountInput: false })
  },

})