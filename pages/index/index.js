
var app = getApp();
Page({
  data: {
    isShowAhturoizeWarning:false,
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  onLoad:function(){
  },
  onShow:function(){

  },

  getUserInfo:function(e) {//同意授权，获取用户信息，encryptedData是加密字符串，里面包含unionid和openid信息
  
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        // console.log(res.rawData);
        wx.login({
          success: function (res) {
            console.log(res);
            if (res.code) {
              console.log('开始登录');
              
              wx.request({
                url: 'https://api.chaton-chatonne.cn/index.php/index/index/getopenid',
                data: {
                  code: res.code,
                },
                method: 'GET',
                success:function(res){
                  console.log('授权返回值=')
                  console.log(res);
                  wx.setStorage({
                    key: 'openid',
                    data: res.data.openid
                  })
                }
              })

              // 在此处登录
              wx.switchTab({
                url: '/pages/all/all'
              })
            } else {
              wx.showToast({
                title: '获取用户登录态失败' + res.errMsg
              })
            }
          }
        })
      }
    })
  },
  getAuthorize: function() {//弹出授权窗函数
    if (this.data.acceptAuthorize) {//判断是否已经授权过
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.login({
              success: function (res) {
                if (res.code) {

                  // 在此处登录
                  wx.switchTab({
                    url: '/pages/all/all'
                  })
                } else {
                  wx.showToast({
                    title: '获取用户登录态失败' + res.errMsg
                  })
                }
              }
            })
            this.setData({
              isShowAhturoizeWarning: false
            })
          } else {
            this.setData({
              isShowAhturoizeWarning: true
            })
          }
        }
      })
    } else {//如果已经授权过直接登录
      this.saveUserInfo()
    }
  },

  cancelAuthroize() {
    this.setData({
      isShowAhturoizeWarning: false,
      acceptAuthorize: false
    });
    app.globalData.unionid = null;
    this.saveUserInfo();

  },



  onReady: function(){
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  }
});