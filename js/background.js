$(function(){
   var backgroudStyle = "background-container";
   if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ 
     var ieversion=new Number(RegExp.$1); console.log(ieversion); 
     if(ieversion <= 9) {
        backgroudStyle = "background-container-ie";
     }
   }
   $(".container-fluid").addClass(backgroudStyle);
});
