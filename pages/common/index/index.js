var QQMapWX = require('./../../../utils/qqmap-wx-jssdk.js');
const distance = require('./../../../utils/dist');
const http = require("./../../../utils/http.js");
const config = require("./../../../config.js");
const app = getApp()
var qqmapsdk;

Page({
  data: {
    height: 0,
    width: 0,

    show_auth: app.globalData.show_auth,
    qrCode: '',
    imageUrl: app.globalData.imageUrl,
    todayStep: 0,
    totalStep: 0,
    stepPageSize: 10,
    stepPageNumber: 1,
    initPageNumber: 1,
    steps: [],
    user: '',
    showGeMoreLoadin: false,
    select: 1,

    //旅行数据
    latitude: 0,
    longitude: 0,
    includePoints: [],
    markers: [],
    travelLogMarkers: [],
    notTravelLogMarkers: [],
    notLabelMarkers: [],
    labelMarkers: [],
    polyline: [{
      points: [],
      color: "#FF4500",
      width: 3,
      dottedLine: false
    }],
    logs: [],
    travelPageSize: 4,
    travelPageNumber: 1,
    initPageNumber: 1,
    plan: '',
    showPostPlan: false,
    avatar: '',
    showReport: false,
    showMap: true,
    showTravelLocation: true,
    showTravelLabel: true,
    report: '',
    mapView: 1,
    fullView: 'full-view',
    harfView: 'harf-view',
    showFinish: false,
    showGeMoreLoadin: false,
    showTips: false,
    randList: [],
    rankPageSize: 10,
    rankPageNumber: 1,
    myRankData: '',
    myRank: 0,
    imagePath: ''
  },

  onLoad: function (option) {
    wx.getSystemInfo({
      success: res => {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        this.setData({
          height: height,
          width: clientWidth
        });
      }
    })
  },

  getReport: function () {
    wx.showLoading({ title: '海报生成中' });
    this.drawReport();
  },

  /**
   * 绘制报告
   */
  drawReport: function () {
    wx.hideLoading();

    this.setData({
      showReport: true,
      showMap: false
    })

    const ctx = wx.createCanvasContext('myCanvas')

    ctx.drawImage('/images/test.jpg', 0, 0, 375, 667);

    ctx.setFillStyle("#F5F5F5")
    ctx.fillRect(260, 30, 110, 40)

    ctx.drawImage('/image/test-icon.png', 333, 40, 20, 20);
    ctx.draw();


    let that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },

  /**
   * 保存报告
   */
  saveReport: function () {
    let that = this;
    wx.authorize({
      scope: "scope.writePhotosAlbum", success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.imagePath,
          success(res) {

          }
        })
      }
    })
  },


})