//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: '这里将会是文字识别结果',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tempFilePaths: null,
    },

    //确定图片来源，从相册中选择或者是拍照
    chooseimage: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#CED63A",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage('camera')
                    }
                }
            }
        })

    },

    //选择图片
    chooseWxImage: function(type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function(res) {
                console.log(res);
                that.setData({
                    tempFilePaths: res.tempFilePaths,
                })
            }
        })
    },

    //上传图片至服务器并接受返回的结果
    identifyimage: function() {
        var that = this;
        wx.uploadFile({
            url: 'http://xxxxxxxxxxxxxxxxxxxxxx', //换成自己的本地服务器的地址
            filePath: that.data.tempFilePaths[0],
            name: 'image',
            // header: { "Content-Type": "multipart/form-data" },
            success: function(res) {
                console.log(res)
                var data = JSON.parse(res.data) //把返回结果解析成json格式
                    //console.log(data)

                if (data.data.errormsg != "OK") {
                    //识别失败，提示上传质量更好的图片
                    wx.showModal({
                        title: '提示',
                        content: '识别失败，请上传质量更好的图片',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    //识别成功，拼接识别结果并显示
                    var list = data.data.items
                    var str = ""
                    for (var i = 0; i < list.length; i++) {
                        str += list[i].itemstring + " "
                    }
                    that.setData({
                        motto: str
                    })

                    // 若识别结果为"Hello World "，则向oneNET请求数据并绘图
                    if (str == "Hello World ") {
                        //从oneNET请求我们的Wi-Fi气象站的数据
                        var devicesId = "XXXXXXX" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
                        var api_key = "XXXXXXXX" // 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=
                        const requestTask = wx.request({
                            url: 'https://api.heclouds.com/devices/' + devicesId + '/datapoints?datastream_id=Light,Temperature,Humidity&limit=15',
                            header: {
                                'content-type': 'application/json',
                                'api-key': api_key
                            },
                            success: function(res) {
                                //console.log(res.data)
                                //拿到数据后保存到全局数据
                                var app = getApp()
                                app.globalData.temperature = res.data.data.datastreams[0]
                                app.globalData.light = res.data.data.datastreams[1]
                                app.globalData.humidity = res.data.data.datastreams[2]
                                console.log(app.globalData.light)
                                    //跳转到天气页面，根据拿到的数据绘图
                                wx.navigateTo({
                                    url: '../tianqi/tianqi',
                                })
                            },

                            fail: function(res) {
                                console.log("fail!!!")
                            },

                            complete: function(res) {
                                console.log("end")
                            }
                        })
                    } else {
                        //若识别结果不是"Hello World"，则给出提示
                        wx.showModal({
                            title: '提示',
                            content: '图片中的文字不是"Hello World"',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }

                }
            }
        })
    },

    onLoad: function() {
        wx.showModal({
            title: '验证口令',
            content: '请上传一张写有‘Hello World’ 的图片，识别成功则绘制天气曲线。',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})