
var postsData = require('../../data/posts-data.js')

Page({
  data:{
  },
  onLoad:function(){
    // 生命周期函数--监听页面加载
   
    this.setData({
        posts_key: postsData.postList
    });
  },

  onPostTap:function(event){
    //当前点击的页面
    var postId = event.currentTarget.dataset.postid;

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },


  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})