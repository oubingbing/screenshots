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
const RECEIVE_TRANSFER_AMOUNT = 8;

wx.onUserCaptureScreen(function (res) {
  wx.showModal({
    title: '系统提示',
    content: '需要对截图进行优化处理，使得截图更加真实',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/common/edit_screen/edit_screen'
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
})

Page({
  data: {
   
    hiddenLeftInput: false,
    hiddenRightInput: false,
    showOperate: false,
    showCreateView: false,
    chatList:[],
    to:12,
    scrollTop:3500,
    leftUser:{nickname:'',avatar:''},
    rightUser: { nickname: '', avatar: '' },
    leftValue:'',
    rightValue:'',

    textContent:'',
    messageType: IMG,
    selectUser:0,
    selectReceiveUser:1,
    transferAmount:0,
    getTransferAmountTo:0,
    redPacketTitle:'恭喜发财，大吉大利',
    footerViewClass: ''
  },

  onLoad: function (option) {
    this.setMember();
    this.setStorageData();

    wx.setNavigationBarTitle({ title: this.data.leftUser.nickname });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#EDEDED',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

    setTimeout(res => {
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop += 1000
      })
    }, 500);
  },

  onUserCaptureScreen:function(){
    console.log("截屏了");
  },

  /**
   * 清空缓存
   */
  clearChat:function(){
    wx.removeStorageSync('single_member');
    wx.removeStorageSync('single_chat');
    this.setData({
      rightUser: { nickname: '', avatar: '' },
      hiddenRightInput: false,
      leftUser: { nickname: '', avatar: '' },
      hiddenLeftInput: false,
      chatList:[]
    });
  },

  /**
   * 根据缓存加载数据
   */
  setStorageData:function(){
    let data = wx.getStorageSync('single_chat');
    console.log(data);
    if(data != '' && data != undefined && data.length > 0){
      this.setData({chatList:data})
    }
  },

  /**
   * 根据缓存信息设置右边用户的信息
   */
  setMember:function(){
    let user = wx.getStorageSync('user');
    let memberInfo = wx.getStorageSync('single_member');
    let leftUser = memberInfo.left;
    let rightUser = memberInfo.right;

    if (rightUser != '' && rightUser != undefined){
      this.setData({ rightUser: rightUser, hiddenRightInput: true });
    }else{
      if (user) {
        let userInfo = this.data.rightUser;
        userInfo.nickname = user.nickName;
        userInfo.avatar = user.avatarUrl;
        this.setData({ rightUser: userInfo, hiddenRightInput: true });
      }
    }

    if (leftUser != '' && leftUser != undefined) {
      this.setData({ leftUser: leftUser, hiddenLeftInput: true });
    }
  },

  operate:function(){
    this.setData({ showOperate: true, footerViewClass: 'footer-full' })
  },

  /**
 * 触摸屏幕后移动触发一些隐藏操作
 */
  hiddenOperate: function () {
    console.log("test");
    this.setData({
      showOperate: false
    });
  },

  hiddenFooterView: function () {
    if (this.data.showGroupMember == true) {
      this.setData({ showGroupMember: false })
    } else {
      this.setData({ showOperate: false, footerViewClass: '' })
    }
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
    let attachments = [];
    attachments.push(uploadData.detail.key)
    this.send(null,attachments);
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
  * 选择聊天成员头像
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

        wx.setStorageSync('single_member', { 'left': this.data.leftUser, 'right': this.data.right });
      }
    })

  },

  /**
   * 获取聊天成员昵称
   */
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
      this.setData({ rightUser: user });
    }
  },

  /**
   * 添加聊天成员输入框失去焦点
   */
  loseCous:function(e){
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;
    if (type == 0 && value != '') {
      this.setData({ hiddenLeftInput: true })
    } else if(value != '') {
      this.setData({ hiddenRightInput: true })
    }

    wx.setStorageSync('single_member', {'left':this.data.leftUser,'right':this.data.right});
  },

  /**
   * 显示聊天成员昵称输入框
   */
  showInputView:function(e){
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({ hiddenLeftInput: false, leftValue:this.data.leftUser.nickname })
    } else {
      this.setData({ hiddenRightInput: false, rightValue: this.data.rightUser.nickname })
    }
  },

  /**
   * 隐藏添加功能面板
   */
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

    if (leftUser.avatar == '') {
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
      message: { type: 1, content: '' ,attachment:''}
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
      case RECEIVED_RED_PACKET:
        let receiveUser = this.data.selectReceiveUser;
        template.message.content = this.data.redPacketTitle;
        template.message.attachment = receiveUser==0?this.data.leftUser.nickname:this.data.rightUser.nickname;
        chatData.push(template);
        break;
      case TRANSFER_AMOUNT:
        let content = '';
        if (this.data.getTransferAmountTo==0){
          content = '转账给' + this.data.leftUser.nickname;
        }else{
          content = '转账给' + this.data.rightUser.nickname;
        }
        template.message.content = content;
        template.message.attachment = this.data.transferAmount;
        chatData.push(template);
        break;
      case RECEIVE_TRANSFER_AMOUNT:
        template.message.content = '已收钱';
        template.message.attachment = this.data.transferAmount;
        chatData.push(template);
        break;
    }

    this.setData({ chatList: chatData, showCreateView: false, showOperate: false});
    wx.setStorageSync('single_chat', chatData);
    wx.showToast({
      title: '添加成功',
      icon:'none'
    })

    setTimeout(res => {
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop += 1000
      })
    }, 500);
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

          let user = this.data.leftUser;
          if (this.data.selectUser == 1) {
            user = this.data.rightUser;
          }

          template.type = this.data.selectUser;
          template.message.type = IMG;
          template.message.content = item;
          template.user.nickname = user.nickname;
          template.user.avatar = user.avatar;
          chatData.push(template);
        })

        this.setData({ chatList: chatData, showCreateView: false, showOperate:false});
        wx.setStorageSync('single_chat', chatData);
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
    let type = e.currentTarget.dataset.type;
    this.setData({ selectUser: type })
  },

  /**
   * 选择收红包的人
   */
  selectReceiveMan:function(e){
    let type = e.currentTarget.dataset.type;
    this.setData({ selectReceiveUser: type })
  },

  /**
   * 选择转账给某人
   */
  selectTransferAmountTo:function(e){
    let type = e.currentTarget.dataset.type;
    this.setData({ getTransferAmountTo: type })
  },

  /**
   * 获取转账金额
   */
  getTransferAmount:function(e){
    this.setData({ transferAmount:e.detail.value}) 
  }
})
