//公共的方法(根据电影的星星数值返回一个[1,1,1,0,0]数组分别代表五颗星星是否变颜色，1代表变颜色，0代表不变)
function convertToStarArray(stars){
  var num = stars.toString().substring(0,1);
  var array = [];
  for(var i = 0 ; i <= 5 ; i++){
    if(i <= num){
      array.push(1);
    }else{
      array.push(0);
    }
  }
  return array;
}

module.exports = {
  convertToStarArray: convertToStarArray
}