
Page({
  data: {
    showCanves:false,
    screenImage:'',
    showImage:false,
    pixelRatio: 0,
    width:0,
    height:0
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success:res=> {
        this.setData({ 
          pixelRatio: res.pixelRatio,
          width: 375 * res.pixelRatio,
          height: 667*res.pixelRatio
        });
        console.log(res)
      }
    })
  },

  selectImage:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.showLoading({
          title: '处理中',
        })
        this.editSreeb(res.tempFilePaths[0]);
      }
    })
  },

  /**
   * 绘制报告
   */
  editSreeb: function (imgPath) {
    const ctx = wx.createCanvasContext('myCanvas');

    let pixelRatio = this.data.pixelRatio;

    ctx.drawImage(imgPath, 0, 0, 375, 667 );
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
          that.setData({ screenImage: tempFilePath, showImage:true})
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
            that.setData({ showImage:false})
          }
        })
      }
    })
  },
})