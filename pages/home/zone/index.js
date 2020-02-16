var QQMapWX = require('./../../../utils/qqmap-wx-jssdk.js');
const http = require("./../../../utils/http.js");
const config = require("./../../../config.js");
const app = getApp()
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"",
    listData:[],
    latitude:"",
    longitude:"",
    markers: [],
    showData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: config.TX_MAP_KEY
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        _this.exchangeLocation();
        _this.list();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
 * 获取地理名字
 */
  exchangeLocation: function () {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: res => {
        if(res.status==0){
          this.setData({ city: res.result.address_component.city})
          this.list();
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  search:function(){
    wx.chooseLocation({
      success: res => {
        console.log(res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log(res.latitude)
        console.log(res.longitude)
        this.exchangeLocation();
      }  
    })
  },

  list: function () {
    if(this.data.city == ""){
      return;
    }
    wx.showLoading({
      title: '加载中',
      icon:"none"
    })
    http.get(`/area?&city=${this.data.city}`, {}, res => {
      wx.hideLoading()
      //listData
      let resData = res.data;
      if (resData.code == 0) {
        let listData = resData.data;
        if (listData) {
          let markers = this.data.markers;
          let showData = this.data.showData;
          for (let item in listData) {
            listData[item].map(sub=>{
              markers.push({
                iconPath: "/images/map.png",
                id: 0,
                latitude: sub.lat,
                longitude: sub.lng,
                width: 30,
                height: 30
              })
              showData = true
            }) 
          }
          var arr = Object.keys(listData)
          this.setData({
            listData: listData,
            markers: markers,
            showData: arr.length>0?true:false
          })
        }
      }
    });
  },
})