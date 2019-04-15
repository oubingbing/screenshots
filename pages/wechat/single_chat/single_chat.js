const util = require('./../../../utils/util.js')
const http = require("./../../../utils/http.js");
const qiniuUtil = require("./../../../utils/qiniuToken.js");
const config = require("./../../../config.js");
const app = getApp();

const TXT = 1;
const IMG = 2;
const SOUND = 3;
const DATE = 4;
const RED_PACKET = 5;
const RECEIVED_RED_PACKET = 6;
const TRANSFER_AMOUNT = 7;

const icon = 'http://image.kucaroom.com//tmp/wx0f587d7c97a68e2b.o6zAJs3oh85Zb1lJE8oWix57vny0.ATIzBaoptXWG8c3ea5b7fe584cf68b45959a9f934eee.png';

let leftAvatar ='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIRSkNHofic4wB9oyZrFBybUGjozW4DKtGJYWTWORATffxUtFLt1Cm3ibP0YVtfRicERVhsSickhgZic2w/132';

let rightAvatar = 'https://wx.qlogo.cn/mmopen/vi_32/GROKibUIbrhvZElK1kTiaF8Gxzny9hmsLp4Lavtkd8tFvHSggsmBUcacfULIpLiceL4XKALYg6bzTibUOGVicsTSXVw/132';

let templateData = {
  data_type: 1, 
  user: { nickname: '', avatar: '' }, 
  message: { type: 1, content: '' } 
};

let chatData = [];

Page({
  data: {
    hiddenLeftInput: false,
    hiddenRightInput: false,
    showOperate: false,
    showCreateView: false,
    chatList:chatData,
    to:12,
    scrollTop:3500,
    leftUser:{nickname:'',avatar:''},
    rightUser: { nickname: '', avatar: '' },
    leftValue:'',
    rightValue:'',

    textContent:'',
    messageType: IMG,
    redPacketTitle:'',
    selectUser:1
  },

  onLoad: function (option) {
    wx.setNavigationBarTitle({ title: this.data.leftUser.nickname });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#EDEDED',
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
      this.setData({ leftUser: user });
      wx.setNavigationBarTitle({ title: this.data.leftUser.nickname });
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
  },

  addText:function(){
    
  },

  closeCreateView:function(){
    this.setData({ showCreateView:false})
  },

  /**
   * 弹出信息发送视图
   */
  showCreateView:function(e){

    let leftUser = this.data.leftUser;
    let rightUser = this.data.rightUser;
    if(leftUser.nickname == ''){
      wx.showToast({
        title: '请填写左边用户的昵称',
        icon:'none'
      })
      return false;
    }

    if (leftUser.nickname == '') {
      wx.showToast({
        title: '请填写左边用户的头像',
        icon: 'none'
      })
      return false;
    }

    if (rightUser.nickname == '') {
      wx.showToast({
        title: '请填写右边用户的昵称',
        icon: 'none'
      })
      return false;
    }

    if (rightUser.nickname == '') {
      wx.showToast({
        title: '请填写右边用户的头像',
        icon: 'none'
      })
      return false;
    }

    let type = e.currentTarget.dataset.type;
    if (type == IMG){
      this.uploadImage();
    }else{
      this.setData({ messageType: type, showCreateView: true });
    }
  },

  /**
   * 获取文字消息
   */
  getTextContent:function(e){
    let value = e.detail.value;
    this.setData({ textContent:value})
  },

  getRedTextContent:function(e){
    let value = e.detail.value;
    this.setData({ redPacketTitle:value});
  },

  /**
   * 添加消息
   */
  pushMessage:function(e){
    
    let user = this.data.leftUser;
    if(this.data.selectUser == 1){
      user = this.data.rightUser;
    }

    let type = this.data.messageType;
    let chatData = this.data.chatList;

    let template = {
      data_type: this.data.selectUser,
      user: { nickname: '', avatar: '' },
      message: { type: 1, content: '' }
    };

    template.message.type = type;
    template.user.nickname = user.nickname;
    template.user.avatar = user.avatar;

    switch (parseInt(type)){
      case TXT:
        template.message.content = this.data.textContent;
        chatData.push(template);
        break;
      case RED_PACKET:
        template.message.content = this.data.redPacketTitle;
        chatData.push(template);
        break;
    }

    this.setData({ chatList: chatData, showCreateView: false, showOperate: false});
    wx.showToast({
      title: '添加成功',
      icon:'none'
    })
  },
  
  /**
   * 添加图片
   */
  uploadImage:function(){
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        let chatData = this.data.chatList;
        var filePaths = res.tempFilePaths;

        filePaths.map(item=>{
          let template = {
            data_type: this.data.selectUser,
            user: { nickname: '', avatar: '' },
            message: { type: 1, content: '' }
          };

          template.type = this.data.selectUser;
          template.message.type = IMG;
          template.message.content = item;
          template.user.nickname = user.nickname;
          template.user.avatar = user.avatar;
          chatData.push(template);
        })

        this.setData({ chatList: chatData, showCreateView: false, showOperate:false});
        setTimeout(res => {
          wx.pageScrollTo({
            scrollTop: this.data.scrollTop += 1000
          })
        }, 500); 
      }
    })
  },

  /**
   * 选着发送信息的聊天成员
   */
  selectChatUser:function(e){
    console.log("select");
    let type = e.currentTarget.dataset.type;
    this.setData({ selectUser: type })
  }
})
