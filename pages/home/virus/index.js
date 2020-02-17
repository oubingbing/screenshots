const http = require("./../../../utils/http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainData:[],
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    list: [],
    showData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.newsList()
  },

  list: function () {
    wx.showLoading({
      title: '加载中',
      icon: "none"
    })
    http.get(`/info_batch`, {}, res => {
      wx.hideLoading()
      let data = res.data;
      if (data.code == 0){
        this.setData({
          mainData: data.data
        })
      }
      console.log(data)
    });
  },

  articleDetail:e=>{
    let item = e.currentTarget.dataset.item;
    wx.setStorageSync("article", item)
    wx.navigateTo({
      url: '/pages/home/article_detail/index?showPage='+false
    })
  },

  newsList: function () {
    http.get(`/news?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}`, {}, res => {
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
          var arr = Object.keys(resData.data.page_data)
          this.setData({
            showData: arr.length <= 0 && this.data.pageNumber <= 1 ? false : true,
            list: listMap,
            pageNumber: this.data.pageNumber + 1,
          })
        }
      }
    });
  },

  /**
* 上拉加载更多
*/
  onReachBottom: function () {
    this.newsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})