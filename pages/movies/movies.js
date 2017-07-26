//获取公共方法
var util = require('../../utils/util.js');

var app = getApp();

Page({

  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow: true,
    searchPanelShow: false
  },

  onMoreTap: function(event){//"更多"跳转方法
    var category = event.currentTarget.dataset.category;//获取点击的“更多”，代表哪儿一个分类
    wx.navigateTo({//跳转子页面
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onLoad: function(event){
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";//获取正在热映的api
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";//获取即将上映的api
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";//获取top250的api
  
    this.getMovieListData(inTheatersUrl , "inTheaters" , "正在热映");
    this.getMovieListData(comingSoonUrl , "comingSoon" , "即将上映");
    this.getMovieListData(top250Url , "top250" , "豆瓣top250");
  },

  getMovieListData: function(url , settedKey , categoryTitle){//获取api下的data数据
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type" : "application/xml"
      },
      success: function(res){
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function(){
        console.log("fail");
      }
    })
  },

  //xx关闭搜索界面
  onCancelImgTap: function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },

  //input绑定事件
  onBindFocus: function(event){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle){//将获取的数据，拆分成我们想要的成分，并且返回结果
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  }

})