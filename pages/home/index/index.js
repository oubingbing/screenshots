const http = require("./../../../utils/http.js");
const app = getApp();

Page({
  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    list:[],
    province:[],
    city:[],
    provinceName:[],
    selectCity:"全国",
    city:""
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      icon: "none"
    })
    this.list();
  },

  openImag:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.attachment, 
      urls: [e.currentTarget.dataset.attachment] 
    })
  },

  copy:function(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      selectCity: e.detail.value[1],
      city: e.detail.value[1],
      list:[],
      pageNumber: 1,
    })
    this.list();
  },

  list:function(){
    http.get(`/mask?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&city=${this.data.city}`, {}, res => {
      wx.hideLoading();
      this.setData({ showGeMoreLoadin: false });
      let resData = res.data;
      if (resData.code == 0) {
        let listData = resData.data.page_data;
        if (listData) {
          let listMap = this.data.list;
          listData.map(item => {
            listMap.push(item);
          })
          this.setData({
            list: listMap,
            pageNumber: this.data.pageNumber + 1,
            notDataTips: listMap.length >= 0 ? true : false
          })
        }
      }
    });
  },

  /**
 * 上拉加载更多
 */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.list();
  },


})