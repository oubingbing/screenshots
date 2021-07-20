const http = require("./../../../utils/http.js");
const util = require("./../../../utils/util.js");
const app = getApp();

Page({
  data: {
    showAuth:false
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success:res=>{
        console.log("型号");
        console.log(res.platform);
      }
    })
  },

  /**
   * 检测授权
   */
  checkoutAuth:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showAuth: true
          });
        }
      }
    })
  },

  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({
      showAuth: false
    });
    wx.setStorageSync('user',data.detail.userInfo);
    //http.login(null, null, null, res => {});
  },

  wechatNavigate:function(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
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