// pages/my/my.js
const base_url = "https://api.chaton-chatonne.cn/index.php/index/index/";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    searchValue:'',
    listArray:[],
    noData:false
  },

  /**
   * 网络请求数据
   */
  clickSearch: function(e){
    
    console.log(this.data.searchValue);
    if (this.data.searchValue == '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon:'loading'
      });
    }else {
      this.list_request()
    }
  },

  list_request:function(){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: base_url + 'article',
      page: this.data.page,
      data: {
        keyword: this.data.searchValue
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        wx.hideToast()
        that.setData({
          listArray: res.data
        })
        if(that.data.listArray.length < 1) {
          that.setData({
            noData: true
          })
        }else {
          that.setData({
            noData: false
          }) 
        }
        
      }
    })
  },
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },  
  onLoad: function () {

  },
  // footerTap: app.footerTap,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      listArray: [],
    })
    this.list_request()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1,
    })
    this.list_request()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})