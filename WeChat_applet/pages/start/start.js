// start.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        opacity: 0.4,
        disabled: true,
        threshold: 0,
        rule: 'up',
        items: [
            { name: 'up', value: '高于门限报警', checked: 'ture' },
            { name: 'down', value: '低于门限报警' },
        ]
    },

    radioChange: function(e) {
        //保存报警规则到当前页面的数据
        if (e.detail.value != "") {
            this.setData({
                rule: e.detail.value
            })
        }
        console.log(this.data.rule)
    },

    send: function() {
        var that = this
            //取得门限数据和报警规则
        var thres = this.data.threshold
        var Rule = this.data.rule

        //调用百度天气API
        // 就是这里需要改动

        var theBaiDuAPPkey = "XXXXXXXX" //百度的APPkey

        const requestTask = wx.request({
            url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
            header: {
                'content-type': 'application/json',
            },

            success: function(res) {
                // 利用正则字符串从百度天气API的返回数据中截出今天的温度数据
                var str = res.data.results[0].weather_data[0].date;
                var tmp1 = str.match(/实时.+/);
                var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
                var tmp = +tmp2;

                //温度高于设置的门限值
                if (tmp > that.data.threshold) {
                    if (that.data.rule == "up") {
                        //规则为高于门限报警，于是报警
                        wx.showModal({
                            title: '警报！',
                            content: '温度异常！',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                    //规则为低于门限报警，于是不报警
                    else if (that.data.rule == "down") {
                        wx.showModal({
                            title: '提示～',
                            content: '温度处于正常范围。',
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
                //温度低于设置的门限值
                else if (tmp <= that.data.threshold) {
                    //规则为高于门限报警，于是不报警
                    if (that.data.rule == "up") {
                        wx.showModal({
                            title: '提示～',
                            content: '温度处于正常范围。',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                    //规则为低于门限报警，于是报警
                    else if (that.data.rule == "down") {
                        wx.showModal({
                            title: '警报！',
                            content: '温度异常！',
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
            },

            fail: function(res) {
                console.log("fail!!!")
            },

            complete: function(res) {
                console.log("end")
            }
        })
    },

    //跳转到图片识别的口令验证页面
    validate: function() {
        wx.navigateTo({
            url: '../wifi_station/index/index',
        })
    },


    change: function(e) {
        //当有输入时激活发送按钮，无输入则禁用按钮
        if (e.detail.value != "") {
            this.setData({
                threshold: e.detail.value,
                opacity: 1,
                disabled: false,
            })
        } else {
            this.setData({
                threshold: 0,
                opacity: 0.4,
                disabled: true,
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})