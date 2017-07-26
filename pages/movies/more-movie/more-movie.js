// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util');

Page({

  data: {
    movies:{},
    navigateTitle: "",
    requestUrl: "",//定义变量通过一个函数的赋值，在另一个函数中调用
    totalCount: 0,
    isEmpty: true//指代当前数据是否为空
  },

  onLoad: function (options) {
    var category = options.category;//接受从主js传过来的点击的类别信息
    wx.setNavigationBarTitle({
      title: category
    })
   
    var dataUrl = "";
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";//默认加载数据是20条
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  onScrollLower: function(event){//下拉加载更多20条数据
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    //设置加载等待loading图标
    wx.showNavigationBarLoading();
  },
  

  //程序刷新自动跳动函数onPullDownRefresh
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
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
    var totalMovies = {};
    if(!this.data.isEmpty){//判断是否不是第一次加载数据
      totalMovies = this.data.movies.concat(movies);//将之前的数据与后加载的20条数据结合在一起
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies//绑定所有数据
    });
    this.data.totalCount += 20;//每次处理数据，都获取下20条数据

    //加载数据完成后，加载图标消失。
    wx.hideNavigationBarLoading();
    //刷新数据完成后，刷新图标消失。
    wx.stopPullDownRefresh();
  }

})