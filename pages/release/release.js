let ArrayList = require("../../utils/arrayList.js");
const base_url = "https://api.chaton-chatonne.cn/index.php/index/index/";

Page({
  data: {
    cate_id1: '',
    cate_id2: '',
    cate_id3: '',
    oneArr: [],
    twoArr: [],
    threeArr: [],
    listArray: [],
    searchData: [],
    searchArray: [],
    index: [0, 0, 0],
    openid:'',
    nickName: '',
    avatarUrl:'',
    segmentindexone:[0],
    segmentindextwo: [0],
    first_id:'',
    second_id:'',

    segmentOneArr:[],
    segmentTwoArr:[],
    segmentData:[],
    desc: '',
    pics: [],
    pics_array: [],
    ok_pics: [],
    requestData:''
  },
  onLoad: function (options) {

    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        })
      },
    })

    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })

    this.segment_request(0)
    this.search_request()
    let list = new ArrayList();
    this.setData({
      pics: list,
      pics_array: list.toArray()
    })
  },

  segment_request:function(event){
    var that = this;

    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration: 10000
    })
    wx.request({
      url: base_url + 'fenlei',
      success: function (res) {
        wx.request({
          url: base_url + 'fenlei',
          data: {
            pid: res.data.first[event]["id"]
          },
          success: function (res) {
            wx.hideToast()
            that.setData({
              segmentData: [],
              segmentTwoArr:[],
              segmentOneArr:[]
            })
            for (var index in res.data['first']) {
              that.setData({
                segmentOneArr: that.data.segmentOneArr.concat(res.data['first'][index]['name']),
              })
            }
            for (var index in res.data['second']) {
              that.setData({
                segmentTwoArr: that.data.segmentTwoArr.concat(res.data['second'][index]['name']),
              })
            }
            that.data.segmentData.push(res.data.first),
            that.data.segmentData.push(res.data.second),
            that.data.second_id = that.data.segmentData[1][0]["id"];
            that.setData({
              segmentOneArr: that.data.segmentOneArr,
              segmentTwoArr: that.data.segmentTwoArr,
              segmentData: that.data.segmentData,
              first_id: that.data.segmentData[0][event]["id"],
              second_id: that.data.second_id
              
            })
          }
        })
      }
    })
  },

  bind_desc(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  bindPickerChange:function(e){
    console.log('标签发送选择改变，携带值为', e.detail.value)

  },
  //第一类目
  bindPickerChangeOne: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      segmentindexone: e.detail.value
    })
    this.segment_request(e.detail.value);

  },
  //第二类目
  bindPickerChangeTwo: function (e) {
    var that = this;
    this.data.second_id = this.data.segmentData[1][e.detail.value].id;

    this.setData({
      segmentindextwo:e.detail.value,
      second_id: this.data.second_id,
    })
    console.log(this.data.second_id);
  },
  //发布按钮点击
  wenda_post() {

    if (this.data.desc.length < 5){
      wx.showToast({
        icon:'loading',
        title: '心得最少五个字哦',
      })
      return
    }
    if (this.data.pics_array.length < 1) {
      wx.showToast({
        icon: 'loading',
        title: '请选择图片',
      })
      return
    }

      if (this.data.pics_array.length > 0) {
        wx.showToast({
          icon: 'loading',
          title: '上传图片中',
          duration: 2000000,
        })

        this.data.pics_array.map((item, index) => {
          if (!item.upload) {//判断当前图片是否已经上传
            var pics_array = this.data.pics_array
            pics_array[index].upload = true
            pics_array[index].progress = 0
            this.setData({
              pics_array: pics_array
            })

            const uploadTask = wx.uploadFile({
              url: base_url + 'uploadfile',
              filePath: item.path,
              name: 'files',
              header: { "content-type": 'multipart/form-data'},
              formData: {
              }, success: res => {
                var obj = JSON.parse(res.data)
                console.log(obj.pic_name);
                this.data.ok_pics.push(obj.pic_name)
                this.setData({
                  ok_pics: this.data.ok_pics
                })
                //所有图片上传完成
                if (this.data.ok_pics.length == this.data.pics_array.length) {
                  //开始提交文档数据
                  this.wenda_post_data()
                }
              }, fail: error => {//有图片上传失败
                  wx.showToast({
                    icon: 'loading',
                    title: '上传失败请重试',
                  })
              }
            })
            if (wx.canIUse('uploadTask')) {//监听图片上传
              uploadTask.onProgressUpdate((res) => {
                var pics_array = this.data.pics_array
                pics_array[index].upload = true
                pics_array[index].progress = res.progress
                this.setData({
                  pics_array: pics_array
                })
              })
            }
          } else {
            //所有图片上传完成
            if (this.data.ok_pics.length == this.data.pics_array.length) {
              //开始提交文档数据
              this.wenda_post_data()
            }
          }

        })
      } else {
        this.wenda_post_data()
      }
  },
  wenda_post_data() {
    var that = this;
    var imageitemstring ='';
    for (var i = 0; i < that.data.ok_pics.length; i++) {
      if (i == that.data.ok_pics.length - 1) {
        imageitemstring = imageitemstring + that.data.ok_pics[i]
      }else {
        imageitemstring = imageitemstring + that.data.ok_pics[i] + '|'
      }
    }

    console.log(imageitemstring);
    that.setData({
      requestData: imageitemstring
    })
    wx.hideToast()

    wx.showToast({
      title: '发布中',
      icon:'loading',
      duration: 10000
    })


      sftp://kwdsftp:@47.97.104.143/application/database.php
    wx.request({
      url: base_url + 'dynamic',
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cate1: this.data.cate_id1,
        cate2: this.data.cate_id2,
        cate3: this.data.cate_id3,
        des: this.data.desc,
        url: this.data.requestData,
        fenlei1: 999,
        fenlei2: 999,
        openid:this.data.openid,
        type:'1',
        nickname: this.data.nickName,
        headimgurl: this.data.avatarUrl

      },
      success: res => {
        wx.hideToast()
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500);
        }else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }, fail: error => {
        wx.showToast({
          title: '请稍后再试'
        })
      }, complete: res => {

      }
    })
  },
  add_pic() {
    wx.chooseImage({
      count: 9 - this.data.pics_array.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('chooseImage');
        console.log(res)
        var tempFilePaths = res.tempFilePaths


        tempFilePaths.map(a => {
          this.data.pics.add(a)

        })

        var pics_array = new Array()
        this.data.pics.toArray().map(path => {
          pics_array.push({
            path: path,
            upload: false,
            progress: 0
          })
        })



        this.setData({
          pics: this.data.pics,
          pics_array: pics_array
        })
        console.log(this.data.pics_array)
      }
    })
  },
  show_pic(event) {
    let item = event.currentTarget.dataset.src;
    wx.previewImage({
      current: item,
      urls: this.data.pics_array,
    })
  },
  del_pic(event) {
    let item = event.currentTarget.dataset.src;
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.data.pics.remove(item);

          var pics_array = new Array()
          this.data.pics.toArray().map(path => {
            pics_array.push({
              path: path,
              upload: false,
              progress: 0
            })
          })
          this.setData({
            pics: this.data.pics,
            pics_array: pics_array
          })
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },
  toDetail: function (event) {
    let that = this;
    var touchTime = that.data.touch_end - that.data.touch_start;
    if (touchTime < 350) {
      this.show_pic(event)
    } else {
      this.del_pic(event)
    }

  },
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  },


  //搜索内容网络请求
  search_request() {
    var that = this;
    wx.request({
      url: base_url + 'index',
      success: function (res) {

        for (var index in res.data['one']) {
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
        var res1 = res.data['one'];
        var res2 = res.data['two'];
        var res3 = res.data['three'];
        that.data.searchData.push(res1);
        that.data.searchData.push(res2);
        that.data.searchData.push(res3);
        that.data.searchArray.push(that.data.oneArr);
        that.data.searchArray.push(that.data.twoArr);
        that.data.searchArray.push(that.data.threeArr);

        that.data.cate_id1 = res1[0]['id'];
        that.data.cate_id2 = res2[0]['id'];
        that.data.cate_id3 = res3[0]['id'];
        
        that.setData({
          cate_id1: that.data.cate_id1,
          cate_id2: that.data.cate_id2,
          cate_id3: that.data.cate_id3,
          searchData: that.data.searchData,
          searchArray: that.data.searchArray
        })
      }
    })
  },
  // 搜索按钮事件
  bindPickerChange: function (e) {
    var that = this;
    // console.log('发送选择改变，携带值为', e.detail.value)
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
    })
  },

})


