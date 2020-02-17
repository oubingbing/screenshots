
// 在页面中定义插屏广告
let interstitialAd = null;

Page({
  data: {
    article:"",
    showHomePage:false
  },

  onLoad: function (options) {
    let article = wx.getStorageSync("article")
    this.setData({article:article})

    if (options.showPage != undefined) {
      this.setData({ showHomePage: false })
    } else {
      this.setData({ showHomePage: true })
    }

    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-1c5aa24c6e971f52'
      })
      app.globalData.ad = interstitialAd;
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
  },

  onReady: function () {
    console.log("ready")
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  openHome: function (e) {
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  },

})