Page({
  onLoad: function(event){
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250',
      data: {},
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function(res){
        console.log(res)
      },
      fail: function(){
        console.log('fail')
      }
    })
  },

})