// pages/my/my.js

const base_url = "https://api.chaton-chatonne.cn/index.php/index/index/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: true,
    secoud:'',
    no_more:false,
    more_data: "加载更多中..",
    page:1,//页数
    bannerArray:[],
    cate_id1: '',
    cate_id2: '',
    cate_id3: '',
    oneArr:[],
    twoArr:[],
    threeArr:[],
    listArray:[],
    searchData:[],
    searchArray:[],
    index: [0, 0, 0],
  },

  searchEmpty:function(){
    this.setData({
      searchArray: [],
      searchData: [],
      oneArr: [],
      twoArr: [],
      threeArr: [],
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      more_data: "加载更多中..",
      page: 1,
      listArray:[],
    })
    this.searchEmpty()
    this.request_all()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.list_request()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

        this.setData({
            secoud:999
        })


    this.request_all();
  },
  request_all:function() {
    this.banner_request(),
    this.list_request(),
    this.search_request()
  },
  //列表网络请求
  list_request() {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url: base_url + 'article',
      method:'post',
      data:{
        fenlei: this.data.secoud,
        cate_id1: this.data.cate_id1,
        cate_id2: this.data.cate_id2,
        cate_id3: this.data.cate_id3,
        page: this.data.page,
        count:'10'
      },
      success:function(res) {
        
        wx.stopPullDownRefresh()
        wx.hideToast()

        let o_data = that.data.listArray;
        for (var index in res.data) {
          that.data.listArray.push(res.data[index])
        }
        if(res.data.length < 1) {
          that.setData({
            no_more: true,
            more_data: "没有更多数据了",
          })
        }
        that.setData({
          listArray: o_data
        })

        if (that.data.listArray.length < 1) {
          that.setData({
            nodata: true
          })
        } else {
          that.setData({
            nodata: false
          })
        }
      },
    })
  },
  // 轮播图网络请求
  banner_request() {
    var that = this;
    wx.request({
      url: base_url + 'banner',
      success: function (res) {
        that.setData({
          bannerArray: res.data
        })
      }
    })
  },

  //搜索内容网络请求
  search_request(){
    var that = this;
    wx.request({
      url: base_url + 'index',
      success: function(res){

        that.setData({
          searchData:[],
          searchArray:[],
          oneArr: that.data.oneArr.concat("全部"),
          twoArr: that.data.twoArr.concat("全部" ),
          threeArr: that.data.threeArr.concat("全部"),
        })
        for(var index in res.data['one']) {
          that.setData({
            oneArr: that.data.oneArr.concat(res.data['one'][index]['name']),
          })
        }
        for (var index in res.data['two']) {
          that.setData({
            twoArr: that.data.twoArr.concat(res.data['two'][index]['name']),
          })
        }
        for (var index in res.data['three']) {
          that.setData({
            threeArr: that.data.threeArr.concat(res.data['three'][index]['name']),
          })
        }

        var tmpData = { id: "","name":"全部"};
        var res1 = res.data['one'];
        var res2 = res.data['two'];
        var res3 = res.data['three'];
        res1.unshift(tmpData);
        res2.unshift(tmpData);
        res3.unshift(tmpData);
        that.data.searchData.push(res1);
        that.data.searchData.push(res2);
        that.data.searchData.push(res3);
        that.data.searchArray.push(that.data.oneArr);
        that.data.searchArray.push(that.data.twoArr);
        that.data.searchArray.push(that.data.threeArr);

        that.setData({
          searchData: that.data.searchData,
          searchArray: that.data.searchArray
        })
        console.log(that.data.searchData);
      }
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

  // 搜索按钮事件
  bindPickerChange: function (e) {
    var that = this;
    console.log('发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
    var oneId = this.data.searchData[0][this.data.index[0]]['id'];
    var twoId = this.data.searchData[1][this.data.index[1]]['id'];
    var threeId = this.data.searchData[2][this.data.index[2]]['id'];

    this.setData({
      cate_id1: oneId,
      cate_id2: twoId,
      cate_id3: threeId,
      listArray:[],
      page:1
      
    })
    console.log(oneId);
    console.log(twoId);
    console.log(threeId);
    this.list_request();

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