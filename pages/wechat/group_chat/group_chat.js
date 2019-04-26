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
const DATE_TIME = 9;

Page({
  data: {

    hiddenLeftInput: false,
    hiddenRightInput: false,
    showOperate: false,
    showCreateView: false,
    showGroupMember:false,
    chatList: [],
    to: 12,
    scrollTop: 3500,
    leftUser: [{id:1,nickname: '', avatar: '',showInput:true,select:false}],
    rightUser: { id:0,nickname: '', avatar: '',select:true},
    leftValue: '',
    rightValue: '',

    textContent: '',
    messageType: IMG,
    selectUser: 0,
    selectReceiveUser: 1,
    transferAmount: 0,
    getTransferAmountTo: 0,
    redPacketTitle: '恭喜发财，大吉大利',
    groupName:'',
    showGroupName:'',
    footerViewClass:''
  },

  onLoad: function (option) {
    let groupName = wx.getStorageSync('group_name');

    if(groupName != '' && groupName != undefined){
      this.setData({ groupName: groupName, showGroupName:true });
      wx.setNavigationBarTitle({ title: groupName });
    }

    this.setMember();
    this.setStorageData();
    this.onScreen();

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

  deleteContent: function (e) {
    let position = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定删除该聊天记录吗',
      success: res => {
        if (res.confirm) {
          let chatData = this.data.chatList;
          let newChatData = chatData.filter((item, index) => {
            if (position != index) {
              return item;
            }
          })

          this.setData({ chatList: newChatData });
          wx.setStorageSync('group_chat', newChatData);
        }
      }
    })
  },

  onScreen: function () {
    wx.onUserCaptureScreen(function (res) {
      wx.showModal({
        title: '系统提示',
        content: '需要对截图进行优化处理，使得截图更加真实',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/common/edit_screen/edit_screen?type=1'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  hiddenFooterView:function(){
    if (this.data.showGroupMember==true){
      this.setData({ showGroupMember: false})
    }else{
      this.setData({ showOperate: false, footerViewClass: '' })
    }
  },

  test:function(){

  },

  /**
   * 清空缓存
   */
  clearChat: function () {
    wx.removeStorageSync('group_member');
    wx.removeStorageSync('group_chat');
    wx.removeStorageSync('group_name');
    this.setData({
      rightUser: { nickname: '', avatar: '' },
      hiddenRightInput: false,
      leftUser: [],
      hiddenLeftInput: false,
      chatList: []
    });
  },

  /**
   * 根据缓存加载数据
   */
  setStorageData: function () {
    let data = wx.getStorageSync('group_chat');
    console.log(data);
    if (data != '' && data != undefined && data.length > 0) {
      this.setData({ chatList: data })
    }
  },

  /**
   * 根据缓存信息设置右边用户的信息
   */
  setMember: function () {
    let user = wx.getStorageSync('user');
    let memberInfo = wx.getStorageSync('group_member');
    let leftUser = memberInfo.left;
    let rightUser = memberInfo.right;

    if (rightUser != '' && rightUser != undefined) {
      this.setData({ rightUser: rightUser, hiddenRightInput: true });
    } else {
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

  operate: function () {
    this.setData({ showOperate: true, footerViewClass:'footer-full' })
  },

  /**
 * 触摸屏幕后移动触发一些隐藏操作
 */
  hiddenOperate: function () {
    console.log("test");
    this.setData({
      showOperate: false,
      showGroupMember:false,
    });
  },

  showMemberGroupView:function(){
    this.setData({showGroupMember:true});
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
    this.send(null, attachments);
  },


  /**
   * 设置title
   */
  setTitle: function (id, cantChat) {

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
    let type = e.currentTarget.dataset.type;
    let userid = e.currentTarget.dataset.userid;

    wx.chooseImage({
      count: 0, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        let temArray = this.data.imageArray;
        var filePaths = res.tempFilePaths;

        if (type == 0) {
          //left
          let users = this.data.leftUser;
          users.map(item=>{
            if(item.id == userid){
              item.avatar = filePaths[0];
            }
            return item;
          })
          this.setData({ leftUser: users })
        } else {
          let user = this.data.rightUser;
          user.avatar = filePaths[0];
          this.setData({ rightUser: user })
        }

        wx.setStorageSync('group_member', { 'left': this.data.leftUser, 'right': this.data.right });
      }
    })

  },

  addGroupMember:function(){
    let users = this.data.leftUser;
    users.push({ id: users.length+1, nickname: '', avatar: '', showInput: true, select: false });
    this.setData({leftUser:users});
    wx.setStorageSync('group_member', { 'left': this.data.leftUser, 'right': this.data.right });
  },

  getGroupname:function(e){
    let value = e.detail.value;
    this.setData({groupName:value});
    wx.setNavigationBarTitle({ title: value });
    wx.setStorageSync('group_name',value);
  },

  /**
   * 获取聊天成员昵称
   */
  getNickname: function (e) {
    let value = e.detail.value;
    let type = e.currentTarget.dataset.type;
    let userid = e.currentTarget.dataset.userid;
    if (type == 0) {
      //left
      let users = this.data.leftUser;
      users.map(item => {
        if (item.id == userid) {
          item.nickname = value;
        }
        return item;
      })
      this.setData({ leftUser: users });
    } else {
      let user = this.data.rightUser;
      user.nickname = value;
      this.setData({ rightUser: user });
    }
  },

  showGroupNameInput:function(e){
    this.setData({ showGroupName: false })
  },

  loseGrouNameCous:function(e){
    this.setData({ showGroupName:true})
  },

  /**
   * 添加聊天成员输入框失去焦点
   */
  loseCous: function (e) {
    let type = e.currentTarget.dataset.type;
    let userid = e.currentTarget.dataset.userid;
    let value = e.detail.value;
    if (type == 0 && value != '') {
      let users = this.data.leftUser;
      users.map(item => {
        if (item.id == userid) {
          console.log("test");
          item.showInput = false;
        }
        return item;
      })
      this.setData({ leftUser: users })
    } else if (value != '') {
      this.setData({ hiddenRightInput: true })
    }

    wx.setStorageSync('group_member', { 'left': this.data.leftUser, 'right': this.data.right });
  },

  /**
   * 显示聊天成员昵称输入框
   */
  showInputView: function (e) {
    let type = e.currentTarget.dataset.type;
    let userid = e.currentTarget.dataset.userid;
    console.log(userid);
    if (type == 0) {
      console.log(this.data.leftUser);
      let leftUser = this.data.leftUser;
      let user = '';
      leftUser.map(item=>{
        if(item.id == userid){
          user = item;
          item.showInput=true;
        }else{
          item.showInput = false;
        }
        return item;
      })
      this.setData({ hiddenLeftInput: false, leftValue: user.nickname, leftUser: leftUser })
    } else {
      this.setData({ hiddenRightInput: false, rightValue: this.data.rightUser.nickname })
    }
  },

  /**
   * 隐藏添加功能面板
   */
  closeCreateView: function () {
    this.setData({ showCreateView: false })
  },

  /**
   * 弹出信息发送视图
   */
  showCreateView: function (e) {

    if (this.data.groupName == '') {
      wx.showToast({
        title: '请打开群成员设置群名称',
        icon: 'none'
      })
      return false;
    }

    let leftUser = this.data.leftUser;
    let rightUser = this.data.rightUser;
    if (leftUser.nickname == '') {
      wx.showToast({
        title: '请填写左边用户的昵称',
        icon: 'none'
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
    if (type == IMG) {
      this.uploadImage();
    } else {
      this.setData({ messageType: type, showCreateView: true });
    }
  },

  /**
   * 获取文字消息
   */
  getTextContent: function (e) {
    let value = e.detail.value;
    this.setData({ textContent: value })
  },

  getRedTextContent: function (e) {
    let value = e.detail.value;
    this.setData({ redPacketTitle: value });
  },

  getDateTimeString: function (e) {
    let value = e.detail.value;
    this.setData({ dateTimeString: value })
  },

  getPushUser:function(){
    let user = this.data.leftUser;
    if (this.data.selectUser == 0) {
      user = this.data.rightUser;
    } else {
      this.data.leftUser.map(item => {
        if (this.data.selectUser == item.id) {
          user = item;
        }
        return item;
      })
    }

    return user;
  },

  getMessageType:function(){
    return this.data.selectUser==0?1:0;
  },

  /**
   * 添加消息
   */
  pushMessage: function (e) {
    let user = this.getPushUser();

    let type = this.data.messageType;
    let chatData = this.data.chatList;
    let template = {
      data_type: this.getMessageType(),
      user: { nickname: '', avatar: '',id:''},
      message: { type: 1, content: '', attachment: '' }
    };

    if (this.data.groupName==''){
      wx.showToast({
        title: '请先填写群名称',
        icon: 'none'
      })
      return false;
    }

    if(user.nickname=='' || user.avatar == ''){
      wx.showToast({
        title: '所选群成员的昵称或头像不能为空',
        icon:'none'
      })
      return false;
    }

    template.message.type = type;
    template.user.nickname = user.nickname;
    template.user.avatar = user.avatar;
    template.user.id = user.id;

    switch (parseInt(type)) {
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
        let receiveUserInfo = '';
        if(receiveUser == 0){
          receiveUserInfo = this.data.rightUser;
        }else{
          receiveUserInfo = user;
        }
        template.message.attachment = receiveUserInfo.nickname
        chatData.push(template);
        break;
      case TRANSFER_AMOUNT:
        let _receiveUserInfo = '';
        if (this.data.getTransferAmountTo == 0) {
          _receiveUserInfo = this.data.rightUser;
        } else {
          this.data.leftUser.map(item => {
            if (item.id == this.data.getTransferAmountTo) {
              _receiveUserInfo = item;
            }
            return item;
          })
        }

        template.message.content = '转账给' + _receiveUserInfo.nickname;
        template.message.attachment = this.data.transferAmount;
        chatData.push(template);
        break;
      case RECEIVE_TRANSFER_AMOUNT:
        template.message.content = '已收钱';
        template.message.attachment = this.data.transferAmount;
        chatData.push(template);
        break;
      case DATE_TIME:
        template.data_type = 2;//日期
        template.message.content = this.data.dateTimeString;
        template.message.attachment = this.data.transferAmount;
        chatData.push(template);
        break;
    }

    this.setData({ chatList: chatData, showCreateView: false, showOperate: false });
    wx.setStorageSync('group_chat', chatData);
    wx.showToast({
      title: '添加成功',
      icon: 'none'
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
  uploadImage: function () {

    if (this.data.groupName == '') {
      wx.showToast({
        title: '请先填写群名称',
        icon: 'none'
      })
      return false;
    }

    let user = this.getPushUser();
    if (user.nickname == '' || user.avatar == '') {
      wx.showToast({
        title: '所选群成员的昵称或头像不能为空',
        icon: 'none'
      })
      return false;
    }

    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        let chatData = this.data.chatList;
        var filePaths = res.tempFilePaths;

        filePaths.map(item => {
          let template = {
            data_type: this.getMessageType(),
            user: { nickname: '', avatar: '' ,id:''},
            message: { type: 1, content: '' }
          };

          template.type = this.data.selectUser;
          template.message.type = IMG;
          template.message.content = item;
          template.user.nickname = user.nickname;
          template.user.avatar = user.avatar;
          template.user.id = this.data.selectUser;
          chatData.push(template);
        })

        this.setData({ chatList: chatData, showCreateView: false, showOperate: false });
        wx.setStorageSync('group_chat', chatData);
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
  selectChatUser: function (e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if(type == 1){
      let rightUser = this.data.rightUser;
      rightUser.select = true;
      let groupUsers = this.data.leftUser;
      groupUsers.map(item => {
        if (item.id == id) {
          item.select = true;
        } else {
          item.select = false;
        }
        return item;
      })
      this.setData({ rightUser: rightUser, leftUser: groupUsers, selectUser:0})
    }else{
      let groupUsers = this.data.leftUser;
      groupUsers.map(item=>{
        if(item.id == id){
          item.select = true;
        }else{
          item.select = false;
        }
        return item;
      })
      let rightUser = this.data.rightUser;
      rightUser.select = false;
      this.setData({ leftUser: groupUsers, rightUser: rightUser, selectUser:id});
    }
  },

  /**
   * 选择收红包的人
   */
  selectReceiveMan: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({ selectReceiveUser: type })
  },

  /**
   * 选择转账给某人
   */
  selectTransferAmountTo: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({ getTransferAmountTo: type })
  },

  /**
   * 获取转账金额
   */
  getTransferAmount: function (e) {
    this.setData({ transferAmount: e.detail.value })
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
