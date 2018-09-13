// pages/my/my.js
var app = getApp();

const base_url = "https://api.chaton-chatonne.cn/index.php/index/index/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstArray:[],
    secondArray:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
  },
  itemDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    // console.log(id);
      if(type==1){
          wx.navigateTo({
              url: '/pages/gflist/gflist?second=' + id
          });
      }else{
          wx.navigateTo({
              url: '/pages/list/list?second=' + id
          });
      }
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.clickfunc(e.detail.current);

    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },


  onLoad: function () {
    
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    wx.request({
      url: base_url + 'fenlei',
      success: function (res) {

        wx.request({
          url: base_url + 'fenlei',
          data: {
            pid: res.data.first[0]['id']
          },
          success: function (res) {
            wx.hideToast()
            that.setData({
              secondArray: res.data.second,
              firstArray: res.data.first

            })
          }
        })
      }
    })


    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 70;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },

  clickfunc: function (event) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: base_url + 'fenlei',
      data:{
        pid: this.data.firstArray[event]['id']
      },
      success: function (res) {
        wx.hideToast()
        that.setData({
          secondArray: res.data.second
        })

      }
    })
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
  
  }
})