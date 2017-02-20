var postsData = require('../../../data/posts-data.js');
var app = getApp();//获取全局变量
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });

        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            //把我们等到的缓存的postCollected值返回给wxml判断的collected信息中
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        }

        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == postId){
            this.setData({
                isPlayingMusic: true
            });
        }

        this.setMusicMonitor();
    },

    setMusicMonitor:function(){
         var that = this;
        //主屏幕的音乐播放监听同步效果 -- 由框架调用代码
        wx.onBackgroundAudioPlay(function() {
          that.setData({
              isPlayingMusic : true
          })
          app.globalData.g_isPlayingMusic = true;
          app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function() {
          that.setData({
              isPlayingMusic : false
          })
          app.globalData.g_isPlayingMusic = false;
          app.globalData.g_currentMusicPostId = null;
        })
    },

    //点击收藏摁扭的事件
    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
    },

    //同步获取缓存的方式
    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "是否收藏该文章" : "是否取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#ff0000",
            success: function (res) {
                if (res.confirm) {
                    //更新文章是否收藏的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定的变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function (postsCollected, postCollected) {
        //更新文章是否收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定的变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        //用户提示信息
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000
        })
    },

    onShareTap: function (event) {
        wx.showActionSheet({
            itemList: [
                "分享给微信好友",
                "分享给朋友圈",
                "分享到QQ",
                "分享到微博"
            ],
            itemColor: "#405f80"
        })
    },
    //音乐播放事件
    onMusicTap: function (event) {

        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;

        if (isPlayingMusic) {
            //停止播放音乐
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic:false
            })
        } else {
            //播放音乐
            wx.playBackgroundAudio({
                dataUrl: postsData.postList[currentPostId].music.url,
                title: postsData.postList[currentPostId].music.title,
                coverImgUrl: postsData.postList[currentPostId].music.coverImg
            })
            this.setData({
                isPlayingMusic:true
            })
        }


    }
})