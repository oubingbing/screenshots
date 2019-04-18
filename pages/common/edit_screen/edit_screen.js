import Poster from '../../../components/canves/poster/poster';


let posterConfig = {
  jdConfig: {
    width: 750,
    height: 1334,
    backgroundColor: '#fff',
    debug: false,
    blocks: [
      {
        width: 250,
        height: 100,
        x: 500,
        y: 35,
        backgroundColor: '#EDEDED',
      }
    ],
    images: [
      {
        width: 750,
        height: 1334,
        x: 0,
        y: 0,
        url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/02bb99132352b5b5dcea.jpg',
      },
      {
        width: 40,
        height: 40,
        x: 670,
        y: 70,
        url: '/images/wechat-more.png',
      }
    ]

  }
}


Page({
  data: {
    showCanves: false,
    screenImage: '',
    showImage: false,
  },

  onLoad: function (options) {

  },

  selectImage: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.showLoading({
          title: '处理中',
        })
        this.editSreeb(res.tempFilePaths[0]);

        posterConfig.jdConfig.images[0].url = res.tempFilePaths[0];

        this.setData({ posterConfig: posterConfig.jdConfig }, () => {
          Poster.create(true);    // 入参：true为抹掉重新生成 
        });

      }
    })
  },

  onPosterSuccess(e) {
    const { detail } = e;

    //wx.previewImage({
    //current: detail,
    //urls: [detail]
    //})

    //return false;

    this.setData({ screenImage: detail, showImage: true });
    return false;
  },
  onPosterFail(err) {
    console.error(err);
  },

  /**
   * 绘制报告
   */
  editSreeb: function (imgPath) {
    const ctx = wx.createCanvasContext('myCanvas');

    let pixelRatio = this.data.pixelRatio;

    ctx.drawImage(imgPath, 0, 0, 375, 667);
    ctx.setFillStyle("#EDEDED")
    ctx.fillRect(260, 30, 110, 40)
    ctx.drawImage('/images/wechat-more.png', 333, 40, 20, 20);
    ctx.draw();

    let that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        destWidth: 375 *3,
        destHeight: 667 * 3,
        canvasId: 'myCanvas',
        fileType:'jpg',
        quality:1,
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          that.setData({ screenImage: tempFilePath, showImage: true })
        },
        fail: function (res) {
          wx.hideLoading();
        }
      });
    }, 500);
  },

  /**
   * 保存tup
   */
  saveImage: function () {
    let that = this;
    console.log("保存图片");
    wx.authorize({
      scope: "scope.writePhotosAlbum", success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.screenImage,
          success(res) {
            that.setData({ showImage: false })
          }
        })
      }
    })
  },
})