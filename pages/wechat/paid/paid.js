
Page({
  data: {
    avatar:'',
    nickname:'',
    amount: '',
    showNickname:false,
    showAmount: false
  },

  onLoad: function (options) {

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
  }
})