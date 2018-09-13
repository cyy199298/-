// pages/my/my.js

const base_url = "https://api.chaton-chatonne.cn/index.php/index/index/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_more:false,
    more_data: "加载更多中..",
    page:1,//页数
    listArray:[],
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      more_data: "加载更多中..",
      // page: 1,
      listArray:[],
    })
    this.list_request()
  },
  deletefunc: function (event){
    var that = this;
    var index = event.currentTarget.dataset.id;
    wx.showModal({
      title: '删除',
      content: '该操作不可找回，请谨慎操作',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: base_url + 'del_detail',
            data: {
              id: index
            },
            success: function(res){
              console.log(res);
              that.onPullDownRefresh()
            }
          })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      // this.setData({
      //   page: this.data.page + 1,
      //   more_data: "正在加载更多.."
      // })
      // this.list_request()

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.list_request();

  },
  //列表网络请求
  list_request() {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.showToast({
          icon: 'loading',
          duration: 10000
        })
        wx.request({
          url: base_url + 'mylist',
          method: 'post',
          data: {
            openid: res.data
          },
          success: function (res) {
            wx.stopPullDownRefresh()
            wx.hideToast()
            console.log(res);
            let o_data = that.data.listArray;
            for (var index in res.data) {
              that.data.listArray.push(res.data[index])
            }
            if (res.data.length < 1) {
              that.setData({
                no_more: true,
                more_data: "没有更多数据了",
              })
            }
            that.setData({
              listArray: o_data
            })
          },
        })
      },
    })

  },
  /**
   * 保存图片及视频
   */
  clicksave: function (event) {
    var index = event.currentTarget.dataset.index;

    if (this.data.listArray[index]['type'] == '0') {
      wx.showToast({
        icon:'loading',
        title: '暂无图片和视频',
        duration: 1000
      })
    }if (this.data.listArray[index]['type'] == '1') {
      for (var tmp in this.data.listArray[index]['url']) {
        this.saveImageFunc(this.data.listArray[index]['url'][tmp], tmp);
      }

    }if (this.data.listArray[index]['type'] == '2') {
      this.saveVideoFunc(this.data.listArray[index]['url'][0]);
    }
    
    

    // wx.hideToast()
  },
  saveVideoFunc:function(video_url) {
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: video_url,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.hideLoading()
            },
            fail(res) {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  saveImageFunc:function(image_url,index) {

    var ind = index + 1;
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: image_url,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.hideLoading()
            },
            fail(res) {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

  /**
   * 保存文字
   */
  clickcopy: function (event) {
    var ind = event.currentTarget.dataset.index;
    wx.setClipboardData({
      data: this.data.listArray[ind]['des'],
      success: function() {
        wx.showToast({
          title: '文案复制成功',
          icon: 'succes',
          mask: true
        })
      }
    })


  },

  // //图片点击事件
  imgYu: function (e) {
    //   //获取当前图片的下表
    var index = e.currentTarget.dataset.index;
    var image = e.currentTarget.dataset.image;
    
    console.log(e);
    //   //图片预览
    // console.log(this.data.listArray[1]['url']);
      wx.previewImage({
        current: image,
        urls: this.data.listArray[index].url // 需要预览的图片http链接列表
      })
  },


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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})