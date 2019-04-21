
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:'',
    amount:'',
    amount:'',
    title:'恭喜发财，大吉大利',
    showNickname:false,
    showTitle:true,
    showAmount:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#F35543'
    })
  },

  selectAvatar:function(){
    wx.chooseImage({
      count: 0, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        var filePaths = res.tempFilePaths;
        this.setData({avatar:filePaths[0]})
        
      }
    })
  },

  getNickname:function(e){
    let value = e.detail.value;
    this.setData({nickname:value})
  },

  loseNicknameCous: function (e) {
    let value = e.detail.value;
    if (value == ''){
      return false;
    }
    this.setData({ showNickname: true })
  },

  hiddenNickname:function(){
    this.setData({ showNickname: false })
  },

  getTitle: function (e) {
    let value = e.detail.value;
    this.setData({ title: value })
  },

  loseTitleCous: function (e) {
    let value = e.detail.value;
    if (value == '') {
      return false;
    }
    this.setData({ showTitle: true })
  },

  hiddenTitle: function () {
    this.setData({ showTitle: false })
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