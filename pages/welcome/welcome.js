Page({
    onTap: function(){
        //wx.navigateTo({
        //  url: '../posts/post'
       // });

        wx.switchTab({//只能跳转带tab的页面
          url: '../posts/post'
        })
    }
})