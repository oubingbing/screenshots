const util = require('./../../../utils/util.js')
const http = require("./../../../utils/http.js");
const qiniuUtil = require("./../../../utils/qiniuToken.js");
const config = require("./../../../config.js");
const app = getApp();

const icon = 'http://image.kucaroom.com//tmp/wx0f587d7c97a68e2b.o6zAJs3oh85Zb1lJE8oWix57vny0.ATIzBaoptXWG8c3ea5b7fe584cf68b45959a9f934eee.png';

let leftAvatar ='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIRSkNHofic4wB9oyZrFBybUGjozW4DKtGJYWTWORATffxUtFLt1Cm3ibP0YVtfRicERVhsSickhgZic2w/132';

let rightAvatar = 'https://wx.qlogo.cn/mmopen/vi_32/GROKibUIbrhvZElK1kTiaF8Gxzny9hmsLp4Lavtkd8tFvHSggsmBUcacfULIpLiceL4XKALYg6bzTibUOGVicsTSXVw/132';

let chatData = [
  {data_type:1,user:{nickname:'叶子',avatar:leftAvatar},message:{type:1,content:'你好'}},
  { data_type: 0, user: { nickname: '慧怡', avatar: rightAvatar }, message: { type: 1, content: '你好' } },
  { data_type: 0, user: { nickname: '慧怡', avatar: rightAvatar }, message: { type: 1, content: '在吗' } },
  { data_type: 0, user: { nickname: '慧怡', avatar: rightAvatar }, message: { type: 1, content: '好想你' } },
];

Page({
  data: {
    chatList:chatData,
    to:12,
    scrollTop:3500,
    showOperate:false,
    leftUser:{nickname:'',avatar:''},
    rightUser: { nickname: '', avatar: '' },
    hiddenLeftInput:false,
    hiddenRightInput:false,
    leftValue:'',
    rightValue:''
  },

  onLoad: function (option) {
    wx.setNavigationBarTitle({ title: '邱慧怡' });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F5F5F5',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },

  getLeftNickname:function(e){

  },

  operate:function(){
    this.setData({ showOperate:true})
  },

  /**
 * 触摸屏幕后移动触发一些隐藏操作
 */
  hiddenOperate: function () {
    this.setData({
      showOperate: false
    });
  },

  /**
   * 获取七牛token
   */
  getQiNiuToken: function () {
    qiniuUtil.getQiniuToken(res => {
      let qiniu = this.data.qiniu;
      qiniu.token = res;
      this.setData({ qiniu: qiniu })
    })
  },

  /**
   * 获取上传的图片
   */
  uploadSuccess: function (uploadData) {
    console.log("发送图片");
    let attachments = [];
    attachments.push(uploadData.detail.key)
    this.send(null,attachments);
  },


  /**
   * 设置title
   */
  setTitle: function (id,cantChat){
    wx.setNavigationBarTitle({ title: '邱慧怡' });
  },

  /**
   * 预览图片
   */
  previewImage: function (event) {
    let url = event.target.id;
    wx.previewImage({
      current: '',
      urls: [url]
    })
  },

  /**
  * 选择头像
  */
  selectImage: function (e) {
    let type  = e.currentTarget.dataset.type;

    wx.chooseImage({
      count: 0, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        let temArray = this.data.imageArray;
        var filePaths = res.tempFilePaths;

        if(type == 0){
          //left
          let user = this.data.leftUser;
          user.avatar = filePaths[0];
          this.setData({leftUser:user})
        }else{
          let user = this.data.rightUser;
          user.avatar = filePaths[0];
          this.setData({ rightUser: user })
        }
      }
    })

  },

  getNickname: function (e){
    let value = e.detail.value;
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      //left
      let user = this.data.leftUser;
      user.nickname = value;
      this.setData({ leftUser: user })
    } else {
      let user = this.data.rightUser;
      user.nickname = value;
      this.setData({ rightUser: user })
    }
  },

  loseCous:function(e){
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;

    console.log(value)

    if (type == 0 && value != '') {
      this.setData({ hiddenLeftInput: true })
    } else if(value != '') {
      this.setData({ hiddenRightInput: true })
    }
  },

  showInputView:function(e){
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({ hiddenLeftInput: false, leftValue:this.data.leftUser.nickname })
    } else {
      this.setData({ hiddenRightInput: false, rightValue: this.data.rightUser.nickname })
    }
  }
})
